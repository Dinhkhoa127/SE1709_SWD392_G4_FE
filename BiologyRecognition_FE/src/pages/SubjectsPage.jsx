import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';

import CreateModal from '../components/CreateModalSubject.jsx';
import EditModal from '../components/EditModalSubject.jsx';
import DeleteModal from '../components/DeleteModal.jsx';

import { fetchSubjects, fetchSubjectById, searchSubjectsByName, createSubject, updateSubject, deleteSubject } from '../redux/thunks/subjectThunks.jsx';
import { fetchCurrentUser } from '../redux/thunks/userThunks.jsx';
import { formatDate } from '../utils/dateUtils';

import '../styles/SubjectsPage.css';

const SubjectsPage = () => {
  const dispatch = useDispatch();
  const { subjects = [], selectedSubject: storeSelectedSubject, loading, error, createLoading, updateLoading, deleteLoading, fetchSubjectLoading } = useSelector(state => state.subjects || {});
  const { currentUser } = useSelector(state => state.user);
  
  // Lấy trạng thái collapsed từ localStorage, mặc định là false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('navbarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Fetch subjects and current user when component mount
  useEffect(() => {
    // Only fetch with pagination if no search term
    if (!searchTerm.trim()) {
      const params = {
        page: currentPage,
        pageSize: pageSize
      };
      
      dispatch(fetchSubjects(params));
    }
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

  // Lưu trạng thái collapsed vào localStorage khi thay đổi
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('navbarCollapsed', JSON.stringify(newCollapsedState));
  };

  // Filter subjects based on search term with defensive check - không cần nữa vì API đã hỗ trợ search
  const displaySubjects = Array.isArray(subjects) ? subjects : [];

  // Handle search with debounce
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      const params = {
        page: 1,
        pageSize: pageSize
      };
      
      if (value.trim()) {
        // Add name parameter for search
        params.name = value.trim();
      }
      
      // Use the same fetchSubjects thunk for both search and regular fetch
      dispatch(fetchSubjects(params));
    }, 500); // 500ms delay
    
    setSearchTimeout(timeout);
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
    
    dispatch(fetchSubjects(params));
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
    
    dispatch(fetchSubjects(params));
  };

  // Handlers
  const handleCreateSubject = (subjectData) => {
    dispatch(createSubject(subjectData))
      .then(() => {
        setShowCreate(false);
        toast.success('Tạo môn học thành công!');
        // Refresh with current pagination and search state
        const params = {
          page: currentPage,
          pageSize: pageSize
        };
        
        if (searchTerm.trim()) {
          params.name = searchTerm.trim();
        }
        
        dispatch(fetchSubjects(params));
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi tạo môn học!');
      });
  };

  const handleEditSubject = async (subject) => {
    setSelectedSubject(subject);
    
    // Fetch chi tiết subject để đảm bảo có đầy đủ thông tin (bao gồm subject_id)
    if (subject.subject_id) {
      await dispatch(fetchSubjectById(subject.subject_id));
    }
    
    setShowEdit(true);
  };

  const handleUpdateSubject = (subjectData) => {
    const subjectToUpdate = storeSelectedSubject || selectedSubject;
    
    if (subjectToUpdate) {
      const subjectId = subjectToUpdate.subject_id || subjectToUpdate.subjectId;
      
      if (!subjectId) {
        return;
      }
      
      dispatch(updateSubject({ 
        subjectId, 
        data: subjectData 
      }))
      .then(() => {
        setShowEdit(false);
        setSelectedSubject(null);
        toast.success('Cập nhật môn học thành công!');
        // Refresh with current pagination and search state
        const params = {
          page: currentPage,
          pageSize: pageSize
        };
        
        if (searchTerm.trim()) {
          params.name = searchTerm.trim();
        }
        
        dispatch(fetchSubjects(params));
      })
      .catch((error) => {
        toast.error('Có lỗi xảy ra khi cập nhật môn học!');
      });
    }
  };

  const handleDeleteSubject = (subject) => {
    setSelectedSubject(subject);
    setShowDelete(true);
  };

  const confirmDeleteSubject = () => {
    if (selectedSubject) {
      dispatch(deleteSubject(selectedSubject.subject_id))
        .then(() => {
          setShowDelete(false);
          setSelectedSubject(null);
          toast.success('Xóa môn học thành công!');
          // Refresh with current pagination and search state
          const params = {
            page: currentPage,
            pageSize: pageSize
          };
          
          if (searchTerm.trim()) {
            params.name = searchTerm.trim();
          }
          
          dispatch(fetchSubjects(params));
        })
        .catch(() => {
          toast.error('Có lỗi xảy ra khi xóa môn học!');
        });
    }
  };


  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="subjects" isCollapsed={isCollapsed} />
        <Header activeSection="subjects" isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Quản lý các môn sinh học</h1>
              <p className="page-description">Quản lý và tổ chức các môn học sinh học trong hệ thống</p>
            </div>
            
            <div className="action-buttons">
              <button 
                className="btn-primary" 
                onClick={() => setShowCreate(true)}
                disabled={createLoading}
              >
                <i className="fas fa-plus"></i> 
                {createLoading ? 'Đang tạo...' : 'Thêm mới môn học'}
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="search-container" style={{ marginBottom: 24 }}>
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên môn học..."
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
                  Tìm thấy {displaySubjects.length} kết quả cho "<strong>{searchTerm}</strong>"
                </div>
              )}
            </div>
            
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="col-name">Tên môn học</th>
                    <th className="col-description">Mô tả</th>
                    <th className="col-actions">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && displaySubjects.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="empty-state">
                        <div className="empty-state-icon">
                          <i className="fas fa-inbox"></i>
                        </div>
                        {searchTerm ? `Không tìm thấy môn học nào với từ khóa "${searchTerm}"` : 'Không có dữ liệu môn học'}
                      </td>
                    </tr>
                  ) : (
                    displaySubjects.map((subject) => (
                      <tr key={subject.subject_id}>
                        <td className="col-name">{highlightText(subject.name, searchTerm)}</td>
                        <td className="col-description">{highlightText(subject.description, searchTerm)}</td>
                        <td className="col-actions">
                          <div className="action-buttons-container">
                            <button
                              className="btn-edit"
                              
                              onClick={() => handleEditSubject(subject)}
                              disabled={updateLoading}
                            >
                              <i className="fas fa-edit"></i>
                             
                            </button>
                            <button 
                              className="btn-delete" 
                              title="Xóa" 
                              onClick={() => handleDeleteSubject(subject)}
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
                  disabled={displaySubjects.length < pageSize || loading}
                  className={`pagination-btn ${displaySubjects.length < pageSize || loading ? 'disabled' : 'enabled'}`}
                >
                  Sau
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>            <CreateModal 
              open={showCreate} 
              onClose={() => setShowCreate(false)} 
              onSubmit={handleCreateSubject}
              loading={createLoading}
            />
            <EditModal 
              open={showEdit} 
              onClose={() => {
                setShowEdit(false);
                setSelectedSubject(null);
              }}
              onSubmit={handleUpdateSubject}
              initialData={storeSelectedSubject || selectedSubject}
              loading={updateLoading || fetchSubjectLoading}
            />
            <DeleteModal
              open={showDelete}
              onClose={() => {
                setShowDelete(false);
                setSelectedSubject(null);
              }}
              onConfirm={confirmDeleteSubject}
              loading={deleteLoading}
              itemName={selectedSubject?.name}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default SubjectsPage;