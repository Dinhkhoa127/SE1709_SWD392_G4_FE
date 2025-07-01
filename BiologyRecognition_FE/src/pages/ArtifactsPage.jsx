import React, { useState, useEffect } from 'react';
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

  // Fetch artifacts khi component mount
  useEffect(() => {
   
    dispatch(fetchArtifactsThunk());
  }, [dispatch]);

  // Debug Redux state
  useEffect(() => {
   
  }, [artifacts, loading, error]);

  // Handle refresh data
  const handleRefresh = () => {
    dispatch(fetchArtifactsThunk());
  };

  // Handle create artifact
  const handleCreateArtifact = (artifactData) => {
    dispatch(createArtifactThunk(artifactData))
      .then(() => {
        setShowCreate(false);
        toast.success('Tạo mẫu vật thành công!');
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
        // Success - thunk đã refresh data
        setShowEdit(false);
        setSelectedArtifact(null);
        toast.success('Cập nhật mẫu vật thành công!');
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

  // Filter artifacts based on search term with defensive check
  const filteredArtifacts = (Array.isArray(artifacts) ? artifacts : []).filter(artifact =>
    artifact?.artifactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artifact?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artifact?.scientificName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artifact?.artifactTypeName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
            {error && (
              <div className="alert alert-danger" style={{ marginBottom: 24 }}>
                <i className="fas fa-exclamation-triangle"></i> {error}
                <button 
                  className="btn btn-sm btn-outline-danger ms-2" 
                  onClick={() => dispatch(clearArtifactError())}
                >
                  Đóng
                </button>
              </div>
            )}
            
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
                  placeholder="Tìm kiếm theo tên mẫu vật, mô tả, tên khoa học hoặc loại mẫu vật..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="clear-search-btn"
                    title="Xóa tìm kiếm"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="search-results-info">
                  Tìm thấy {filteredArtifacts.length} kết quả cho "{searchTerm}"
                </div>
              )}
            </div>
            
            <div className="table-responsive">
              {loading && (!filteredArtifacts || filteredArtifacts.length === 0) ? (
                <div className="text-center py-4">
                  <i className="fas fa-spinner fa-spin fa-2x"></i>
                  <p className="mt-2">Đang tải dữ liệu...</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tên mẫu vật</th>
                      <th>Mô tả</th>
                      <th>Tên khoa học</th>
                      <th>Loại mẫu vật</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!filteredArtifacts || filteredArtifacts.length === 0) && !loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          <i className="fas fa-inbox fa-2x mb-2"></i>
                          <p>{searchTerm ? `Không tìm thấy mẫu vật nào với từ khóa "${searchTerm}"` : 'Không có dữ liệu mẫu vật'}</p>
                        </td>
                      </tr>
                    ) : (
                      filteredArtifacts && filteredArtifacts.map(artifact => (
                        <tr key={artifact.artifactId}>
                          <td>{highlightText(artifact.artifactName, searchTerm) || 'N/A'}</td>
                          <td title={artifact.description || ''}>
                            {artifact.description && artifact.description.length > 100
                              ? highlightText(`${artifact.description.substring(0, 100)}...`, searchTerm)
                              : (highlightText(artifact.description, searchTerm) || 'Không có mô tả')}
                          </td>
                          <td>{highlightText(artifact.scientificName, searchTerm) || 'N/A'}</td>
                          <td>{highlightText(artifact.artifactTypeName, searchTerm) || 'N/A'}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-edit" 
                              title="Sửa"
                              onClick={() => handleEditArtifact(artifact)}
                              disabled={updating}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-sm btn-delete" title="Xóa">
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
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
