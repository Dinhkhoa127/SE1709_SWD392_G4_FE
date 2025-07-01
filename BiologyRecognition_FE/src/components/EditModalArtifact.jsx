import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { 
    getSubjectsAPI, 
    getChaptersBySubjectAPI, 
    getTopicsByChapterAPI, 
    getArtifactTypesByTopicAPI 
} from '../redux/services/apiService';
import '../styles/EditModal.css';

const defaultForm = {
  name: '',
  description: '',
  scientificName: '',
  subjectId: '',
  chapterId: '',
  topicId: '',
  artifactTypeId: ''
};

const EditModalArtifact = ({ open, onClose, onSubmit, initialData, loading }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  
  const [form, setForm] = useState(defaultForm);
  const [isEditing, setIsEditing] = useState(false);
  
  const [dropdownData, setDropdownData] = useState({
    subjects: [],
    chapters: [],
    topics: [],
    artifactTypes: []
  });

  const [loadingStates, setLoadingStates] = useState({
    subjects: false,
    chapters: false,
    topics: false,
    artifactTypes: false
  });

  // Load initial data when modal opens or initialData changes
  useEffect(() => {
    if (open && initialData) {
      console.log('🔍 EditModalArtifact - initialData:', initialData);
      setForm({
        name: initialData.artifactName || initialData.name || '',
        description: initialData.description || '',
        scientificName: initialData.scientificName || '',
        subjectId: initialData.subjectId || '',
        chapterId: initialData.chapterId || '',
        topicId: initialData.topicId || '',
        artifactTypeId: initialData.artifactTypeId || ''
      });
      setIsEditing(false); // Reset to view mode when opening
    } else {
      setForm(defaultForm);
      setIsEditing(false);
    }
  }, [open, initialData]);

  // Fetch current user and dropdowns when modal opens
  useEffect(() => {
    if (open) {
      if (!currentUser) {
        dispatch(fetchCurrentUser());
      }
      fetchSubjects();
    }
  }, [open, currentUser, dispatch]);

  // Auto-fetch cascading dropdowns when form has pre-selected values
  useEffect(() => {
    if (open && initialData && form.subjectId) {
      fetchChaptersBySubject(form.subjectId);
    }
  }, [open, initialData, form.subjectId]);

  useEffect(() => {
    if (open && initialData && form.chapterId && form.subjectId) {
      fetchTopicsByChapter(form.chapterId);
    }
  }, [open, initialData, form.chapterId]);

  useEffect(() => {
    if (open && initialData && form.topicId && form.chapterId) {
      fetchArtifactTypesByTopic(form.topicId);
    }
  }, [open, initialData, form.topicId]);

  const fetchSubjects = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, subjects: true }));
      console.log('🔍 Fetching subjects...');
      const response = await getSubjectsAPI();
      console.log('✅ Subjects response:', response);
      setDropdownData(prev => ({
        ...prev,
        subjects: response.data || response || []
      }));
    } catch (error) {
      console.error('❌ Error fetching subjects:', error);
      toast.error('Lỗi khi tải danh sách môn học');
      setDropdownData(prev => ({ ...prev, subjects: [] }));
    } finally {
      setLoadingStates(prev => ({ ...prev, subjects: false }));
    }
  };

  const fetchChaptersBySubject = async (subjectId) => {
    try {
      setLoadingStates(prev => ({ ...prev, chapters: true }));
      console.log('🔍 Fetching chapters for subjectId:', subjectId);
      const response = await getChaptersBySubjectAPI(subjectId);
      console.log('✅ Chapters response:', response);
      setDropdownData(prev => ({
        ...prev,
        chapters: response.data || response || []
      }));
    } catch (error) {
      console.error('❌ Error fetching chapters:', error);
      toast.error('Lỗi khi tải danh sách chương');
      setDropdownData(prev => ({ ...prev, chapters: [] }));
    } finally {
      setLoadingStates(prev => ({ ...prev, chapters: false }));
    }
  };

  const fetchTopicsByChapter = async (chapterId) => {
    try {
      setLoadingStates(prev => ({ ...prev, topics: true }));
      console.log('🔍 Fetching topics for chapterId:', chapterId);
      const response = await getTopicsByChapterAPI(chapterId);
      console.log('✅ Topics response:', response);
      setDropdownData(prev => ({
        ...prev,
        topics: response.data || response || []
      }));
    } catch (error) {
      console.error('❌ Error fetching topics:', error);
      toast.error('Lỗi khi tải danh sách chủ đề');
      setDropdownData(prev => ({ ...prev, topics: [] }));
    } finally {
      setLoadingStates(prev => ({ ...prev, topics: false }));
    }
  };

  const fetchArtifactTypesByTopic = async (topicId) => {
    try {
      setLoadingStates(prev => ({ ...prev, artifactTypes: true }));
      console.log('🔍 Fetching artifact types for topicId:', topicId);
      const response = await getArtifactTypesByTopicAPI(topicId);
      console.log('✅ Artifact types response:', response);
      setDropdownData(prev => ({
        ...prev,
        artifactTypes: response.data || response || []
      }));
    } catch (error) {
      console.error('❌ Error fetching artifact types:', error);
      toast.error('Lỗi khi tải danh sách loại mẫu vật');
      setDropdownData(prev => ({ ...prev, artifactTypes: [] }));
    } finally {
      setLoadingStates(prev => ({ ...prev, artifactTypes: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Handle cascade dropdowns - only fetch if we're in editing mode
    if (isEditing) {
      if (name === 'subjectId' && value) {
        fetchChaptersBySubject(value);
        // Reset dependent fields
        setForm(prev => ({
          ...prev,
          chapterId: '',
          topicId: '',
          artifactTypeId: ''
        }));
        setDropdownData(prev => ({
          ...prev,
          chapters: [],
          topics: [],
          artifactTypes: []
        }));
      } else if (name === 'chapterId' && value) {
        fetchTopicsByChapter(value);
        // Reset dependent fields
        setForm(prev => ({
          ...prev,
          topicId: '',
          artifactTypeId: ''
        }));
        setDropdownData(prev => ({
          ...prev,
          topics: [],
          artifactTypes: []
        }));
      } else if (name === 'topicId' && value) {
        fetchArtifactTypesByTopic(value);
        // Reset dependent field
        setForm(prev => ({
          ...prev,
          artifactTypeId: ''
        }));
        setDropdownData(prev => ({
          ...prev,
          artifactTypes: []
        }));
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    if (form.name.trim() && form.description.trim() && form.scientificName.trim() && form.artifactTypeId && currentUser && initialData && isEditing) {
      const updateData = {
        ...form,
        artifactTypeId: parseInt(form.artifactTypeId),
        modifiedBy: currentUser.userAccountId || currentUser.id || currentUser.userId || currentUser.user_id,
      };
      
      console.log('📤 Updating artifact with data:', updateData);
      onSubmit(updateData);
    }
  };

  const handleClose = () => {
    setForm(defaultForm);
    setIsEditing(false);
    setDropdownData({
      subjects: [],
      chapters: [],
      topics: [],
      artifactTypes: []
    });
    onClose();
  };

  // Get display names for view mode
  const getSubjectName = () => {
    if (!form.subjectId || !dropdownData.subjects.length) return 'Không có thông tin';
    const subject = dropdownData.subjects.find(s => 
      (s.subjectId || s.subject_id) == form.subjectId
    );
    return subject ? subject.name : 'Không tìm thấy môn học';
  };

  const getChapterName = () => {
    if (!form.chapterId || !dropdownData.chapters.length) return 'Không có thông tin';
    const chapter = dropdownData.chapters.find(ch => 
      (ch.chapterId || ch.chapter_id) == form.chapterId
    );
    return chapter ? chapter.name : 'Không tìm thấy chương';
  };

  const getTopicName = () => {
    if (!form.topicId || !dropdownData.topics.length) return 'Không có thông tin';
    const topic = dropdownData.topics.find(t => 
      (t.topicId || t.topic_id) == form.topicId
    );
    return topic ? topic.name : 'Không tìm thấy chủ đề';
  };

  const getArtifactTypeName = () => {
    if (!form.artifactTypeId || !dropdownData.artifactTypes.length) return 'Không có thông tin';
    const artifactType = dropdownData.artifactTypes.find(at => 
      (at.artifactTypeId || at.artifact_type_id) == form.artifactTypeId
    );
    return artifactType ? artifactType.name : 'Không tìm thấy loại mẫu vật';
  };

  if (!open) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-content edit-modal">
        <div className="edit-modal-title">
          {isEditing ? 'Chỉnh sửa mẫu vật' : 'Xem thông tin mẫu vật'}
        </div>
        <button className="close-btn" onClick={handleClose} aria-label="Đóng">
          <i className="fas fa-times"></i>
        </button>
        
        <form className="edit-modal-form" onSubmit={handleSubmit} id="editForm">
          <div className="form-group full-width">
            <label>Tên mẫu vật</label>
            <textarea
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập tên mẫu vật"
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
            <label>Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập mô tả mẫu vật"
              rows="4"
              disabled={!isEditing}
              required
              style={{
                backgroundColor: !isEditing ? '#f5f5f5' : 'white',
                color: !isEditing ? '#666' : 'black'
              }}
            />
          </div>

          <div className="form-group full-width">
            <label>Tên khoa học</label>
            <textarea
              name="scientificName"
              value={form.scientificName}
              onChange={handleChange}
              placeholder="Nhập tên khoa học"
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
                  {dropdownData.subjects.map(subject => (
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
                  {dropdownData.chapters.map(chapter => (
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
            <label>Chủ đề</label>
            {isEditing ? (
              <>
                <select 
                  name="topicId" 
                  value={form.topicId} 
                  onChange={handleChange}
                  required
                  disabled={loadingStates.topics || !form.chapterId}
                >
                  <option value="">
                    {loadingStates.topics ? 'Đang tải chủ đề...' : 
                     !form.chapterId ? 'Vui lòng chọn chương trước' : 'Chọn chủ đề'}
                  </option>
                  {dropdownData.topics.map(topic => (
                    <option 
                      key={topic.topicId || topic.topic_id} 
                      value={topic.topicId || topic.topic_id}
                    >
                      {topic.name}
                    </option>
                  ))}
                </select>
                {loadingStates.topics && (
                  <div className="loading-indicator">
                    <i className="fas fa-spinner fa-spin"></i> Đang tải danh sách chủ đề...
                  </div>
                )}
              </>
            ) : (
              <textarea
                value={getTopicName()}
                disabled
                rows="1"
                style={{ backgroundColor: '#f5f5f5', color: '#666' }}
              />
            )}
          </div>

          <div className="form-group full-width">
            <label>Loại mẫu vật</label>
            {isEditing ? (
              <>
                <select 
                  name="artifactTypeId" 
                  value={form.artifactTypeId} 
                  onChange={handleChange}
                  required
                  disabled={loadingStates.artifactTypes || !form.topicId}
                >
                  <option value="">
                    {loadingStates.artifactTypes ? 'Đang tải loại mẫu vật...' : 
                     !form.topicId ? 'Vui lòng chọn chủ đề trước' : 'Chọn loại mẫu vật'}
                  </option>
                  {dropdownData.artifactTypes.map(artifactType => (
                    <option 
                      key={artifactType.artifactTypeId || artifactType.artifact_type_id} 
                      value={artifactType.artifactTypeId || artifactType.artifact_type_id}
                    >
                      {artifactType.name}
                    </option>
                  ))}
                </select>
                {loadingStates.artifactTypes && (
                  <div className="loading-indicator">
                    <i className="fas fa-spinner fa-spin"></i> Đang tải danh sách loại mẫu vật...
                  </div>
                )}
              </>
            ) : (
              <textarea
                value={getArtifactTypeName()}
                disabled
                rows="1"
                style={{ backgroundColor: '#f5f5f5', color: '#666' }}
              />
            )}
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
                      name: initialData.artifactName || initialData.name || '',
                      description: initialData.description || '',
                      scientificName: initialData.scientificName || '',
                      subjectId: initialData.subjectId || '',
                      chapterId: initialData.chapterId || '',
                      topicId: initialData.topicId || '',
                      artifactTypeId: initialData.artifactTypeId || ''
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
                disabled={
                  loading || 
                  !form.name.trim() || 
                  !form.description.trim() || 
                  !form.scientificName.trim() || 
                  !form.artifactTypeId ||
                  Object.values(loadingStates).some(loading => loading)
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

export default EditModalArtifact;
