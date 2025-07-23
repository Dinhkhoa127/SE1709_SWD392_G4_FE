import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { getChaptersAPI } from '../redux/services/apiService';
import '../styles/CreateModal.css';

const CreateModalTopic = ({ open, onClose, onSubmit, loading }) => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    
    const [form, setForm] = useState({
        name: '',
        chapterId: '',
        description: ''
    });

    const [chapters, setChapters] = useState([]);
    const [chaptersLoading, setChaptersLoading] = useState(false);

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
            toast.error('Không thể tải danh sách chương!');
            setChapters([]);
        } finally {
            setChaptersLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
            chapterId: '',
            description: ''
        });
    };

    const handleClose = () => {
        setForm({
            name: '',
            chapterId: '',
            description: ''
        });
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
                        <label>Chương *</label>
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
                            disabled={loading || !form.name.trim() || !form.chapterId || !form.description.trim() || chaptersLoading}
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
