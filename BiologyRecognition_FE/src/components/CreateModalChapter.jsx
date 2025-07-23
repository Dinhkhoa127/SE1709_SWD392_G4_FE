import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { fetchSubjects } from '../redux/thunks/subjectThunks';
import '../styles/CreateModal.css';
const CreateModalChapter = ({ open, onClose, onSubmit, loading, subjects = [], isChapter = false }) => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { subjects: subjectsFromStore } = useSelector(state => state.subjects);
    
    // Use subjects from Redux store if available, otherwise use props
    const availableSubjects = subjectsFromStore && subjectsFromStore.length > 0 ? subjectsFromStore : subjects;
    
    const [form, setForm] = useState({
        name: '',
        description: '',
        subjectId: ''
    });

    // Fetch current user when modal opens
    useEffect(() => {
        if (open && !currentUser) {
            dispatch(fetchCurrentUser());
        }
    }, [open, currentUser, dispatch]);

    // Fetch all subjects with pagination when modal opens (nếu là chapter)
    useEffect(() => {
        if (open && isChapter) {
            const fetchAllSubjects = async () => {
                let page = 1;
                let pageSize = 100;
                let totalPages = 1;
                do {
                    const action = await dispatch(fetchSubjects({ page, pageSize }));
                    const data = action?.payload;
                    if (data && Array.isArray(data.subjects)) {
                        totalPages = data.totalPages || 1;
                    } else {
                        break;
                    }
                    page++;
                } while (page <= totalPages);
            };
            fetchAllSubjects();
        }
    }, [open, isChapter, dispatch]);

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

        let data;
        if (isChapter) {
            if (!form.subjectId) {
                toast.error('Vui lòng chọn môn học!');
                return;
            }
            data = {
                subjectId: Number(form.subjectId),
                name: form.name,
                description: form.description,
                createdBy: userId
            };
        } else {
            data = {
                name: form.name,
                description: form.description,
                createdBy: userId
            };
        }

        onSubmit(data);
        setForm({
            name: '',
            description: '',
            subjectId: ''
        });
    };

    const handleClose = () => {
        setForm({
            name: '',
            description: '',
            subjectId: ''
        });
        onClose();
    };

    if (!open) return null;

    return (
        <div className="create-modal-overlay">
            <div className="create-modal-content create-modal">
                <div className="create-modal-title">{isChapter ? 'Tạo chương mới' : 'Tạo môn học mới'}</div>
                <button className="close-btn" onClick={handleClose} aria-label="Đóng">
                    <i className="fas fa-times"></i>
                </button>
                <form className="create-modal-form" onSubmit={handleSubmit}>
                    {isChapter && (
                        <div className="form-group full-width">
                            <label>Môn học *</label>
                            <select name="subjectId" value={form.subjectId} onChange={handleChange} required>
                                <option value="">-- Chọn môn học --</option>
                                {availableSubjects.map(sub => (
                                    <option key={sub.subject_id || sub.subjectId} value={sub.subject_id || sub.subjectId}>{sub.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="form-group full-width">
                        <label>{isChapter ? 'Tên chương *' : 'Tên môn học *'}</label>
                        <textarea 
                            name="name" 
                            value={form.name} 
                            onChange={handleChange}
                            placeholder={isChapter ? 'Nhập tên chương' : 'Nhập tên môn học'}
                            rows="2"
                            required
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>{isChapter ? 'Mô tả *' : 'Mô tả *'}</label>
                        <textarea 
                            name="description" 
                            value={form.description} 
                            onChange={handleChange}
                            placeholder={isChapter ? 'Nhập mô tả chương' : 'Nhập mô tả môn học'}
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
                            disabled={loading || !form.name.trim() || !form.description.trim() || (isChapter && !form.subjectId)}
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

export default CreateModalChapter;