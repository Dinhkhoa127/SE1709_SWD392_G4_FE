import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChapters, createChapter, updateChapter, deleteChapter, searchChaptersByName } from '../redux/thunks/chapterThunks';
import { fetchSubjects } from '../redux/thunks/subjectThunks';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import '../styles/ChaptersPage.css';
import { toast } from 'react-toastify';
import CreateModalChapter from '../components/CreateModalChapter';
import EditModalChapter from '../components/EditModalChapter';
import DeleteModal from '../components/DeleteModal.jsx';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { formatDate } from '../utils/dateUtils';

const ChaptersPage = () => {
  // Lấy trạng thái collapsed từ localStorage, mặc định là false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('navbarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const dispatch = useDispatch();
  const { chapters = [], loading, error, createLoading, updateLoading, fetchChapterByIdLoading, selectedChapter, deleteLoading } = useSelector(state => state.chapters || {});
  const { subjects } = useSelector(state => state.subjects);
  const { currentUser } = useSelector(state => state.user);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [deletingChapter, setDeletingChapter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Fetch chapters and current user when component mount
  useEffect(() => {
    const fetchData = () => {
      if (searchTerm.trim()) {
        // Use search API for searching
        dispatch(searchChaptersByName(searchTerm));
      } else {
        // Use paginated API for normal listing
        dispatch(fetchChapters({
          page: currentPage,
          pageSize: pageSize
        }));
      }
    };

    fetchData();
    // Fetch subjects without params (assuming subjects API doesn't have pagination yet)
    dispatch(fetchSubjects({}));
    dispatch(fetchCurrentUser());
  }, [dispatch, currentPage, pageSize]); // Remove searchTerm from dependency

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);
  
  // Filter chapters based on search term - handle both paginated and non-paginated response
  const displayChapters = Array.isArray(chapters) ? chapters : [];

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
      
      // Use the same fetchChapters thunk for both search and regular fetch
      dispatch(fetchChapters(params));
    }, 500);
    
    setSearchTimeout(newTimeout);
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
  
  // Lưu trạng thái collapsed vào localStorage khi thay đổi
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('navbarCollapsed', JSON.stringify(newCollapsedState));
  };

  const handleCreateChapter = (chapterData) => {
    dispatch(createChapter(chapterData))
      .then(() => {
        setShowCreate(false);
        toast.success('Tạo chương thành công!');
        // Refresh with current pagination and search state
        const params = {
          page: currentPage,
          pageSize: pageSize
        };
        
        if (searchTerm.trim()) {
          params.name = searchTerm.trim();
        }
        
        dispatch(fetchChapters(params));
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi tạo chương!');
      });
  };

  const handleEditClick = (chapter) => {
    setEditingChapter(chapter);
    setShowEdit(true);
  };

  const handleUpdateChapter = (chapterData) => {
    const chapterId = editingChapter.chapterId || editingChapter.chapter_id;
    if (!chapterId) {
      toast.error('Không tìm thấy ID chương!');
      return;
    }
    dispatch(updateChapter({ chapterId, data: chapterData }))
      .then(() => {
        setShowEdit(false);
        setEditingChapter(null);
        toast.success('Cập nhật chương thành công!');
        // Refresh with current pagination and search state
        const params = {
          page: currentPage,
          pageSize: pageSize
        };
        
        if (searchTerm.trim()) {
          params.name = searchTerm.trim();
        }
        
        dispatch(fetchChapters(params));
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi cập nhật chương!');
      });
  };

  const handleDeleteChapter = (chapterId) => {
    const chapter = displayChapters.find(ch => (ch.chapterId || ch.chapter_id) === chapterId);
    setDeletingChapter(chapter);
    setShowDelete(true);
  };

  const handleConfirmDelete = () => {
    const chapterId = deletingChapter.chapterId || deletingChapter.chapter_id;
    if (!chapterId) {
      toast.error('Không tìm thấy ID chương!');
      return;
    }
    
    dispatch(deleteChapter(chapterId))
      .then(() => {
        setShowDelete(false);
        setDeletingChapter(null);
        toast.success('Xóa chương thành công!');
        // Refresh with current pagination and search state
        const params = {
          page: currentPage,
          pageSize: pageSize
        };
        
        if (searchTerm.trim()) {
          params.name = searchTerm.trim();
        }
        
        dispatch(fetchChapters(params));
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi xóa chương!');
      });
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
    
    dispatch(fetchChapters(params));
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
    
    dispatch(fetchChapters(params));
  };

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        rel="stylesheet" 
      />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar 
          activeSection="chapters" 
          isCollapsed={isCollapsed} 
        />
        <Header 
          activeSection="chapters" 
          isCollapsed={isCollapsed} 
          onToggleCollapse={handleToggleCollapse} 
        />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Quản lý chương</h1>
              <p className="page-description">Quản lý các chương học sinh học</p>
            </div>
            <div className="action-buttons" style={{ marginBottom: 24 }}>
              <button className="btn btn-primary" onClick={() => setShowCreate(true)} disabled={createLoading}>
                <i className="fas fa-plus"></i> {createLoading ? 'Đang tạo...' : 'Thêm mới chương'}
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="search-container" style={{ marginBottom: 24 }}>
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên chương"
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
                  Tìm thấy {displayChapters.length} kết quả cho "<strong>{searchTerm}</strong>"
                </div>
              )}
            </div>
            <CreateModalChapter
              open={showCreate}
              onClose={() => setShowCreate(false)}
              onSubmit={handleCreateChapter}
              loading={createLoading}
              subjects={subjects}
              isChapter={true}
            />
            <EditModalChapter
              open={showEdit}
              onClose={() => {
                setShowEdit(false);
                setEditingChapter(null);
              }}
              onSubmit={handleUpdateChapter}
              initialData={editingChapter}
              loading={updateLoading || fetchChapterByIdLoading}
            />
            <DeleteModal
              open={showDelete}
              onClose={() => {
                setShowDelete(false);
                setDeletingChapter(null);
              }}
              onConfirm={handleConfirmDelete}
              title="Xóa chương học"
              message={`Bạn có chắc chắn muốn xóa chương "${deletingChapter?.name || ''}"? Hành động này không thể hoàn tác.`}
            />
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên chương</th>
                    <th>Môn học</th>
                  
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && displayChapters.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="empty-state">
                        <div className="empty-state-icon">
                          <i className="fas fa-inbox"></i>
                        </div>
                        {searchTerm ? `Không tìm thấy chương nào với từ khóa "${searchTerm}"` : 'Không có dữ liệu chương học'}
                      </td>
                    </tr>
                  ) : (
                    displayChapters.map(chapter => (
                      <tr key={chapter.chapterId || chapter.chapter_id}>
                        <td>{highlightText(chapter.name, searchTerm)}</td>
                        <td>{highlightText(chapter.subjectName || chapter.subject, searchTerm)}</td>
                      
                        <td>
                          <div className="action-buttons-container">
                            <button className="btn btn-edit" title="Xem" onClick={() => handleEditClick(chapter)}>
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="btn btn-delete" title="Xóa" onClick={() => handleDeleteChapter(chapter.chapterId || chapter.chapter_id)}>
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
                  disabled={displayChapters.length < pageSize || loading}
                  className={`pagination-btn ${displayChapters.length < pageSize || loading ? 'disabled' : 'enabled'}`}
                >
                  Sau
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ChaptersPage;