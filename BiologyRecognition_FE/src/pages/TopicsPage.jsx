import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';

import CreateModalTopic from '../components/CreateModalTopic.jsx';
import EditModalTopic from '../components/EditModalTopic.jsx';
import DeleteModal from '../components/DeleteModal.jsx';

import { fetchTopics, fetchTopicById, createTopic, updateTopic, deleteTopic, searchTopicsByName } from '../redux/thunks/topicThunks.jsx';
import { fetchCurrentUser } from '../redux/thunks/userThunks.jsx';
import { formatDate } from '../utils/dateUtils';

import '../styles/TopicsPage.css';

const TopicsPage = () => {
  const dispatch = useDispatch();
  const { topics = [], selectedTopic: storeSelectedTopic, loading, error, createLoading, updateLoading, deleteLoading, fetchTopicLoading } = useSelector(state => state.topics || {});
  const { currentUser } = useSelector(state => state.user);
  
  // Lấy trạng thái collapsed từ localStorage, mặc định là false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('navbarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Fetch topics, all chapters, and current user when component mount
  useEffect(() => {
    const fetchData = () => {
      if (searchTerm.trim()) {
        // Use search API for searching
        dispatch(searchTopicsByName(searchTerm));
      } else {
        // Use paginated API for normal listing
        dispatch(fetchTopics({
          page: currentPage,
          pageSize: pageSize
        }));
      }
    };

    fetchData();
    // Fetch all chapters by looping through all pages
    const fetchAllChapters = async () => {
      let allChapters = [];
      let page = 1;
      let pageSize = 100;
      let totalPages = 1;
      const { getChaptersAPI } = await import('../redux/services/apiService');
      do {
        const response = await getChaptersAPI({ page, pageSize });
        const chapters = response?.data || response || [];
        if (Array.isArray(chapters)) {
          allChapters = allChapters.concat(chapters);
          totalPages = response?.totalPages || 1;
        } else {
          break;
        }
        page++;
      } while (page <= totalPages);
      // Optionally: set allChapters to redux or state if needed
    };
    fetchAllChapters();
    dispatch(fetchCurrentUser());
  }, [dispatch, currentPage, pageSize]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Lưu trạng thái collapsed vào localStorage khi thay đổi
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('navbarCollapsed', JSON.stringify(newCollapsedState));
  };

  // Filter topics based on search term - handle both paginated and non-paginated response
  const displayTopics = Array.isArray(topics) ? topics : [];

  // Handle search with debounce
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout
    const newTimeout = setTimeout(() => {
      const params = {
        page: 1,
        pageSize: pageSize
      };
      
      if (value.trim()) {
        // Add name parameter for search
        params.name = value.trim();
      }
      
      // Use the same fetchTopics thunk for both search and regular fetch
      dispatch(fetchTopics(params));
    }, 500);
    
    setSearchTimeout(newTimeout);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    
    const params = {
      page: newPage,
      pageSize: pageSize
    };
    
    // Include search term if present
    if (searchTerm.trim()) {
      params.name = searchTerm.trim();
    }
    
    dispatch(fetchTopics(params));
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    
    const params = {
      page: 1,
      pageSize: newPageSize
    };
    
    // Include search term if present
    if (searchTerm.trim()) {
      params.name = searchTerm.trim();
    }
    
    dispatch(fetchTopics(params));
  };
  
  // Helper function to highlight search term in text
  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="highlight-text">{part}</span>
      ) : part
    );
  };

  // Handlers
  const handleCreateTopic = (topicData) => {
    dispatch(createTopic(topicData))
      .then(() => {
        setShowCreate(false);
        toast.success('Tạo chủ đề thành công!');
        // Refresh with current pagination and search state
        const params = {
          page: currentPage,
          pageSize: pageSize
        };
        
        if (searchTerm.trim()) {
          params.name = searchTerm.trim();
        }
        
        dispatch(fetchTopics(params));
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi tạo chủ đề!');
      });
  };

  const handleEditTopic = async (topic) => {
    setSelectedTopic(topic);
    
    // Fetch chi tiết topic để đảm bảo có đầy đủ thông tin (bao gồm topic_id)
    if (topic.topicId || topic.topic_id) {
      await dispatch(fetchTopicById(topic.topicId || topic.topic_id));
    }
    
    setShowEdit(true);
  };

  const handleUpdateTopic = (topicData) => {
    const topicToUpdate = storeSelectedTopic || selectedTopic;
    
    if (topicToUpdate) {
      const topicId = topicToUpdate.topicId || topicToUpdate.topic_id;
      
      if (!topicId) {
        return;
      }
      
      dispatch(updateTopic({ 
        topicId, 
        data: topicData 
      }))
      .then(() => {
        setShowEdit(false);
        setSelectedTopic(null);
        toast.success('Cập nhật chủ đề thành công!');
        // Refresh with current pagination and search state
        const params = {
          page: currentPage,
          pageSize: pageSize
        };
        
        if (searchTerm.trim()) {
          params.name = searchTerm.trim();
        }
        
        dispatch(fetchTopics(params));
      })
      .catch((error) => {
        toast.error('Có lỗi xảy ra khi cập nhật chủ đề!');
      });
    }
  };

  const handleDeleteTopic = (topic) => {
    setSelectedTopic(topic);
    setShowDelete(true);
  };

  const confirmDeleteTopic = () => {
    if (selectedTopic) {
      dispatch(deleteTopic(selectedTopic.topicId || selectedTopic.topic_id))
        .then(() => {
          setShowDelete(false);
          setSelectedTopic(null);
          toast.success('Xóa chủ đề thành công!');
          // Refresh with current pagination and search state
          const params = {
            page: currentPage,
            pageSize: pageSize
          };
          
          if (searchTerm.trim()) {
            params.name = searchTerm.trim();
          }
          
          dispatch(fetchTopics(params));
        })
        .catch(() => {
          toast.error('Có lỗi xảy ra khi xóa chủ đề!');
        });
    }
  };

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="topics" isCollapsed={isCollapsed} />
        <Header activeSection="topics" isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Quản lý các chủ đề sinh học</h1>
              <p className="page-description">Quản lý các chủ đề sinh học trong hệ thống</p>
            </div>
            
            <div className="action-buttons">
              <button 
                className="btn-primary" 
                onClick={() => setShowCreate(true)}
                disabled={createLoading}
              >
                <i className="fas fa-plus"></i> 
                {createLoading ? 'Đang tạo...' : 'Thêm mới chủ đề'}
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="search-container" style={{ marginBottom: 24 }}>
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên chủ đề"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    className="clear-search-btn"
                    title="Xóa tìm kiếm"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="search-results-info">
                  Tìm thấy {displayTopics.length} kết quả cho "<strong>{searchTerm}</strong>"
                </div>
              )}
            </div>
            
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên chủ đề</th>
                    <th>Chương</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && displayTopics.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="empty-state">
                        <div className="empty-state-icon">
                          <i className="fas fa-inbox"></i>
                        </div>
                        {searchTerm ? `Không tìm thấy chủ đề nào với từ khóa "${searchTerm}"` : 'Không có dữ liệu chủ đề'}
                      </td>
                    </tr>
                  ) : (
                    displayTopics.map(topic => (
                      <tr key={topic.topicId || topic.topic_id}>
                        <td>{highlightText(topic.name, searchTerm)}</td>
                        <td>{highlightText(topic.chapterName || topic.chapter, searchTerm)}</td>
                        <td>
                          <div className="action-buttons-container">
                            <button
                              className="btn-edit"
                              title="Sửa"
                              onClick={() => handleEditTopic(topic)}
                              disabled={updateLoading}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn-delete" 
                              title="Xóa" 
                              onClick={() => handleDeleteTopic(topic)}
                              disabled={deleteLoading}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls - Show for both search and regular fetch */}
            <div className="pagination-container">
              <div className="pagination-info">
                <span>Hiển thị</span>
                <select 
                  value={pageSize} 
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>mục mỗi trang</span>
              </div>
              
              <div className="pagination-controls">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                  className={`pagination-btn ${currentPage <= 1 || loading ? 'disabled' : 'enabled'}`}
                >
                  <i className="fas fa-chevron-left"></i>
                  Trước
                </button>
                
                <div className="pagination-current-page">
                  Trang {currentPage}
                </div>
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={displayTopics.length < pageSize || loading}
                  className={`pagination-btn ${displayTopics.length < pageSize || loading ? 'disabled' : 'enabled'}`}
                >
                  Sau
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
            
            <CreateModalTopic 
              open={showCreate} 
              onClose={() => setShowCreate(false)} 
              onSubmit={handleCreateTopic}
              loading={createLoading}
            />
            <EditModalTopic 
              open={showEdit} 
              onClose={() => {
                setShowEdit(false);
                setSelectedTopic(null);
              }}
              onSubmit={handleUpdateTopic}
              initialData={storeSelectedTopic || selectedTopic}
              loading={updateLoading || fetchTopicLoading}
            />
            <DeleteModal
              open={showDelete}
              onClose={() => {
                setShowDelete(false);
                setSelectedTopic(null);
              }}
              onConfirm={confirmDeleteTopic}
              loading={deleteLoading}
              itemName={selectedTopic?.name}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default TopicsPage;