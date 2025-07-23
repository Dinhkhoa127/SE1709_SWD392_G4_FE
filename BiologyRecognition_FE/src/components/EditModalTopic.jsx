import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { getChaptersAPI } from '../redux/services/apiService';
import '../styles/EditModal.css';

const defaultForm = {
  name: '',
  chapterId: '',
  description: ''
};

const EditModalTopic = ({ open, onClose, onSubmit, initialData, loading }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  
  const [form, setForm] = useState(defaultForm);
  const [isEditing, setIsEditing] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [chaptersLoading, setChaptersLoading] = useState(false);

  // Load initial data when modal opens or initialData changes
  useEffect(() => {
    if (open && initialData) {
      setForm({
        name: initialData.name || '',
        chapterId: initialData.chapterId || initialData.chapter_id || '',
        description: initialData.description || ''
      });
      setIsEditing(false); // Reset to view mode when opening
    } else {
      setForm(defaultForm);
      setIsEditing(false);
    }
  }, [open, initialData]);

  // Fetch current user and chapters when modal opens
  useEffect(() => {
    if (open) {
      if (!currentUser) {
        dispatch(fetchCurrentUser());
      }
      fetchChapters();
    }
  }, [open, currentUser, dispatch]);

  // Fetch all chapters with pagination
  const fetchChapters = async () => {
    try {
      setChaptersLoading(true);
      let allChapters = [];
      let page = 1;
      let pageSize = 100;
      let totalPages = 1;
      do {
        const response = await getChaptersAPI({ page, pageSize });
        const chapters = response?.data || response || [];
        if (Array.isArray(chapters)) {
          allChapters = allChapters.concat(chapters);
          totalPages = response?.totalPages || 1;
        } else {
          break;
        }
        page++;
      } while (page <= totalPages);
      setChapters(allChapters);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách chương');
      setChapters([]);
    } finally {
      setChaptersLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    if (form.name.trim() && form.chapterId && form.description.trim() && currentUser && initialData && isEditing) {
      const updateData = {
        ...form,
        chapterId: parseInt(form.chapterId),
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

  // Get chapter name for display in view mode
  const getChapterName = () => {
    if (!form.chapterId || !chapters.length) return 'Không có thông tin';
    const chapter = chapters.find(ch => 
      (ch.chapterId || ch.chapter_id) == form.chapterId
    );
    return chapter ? chapter.name : 'Không tìm thấy chương';
  };

  if (!open) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-content edit-modal">
        <div className="edit-modal-title">
          {isEditing ? 'Chỉnh sửa chủ đề' : 'Xem thông tin chủ đề'}
        </div>
        <button className="close-btn" onClick={handleClose} aria-label="Đóng">
          <i className="fas fa-times"></i>
        </button>
        
        <form className="edit-modal-form" onSubmit={handleSubmit} id="editForm">
            <div className="form-group full-width">
              <label>Tên chủ đề</label>
              <textarea
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập tên chủ đề"
                rows="2"
                disabled={!isEditing}
                required
                style={{
                  backgroundColor: !isEditing ? '#f5f5f5' : 'white',
                  color: !isEditing ? '#666' : 'black'
                }}
              />
            </div>
            <div className="form-group full-width">
              <label>Chương</label>
              {isEditing ? (
                <>
                  <select 
                    name="chapterId" 
                    value={form.chapterId} 
                    onChange={handleChange}
                    required
                    disabled={chaptersLoading}
                  >
                    <option value="">
                      {chaptersLoading ? 'Đang tải chương...' : 'Chọn chương'}
                    </option>
                    {chapters.map(chapter => (
                      <option 
                        key={chapter.chapterId || chapter.chapter_id} 
                        value={chapter.chapterId || chapter.chapter_id}
                      >
                        {chapter.name}
                      </option>
                    ))}
                  </select>
                  {chaptersLoading && (
                    <div className="loading-indicator">
                      <i className="fas fa-spinner fa-spin"></i> Đang tải danh sách chương...
                    </div>
                  )}
                </>
              ) : (
                <textarea
                  value={getChapterName()}
                  disabled
                  rows="1"
                  style={{ backgroundColor: '#f5f5f5', color: '#666' }}
                />
              )}
            </div>
            <div className="form-group full-width">
              <label>Mô tả</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Nhập mô tả chủ đề"
                rows="4"
                disabled={!isEditing}
                required
                style={{
                  backgroundColor: !isEditing ? '#f5f5f5' : 'white',
                  color: !isEditing ? '#666' : 'black'
                }}
              />
            </div>
            
            {/* Thông tin người tạo và ngày tạo - chỉ hiện trong view mode */}
            {!isEditing && initialData && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Người tạo</label>
                    <input
                      type="text"
                      value={initialData.createdName || initialData.CreatedBy || 'Không có thông tin'}
                      disabled
                      style={{ backgroundColor: '#f5f5f5', color: '#666' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Ngày tạo</label>
                    <input
                      type="text"
                      value={initialData.createdDate || initialData.CreatedDate ? 
                        new Date(initialData.createdDate || initialData.CreatedDate).toLocaleDateString('vi-VN') : 
                        'Không có thông tin'}
                      disabled
                      style={{ backgroundColor: '#f5f5f5', color: '#666' }}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Người sửa cuối</label>
                    <input
                      type="text"
                      value={initialData.modifiedName || initialData.ModifiedBy || 'Không có thông tin'}
                      disabled
                      style={{ backgroundColor: '#f5f5f5', color: '#666' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Ngày sửa cuối</label>
                    <input
                      type="text"
                      value={initialData.modifiedDate || initialData.ModifiedDate ? 
                        new Date(initialData.modifiedDate || initialData.ModifiedDate).toLocaleDateString('vi-VN') : 
                        'Không có thông tin'}
                      disabled
                      style={{ backgroundColor: '#f5f5f5', color: '#666' }}
                    />
                  </div>
                </div>
              </>
            )}
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
                      chapterId: initialData.chapterId || initialData.chapter_id || '',
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
                disabled={loading || !form.name.trim() || !form.chapterId || !form.description.trim() || chaptersLoading}
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

export default EditModalTopic;
