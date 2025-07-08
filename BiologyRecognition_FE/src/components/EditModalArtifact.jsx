import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { 
    getSubjectsAPI, 
    getChaptersBySubjectAPI, 
    getTopicsByChapterAPI, 
    getArtifactTypesByTopicAPI,
    getTopicByIdAPI,
    getChapterByIdAPI
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

  // Store resolved IDs from cascade lookup
  const [resolvedIds, setResolvedIds] = useState({
    subjectId: null,
    chapterId: null
  });

  // Load initial data when modal opens or initialData changes
  useEffect(() => {
    if (open && initialData) {
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
      
      // Load basic subjects data
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
      let effectiveChapterId = initialData.chapterId;
      
      // If we don't have subjectId/chapterId but have topicId, try to get them
      if (!effectiveSubjectId || !effectiveChapterId) {
        if (initialData.topicId) {
          const topicInfo = await getTopicInfoById(initialData.topicId);
          if (topicInfo) {
            effectiveSubjectId = effectiveSubjectId || topicInfo.subjectId;
            effectiveChapterId = effectiveChapterId || topicInfo.chapterId;
            
            // Save resolved IDs for display
            setResolvedIds({
              subjectId: effectiveSubjectId,
              chapterId: effectiveChapterId
            });
          }
        }
      }
      
      // Load cascade data based on effective IDs
      if (effectiveSubjectId) {
        await fetchChaptersBySubject(effectiveSubjectId);
        
        if (effectiveChapterId) {
          await fetchTopicsByChapter(effectiveChapterId);
          
          if (initialData.topicId) {
            await fetchArtifactTypesByTopic(initialData.topicId);
          }
        }
      }
    } catch (error) {
      console.error('Error loading cascade data:', error);
    }
  };

  // Load basic subjects data
  const loadInitialData = async () => {
    try {
      await fetchSubjects();
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, subjects: true }));
      const response = await getSubjectsAPI();
      setDropdownData(prev => ({
        ...prev,
        subjects: response.data || response || []
      }));
    } catch (error) {
      toast.error('Lỗi khi tải danh sách môn học');
      setDropdownData(prev => ({ ...prev, subjects: [] }));
    } finally {
      setLoadingStates(prev => ({ ...prev, subjects: false }));
    }
  };

  const fetchChaptersBySubject = async (subjectId) => {
    try {
      setLoadingStates(prev => ({ ...prev, chapters: true }));
      const response = await getChaptersBySubjectAPI(subjectId);
      setDropdownData(prev => ({
        ...prev,
        chapters: response.data || response || []
      }));
    } catch (error) {
      toast.error('Lỗi khi tải danh sách chương');
      setDropdownData(prev => ({ ...prev, chapters: [] }));
    } finally {
      setLoadingStates(prev => ({ ...prev, chapters: false }));
    }
  };

  const fetchTopicsByChapter = async (chapterId) => {
    try {
      setLoadingStates(prev => ({ ...prev, topics: true }));
      const response = await getTopicsByChapterAPI(chapterId);
      setDropdownData(prev => ({
        ...prev,
        topics: response.data || response || []
      }));
    } catch (error) {
      toast.error('Lỗi khi tải danh sách chủ đề');
      setDropdownData(prev => ({ ...prev, topics: [] }));
    } finally {
      setLoadingStates(prev => ({ ...prev, topics: false }));
    }
  };

  const fetchArtifactTypesByTopic = async (topicId) => {
    try {
      setLoadingStates(prev => ({ ...prev, artifactTypes: true }));
      const response = await getArtifactTypesByTopicAPI(topicId);
      setDropdownData(prev => ({
        ...prev,
        artifactTypes: response.data || response || []
      }));
    } catch (error) {
      toast.error('Lỗi khi tải danh sách loại mẫu vật');
      setDropdownData(prev => ({ ...prev, artifactTypes: [] }));
    } finally {
      setLoadingStates(prev => ({ ...prev, artifactTypes: false }));
    }
  };

  // Get topic info including chapterId and subjectId
  const getTopicInfoById = async (topicId) => {
    try {
      const response = await getTopicByIdAPI(topicId);
      const topicData = response.data || response;
      
      if (topicData && topicData.chapterId) {
        // If we have chapterId, try to get subjectId from chapter info
        if (topicData.chapterId) {
          try {
            const chapterResponse = await getChapterByIdAPI(topicData.chapterId);
            const chapterData = chapterResponse.data || chapterResponse;
            
            if (chapterData && chapterData.subjectId) {
              return {
                chapterId: topicData.chapterId,
                subjectId: chapterData.subjectId
              };
            }
          } catch (error) {
            console.log('⚠️ Error getting chapter info:', error);
          }
        }
        
        return {
          chapterId: topicData.chapterId,
          subjectId: null
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting topic info:', error);
      return null;
    }
  };

  // Load cascade data for edit mode
  const loadCascadeDataForEdit = async (subjectId, chapterId, topicId) => {
    try {
      // Load chapters if we have subjectId
      if (subjectId) {
        await fetchChaptersBySubject(subjectId);
        
        // Load topics if we have chapterId
        if (chapterId) {
          await fetchTopicsByChapter(chapterId);
          
          // Load artifact types if we have topicId
          if (topicId) {
            await fetchArtifactTypesByTopic(topicId);
          }
        }
      }
    } catch (error) {
      console.error('Error loading cascade data for edit mode:', error);
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
      } else if (name === 'subjectId' && !value) {
        // If subject is cleared, reset everything
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
      } else if (name === 'chapterId' && !value) {
        // If chapter is cleared, reset topics and artifact types
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
      } else if (name === 'topicId' && !value) {
        // If topic is cleared, reset artifact types
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
    // Update form with resolved IDs when entering edit mode
    const effectiveSubjectId = form.subjectId || initialData?.subjectId || resolvedIds.subjectId;
    const effectiveChapterId = form.chapterId || initialData?.chapterId || resolvedIds.chapterId;
    
    // Update form with effective IDs for proper cascade behavior
    setForm(prev => ({
      ...prev,
      subjectId: effectiveSubjectId || '',
      chapterId: effectiveChapterId || ''
    }));
    
    setIsEditing(true);
    
    // Load cascade data for edit mode
    loadCascadeDataForEdit(effectiveSubjectId, effectiveChapterId, form.topicId);
  };

  const handleSubmit = () => {
    if (form.name.trim() && form.description.trim() && form.scientificName.trim() && form.artifactTypeId && currentUser && initialData && isEditing) {
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
    setResolvedIds({
      subjectId: null,
      chapterId: null
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
    const subject = dropdownData.subjects.find(s => 
      (s.subjectId || s.subject_id) == subjectId
    );
    return subject ? subject.name : 'Không có thông tin';
  };

  const getChapterName = () => {
    // First try to get from initialData
    if (initialData && initialData.chapterName) {
      return initialData.chapterName;
    }
    
    // Try to get chapterId from form, initialData, or resolved IDs
    const chapterId = form.chapterId || initialData?.chapterId || resolvedIds.chapterId;
    
    if (!chapterId) {
      return 'Không có thông tin';
    }
    
    // Fallback to dropdown data
    const chapter = dropdownData.chapters.find(ch => 
      (ch.chapterId || ch.chapter_id) == chapterId
    );
    return chapter ? chapter.name : 'Không có thông tin';
  };

  const getTopicName = () => {
    // First try to get from initialData
    if (initialData && initialData.topicName) {
      return initialData.topicName;
    }
    
    // Try to get topicId from form or initialData
    const topicId = form.topicId || initialData?.topicId;
    if (!topicId) {
      return 'Không có thông tin';
    }
    
    // Fallback to dropdown data
    const topic = dropdownData.topics.find(t => 
      (t.topicId || t.topic_id) == topicId
    );
    return topic ? topic.name : 'Không có thông tin';
  };

  const getArtifactTypeName = () => {
    // First try to get from initialData
    if (initialData && initialData.artifactTypeName) {
      return initialData.artifactTypeName;
    }
    
    // Try to get artifactTypeId from form or initialData
    const artifactTypeId = form.artifactTypeId || initialData?.artifactTypeId;
    if (!artifactTypeId) {
      return 'Không có thông tin';
    }
    
    // Fallback to dropdown data
    const artifactType = dropdownData.artifactTypes.find(at => 
      (at.artifactTypeId || at.artifact_type_id) == artifactTypeId
    );
    return artifactType ? artifactType.name : 'Không có thông tin';
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
