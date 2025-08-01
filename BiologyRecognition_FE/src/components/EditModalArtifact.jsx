import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { 
    getSubjectsAPI, 
    getChaptersAPI, 
    getTopicsAPI, 
    getArtifactTypesAPI 
} from '../redux/services/apiService';
import '../styles/EditModal.css';

const defaultForm = {
  name: '',
  artifactCode: '',
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

  // Load initial data and fetch cascade data when modal opens
  useEffect(() => {
    if (open && initialData) {
      console.log('🔍 Loading Initial Data:', {
        initialData,
        subjectId: initialData.subjectId,
        chapterId: initialData.chapterId,
        topicId: initialData.topicId,
        artifactTypeId: initialData.artifactTypeId
      });
      
      setForm({
        name: initialData.artifactName || initialData.name || '',
        artifactCode: initialData.artifactCode || '',
        description: initialData.description || '',
        scientificName: initialData.scientificName || '',
        subjectId: initialData.subjectId || '',
        chapterId: initialData.chapterId || '',
        topicId: initialData.topicId || '',
        artifactTypeId: initialData.artifactTypeId || ''
      });
      setIsEditing(false); // Reset to view mode when opening
      
      // Load cascade data to display proper names
      loadCascadeData();
    } else {
      setForm(defaultForm);
      setIsEditing(false);
    }
  }, [open, initialData]);

  const loadCascadeData = async () => {
    try {
      // Always fetch subjects first
      await fetchSubjects();
      
      // If we have topicId, we need to trace back to get chapter and subject
      if (initialData.topicId) {
        // We need to find which chapter this topic belongs to
        // Since we don't have direct API, we'll need to check all subjects and their chapters
        const subjectsResponse = await getSubjectsAPI();
        const subjects = subjectsResponse.data || subjectsResponse || [];
        
        for (const subject of subjects) {
          try {
            const chaptersResponse = await getChaptersAPI({ subjectId: subject.subjectId || subject.subject_id });
            const chapters = chaptersResponse.data || chaptersResponse || [];
            
            for (const chapter of chapters) {
              const topicsResponse = await getTopicsAPI({ chapterId: chapter.chapterId || chapter.chapter_id });
              const topics = topicsResponse.data || topicsResponse || [];
              
              const foundTopic = topics.find(t => 
                String(t.topicId || t.topic_id) === String(initialData.topicId)
              );
              
              if (foundTopic) {
                // Found the topic! Update form with subject and chapter IDs
                setForm(prev => ({
                  ...prev,
                  subjectId: subject.subjectId || subject.subject_id,
                  chapterId: chapter.chapterId || chapter.chapter_id
                }));
                
                // Load the chapters and topics for display
                setDropdownData(prev => ({
                  ...prev,
                  chapters: chapters,
                  topics: topics
                }));
                
                // Also fetch artifact types for this topic
                await fetchArtifactTypesByTopic(initialData.topicId);
                return; // Stop searching once found
              }
            }
          } catch (error) {
            console.log('Error checking subject:', subject, error);
          }
        }
      }
    } catch (error) {
      console.error('Error loading cascade data:', error);
    }
  };

  // Fetch current user when modal opens
  useEffect(() => {
    if (open && !currentUser) {
      dispatch(fetchCurrentUser());
    }
  }, [open, currentUser, dispatch]);

  // Fetch all subjects with pagination
  const fetchSubjects = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, subjects: true }));
      let allSubjects = [];
      let page = 1;
      let pageSize = 100;
      let totalPages = 1;
      do {
        const response = await getSubjectsAPI({ page, pageSize });
        const subjects = response.data || response || [];
        if (Array.isArray(subjects)) {
          allSubjects = allSubjects.concat(subjects);
          totalPages = response.totalPages || 1;
        } else {
          break;
        }
        page++;
      } while (page <= totalPages);
      setDropdownData(prev => ({
        ...prev,
        subjects: allSubjects
      }));
    } catch (error) {
      toast.error('Lỗi khi tải danh sách môn học');
      setDropdownData(prev => ({ ...prev, subjects: [] }));
    } finally {
      setLoadingStates(prev => ({ ...prev, subjects: false }));
    }
  };

  // Fetch all chapters with pagination by subject
  const fetchChaptersBySubject = async (subjectId) => {
    try {
      setLoadingStates(prev => ({ ...prev, chapters: true }));
      let allChapters = [];
      let page = 1;
      let pageSize = 100;
      let totalPages = 1;
      do {
        const response = await getChaptersAPI({ subjectId, page, pageSize });
        const chapters = response.data || response || [];
        if (Array.isArray(chapters)) {
          allChapters = allChapters.concat(chapters);
          totalPages = response.totalPages || 1;
        } else {
          break;
        }
        page++;
      } while (page <= totalPages);
      setDropdownData(prev => ({
        ...prev,
        chapters: allChapters
      }));
    } catch (error) {
      toast.error('Lỗi khi tải danh sách chương');
      setDropdownData(prev => ({ ...prev, chapters: [] }));
    } finally {
      setLoadingStates(prev => ({ ...prev, chapters: false }));
    }
  };

  // Fetch all topics with pagination by chapter
  const fetchTopicsByChapter = async (chapterId) => {
    try {
      setLoadingStates(prev => ({ ...prev, topics: true }));
      let allTopics = [];
      let page = 1;
      let pageSize = 100;
      let totalPages = 1;
      do {
        const response = await getTopicsAPI({ chapterId, page, pageSize });
        const topics = response.data || response || [];
        if (Array.isArray(topics)) {
          allTopics = allTopics.concat(topics);
          totalPages = response.totalPages || 1;
        } else {
          break;
        }
        page++;
      } while (page <= totalPages);
      setDropdownData(prev => ({
        ...prev,
        topics: allTopics
      }));
    } catch (error) {
      toast.error('Lỗi khi tải danh sách chủ đề');
      setDropdownData(prev => ({ ...prev, topics: [] }));
    } finally {
      setLoadingStates(prev => ({ ...prev, topics: false }));
    }
  };

  // Fetch all artifact types with pagination by topic
  const fetchArtifactTypesByTopic = async (topicId) => {
    try {
      setLoadingStates(prev => ({ ...prev, artifactTypes: true }));
      let allArtifactTypes = [];
      let page = 1;
      let pageSize = 100;
      let totalPages = 1;
      do {
        const response = await getArtifactTypesAPI({ topicId, page, pageSize });
        const artifactTypes = response.data || response || [];
        if (Array.isArray(artifactTypes)) {
          allArtifactTypes = allArtifactTypes.concat(artifactTypes);
          totalPages = response.totalPages || 1;
        } else {
          break;
        }
        page++;
      } while (page <= totalPages);
      setDropdownData(prev => ({
        ...prev,
        artifactTypes: allArtifactTypes
      }));
    } catch (error) {
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
    if (form.name.trim() && form.artifactCode.trim() && form.description.trim() && form.scientificName.trim() && form.artifactTypeId && currentUser && initialData && isEditing) {
      const updateData = {
        ...form,
        artifactTypeId: parseInt(form.artifactTypeId),
        modifiedBy: currentUser.userAccountId || currentUser.id || currentUser.userId || currentUser.user_id,
      };
      

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
      String(s.subjectId || s.subject_id || s.id) === String(form.subjectId)
    );
    
    return subject ? subject.name : 'Không tìm thấy môn học';
  };

  const getChapterName = () => {
    if (!form.chapterId || !dropdownData.chapters.length) return 'Không có thông tin';
    
    const chapter = dropdownData.chapters.find(ch => 
      String(ch.chapterId || ch.chapter_id || ch.id) === String(form.chapterId)
    );
    
    return chapter ? chapter.name : 'Không tìm thấy chương';
  };

  const getTopicName = () => {
    // Use topicName directly from initialData if available
    if (initialData && initialData.topicName) {
      return initialData.topicName;
    }
    
    // Fallback to dropdown search
    if (!form.topicId || !dropdownData.topics.length) return 'Không có thông tin';
    const topic = dropdownData.topics.find(t => 
      String(t.topicId || t.topic_id || t.id) === String(form.topicId)
    );
    return topic ? topic.name : 'Không tìm thấy chủ đề';
  };

  const getArtifactTypeName = () => {
    // Use artifactTypeName directly from initialData if available
    if (initialData && initialData.artifactTypeName) {
      return initialData.artifactTypeName;
    }
    
    // Fallback to dropdown search
    if (!form.artifactTypeId || !dropdownData.artifactTypes.length) return 'Không có thông tin';
    const artifactType = dropdownData.artifactTypes.find(at => 
      String(at.artifactTypeId || at.artifact_type_id || at.id) === String(form.artifactTypeId)
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
            <label>Mã mẫu vật</label>
            <input
              type="text"
              name="artifactCode"
              value={form.artifactCode}
              onChange={handleChange}
              placeholder="Nhập mã mẫu vật"
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
                      artifactCode: initialData.artifactCode || '',
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
                  !form.artifactCode.trim() ||
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
