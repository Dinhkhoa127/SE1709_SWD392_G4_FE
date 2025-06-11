import React, { useState, useEffect } from 'react';
import '../styles/EditModal.css';

const defaultForm = {
  name: '',
  description: '',
  CreatedDate: '',
  CreatedBy: '',
  ModifiedBy: '',
  ModifiedDate: '',
  status: 'active'
};

const EditModal = ({ open, onClose, subject, onSave }) => {
  const [form, setForm] = useState(subject || defaultForm);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setForm(subject || defaultForm);
    setIsEditing(false);
  }, [subject, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    if (onSave) onSave(form);
    setIsEditing(false);
  };

  if (!open) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-content edit-modal">
        <div className="edit-modal-title">Xem / Sửa môn học</div>
        <button className="close-btn" onClick={onClose} aria-label="Đóng">
          <i className="fas fa-times"></i>
        </button>
        <form className="edit-modal-form">
          <div className="form-group">
            <label>Tên môn học</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Ngày tạo</label>
            <input
              type="date"
              name="CreatedDate"
              value={form.CreatedDate}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group full-width">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Người tạo</label>
            <input
              name="CreatedBy"
              value={form.CreatedBy}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Người sửa cuối</label>
            <input
              name="ModifiedBy"
              value={form.ModifiedBy}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Ngày sửa cuối</label>
            <input
              type="date"
              name="ModifiedDate"
              value={form.ModifiedDate}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </form>
        <div className="action-buttons">
          {!isEditing && (
            <button className="btn btn-primary" onClick={handleEdit}>Edit</button>
          )}
          {isEditing && (
            <button className="btn btn-primary" onClick={handleSave}>Lưu</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditModal;