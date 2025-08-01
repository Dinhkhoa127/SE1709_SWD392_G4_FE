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
import '../styles/CreateModal.css';

const CreateModalArtifact = ({ open, onClose, onSubmit, loading }) => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    
    const [form, setForm] = useState({
        artifactName: '',
        artifactCode: '',
        description: '',
        scientificName: '',
        subjectId: '',
        chapterId: '',
        topicId: '',
        artifactTypeId: ''
    });

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

    // Fetch current user and subjects when modal opens
    useEffect(() => {
        if (open) {
            if (!currentUser) {
                dispatch(fetchCurrentUser());
            }
            fetchSubjects();
        }
    }, [open, currentUser, dispatch]);

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            setForm({
                artifactName: '',
                artifactCode: '',
                description: '',
                scientificName: '',
                subjectId: '',
                chapterId: '',
                topicId: '',
                artifactTypeId: ''
            });
            setDropdownData({
                subjects: [],
                chapters: [],
                topics: [],
                artifactTypes: []
            });
        }
    }, [open]);

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
            toast.error('Không thể tải danh sách môn học!');
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
                chapters: allChapters,
                topics: [], // Reset topics when subject changes
                artifactTypes: [] // Reset artifact types when subject changes
            }));
            // Reset form fields when subject changes
            setForm(prev => ({
                ...prev,
                chapterId: '',
                topicId: '',
                artifactTypeId: ''
            }));
        } catch (error) {
            toast.error('Không thể tải danh sách chương!');
            setDropdownData(prev => ({ 
                ...prev, 
                chapters: [], 
                topics: [], 
                artifactTypes: [] 
            }));
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
                topics: allTopics,
                artifactTypes: [] // Reset artifact types when chapter changes
            }));
            // Reset form fields when chapter changes
            setForm(prev => ({
                ...prev,
                topicId: '',
                artifactTypeId: ''
            }));
        } catch (error) {
            toast.error('Không thể tải danh sách chủ đề!');
            setDropdownData(prev => ({ 
                ...prev, 
                topics: [], 
                artifactTypes: [] 
            }));
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
            // Reset artifact type when topic changes
            setForm(prev => ({
                ...prev,
                artifactTypeId: ''
            }));
        } catch (error) {
            toast.error('Không thể tải danh sách loại mẫu vật!');
            setDropdownData(prev => ({ ...prev, artifactTypes: [] }));
        } finally {
            setLoadingStates(prev => ({ ...prev, artifactTypes: false }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Handle cascade dropdowns
        if (name === 'subjectId' && value) {
            fetchChaptersBySubject(value);
        } else if (name === 'chapterId' && value) {
            fetchTopicsByChapter(value);
        } else if (name === 'topicId' && value) {
            fetchArtifactTypesByTopic(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            toast.error('Không thể lấy thông tin người dùng hiện tại!');
            return;
        }

        const userId = currentUser.userAccountId || currentUser.id || currentUser.userId || currentUser.user_id;
        
        if (!userId) {
            toast.error('Không thể lấy ID người dùng hiện tại!');
            return;
        }

        // Validate required fields
        if (!form.artifactTypeId) {
            toast.error('Vui lòng chọn loại mẫu vật!');
            return;
        }

        const artifactData = {
            name: form.artifactName,  // Backend expects "name" not "artifactName"
            artifactCode: form.artifactCode,
            description: form.description,
            scientificName: form.scientificName,
            artifactTypeId: parseInt(form.artifactTypeId),
            createdBy: userId
        };

        console.log('🚀 Submitting artifact data:', artifactData);
        onSubmit(artifactData);
        
        // Reset form
        setForm({
            artifactName: '',
            artifactCode: '',
            description: '',
            scientificName: '',
            subjectId: '',
            chapterId: '',
            topicId: '',
            artifactTypeId: ''
        });
    };

    const handleClose = () => {
        setForm({
            artifactName: '',
            artifactCode: '',
            description: '',
            scientificName: '',
            subjectId: '',
            chapterId: '',
            topicId: '',
            artifactTypeId: ''
        });
        setDropdownData({
            subjects: [],
            chapters: [],
            topics: [],
            artifactTypes: []
        });
        onClose();
    };

    if (!open) return null;

    return (
        <div className="create-modal-overlay">
            <div className="create-modal-content create-modal">
                <div className="create-modal-title">Tạo mẫu vật mới</div>
                <button className="close-btn" onClick={handleClose} aria-label="Đóng">
                    <i className="fas fa-times"></i>
                </button>
                <form className="create-modal-form" onSubmit={handleSubmit}>
                    {/* Artifact Name */}
                    <div className="form-group full-width">
                        <label>Tên mẫu vật *</label>
                        <input 
                            type="text"
                            name="artifactName" 
                            value={form.artifactName} 
                            onChange={handleChange}
                            placeholder="Nhập tên mẫu vật"
                            required
                        />
                    </div>

                    {/* Artifact Code */}
                    <div className="form-group full-width">
                        <label>Mã mẫu vật *</label>
                        <input 
                            type="text"
                            name="artifactCode" 
                            value={form.artifactCode} 
                            onChange={handleChange}
                            placeholder="Nhập mã mẫu vật"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group full-width">
                        <label>Mô tả *</label>
                        <textarea 
                            name="description" 
                            value={form.description} 
                            onChange={handleChange}
                            placeholder="Nhập mô tả mẫu vật"
                            rows="3"
                            required
                        />
                    </div>

                    {/* Scientific Name */}
                    <div className="form-group full-width">
                        <label>Tên khoa học *</label>
                        <input 
                            type="text"
                            name="scientificName" 
                            value={form.scientificName} 
                            onChange={handleChange}
                            placeholder="Nhập tên khoa học"
                            required
                        />
                    </div>

                    {/* Subject Dropdown */}
                    <div className="form-group full-width">
                        <label>Môn học *</label>
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
                    </div>

                    {/* Chapter Dropdown */}
                    <div className="form-group full-width">
                        <label>Chương *</label>
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
                    </div>

                    {/* Topic Dropdown */}
                    <div className="form-group full-width">
                        <label>Chủ đề *</label>
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
                    </div>

                    {/* Artifact Type Dropdown */}
                    <div className="form-group full-width">
                        <label>Loại mẫu vật *</label>
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
                    </div>

                    <div className="action-buttons">
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={
                                loading || 
                                !form.artifactName.trim() || 
                                !form.artifactCode.trim() ||
                                !form.description.trim() || 
                                !form.scientificName.trim() ||
                                !form.artifactTypeId ||
                                Object.values(loadingStates).some(loading => loading)
                            }
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Đang tạo...
                                </>
                            ) : (
                                'Tạo mới'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateModalArtifact;
