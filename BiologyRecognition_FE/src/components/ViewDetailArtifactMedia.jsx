import React from 'react';
import { formatDate } from '../utils/dateUtils';

const ViewDetailArtifactMedia = ({ open, onClose, artifactMedia, artifactTypes }) => {
  if (!open || !artifactMedia) return null;

  // Helper function to get artifact type name
  const getArtifactTypeName = (artifactId) => {
    const artifactType = artifactTypes?.find(a => a.artifactTypeId === artifactId);
    if (artifactType) {
      return artifactType.artifactTypeName || artifactType.name || 'Không xác định';
    }
    return 'Không xác định';
  };

  // Helper function to render media preview
  const renderMediaPreview = () => {
    if (!artifactMedia.url) {
      return (
        <div className="no-media-placeholder">
          <i className="fas fa-file"></i>
          <span>Không có media</span>
        </div>
      );
    }

    const { type, url } = artifactMedia;

    if (type === 'IMAGE') {
      return (
        <div className="media-preview-large">
          <img 
            src={url} 
            alt={artifactMedia.artifactName}
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{ 
            display: 'none', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '200px',
            color: '#666',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            flexDirection: 'column'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
            <span>Lỗi tải hình ảnh</span>
          </div>
        </div>
      );
    } else if (type === 'VIDEO') {
      return (
        <div className="media-preview-large">
          <video 
            controls
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          >
            <source src={url} type="video/mp4" />
            <source src={url} type="video/webm" />
            <source src={url} type="video/ogg" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
          <div style={{ 
            display: 'none', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '200px',
            color: '#666',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            flexDirection: 'column'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
            <span>Lỗi tải video</span>
          </div>
        </div>
      );
    } else if (type === 'AUDIO') {
      return (
        <div className="media-preview-large">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '200px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            flexDirection: 'column',
            marginBottom: '16px'
          }}>
            <i className="fas fa-volume-up" style={{ fontSize: '64px', color: '#6c757d', marginBottom: '16px' }}></i>
            <span style={{ color: '#6c757d', fontSize: '18px' }}>Tệp âm thanh</span>
          </div>
          <audio 
            controls 
            style={{ width: '100%' }}
            onError={(e) => {
              e.target.nextSibling.style.display = 'block';
            }}
          >
            <source src={url} type="audio/mpeg" />
            <source src={url} type="audio/wav" />
            <source src={url} type="audio/ogg" />
            Trình duyệt của bạn không hỗ trợ audio.
          </audio>
          <div style={{ display: 'none', color: '#dc3545', textAlign: 'center', marginTop: '8px' }}>
            Lỗi tải tệp âm thanh
          </div>
        </div>
      );
    } else {
      return (
        <div className="media-preview-large">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '200px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            flexDirection: 'column'
          }}>
            <i className="fas fa-file-alt" style={{ fontSize: '64px', color: '#6c757d', marginBottom: '16px' }}></i>
            <span style={{ color: '#6c757d', fontSize: '18px', marginBottom: '16px' }}>Tệp tài liệu</span>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <i className="fas fa-external-link-alt"></i> Mở tệp
            </a>
          </div>
        </div>
      );
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'ACTIVE': { class: 'success', text: 'Hoạt động' },
      'INACTIVE': { class: 'secondary', text: 'Không hoạt động' },
      'PENDING': { class: 'warning', text: 'Chờ duyệt' },
      'DELETED': { class: 'danger', text: 'Đã xóa' }
    };
    
    const statusInfo = statusMap[status] || { class: 'secondary', text: status || 'Không xác định' };
    
    return (
      <span className={`status-badge-detail bg-${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-xl" role="document">
        <div className="modal-content artifact-media-modal">
          <div className="modal-header artifact-media-header">
            <h5 className="modal-title">
              <i className="fas fa-info-circle me-2"></i>
              Chi tiết Media Mẫu vật
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body artifact-media-body">
            <div className="detail-layout">
              {/* Left Column - Media Preview */}
              <div className="detail-left-column">
                <div className="detail-section-title">
                  <i className="fas fa-image me-2"></i>
                  Media Preview
                </div>
                <div className="media-section">
                  {renderMediaPreview()}
                  {artifactMedia.url && (
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                      <a 
                        href={artifactMedia.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary btn-sm"
                      >
                        <i className="fas fa-external-link-alt me-1"></i>
                        Xem toàn màn hình
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="detail-right-column">
                <div className="detail-section-title">
                  <i className="fas fa-list me-2"></i>
                  Thông tin chi tiết
                </div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="fas fa-tag me-1"></i>
                      ID
                    </div>
                    <div className="detail-value">
                      {artifactMedia.artifactMediaId || 'Không có'}
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="fas fa-cube me-1"></i>
                      Tên mẫu vật
                    </div>
                    <div className="detail-value">
                      {artifactMedia.artifactName || 'Không có tên'}
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="fas fa-layer-group me-1"></i>
                      Loại mẫu vật
                    </div>
                    <div className="detail-value">
                      {getArtifactTypeName(artifactMedia.artifactId)}
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="fas fa-file-alt me-1"></i>
                      Loại media
                    </div>
                    <div className="detail-value">
                      <span className={`badge bg-${
                        artifactMedia.type === 'IMAGE' ? 'info' :
                        artifactMedia.type === 'VIDEO' ? 'success' :
                        artifactMedia.type === 'AUDIO' ? 'warning' : 'secondary'
                      }`}>
                        {artifactMedia.type === 'IMAGE' ? 'Hình ảnh' :
                         artifactMedia.type === 'VIDEO' ? 'Video' :
                         artifactMedia.type === 'AUDIO' ? 'Âm thanh' : 
                         artifactMedia.type || 'Không xác định'}
                      </span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="fas fa-link me-1"></i>
                      URL
                    </div>
                    <div className="detail-value">
                      {artifactMedia.url ? (
                        <a 
                          href={artifactMedia.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary text-decoration-none"
                          style={{ 
                            wordBreak: 'break-all',
                            fontSize: '0.9em'
                          }}
                        >
                          <i className="fas fa-external-link-alt me-1"></i>
                          {artifactMedia.url.length > 50 ? 
                            `${artifactMedia.url.substring(0, 50)}...` : 
                            artifactMedia.url
                          }
                        </a>
                      ) : (
                        'Không có URL'
                      )}
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="fas fa-align-left me-1"></i>
                      Mô tả
                    </div>
                    <div className="detail-value">
                      {artifactMedia.description || 'Không có mô tả'}
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="fas fa-toggle-on me-1"></i>
                      Trạng thái
                    </div>
                    <div className="detail-value">
                      {getStatusBadge(artifactMedia.status)}
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="fas fa-calendar-plus me-1"></i>
                      Ngày tạo
                    </div>
                    <div className="detail-value">
                      {artifactMedia.createdAt ? formatDate(artifactMedia.createdAt) : 'Không có thông tin'}
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="fas fa-calendar-edit me-1"></i>
                      Ngày cập nhật
                    </div>
                    <div className="detail-value">
                      {artifactMedia.updatedAt ? formatDate(artifactMedia.updatedAt) : 'Chưa cập nhật'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer artifact-media-footer">
            <button 
              type="button" 
              className="btn btn-secondary btn-close-modal" 
              onClick={onClose}
            >
              <i className="fas fa-times me-1"></i>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailArtifactMedia;
