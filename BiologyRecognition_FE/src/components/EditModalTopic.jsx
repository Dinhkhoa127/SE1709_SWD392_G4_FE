import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { getChaptersAPI, getSubjectsAPI, getChaptersBySubjectAPI, getTopicByIdAPI, getChapterByIdAPI } from '../redux/services/apiService';
import { formatDate } from '../utils/dateUtils';
import '../styles/EditModal.css';

const defaultForm = {
  name: '',
  subjectId: '',
  chapterId: '',
  description: ''
};

const EditModalTopic = ({ open, onClose, onSubmit, initialData, loading }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  
  const [form, setForm] = useState(defaultForm);
  const [isEditing, setIsEditing] = useState(false);
  
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    subjects: false,
    chapters: false
  });

  // Store resolved IDs from cascade lookup
  const [resolvedIds, setResolvedIds] = useState({
    subjectId: null
  });

  // Load initial data when modal opens or initialData changes
  useEffect(() => {
    if (open && initialData) {
      setForm({
        name: initialData.name || '',
        subjectId: initialData.subjectId || '',
        chapterId: initialData.chapterId || initialData.chapter_id || '',
        description: initialData.description || ''
      });
      setIsEditing(false); // Reset to view mode when opening
    } else {
      setForm(defaultForm);
      setIsEditing(false);
    }
  }, [open, initialData]);

  // Fetch current user and subjects when modal opens
  useEffect(() => {
    if (open) {
      if (!currentUser) {
        dispatch(fetchCurrentUser());
      }
      fetchSubjects();
    }
  }, [open, currentUser, dispatch]);

  // Load cascade data when initialData is available
  useEffect(() => {
    if (open && initialData) {
      loadCascadeData();
    }
  }, [open, initialData]);

  // Load cascade dropdown data based on initialData
  const loadCascadeData = async () => {
    try {
      let effectiveSubjectId = initialData.subjectId;
      
      // If we don't have subjectId but have chapterId, try to get it
      if (!effectiveSubjectId && initialData.chapterId) {
        const chapterInfo = await getChapterInfoById(initialData.chapterId);
        if (chapterInfo && chapterInfo.subjectId) {
          effectiveSubjectId = chapterInfo.subjectId;
          setResolvedIds({
            subjectId: effectiveSubjectId
          });
        }
      }
      
      // Load cascade data based on effective IDs
      if (effectiveSubjectId) {
        await fetchChaptersBySubject(effectiveSubjectId);
      }
    } catch (error) {
      console.error('Error loading cascade data:', error);
    }
  };

  // Get chapter info including subjectId
  const getChapterInfoById = async (chapterId) => {
    try {
      const response = await getChapterByIdAPI(chapterId);
      const chapterData = response.data || response;
      
      if (chapterData && chapterData.subjectId) {
        return {
          subjectId: chapterData.subjectId
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting chapter info:', error);
      return null;
    }
  };

  const fetchSubjects = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, subjects: true }));
      const response = await getSubjectsAPI();
      setSubjects(response.data || response || []);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách môn học');
      setSubjects([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, subjects: false }));
    }
  };

  const fetchChaptersBySubject = async (subjectId) => {
    try {
      setLoadingStates(prev => ({ ...prev, chapters: true }));
      const response = await getChaptersBySubjectAPI(subjectId);
      setChapters(response.data || response || []);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách chương');
      setChapters([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, chapters: false }));
    }
  };

  const fetchChapters = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, chapters: true }));
      const response = await getChaptersAPI();
      setChapters(response || []);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách chương');
      setChapters([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, chapters: false }));
    }
  };

  // Load cascade data for edit mode
  const loadCascadeDataForEdit = async (subjectId) => {
    try {
      // Load chapters if we have subjectId
      if (subjectId) {
        await fetchChaptersBySubject(subjectId);
      }
    } catch (error) {
      console.error('Error loading cascade data for edit mode:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Handle cascade dropdowns - only fetch if we're in editing mode
    if (isEditing) {
      if (name === 'subjectId') {
        if (value) {
          // Load chapters for selected subject
          fetchChaptersBySubject(value);
        } else {
          // Clear chapters if no subject selected
          setChapters([]);
        }
        // Reset chapter selection when subject changes
        setForm(prev => ({ ...prev, chapterId: '' }));
      }
    }
  };

  const handleEdit = () => {
    // Update form with resolved IDs when entering edit mode
    const effectiveSubjectId = form.subjectId || initialData?.subjectId || resolvedIds.subjectId;
    
    // Update form with effective IDs for proper cascade behavior
    setForm(prev => ({
      ...prev,
      subjectId: effectiveSubjectId || ''
    }));
    
    setIsEditing(true);
    
    // Load cascade data for edit mode
    loadCascadeDataForEdit(effectiveSubjectId);
  };

  const handleSubmit = () => {
    if (form.name.trim() && form.subjectId && form.chapterId && form.description.trim() && currentUser && initialData && isEditing) {
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
    setSubjects([]);
    setChapters([]);
    setResolvedIds({
      subjectId: null
    });
    onClose();
  };

  // Get display names for view mode
  const getSubjectName = () => {
    // First try to get from initialData
    if (initialData && initialData.subjectName) {
      return initialData.subjectName;
    }
    
    // Try to get subjectId from form, initialData, or resolved IDs
    const subjectId = form.subjectId || initialData?.subjectId || resolvedIds.subjectId;
    
    if (!subjectId) {
      return 'Không có thông tin';
    }
    
    // Fallback to dropdown data
    const subject = subjects.find(s => 
      (s.subjectId || s.subject_id) == subjectId
    );
    return subject ? subject.name : 'Không có thông tin';
  };

  // Get chapter name for display in view mode
  const getChapterName = () => {
    // First try to get from initialData
    if (initialData && initialData.chapterName) {
      return initialData.chapterName;
    }
    
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
              <label>Môn học</label>
              {isEditing ? (
                <>
                  <select 
                    name="subjectId" 
                    value={form.subjectId} 
                    onChange={handleChange}
                    required
                    disabled={loadingStates.subjects}
                  >
                    <option value="">
                      {loadingStates.subjects ? 'Đang tải môn học...' : 'Chọn môn học'}
                    </option>
                    {subjects.map(subject => (
                      <option 
                        key={subject.subjectId || subject.subject_id} 
                        value={subject.subjectId || subject.subject_id}
                      >
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  {loadingStates.subjects && (
                    <div className="loading-indicator">
                      <i className="fas fa-spinner fa-spin"></i> Đang tải danh sách môn học...
                    </div>
                  )}
                </>
              ) : (
                <textarea
                  value={getSubjectName()}
                  disabled
                  rows="1"
                  style={{ backgroundColor: '#f5f5f5', color: '#666' }}
                />
              )}
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
                    disabled={loadingStates.chapters || !form.subjectId}
                  >
                    <option value="">
                      {loadingStates.chapters ? 'Đang tải chương...' : 
                       !form.subjectId ? 'Vui lòng chọn môn học trước' : 'Chọn chương'}
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
                  {loadingStates.chapters && (
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
                      name: initialData.name || '',
                      subjectId: initialData.subjectId || '',
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
                disabled={loading || !form.name.trim() || !form.subjectId || !form.chapterId || !form.description.trim() || Object.values(loadingStates).some(loading => loading)}
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
