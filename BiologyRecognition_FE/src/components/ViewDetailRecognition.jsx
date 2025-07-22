import React from 'react';
import { formatDate } from '../utils/dateUtils';
import '../styles/EditModal.css';
import '../styles/ViewDetail.css';

const ViewDetailRecognition = ({ open, onClose, recognitionData }) => {
  if (!open || !recognitionData) return null;

  // Helper function to render media preview based on type
  const renderMediaPreview = () => {
    if (!recognitionData.imageUrl) {
      return (
        <div className="no-image-placeholder">
          <i className="fas fa-image"></i>
          <span>Không có media</span>
        </div>
      );
    }

    // Determine media type based on URL or default to IMAGE
    const mediaType = recognitionData.mediaType || 'IMAGE';

    return (
      <div className="image-container-large">
        <div className="current-media-preview">
          {mediaType === 'IMAGE' && (
            <div className="image-preview">
              <img 
                src={recognitionData.imageUrl}
                alt="Recognition Media" 
                className="recognition-image-large"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="image-error" style={{ display: 'none' }}>
                <i className="fas fa-exclamation-triangle"></i>
                <span>Không thể tải ảnh</span>
              </div>
            </div>
          )}
          {mediaType === 'VIDEO' && (
            <div className="video-preview">
              <video 
                src={recognitionData.imageUrl}
                controls 
                className="recognition-image-large"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="video-error" style={{ display: 'none' }}>
                <i className="fas fa-exclamation-triangle"></i>
                <span>Không thể tải video</span>
              </div>
            </div>
          )}
          {mediaType === 'AUDIO' && (
            <div className="audio-preview">
              <audio 
                src={recognitionData.imageUrl}
                controls 
                className="recognition-audio-large"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="audio-error" style={{ display: 'none' }}>
                <i className="fas fa-exclamation-triangle"></i>
                <span>Không thể tải audio</span>
              </div>
            </div>
          )}
          {mediaType === 'DOCUMENT' && (
            <div className="document-preview">
              <div className="document-icon">
                <i className="fas fa-file-alt"></i>
                <span>Tài liệu</span>
              </div>
            </div>
          )}
          <div className="media-actions">
            <a 
              href={recognitionData.imageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary btn-expand view-link"
            >
              <i className="fas fa-external-link-alt me-2"></i>
              Xem toàn màn hình
            </a>
          </div>
        </div>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'completed': { class: 'success', text: 'Hoàn thành' },
      'processing': { class: 'warning', text: 'Đang xử lý' },
      'failed': { class: 'danger', text: 'Thất bại' },
      'pending': { class: 'secondary', text: 'Chờ xử lý' }
    };
    
    const statusInfo = statusMap[status?.toLowerCase()] || { class: 'secondary', text: status || 'Không xác định' };
    
    return (
      <div className="status-badge-like-ai">
        {statusInfo.text}
      </div>
    );
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-content edit-modal">
        <div className="edit-modal-title">
          <i className="fas fa-brain me-2"></i>
          Chi tiết Nhận diện sinh học
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Đóng">
          <i className="fas fa-times"></i>
        </button>
        
        <div className="edit-modal-form">
          {/* Media Section */}
          <div className="form-group full-width">
            <label>Media hiện tại</label>
            {recognitionData.imageUrl ? (
              <div className="current-media-preview">
                {/* Determine media type and render accordingly */}
                {(recognitionData.mediaType || 'IMAGE') === 'IMAGE' && (
                  <div className="image-preview">
                    <img 
                      src={recognitionData.imageUrl}
                      alt="Recognition Media" 
                      className="current-media-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="image-error" style={{ display: 'none' }}>
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>Không thể tải ảnh</span>
                    </div>
                  </div>
                )}
                {(recognitionData.mediaType || 'IMAGE') === 'VIDEO' && (
                  <div className="video-preview">
                    <video 
                      src={recognitionData.imageUrl}
                      controls 
                      className="current-media-video"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="video-error" style={{ display: 'none' }}>
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>Không thể tải video</span>
                    </div>
                  </div>
                )}
                {(recognitionData.mediaType || 'IMAGE') === 'AUDIO' && (
                  <div className="audio-preview">
                    <audio 
                      src={recognitionData.imageUrl}
                      controls 
                      className="current-media-audio"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="audio-error" style={{ display: 'none' }}>
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>Không thể tải audio</span>
                    </div>
                  </div>
                )}
                {(recognitionData.mediaType || 'IMAGE') === 'DOCUMENT' && (
                  <div className="document-preview">
                    <div className="document-icon">
                      <i className="fas fa-file-alt"></i>
                      <span>Tài liệu</span>
                    </div>
                  </div>
                )}
                <div className="media-actions">
                  <a href={recognitionData.imageUrl} target="_blank" rel="noopener noreferrer" className="view-link">
                    <i className="fas fa-external-link-alt"></i> Xem toàn màn hình
                  </a>
                </div>
              </div>
            ) : (
              <div className="no-media-placeholder">
                <i className="fas fa-image"></i>
                <span>Không có media</span>
              </div>
            )}
          </div>

          {/* Information Fields */}
          <div className="form-group">
            <label>ID Nhận diện</label>
            <input
              type="text"
              value={recognitionData.recognitionId || 'Không có'}
              disabled
              className="form-control"
            />
          </div>

          <div className="form-group full-width">
            <label>Kết quả AI</label>
            <div className="ai-result-display">
              {recognitionData.aiResult || 'Chưa có kết quả'}
            </div>
          </div>

          <div className="form-group">
            <label>Độ tin cậy</label>
            <div className="confidence-display">
              {recognitionData.confidenceScore ? 
                `${(recognitionData.confidenceScore * 100).toFixed(2)}%` : 
                'N/A'
              }
            </div>
          </div>

          <div className="form-group full-width">
            <label>
              <i className="fas fa-flag me-2"></i>
              Trạng thái
            </label>
            <div className="status-display-prominent">
              {getStatusBadge(recognitionData.status)}
            </div>
          </div>

          <div className="form-group">
            <label>Tên mẫu vật</label>
            <input
              type="text"
              value={recognitionData.artifactName || 'Không có'}
              disabled
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>ID Người dùng</label>
            <input
              type="text"
              value={recognitionData.userId || 'Không có'}
              disabled
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Thời gian nhận diện</label>
            <input
              type="text"
              value={recognitionData.recognizedAt ? formatDate(recognitionData.recognizedAt) : 'Không có thông tin'}
              disabled
              className="form-control"
            />
          </div>
        </div>

        <div className="action-buttons">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            <i className="fas fa-times me-1"></i>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailRecognition;
