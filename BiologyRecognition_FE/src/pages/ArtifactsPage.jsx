import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import '../styles/SubjectsPage.css';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import CreateModalArtifact from '../components/CreateModalArtifact.jsx';
import EditModalArtifact from '../components/EditModalArtifact.jsx';
import { fetchArtifactsThunk, createArtifactThunk, updateArtifactThunk } from '../redux/thunks/artifactThunks';
import { clearArtifactError } from '../redux/actions/artifactActions';

const ArtifactsPage = () => {
  // Redux
  const dispatch = useDispatch();
  const { artifacts = [], loading = false, error = null, creating = false, updating = false } = useSelector((state) => state.artifacts || {});

  // Local state
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchTermRef = useRef('');

  // Lấy trạng thái collapsed từ localStorage, mặc định là false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('navbarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Lưu trạng thái collapsed vào localStorage khi thay đổi
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('navbarCollapsed', JSON.stringify(newCollapsedState));
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Fetch artifacts khi component mount hoặc pagination changes
  useEffect(() => {
    // Only fetch with pagination if no search term in ref
    if (!searchTermRef.current.trim()) {
      dispatch(fetchArtifactsThunk({ 
        page: currentPage, 
        pageSize: pageSize,
        includeDetails: true 
      }));
    }
  }, [dispatch, currentPage, pageSize]); // Remove all search-related dependencies

  // Handle search with debounce
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    searchTermRef.current = value; // Update ref immediately
    setCurrentPage(1); // Reset to first page when searching
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      if (value.trim()) {
        // Use search API with pagination
        dispatch(fetchArtifactsThunk({ 
          name: value.trim(),
          page: 1,
          pageSize: pageSize,
          includeDetails: true 
        }));
      } else {
        // Use regular fetch API with pagination
        dispatch(fetchArtifactsThunk({ 
          page: 1,
          pageSize: pageSize,
          includeDetails: true 
        }));
      }
    }, 300);
    
    setSearchTimeout(timeout);
  };

  // Handle refresh data
  const handleRefresh = () => {
    dispatch(fetchArtifactsThunk({ 
      page: currentPage, 
      pageSize: pageSize,
      includeDetails: true 
    }));
  };

  // Handle create artifact
  const handleCreateArtifact = (artifactData) => {
    dispatch(createArtifactThunk(artifactData))
      .then(() => {
        setShowCreate(false);
        toast.success('Tạo mẫu vật thành công!');
        // Refresh based on current state
        if (searchTerm.trim()) {
          dispatch(fetchArtifactsThunk({ 
            name: searchTerm.trim(),
            page: currentPage,
            pageSize: pageSize,
            includeDetails: true 
          }));
        } else {
          dispatch(fetchArtifactsThunk({ 
            page: currentPage,
            pageSize: pageSize,
            includeDetails: true 
          }));
        }
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi tạo mẫu vật!');
      });
  };

  // Handle edit artifact
  const handleEditArtifact = (artifact) => {
    setSelectedArtifact(artifact);
    setShowEdit(true);
  };

  // Handle update artifact
  const handleUpdateArtifact = async (artifactData) => {
    if (selectedArtifact) {
      const updateData = {
        ...artifactData,
        artifactId: selectedArtifact.artifactId
      };
      
      try {
        await dispatch(updateArtifactThunk(updateData));
        setShowEdit(false);
        setSelectedArtifact(null);
        toast.success('Cập nhật mẫu vật thành công!');
        // Refresh artifacts data with current search and pagination state
        if (searchTerm.trim()) {
          dispatch(fetchArtifactsThunk({ 
            name: searchTerm.trim(),
            page: currentPage,
            pageSize: pageSize,
            includeDetails: true 
          }));
        } else {
          dispatch(fetchArtifactsThunk({ 
            page: currentPage,
            pageSize: pageSize,
            includeDetails: true 
          }));
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi cập nhật mẫu vật!');
      }
    }
  };

  // Handle close edit modal
  const handleCloseEdit = () => {
    setShowEdit(false);
    setSelectedArtifact(null);
  };

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearArtifactError());
      }
    };
  }, [dispatch, error]);

  // Display artifacts (server đã filter và paginate rồi)
  const displayedArtifacts = Array.isArray(artifacts) ? artifacts : [];
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    
    // Use search + pagination if there's a search term
    if (searchTerm.trim()) {
      dispatch(fetchArtifactsThunk({ 
        name: searchTerm.trim(),
        page: newPage,
        pageSize: pageSize,
        includeDetails: true 
      }));
    } else {
      // Use regular pagination when no search term
      dispatch(fetchArtifactsThunk({ 
        page: newPage,
        pageSize: pageSize,
        includeDetails: true 
      }));
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    
    // Use search + pagination if there's a search term
    if (searchTerm.trim()) {
      dispatch(fetchArtifactsThunk({ 
        name: searchTerm.trim(),
        page: 1,
        pageSize: newPageSize,
        includeDetails: true 
      }));
    } else {
      // Use regular pagination when no search term
      dispatch(fetchArtifactsThunk({ 
        page: 1,
        pageSize: newPageSize,
        includeDetails: true 
      }));
    }
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

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="artifacts" isCollapsed={isCollapsed} />
        <Header activeSection="artifacts" isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Quản lý các mẫu vật sinh học</h1>
              <p className="page-description">Quản lý các mẫu vật sinh học</p>
            </div>
            
            <div className="action-buttons" style={{ marginBottom: 24 }}>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreate(true)}
                disabled={creating}
              >
                <i className="fas fa-plus"></i> 
                {creating ? 'Đang tạo...' : 'Thêm mới mẫu vật'}
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="search-container" style={{ marginBottom: 24 }}>
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên mẫu vật"
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
                  Tìm thấy {displayedArtifacts.length} kết quả cho "<strong>{searchTerm}</strong>"
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
                      <th>Tên mẫu vật</th>
                      <th>Mã mẫu vật</th>
                      <th>Tên khoa học</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading && displayedArtifacts.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="empty-state">
                          <div className="empty-state-icon">
                            <i className="fas fa-inbox"></i>
                          </div>
                          {searchTerm ? `Không tìm thấy mẫu vật nào với từ khóa "${searchTerm}"` : 'Không có dữ liệu mẫu vật'}
                        </td>
                      </tr>
                    ) : (
                      displayedArtifacts.map(artifact => (
                        <tr key={artifact.artifactId}>
                          <td>{highlightText(artifact.artifactName, searchTerm) || 'N/A'}</td>
                          <td>{highlightText(artifact.artifactCode, searchTerm) || 'N/A'}</td>
                          <td>{highlightText(artifact.scientificName, searchTerm) || 'N/A'}</td>
                          <td>
                            <div className="action-buttons-container">
                              <button 
                                className="btn-edit" 
                                title="Sửa"
                                onClick={() => handleEditArtifact(artifact)}
                                disabled={updating}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="btn-delete" title="Xóa">
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

            {/* Pagination Controls - Always show when there are artifacts */}
            {displayedArtifacts.length > 0 && (
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
                    disabled={loading || (displayedArtifacts && displayedArtifacts.length < pageSize)}
                    className={`pagination-btn ${loading || (displayedArtifacts && displayedArtifacts.length < pageSize) ? 'disabled' : 'enabled'}`}
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
      
      <CreateModalArtifact 
        open={showCreate} 
        onClose={() => setShowCreate(false)} 
        onSubmit={handleCreateArtifact}
        loading={creating}
      />
      
      <EditModalArtifact 
        open={showEdit} 
        onClose={handleCloseEdit} 
        onSubmit={handleUpdateArtifact}
        initialData={selectedArtifact}
        loading={updating}
      />
    </>
  );
};

export default ArtifactsPage;
