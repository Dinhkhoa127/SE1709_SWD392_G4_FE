import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { fetchSubjects } from '../redux/thunks/subjectThunks';
import '../styles/EditModal.css';

const defaultForm = {
  name: '',
  description: '',
  subjectId: ''
};

const EditModalChapter = ({ open, onClose, onSubmit, initialData, loading }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { subjects } = useSelector(state => state.subjects);
  
  const [form, setForm] = useState(defaultForm);
  const [isEditing, setIsEditing] = useState(false);

  // Load initial data when modal opens or initialData changes
  useEffect(() => {
    if (open && initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        subjectId: initialData.subjectId || ''
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

  // Fetch subjects when modal opens
  useEffect(() => {
    if (open) {
      dispatch(fetchSubjects());
    }
  }, [open, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    if (form.name.trim() && form.description.trim() && form.subjectId && currentUser && initialData && isEditing) {
      const updateData = {
        ...form,
        subjectId: parseInt(form.subjectId),
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
          {isEditing ? 'Chỉnh sửa chương học' : 'Xem thông tin chương học'}
        </div>
        <button className="close-btn" onClick={handleClose} aria-label="Đóng">
          <i className="fas fa-times"></i>
        </button>
        <form className="edit-modal-form" onSubmit={handleSubmit} id="editForm">
          <div className="form-group full-width">
            <label>Tên chương</label>
            <textarea
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập tên chương"
              rows="2"
              disabled={!isEditing}
              required
            />
          </div>
          
          <div className="form-group full-width">
            <label>Môn học</label>
            <select
              name="subjectId"
              value={form.subjectId}
              onChange={handleChange}
              disabled={!isEditing}
              required
            >
              <option value="">Chọn môn học</option>
              {subjects && subjects.map(subject => (
                <option key={subject.subjectId || subject.subject_id} value={subject.subjectId || subject.subject_id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group full-width">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập mô tả chương học"
              rows="4"
              disabled={!isEditing}
              required
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
                      description: initialData.description || '',
                      subjectId: initialData.subjectId || ''
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
                disabled={loading || !form.name.trim() || !form.description.trim() || !form.subjectId}
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

export default EditModalChapter;