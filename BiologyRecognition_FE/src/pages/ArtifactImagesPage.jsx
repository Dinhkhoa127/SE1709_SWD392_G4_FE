import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';

import CreateModalArtifactMedia from '../components/CreateModalArtifactMedia.jsx';
import EditModalArtifactMedia from '../components/EditModalArtifactMedia.jsx';
import DeleteModal from '../components/DeleteModal.jsx';

import { fetchArtifactMedia, fetchArtifactMediaById, createArtifactMedia, updateArtifactMedia, deleteArtifactMedia } from '../redux/thunks/artifactMediaThunks.jsx';
import { fetchCurrentUser } from '../redux/thunks/userThunks.jsx';
import { fetchArtifactTypes } from '../redux/thunks/artifactTypeThunks.jsx';

import '../styles/SubjectsPage.css'; // Reusing existing styles

const ArtifactImagesPage = () => {
  const dispatch = useDispatch();
  const { artifactMedia, selectedArtifactMedia, loading, error, createLoading, updateLoading, deleteLoading, fetchArtifactMediaLoading } = useSelector(state => state.artifactMedia);
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

  // Fetch artifact media and current user when component mount
  useEffect(() => {
    dispatch(fetchArtifactMedia());
    dispatch(fetchCurrentUser());
    dispatch(fetchArtifactTypes());
  }, [dispatch]);

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
        toast.success('Tạo hình ảnh mẫu vật thành công!');
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi tạo hình ảnh mẫu vật!');
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
        toast.success('Cập nhật hình ảnh mẫu vật thành công!');
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi cập nhật hình ảnh mẫu vật!');
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
          toast.success('Xóa hình ảnh mẫu vật thành công!');
        })
        .catch(() => {
          toast.error('Có lỗi xảy ra khi xóa hình ảnh mẫu vật!');
        });
    }
  };

  const handleCloseModals = () => {
    setShowCreate(false);
    setShowEdit(false);
    setShowDelete(false);
    setSelectedMedia(null);
  };

  // Helper function to get artifact name from artifactId
  const getArtifactName = (artifactId) => {
    const artifact = artifactTypes.find(a => a.artifactTypeId === artifactId);
    return artifact ? artifact.name : `Artifact ID: ${artifactId}`;
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
              <h1 className="page-title">Quản lý hình ảnh mẫu vật</h1>
              <p className="page-description">Quản lý hình ảnh và media của các mẫu vật sinh học</p>
            </div>
            
            <div className="action-buttons" style={{ marginBottom: 24 }}>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowCreate(true)}
                disabled={createLoading}
              >
                <i className="fas fa-plus"></i> 
                {createLoading ? 'Đang tạo...' : 'Thêm mới hình ảnh'}
              </button>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên tài liệu</th>
                    <th>Mẫu vật</th>
                    <th>Loại</th>
                    <th>URL</th>
                    <th>Mô tả</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {artifactMedia && artifactMedia.length > 0 ? (
                    artifactMedia.map(media => (
                      <tr key={media.artifactMediaId}>
                        <td>{media.artifactName}</td>
                        <td>{getArtifactName(media.artifactId)}</td>
                        <td>{media.type}</td>
                        <td>
                          <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {media.url}
                          </div>
                        </td>
                        <td>{media.description}</td>
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
                      <td colSpan="7" className="text-center">
                        Không có dữ liệu hình ảnh mẫu vật
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
        itemType="hình ảnh mẫu vật"
      />
    </>
  );
};

export default ArtifactImagesPage;