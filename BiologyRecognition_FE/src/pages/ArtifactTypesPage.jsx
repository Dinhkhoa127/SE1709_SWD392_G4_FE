import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';

import CreateModalArtifactType from '../components/CreateModalArtifactType.jsx';
import EditModalArtifactType from '../components/EditModalArtifactType.jsx';
import DeleteModal from '../components/DeleteModal.jsx';

import { fetchArtifactTypes, searchArtifactTypes, fetchArtifactTypeById, createArtifactType, updateArtifactType, deleteArtifactType } from '../redux/thunks/artifactTypeThunks.jsx';
import { fetchCurrentUser } from '../redux/thunks/userThunks.jsx';
import { fetchTopics } from '../redux/thunks/topicThunks.jsx';

import '../styles/SubjectsPage.css'; // Reusing existing styles

const ArtifactTypePage = () => {
  const dispatch = useDispatch();
  const { artifactTypes = [], selectedArtifactType: storeSelectedArtifactType, loading, error, createLoading, updateLoading, deleteLoading, fetchArtifactTypeLoading } = useSelector(state => state.artifactTypes || {});
  const { currentUser } = useSelector(state => state.user);
  const { topics } = useSelector(state => state.topics);
  
  // Lấy trạng thái collapsed từ localStorage, mặc định là false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('navbarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedArtifactType, setSelectedArtifactType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalArtifactTypes, setTotalArtifactTypes] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Debounce search term
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Helper function to get topic name from topicId
  const getTopicName = (topicId) => {
    const topic = topics.find(t => t.topicId === topicId);
    return topic ? topic.topicName || topic.name : `Topic ID: ${topicId}`;
  };

  // Display data from server response (no client-side filtering for pagination)
  const displayedArtifactTypes = Array.isArray(artifactTypes) ? artifactTypes : [];

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

  // Fetch artifact types when pagination changes or component mounts
  useEffect(() => {
    const fetchData = () => {
      if (searchTerm.trim()) {
        // Use search API for searching
        dispatch(searchArtifactTypes(searchTerm));
      } else {
        // Use paginated API for normal listing
        dispatch(fetchArtifactTypes({
          page: currentPage,
          pageSize: pageSize
        }));
      }
    };

    fetchData();
  }, [dispatch, currentPage, pageSize]); // Remove searchTerm from dependency

  // Handle search with debounce
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debounced search
    const newTimeout = setTimeout(() => {
      if (value.trim()) {
        // Use search API with pagination
        dispatch(searchArtifactTypes({
          name: value.trim(),
          page: 1,
          pageSize: pageSize
        }));
      } else {
        // Use regular fetch API with pagination
        dispatch(fetchArtifactTypes({
          page: 1,
          pageSize: pageSize
        }));
      }
    }, 300);
    
    setSearchTimeout(newTimeout);
  };

  // Fetch current user and topics once when component mounts
  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchTopics());
  }, [dispatch]);

  // Lưu trạng thái collapsed vào localStorage khi thay đổi
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('navbarCollapsed', JSON.stringify(newCollapsedState));
  };

  // Handlers
  const handleCreateArtifactType = (artifactTypeData) => {
    dispatch(createArtifactType(artifactTypeData))
      .then(() => {
        setShowCreate(false);
        toast.success('Tạo loại mẫu vật thành công!');
        // Refresh data based on current state
        if (searchTerm.trim()) {
          dispatch(searchArtifactTypes({
            name: searchTerm.trim(),
            page: currentPage,
            pageSize: pageSize
          }));
        } else {
          dispatch(fetchArtifactTypes({
            page: currentPage,
            pageSize: pageSize
          }));
        }
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi tạo loại mẫu vật!');
      });
  };

  const handleEditArtifactType = (artifactType) => {
    setSelectedArtifactType(artifactType);
    setShowEdit(true);
  };

  const handleUpdateArtifactType = (artifactTypeData) => {
    dispatch(updateArtifactType(artifactTypeData))
      .then(() => {
        setShowEdit(false);
        setSelectedArtifactType(null);
        toast.success('Cập nhật loại mẫu vật thành công!');
        // Refresh data based on current state
        if (searchTerm.trim()) {
          dispatch(searchArtifactTypes({
            name: searchTerm.trim(),
            page: currentPage,
            pageSize: pageSize
          }));
        } else {
          dispatch(fetchArtifactTypes({
            page: currentPage,
            pageSize: pageSize
          }));
        }
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi cập nhật loại mẫu vật!');
      });
  };

  const handleDeleteArtifactType = (artifactType) => {
    setSelectedArtifactType(artifactType);
    setShowDelete(true);
  };

  const handleConfirmDelete = () => {
    if (selectedArtifactType) {
      dispatch(deleteArtifactType(selectedArtifactType.artifactTypeId))
        .then(() => {
          setShowDelete(false);
          setSelectedArtifactType(null);
          toast.success('Xóa loại mẫu vật thành công!');
          // Refresh data based on current state
          if (searchTerm.trim()) {
            dispatch(searchArtifactTypes({
              name: searchTerm.trim(),
              page: currentPage,
              pageSize: pageSize
            }));
          } else {
            dispatch(fetchArtifactTypes({
              page: currentPage,
              pageSize: pageSize
            }));
          }
        })
        .catch(() => {
          toast.error('Có lỗi xảy ra khi xóa loại mẫu vật!');
        });
    }
  };

  const handleCloseModals = () => {
    setShowCreate(false);
    setShowEdit(false);
    setShowDelete(false);
    setSelectedArtifactType(null);
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    
    // Use search + pagination if there's a search term
    if (searchTerm.trim()) {
      dispatch(searchArtifactTypes({
        name: searchTerm.trim(),
        page: newPage,
        pageSize: pageSize
      }));
    } else {
      // Use regular pagination when no search term
      dispatch(fetchArtifactTypes({
        page: newPage,
        pageSize: pageSize
      }));
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    
    // Use search + pagination if there's a search term
    if (searchTerm.trim()) {
      dispatch(searchArtifactTypes({
        name: searchTerm.trim(),
        page: 1,
        pageSize: newPageSize
      }));
    } else {
      // Use regular pagination when no search term
      dispatch(fetchArtifactTypes({
        page: 1,
        pageSize: newPageSize
      }));
    }
  };

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="artifact-types" isCollapsed={isCollapsed} />
        <Header activeSection="artifact-types" isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Quản lý loại mẫu vật</h1>
              <p className="page-description">Quản lý các loại mẫu vật sinh học</p>
            </div>
            
            <div className="action-buttons" style={{ marginBottom: 24 }}>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowCreate(true)}
                disabled={createLoading}
              >
                <i className="fas fa-plus"></i> 
                {createLoading ? 'Đang tạo...' : 'Thêm mới loại mẫu vật'}
              </button>
            </div>

            {/* Search Bar */}
            <div className="search-container" style={{ marginBottom: 24 }}>
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên loại mẫu vật"
                  value={searchTerm}
                  onChange={(e) => {
                    handleSearchChange(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      handleSearchChange('');
                    }}
                    className="clear-search-btn"
                    title="Xóa tìm kiếm"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="search-results-info">
                  Tìm thấy {displayedArtifactTypes.length} kết quả cho "<strong>{searchTerm}</strong>"
                </div>
              )}
            </div>

            <div className="table-responsive">
              {loading ? (
                <div className="text-center py-4">
                  <i className="fas fa-spinner fa-spin fa-2x"></i>
                  <p className="mt-2">Đang tải dữ liệu...</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tên loại mẫu vật</th>
                      <th>Tên chủ đề</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading && displayedArtifactTypes.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="empty-state">
                          <div className="empty-state-icon">
                            <i className="fas fa-inbox"></i>
                          </div>
                          {searchTerm ? `Không tìm thấy loại mẫu vật nào với từ khóa "${searchTerm}"` : 'Không có dữ liệu loại mẫu vật'}
                        </td>
                      </tr>
                    ) : (
                      displayedArtifactTypes.map(artifactType => (
                        <tr key={artifactType.artifactTypeId}>
                           <td>{highlightText(artifactType.name, searchTerm)}</td>
                          <td>{highlightText(getTopicName(artifactType.topicId), searchTerm)}</td>
                      
                          <td>
                            <div className="action-buttons-container">
                              <button 
                                className="btn-edit" 
                                title="Sửa"
                                onClick={() => handleEditArtifactType(artifactType)}
                                disabled={updateLoading}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                className="btn-delete" 
                                title="Xóa"
                                onClick={() => handleDeleteArtifactType(artifactType)}
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
              )}
            </div>

            {/* Pagination Controls - Always show when there are artifact types */}
            {displayedArtifactTypes.length > 0 && (
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
                    disabled={loading || (displayedArtifactTypes && displayedArtifactTypes.length < pageSize)}
                    className={`pagination-btn ${loading || (displayedArtifactTypes && displayedArtifactTypes.length < pageSize) ? 'disabled' : 'enabled'}`}
                  >
                    Sau
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateModalArtifactType 
        open={showCreate}
        onClose={handleCloseModals}
        onSubmit={handleCreateArtifactType}
        loading={createLoading}
      />

      <EditModalArtifactType 
        open={showEdit}
        onClose={handleCloseModals}
        onSubmit={handleUpdateArtifactType}
        loading={updateLoading}
        artifactType={selectedArtifactType}
      />

      <DeleteModal 
        open={showDelete}
        onClose={handleCloseModals}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        itemName={selectedArtifactType?.name}
        itemType="loại mẫu vật"
      />
    </>
  );
};

export default ArtifactTypePage;