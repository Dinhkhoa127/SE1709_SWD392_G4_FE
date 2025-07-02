import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { fetchArtifactsThunk } from '../redux/thunks/artifactThunks';
import '../styles/CreateModal.css';

const CreateModalArticle = ({ open, onClose, onSubmit, loading }) => {
  const dispatch = useDispatch();
  const { artifacts = [] } = useSelector((state) => state.artifacts || {});
  const { currentUser } = useSelector(state => state.user);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    artifactIds: []
  });

  const [errors, setErrors] = useState({});
  const [selectedArtifacts, setSelectedArtifacts] = useState([]);

  // Fetch current user and artifacts when modal opens
  useEffect(() => {
    if (open) {
      if (!currentUser) {
        dispatch(fetchCurrentUser());
      }
      dispatch(fetchArtifactsThunk());
    }
  }, [open, currentUser, dispatch]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        title: '',
        content: '',
        artifactIds: []
      });
      setSelectedArtifacts([]);
      setErrors({});
    }
  }, [open]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle artifact selection
  const handleArtifactSelect = (artifactId) => {
    const artifact = artifacts.find(art => art.artifactId === artifactId);
    if (!artifact) return;

    const isSelected = selectedArtifacts.some(art => art.artifactId === artifactId);
    
    if (isSelected) {
      // Remove from selection
      const newSelection = selectedArtifacts.filter(art => art.artifactId !== artifactId);
      setSelectedArtifacts(newSelection);
      setFormData(prev => ({
        ...prev,
        artifactIds: newSelection.map(art => art.artifactId)
      }));
    } else {
      // Add to selection
      const newSelection = [...selectedArtifacts, artifact];
      setSelectedArtifacts(newSelection);
      setFormData(prev => ({
        ...prev,
        artifactIds: newSelection.map(art => art.artifactId)
      }));
    }
  };

  // Remove artifact from selection
  const removeArtifact = (artifactId) => {
    const newSelection = selectedArtifacts.filter(art => art.artifactId !== artifactId);
    setSelectedArtifacts(newSelection);
    setFormData(prev => ({
      ...prev,
      artifactIds: newSelection.map(art => art.artifactId)
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung là bắt buộc';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!currentUser) {
      toast.error('Không thể lấy thông tin người dùng hiện tại!');
      return;
    }

    const userId = currentUser.userAccountId || currentUser.id || currentUser.userId || currentUser.user_id;
    
    if (!userId) {
      toast.error('Không thể lấy ID người dùng hiện tại!');
      return;
    }

    const articleData = {
      title: formData.title,
      content: formData.content,
      artifactIds: formData.artifactIds,
      createdBy: userId
    };

    onSubmit(articleData);
  };

  // Handle close modal
  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      artifactIds: []
    });
    setSelectedArtifacts([]);
    setErrors({});
    onClose();
  };

  if (!open) return null;

  return (
    <div className="create-modal-overlay">
      <div className="create-modal-content create-modal">
        <div className="create-modal-title">Tạo bài viết mới</div>
        <button className="close-btn" onClick={handleClose} aria-label="Đóng">
          <i className="fas fa-times"></i>
        </button>
        <form className="create-modal-form" onSubmit={handleSubmit}>
          {/* Title Field */}
          <div className="form-group full-width">
            <label>Tiêu đề *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Nhập tiêu đề bài viết..."
              disabled={loading}
              required
            />
            {errors.title && (
              <div className="invalid-feedback" style={{ display: 'block', color: '#dc3545', fontSize: '0.875em', marginTop: '4px' }}>
                <i className="fas fa-exclamation-circle me-1"></i>
                {errors.title}
              </div>
            )}
          </div>

          {/* Content Field */}
          <div className="form-group full-width">
            <label>Nội dung *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Nhập nội dung bài viết..."
              rows="6"
              disabled={loading}
              required
            />
            {errors.content && (
              <div className="invalid-feedback" style={{ display: 'block', color: '#dc3545', fontSize: '0.875em', marginTop: '4px' }}>
                <i className="fas fa-exclamation-circle me-1"></i>
                {errors.content}
              </div>
            )}
          </div>

          {/* Artifacts Selection */}
          <div className="form-group full-width">
            <label className="form-label">
              <i className="fas fa-microscope me-2"></i>
              Mẫu vật liên quan
              <small className="text-muted ms-2">(Tùy chọn)</small>
            </label>
            
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
          </div>

          <div className="action-buttons">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Đang tạo...
                </>
              ) : (
                'Tạo mới'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModalArticle;
