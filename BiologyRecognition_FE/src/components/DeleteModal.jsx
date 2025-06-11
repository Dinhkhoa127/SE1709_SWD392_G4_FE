import React from 'react';
import '../styles/DeleteModal.css';

const DeleteModal = ({ open, onClose, onConfirm, title = "Xóa mục này?", message = "Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác." }) => {
  if (!open) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <button className="delete-modal-close-btn" onClick={onClose} aria-label="Đóng">
          <i className="fas fa-times"></i>
        </button>
        <div className="delete-modal-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <div className="delete-modal-title">{title}</div>
        <div className="delete-modal-message">{message}</div>
        <div className="delete-modal-actions">
          <button className="btn btn-cancel" onClick={onClose}>Hủy</button>
          <button className="btn btn-danger" onClick={onConfirm}>Xác nhận xóa</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;