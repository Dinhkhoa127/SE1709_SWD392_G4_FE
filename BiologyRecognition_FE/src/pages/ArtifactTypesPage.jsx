import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';

import CreateModalArtifactType from '../components/CreateModalArtifactType.jsx';
import EditModalArtifactType from '../components/EditModalArtifactType.jsx';
import DeleteModal from '../components/DeleteModal.jsx';

import { fetchArtifactTypes, fetchArtifactTypeById, createArtifactType, updateArtifactType, deleteArtifactType } from '../redux/thunks/artifactTypeThunks.jsx';
import { fetchCurrentUser } from '../redux/thunks/userThunks.jsx';
import { fetchTopics } from '../redux/thunks/topicThunks.jsx';

import '../styles/SubjectsPage.css'; // Reusing existing styles

const ArtifactTypePage = () => {
  const dispatch = useDispatch();
  const { artifactTypes, selectedArtifactType: storeSelectedArtifactType, loading, error, createLoading, updateLoading, deleteLoading, fetchArtifactTypeLoading } = useSelector(state => state.artifactTypes);
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

  // Fetch artifact types and current user when component mount
  useEffect(() => {
    dispatch(fetchArtifactTypes());
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

  // Helper function to get topic name from topicId
  const getTopicName = (topicId) => {
    const topic = topics.find(t => t.topicId === topicId);
    return topic ? topic.topicName || topic.name : `Topic ID: ${topicId}`;
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
        <button className="btn btn-primary" onClick={() => dispatch(fetchArtifactTypes())}>
          Thử lại
        </button>
      </div>
    );
  }

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

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tên bài</th>
                    <th>Tên loại</th>
                    <th>Mô tả</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {artifactTypes && artifactTypes.length > 0 ? (
                    artifactTypes.map(artifactType => (
                      <tr key={artifactType.artifactTypeId}>
                        <td>{getTopicName(artifactType.topicId)}</td>
                        <td>{artifactType.name}</td>
                        <td>{artifactType.description}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-edit" 
                            title="Sửa"
                            onClick={() => handleEditArtifactType(artifactType)}
                            disabled={updateLoading}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-delete" 
                            title="Xóa"
                            onClick={() => handleDeleteArtifactType(artifactType)}
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
                        Không có dữ liệu loại mẫu vật
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
