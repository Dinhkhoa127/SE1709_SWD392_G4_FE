import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { getChaptersAPI, getSubjectsAPI, getChaptersBySubjectAPI } from '../redux/services/apiService';
import '../styles/CreateModal.css';

const CreateModalTopic = ({ open, onClose, onSubmit, loading }) => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    
    const [form, setForm] = useState({
        name: '',
        subjectId: '',
        chapterId: '',
        description: ''
    });

    const [subjects, setSubjects] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [loadingStates, setLoadingStates] = useState({
        subjects: false,
        chapters: false
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

    const fetchSubjects = async () => {
        try {
            setLoadingStates(prev => ({ ...prev, subjects: true }));
            const response = await getSubjectsAPI();
            setSubjects(response.data || response || []);
        } catch (error) {
            toast.error('Không thể tải danh sách môn học!');
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
            toast.error('Không thể tải danh sách chương!');
            setChapters([]);
        } finally {
            setLoadingStates(prev => ({ ...prev, chapters: false }));
        }
    };

    const fetchChapters = async () => {
        try {
            setLoadingStates(prev => ({ ...prev, chapters: true }));
            const response = await getChaptersAPI();
            setChapters(response.data || response || []);
        } catch (error) {
            toast.error('Không thể tải danh sách chương!');
            setChapters([]);
        } finally {
            setLoadingStates(prev => ({ ...prev, chapters: false }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Handle cascade dropdown for chapters when subject changes
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

        if (!form.subjectId) {
            toast.error('Vui lòng chọn môn học!');
            return;
        }

        if (!form.chapterId) {
            toast.error('Vui lòng chọn chương!');
            return;
        }

        const topicData = {
            name: form.name,
            chapterId: parseInt(form.chapterId),
            description: form.description,
            createdBy: userId
        };

        onSubmit(topicData);
        
        setForm({
            name: '',
            subjectId: '',
            chapterId: '',
            description: ''
        });
    };

    const handleClose = () => {
        setForm({
            name: '',
            subjectId: '',
            chapterId: '',
            description: ''
        });
        setSubjects([]);
        setChapters([]);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="create-modal-overlay">
            <div className="create-modal-content create-modal">
                <div className="create-modal-title">Tạo chủ đề mới</div>
                <button className="close-btn" onClick={handleClose} aria-label="Đóng">
                    <i className="fas fa-times"></i>
                </button>
                <form className="create-modal-form" onSubmit={handleSubmit}>
                    <div className="form-group full-width">
                        <label>Tên chủ đề *</label>
                        <textarea 
                            name="name" 
                            value={form.name} 
                            onChange={handleChange}
                            placeholder="Nhập tên chủ đề"
                            rows="2"
                            required
                        />
                    </div>
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
                    </div>
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
                    </div>
                    <div className="form-group full-width">
                        <label>Mô tả *</label>
                        <textarea 
                            name="description" 
                            value={form.description} 
                            onChange={handleChange}
                            placeholder="Nhập mô tả chủ đề"
                            rows="4"
                            required
                        />
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
                            disabled={loading || !form.name.trim() || !form.subjectId || !form.chapterId || !form.description.trim() || Object.values(loadingStates).some(loading => loading)}
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

export default CreateModalTopic;
