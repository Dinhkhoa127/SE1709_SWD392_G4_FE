import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';

import CreateModalArtifactMedia from '../components/CreateModalArtifactMedia.jsx';
import EditModalArtifactMedia from '../components/EditModalArtifactMedia.jsx';
import DeleteModal from '../components/DeleteModal.jsx';

import { fetchArtifactMedia, searchArtifactMedia, fetchArtifactMediaById, createArtifactMedia, updateArtifactMedia, deleteArtifactMedia } from '../redux/thunks/artifactMediaThunks.jsx';
import { fetchCurrentUser } from '../redux/thunks/userThunks.jsx';
import { fetchArtifactTypes } from '../redux/thunks/artifactTypeThunks.jsx';

import '../styles/SubjectsPage.css'; // Reusing existing styles

const ArtifactMediasPage = () => {
  const dispatch = useDispatch();
  const { artifactMedia = [], selectedArtifactMedia, loading, error, createLoading, updateLoading, deleteLoading, fetchArtifactMediaLoading } = useSelector(state => state.artifactMedia || {});
  const { currentUser } = useSelector(state => state.user);
  const { artifactTypes } = useSelector(state => state.artifactTypes);
  
  // Lấy trạng thái collapsed từ localStorage, mặc định là false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('navbarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const searchTermRef = useRef('');

  // Helper function to get artifact name from artifactId
  const getArtifactName = (artifactId) => {
    // First try to find in artifactTypes
    const artifactType = artifactTypes?.find(a => a.artifactTypeId === artifactId);
    if (artifactType) {
      return artifactType.artifactTypeName || artifactType.name || artifactType.topicName;
    }
    
    // If not found, return the ID for debugging
    return `Artifact Type ID: ${artifactId}`;
  };

  // Helper function to render media preview based on type
  const renderMediaPreview = (media) => {
    if (!media.url) return 'Không có URL';
    
    const { type, url } = media;
    
    if (type === 'IMAGE') {
      return (
        <div className="media-preview">
          <img 
            src={url} 
            alt={media.artifactName}
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => {
              setSelectedImage({ url, name: media.artifactName });
              setShowImageModal(true);
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{ display: 'none', fontSize: '12px', color: '#666' }}>
            Lỗi tải ảnh
          </div>
        </div>
      );
    } else if (type === 'VIDEO') {
      return (
        <div className="media-preview">
          <video 
            src={url}
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => window.open(url, '_blank')}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{ display: 'none', fontSize: '12px', color: '#666' }}>
            Lỗi tải video
          </div>
        </div>
      );
    } else {
      return (
        <div className="media-preview">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '8px 12px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              textDecoration: 'none',
              color: '#333',
              fontSize: '12px'
            }}
          >
            <i className="fas fa-external-link-alt"></i> Xem file
          </a>
        </div>
      );
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Fetch artifact media when component mount or pagination changes
  useEffect(() => {
    // Only fetch with pagination if no search term in ref
    if (!searchTermRef.current.trim()) {
      dispatch(fetchArtifactMedia({ 
        page: currentPage, 
        pageSize: pageSize 
      }));
    }
  }, [dispatch, currentPage, pageSize]);

  // Fetch other data once on mount
  useEffect(() => {
    dispatch(fetchCurrentUser());
    // Force fetch all artifact types with high page size
    dispatch(fetchArtifactTypes({ page: 1, pageSize: 100 }));
  }, [dispatch]);

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
        dispatch(searchArtifactMedia({
          artifactName: value.trim(),
          page: 1,
          pageSize: pageSize
        }));
      } else {
        // Use regular fetch API with pagination
        dispatch(fetchArtifactMedia({
          page: 1,
          pageSize: pageSize
        }));
      }
    }, 300);
    
    setSearchTimeout(timeout);
  };

  // Display artifacts from server response (no client-side filtering)
  const displayedArtifactMedia = Array.isArray(artifactMedia) ? artifactMedia : [];

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    
    // Use search + pagination if there's a search term
    if (searchTerm.trim()) {
      dispatch(searchArtifactMedia({
        artifactName: searchTerm.trim(),
        page: newPage,
        pageSize: pageSize
      }));
    } else {
      // Use regular pagination when no search term
      dispatch(fetchArtifactMedia({ 
        page: newPage,
        pageSize: pageSize
      }));
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    
    // Use search + pagination if there's a search term
    if (searchTerm.trim()) {
      dispatch(searchArtifactMedia({
        artifactName: searchTerm.trim(),
        page: 1,
        pageSize: newPageSize
      }));
    } else {
      // Use regular pagination when no search term
      dispatch(fetchArtifactMedia({ 
        page: 1,
        pageSize: newPageSize
      }));
    }
  };

  // Lưu trạng thái collapsed vào localStorage khi thay đổi
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('navbarCollapsed', JSON.stringify(newCollapsedState));
  };

  // Handlers
  const handleCreateArtifactMedia = (artifactMediaData) => {
    dispatch(createArtifactMedia(artifactMediaData))
      .then(() => {
        setShowCreate(false);
        toast.success('Tạo media mẫu vật thành công!');
        
        // Use search + pagination if there's a search term
        if (searchTerm.trim()) {
          dispatch(searchArtifactMedia({
            artifactName: searchTerm.trim(),
            page: currentPage,
            pageSize: pageSize
          }));
        } else {
          // Use regular pagination when no search term
          dispatch(fetchArtifactMedia({ 
            page: currentPage,
            pageSize: pageSize
          }));
        }
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi tạo media mẫu vật!');
      });
  };

  const handleEditArtifactMedia = (media) => {
    setSelectedMedia(media);
    setShowEdit(true);
  };

  const handleUpdateArtifactMedia = (artifactMediaData) => {
    dispatch(updateArtifactMedia(artifactMediaData))
      .then(() => {
        setShowEdit(false);
        setSelectedMedia(null);
        toast.success('Cập nhật media mẫu vật thành công!');
        
        // Use search + pagination if there's a search term
        if (searchTerm.trim()) {
          dispatch(searchArtifactMedia({
            artifactName: searchTerm.trim(),
            page: currentPage,
            pageSize: pageSize
          }));
        } else {
          // Use regular pagination when no search term
          dispatch(fetchArtifactMedia({ 
            page: currentPage,
            pageSize: pageSize
          }));
        }
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi cập nhật media mẫu vật!');
      });
  };

  const handleDeleteArtifactMedia = (media) => {
    setSelectedMedia(media);
    setShowDelete(true);
  };

  const handleConfirmDelete = () => {
    if (selectedMedia) {
      dispatch(deleteArtifactMedia(selectedMedia.artifactMediaId))
        .then(() => {
          setShowDelete(false);
          setSelectedMedia(null);
          toast.success('Xóa media mẫu vật thành công!');
          
          // Use search + pagination if there's a search term
          if (searchTerm.trim()) {
            dispatch(searchArtifactMedia({
              artifactName: searchTerm.trim(),
              page: currentPage,
              pageSize: pageSize
            }));
          } else {
            // Use regular pagination when no search term
            dispatch(fetchArtifactMedia({ 
              page: currentPage,
              pageSize: pageSize
            }));
          }
        })
        .catch(() => {
          toast.error('Có lỗi xảy ra khi xóa media mẫu vật!');
        });
    }
  };

  const handleCloseModals = () => {
    setShowCreate(false);
    setShowEdit(false);
    setShowDelete(false);
    setSelectedMedia(null);
    setShowImageModal(false);
    setSelectedImage(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Lỗi: {error}</p>
        <button className="btn btn-primary" onClick={() => dispatch(fetchArtifactMedia())}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="artifact-images" isCollapsed={isCollapsed} />
        <Header activeSection="artifact-images" isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Quản lý media mẫu vật</h1>
              <p className="page-description">Quản lý hình ảnh, video, audio và tài liệu của các mẫu vật sinh học</p>
            </div>
            
            <div className="action-buttons" style={{ marginBottom: 24 }}>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowCreate(true)}
                disabled={createLoading}
              >
                <i className="fas fa-plus"></i> 
                {createLoading ? 'Đang tạo...' : 'Thêm mới media'}
              </button>
            </div>

            {/* Search Bar */}
            <div className="search-container" style={{ marginBottom: 24 }}>
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mẫu vật"
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
                  Tìm thấy {displayedArtifactMedia.length} kết quả cho "<strong>{searchTerm}</strong>"
                </div>
              )}
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên mẫu vật</th>
                   
                   
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(displayedArtifactMedia) && displayedArtifactMedia.length > 0 ? (
                    displayedArtifactMedia.map(media => (
                      <tr key={media.artifactMediaId}>
                        <td>{highlightText(media.artifactName, searchTerm)}</td>
                       
                     
                        <td>
                          <button 
                            className="btn btn-sm btn-edit" 
                            title="Sửa"
                            onClick={() => handleEditArtifactMedia(media)}
                            disabled={updateLoading}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-delete" 
                            title="Xóa"
                            onClick={() => handleDeleteArtifactMedia(media)}
                            disabled={deleteLoading}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        <div className="empty-state-icon">
                          <i className="fas fa-inbox"></i>
                        </div>
                        {searchTerm ? `Không tìm thấy media nào với từ khóa "${searchTerm}"` : 'Không có dữ liệu media mẫu vật'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
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
                  disabled={loading || (Array.isArray(artifactMedia) && artifactMedia.length < pageSize)}
                  className={`pagination-btn ${loading || (Array.isArray(artifactMedia) && artifactMedia.length < pageSize) ? 'disabled' : 'enabled'}`}
                >
                  Sau
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateModalArtifactMedia 
        open={showCreate}
        onClose={handleCloseModals}
        onSubmit={handleCreateArtifactMedia}
        loading={createLoading}
      />

      <EditModalArtifactMedia 
        open={showEdit}
        onClose={handleCloseModals}
        onSubmit={handleUpdateArtifactMedia}
        loading={updateLoading}
        artifactMedia={selectedMedia}
      />

      <DeleteModal 
        open={showDelete}
        onClose={handleCloseModals}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        itemName={selectedMedia?.artifactName}
        itemType="media mẫu vật"
      />

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="image-modal-overlay" onClick={handleCloseModals}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseModals}>
              <i className="fas fa-times"></i>
            </button>
            <img 
              src={selectedImage.url} 
              alt={selectedImage.name}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain'
              }}
            />
            <div className="image-modal-title">
              {selectedImage.name}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArtifactMediasPage;