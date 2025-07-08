import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { formatDate } from '../utils/dateUtils';
import '../styles/EditModal.css';

const defaultForm = {
  name: '',
  description: ''
};

const EditModal = ({ open, onClose, onSubmit, initialData, loading }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  
  const [form, setForm] = useState(defaultForm);
  const [isEditing, setIsEditing] = useState(false);

  // Load initial data when modal opens or initialData changes
  useEffect(() => {
    if (open && initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || ''
      });
      setIsEditing(false); // Reset to view mode when opening
    } else {
      setForm(defaultForm);
      setIsEditing(false);
    }
  }, [open, initialData]);

  // Fetch current user when modal opens
  useEffect(() => {
    if (open && !currentUser) {
      dispatch(fetchCurrentUser());
    }
  }, [open, currentUser, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    if (form.name.trim() && form.description.trim() && currentUser && initialData && isEditing) {
      const updateData = {
        ...form,
        modifiedBy: currentUser.userAccountId || currentUser.id || currentUser.userId || currentUser.user_id,
      };
      
      onSubmit(updateData);
    }
  };

  const handleClose = () => {
    setForm(defaultForm);
    setIsEditing(false);
    onClose();
  };



  if (!open) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-content edit-modal">
        <div className="edit-modal-title">
          {isEditing ? 'Chỉnh sửa môn học' : 'Xem thông tin môn học'}
        </div>
        <button className="close-btn" onClick={handleClose} aria-label="Đóng">
          <i className="fas fa-times"></i>
        </button>
        <form className="edit-modal-form" onSubmit={handleSubmit} id="editForm">
          <div className="form-group full-width">
            <label>Tên môn học</label>
            <textarea
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập tên môn học"
              rows="2"
              disabled={!isEditing}
              required
            />
          </div>
          <div className="form-group full-width">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập mô tả môn học"
              rows="4"
              disabled={!isEditing}
              required
            />
          </div>
          <div className="form-group">
            <label>Người sửa cuối</label>
            <input
              type="text"
              value={initialData?.ModifiedBy || initialData?.modifiedName || 'Chưa có'}
              disabled
              className="disabled-input"
            />
          </div>
          <div className="form-group">
            <label>Ngày sửa cuối</label>
            <input
              type="text"
              value={formatDate(initialData?.ModifiedDate || initialData?.modifiedDate)}
              disabled
              className="disabled-input"
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
                      name: initialData.name || '',
                      description: initialData.description || ''
                    });
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
                disabled={loading || !form.name.trim() || !form.description.trim()}
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

export default EditModal;