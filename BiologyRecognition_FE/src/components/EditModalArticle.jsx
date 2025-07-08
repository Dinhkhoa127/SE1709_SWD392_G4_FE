import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { fetchArtifactsThunk } from '../redux/thunks/artifactThunks';
import { formatDate } from '../utils/dateUtils';
import '../styles/EditModal.css';

const defaultForm = {
  title: '',
  content: '',
  artifactIds: []
};

const EditModalArticle = ({ open, onClose, onSubmit, initialData, loading }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { artifacts = [] } = useSelector((state) => state.artifacts || {});
  
  const [form, setForm] = useState(defaultForm);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArtifacts, setSelectedArtifacts] = useState([]);

  // Load initial data when modal opens or initialData changes
  useEffect(() => {
    if (open && initialData) {
      setForm({
        title: initialData.title || '',
        content: initialData.content || '',
        artifactIds: initialData.artifactIds || []
      });
      
      // Set selected artifacts based on artifactIds
      if (initialData.artifactIds && Array.isArray(initialData.artifactIds)) {
        const selectedArts = artifacts.filter(art => 
          initialData.artifactIds.includes(art.artifactId)
        );
        setSelectedArtifacts(selectedArts);
      } else {
        setSelectedArtifacts([]);
      }
      
      setIsEditing(false); // Reset to view mode when opening
    } else {
      setForm(defaultForm);
      setSelectedArtifacts([]);
      setIsEditing(false);
    }
  }, [open, initialData, artifacts]);

  // Fetch current user and artifacts when modal opens
  useEffect(() => {
    if (open) {
      if (!currentUser) {
        dispatch(fetchCurrentUser());
      }
      dispatch(fetchArtifactsThunk());
    }
  }, [open, currentUser, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle artifact selection (only in edit mode)
  const handleArtifactSelect = (artifactId) => {
    if (!isEditing) return;
    
    const artifact = artifacts.find(art => art.artifactId === artifactId);
    if (!artifact) return;

    const isSelected = selectedArtifacts.some(art => art.artifactId === artifactId);
    
    if (isSelected) {
      // Remove from selection
      const newSelection = selectedArtifacts.filter(art => art.artifactId !== artifactId);
      setSelectedArtifacts(newSelection);
      setForm(prev => ({
        ...prev,
        artifactIds: newSelection.map(art => art.artifactId)
      }));
    } else {
      // Add to selection
      const newSelection = [...selectedArtifacts, artifact];
      setSelectedArtifacts(newSelection);
      setForm(prev => ({
        ...prev,
        artifactIds: newSelection.map(art => art.artifactId)
      }));
    }
  };

  // Remove artifact from selection (only in edit mode)
  const removeArtifact = (artifactId) => {
    if (!isEditing) return;
    
    const newSelection = selectedArtifacts.filter(art => art.artifactId !== artifactId);
    setSelectedArtifacts(newSelection);
    setForm(prev => ({
      ...prev,
      artifactIds: newSelection.map(art => art.artifactId)
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    if (form.title.trim() && form.content.trim() && currentUser && initialData && isEditing) {
      const updateData = {
        ...form,
        modifiedBy: currentUser.userAccountId || currentUser.id || currentUser.userId || currentUser.user_id,
      };
      
      onSubmit(updateData);
    }
  };

  const handleClose = () => {
    setForm(defaultForm);
    setSelectedArtifacts([]);
    setIsEditing(false);
    onClose();
  };

  // Get display names for view mode
  const getArtifactNames = () => {
    if (!selectedArtifacts || selectedArtifacts.length === 0) {
      return 'Không có mẫu vật liên quan';
    }
    return selectedArtifacts.map(art => art.artifactName).join(', ');
  };

  if (!open) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-content edit-modal">
        <div className="edit-modal-title">
          {isEditing ? 'Chỉnh sửa bài viết' : 'Xem thông tin bài viết'}
        </div>
        <button className="close-btn" onClick={handleClose} aria-label="Đóng">
          <i className="fas fa-times"></i>
        </button>
        
        <form className="edit-modal-form" onSubmit={handleSubmit} id="editForm">
          {/* Title Field */}
          <div className="form-group full-width">
            <label>Tiêu đề</label>
            <textarea
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề bài viết"
              rows="2"
              disabled={!isEditing}
              required
              style={{
                backgroundColor: !isEditing ? '#f5f5f5' : 'white',
                color: !isEditing ? '#666' : 'black'
              }}
            />
          </div>

          {/* Content Field */}
          <div className="form-group full-width">
            <label>Nội dung</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Nhập nội dung bài viết"
              rows="6"
              disabled={!isEditing}
              required
              style={{
                backgroundColor: !isEditing ? '#f5f5f5' : 'white',
                color: !isEditing ? '#666' : 'black'
              }}
            />
          </div>

          {/* Artifacts Selection */}
          <div className="form-group full-width">
            <label className="form-label">
              <i className="fas fa-microscope me-2"></i>
              Mẫu vật liên quan
              <small className="text-muted ms-2">(Tùy chọn)</small>
            </label>
            
            {!isEditing ? (
              // View mode - show selected artifacts as styled cards
              <div className="artifacts-view-mode">
                {selectedArtifacts.length > 0 ? (
                  <div className="selected-artifacts">
                    <div className="selected-artifacts-label">
                      <small className="text-muted">
                        <i className="fas fa-eye me-1"></i>
                        {selectedArtifacts.length} mẫu vật được liên kết
                      </small>
                    </div>
                    <div className="selected-artifacts-list">
                      {selectedArtifacts.map(artifact => (
                        <span key={artifact.artifactId} className="badge bg-info">
                          <i className="fas fa-leaf me-1"></i>
                          {artifact.artifactName}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="no-artifacts-selected">
                    <div className="text-center py-3" style={{ 
                      backgroundColor: '#f8f9fa', 
                      border: '1px dashed #dee2e6', 
                      borderRadius: '8px' 
                    }}>
                      <i className="fas fa-info-circle text-muted mb-2"></i>
                      <p className="text-muted mb-0">Không có mẫu vật nào được liên kết</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Edit mode - show interactive selection
              <>
                {/* Selected Artifacts Display */}
                {selectedArtifacts.length > 0 && (
                  <div className="selected-artifacts">
                    <div className="selected-artifacts-label">
                      <small className="text-muted">
                        <i className="fas fa-check-circle me-1 text-success"></i>
                        Đã chọn {selectedArtifacts.length} mẫu vật
                      </small>
                    </div>
                    <div className="selected-artifacts-list">
                      {selectedArtifacts.map(artifact => (
                        <span key={artifact.artifactId} className="badge bg-primary">
                          <i className="fas fa-leaf me-1"></i>
                          {artifact.artifactName}
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeArtifact(artifact.artifactId);
                            }}
                            disabled={loading}
                            title={`Bỏ chọn ${artifact.artifactName}`}
                          ></button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Artifacts Selection List */}
                <div className="artifacts-selection">
                  {artifacts && artifacts.length > 0 ? (
                    <>
                      <div className="artifacts-header" style={{ 
                        padding: '12px 20px', 
                        backgroundColor: '#f8f9fa', 
                        borderBottom: '1px solid #e9ecef',
                        borderTopLeftRadius: '12px',
                        borderTopRightRadius: '12px',
                        fontWeight: '500',
                        fontSize: '0.9em',
                        color: '#495057'
                      }}>
                        <i className="fas fa-list me-2"></i>
                        Chọn mẫu vật ({artifacts.length} mẫu vật có sẵn)
                      </div>
                      <div className="artifacts-grid">
                        {artifacts.map(artifact => {
                          const isSelected = selectedArtifacts.some(art => art.artifactId === artifact.artifactId);
                          return (
                            <div
                              key={artifact.artifactId}
                              className={`artifact-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => handleArtifactSelect(artifact.artifactId)}
                              title={`${isSelected ? 'Bỏ chọn' : 'Chọn'} ${artifact.artifactName}`}
                            >
                              <div className="artifact-checkbox">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleArtifactSelect(artifact.artifactId)}
                                  disabled={loading}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                              <div className="artifact-info">
                                <div className="artifact-name">
                                  <i className="fas fa-seedling me-2 text-success"></i>
                                  {artifact.artifactName}
                                </div>
                                {artifact.scientificName && (
                                  <div className="artifact-scientific">
                                    <small className="text-muted">
                                      <i className="fas fa-flask me-1"></i>
                                      {artifact.scientificName}
                                    </small>
                                  </div>
                                )}
                                {artifact.description && (
                                  <div className="artifact-description">
                                    <small className="text-muted">
                                      <i className="fas fa-info-circle me-1"></i>
                                      {artifact.description.length > 80
                                        ? `${artifact.description.substring(0, 80)}...`
                                        : artifact.description
                                      }
                                    </small>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                      <p className="text-muted mb-0">Không có mẫu vật nào được tìm thấy</p>
                      <small className="text-muted">Hãy thêm mẫu vật trong trang quản lý mẫu vật</small>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* Read-only fields */}
          <div className="form-group">
            <label>Người sửa cuối</label>
            <input
              type="text"
              value={initialData?.modifiedName || initialData?.ModifiedBy || ''}
              disabled
              style={{
                backgroundColor: '#f5f5f5',
                color: '#666',
                border: '1px solid #ddd'
              }}
            />
          </div>
          <div className="form-group">
            <label>Ngày sửa cuối</label>
            <input
              type="text"
              value={initialData?.modifiedDate || initialData?.ModifiedDate ? formatDate(initialData?.modifiedDate || initialData?.ModifiedDate) : ''}
              disabled
              style={{
                backgroundColor: '#f5f5f5',
                color: '#666',
                border: '1px solid #ddd'
              }}
            />
          </div>
        </form>

        <div className="action-buttons">
          {!isEditing ? (
            // View mode buttons
            <>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleClose}
              >
                Đóng
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleEdit}
              >
                <i className="fas fa-edit"></i> Chỉnh sửa
              </button>
            </>
          ) : (
            // Edit mode buttons
            <>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  // Reset form to initial data when canceling
                  if (initialData) {
                    setForm({
                      title: initialData.title || '',
                      content: initialData.content || '',
                      artifactIds: initialData.artifactIds || []
                    });
                    
                    // Reset selected artifacts
                    if (initialData.artifactIds && Array.isArray(initialData.artifactIds)) {
                      const selectedArts = artifacts.filter(art => 
                        initialData.artifactIds.includes(art.artifactId)
                      );
                      setSelectedArtifacts(selectedArts);
                    } else {
                      setSelectedArtifacts([]);
                    }
                  }
                  setIsEditing(false);
                }}
                disabled={loading}
              >
                Hủy
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={
                  loading || 
                  !form.title.trim() || 
                  !form.content.trim()
                }
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Đang lưu...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i> Lưu
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditModalArticle;
