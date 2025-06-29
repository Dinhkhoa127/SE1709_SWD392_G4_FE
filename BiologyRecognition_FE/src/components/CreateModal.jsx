import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import '../styles/CreateModal.css';

<<<<<<< HEAD
const CreateModal = ({ open, onClose, onSubmit, loading, subjects = [], isChapter = false }) => {
=======
const CreateModal = ({ open, onClose, onSubmit, loading }) => {
>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    
    const [form, setForm] = useState({
        name: '',
<<<<<<< HEAD
        description: '',
        subjectId: ''
=======
        description: ''
>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730
    });

    // Fetch current user when modal opens
    useEffect(() => {
        if (open && !currentUser) {
            dispatch(fetchCurrentUser());
        }
    }, [open, currentUser, dispatch]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };    const handleSubmit = (e) => {
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

        const subjectData = {
            name: form.name,
            description: form.description,
            createdBy: userId
        };

        onSubmit(subjectData);
        
        setForm({
            name: '',
            description: ''
        });
    };

    const handleClose = () => {
        setForm({
            name: '',
            description: ''
        });
        onClose();
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

    return (        <div className="create-modal-overlay">
            <div className="create-modal-content create-modal">
<<<<<<< HEAD
                <div className="create-modal-title">{isChapter ? 'Tạo chương mới' : 'Tạo môn học mới'}</div>
=======
                <div className="create-modal-title">Tạo môn học mới</div>
>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730
                <button className="close-btn" onClick={handleClose} aria-label="Đóng">
                    <i className="fas fa-times"></i>
                </button>
                <form className="create-modal-form" onSubmit={handleSubmit}>
<<<<<<< HEAD
                    {isChapter && (
                        <div className="form-group full-width">
                            <label>Môn học *</label>
                            <select name="subjectId" value={form.subjectId} onChange={handleChange} required>
                                <option value="">-- Chọn môn học --</option>
                                {subjects.map(sub => (
                                    <option key={sub.subject_id || sub.subjectId} value={sub.subject_id || sub.subjectId}>{sub.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="form-group full-width">
                        <label>{isChapter ? 'Tên chương *' : 'Tên môn học *'}</label>
=======
                    <div className="form-group full-width">
                        <label>Tên môn học *</label>
>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730
                        <textarea 
                            name="name" 
                            value={form.name} 
                            onChange={handleChange}
<<<<<<< HEAD
                            placeholder={isChapter ? 'Nhập tên chương' : 'Nhập tên môn học'}
=======
                            placeholder="Nhập tên môn học"
>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730
                            rows="2"
                            required
                        />
                    </div>
                    <div className="form-group full-width">
<<<<<<< HEAD
                        <label>{isChapter ? 'Mô tả *' : 'Mô tả *'}</label>
=======
                        <label>Mô tả *</label>
>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730
                        <textarea 
                            name="description" 
                            value={form.description} 
                            onChange={handleChange}
<<<<<<< HEAD
                            placeholder={isChapter ? 'Nhập mô tả chương' : 'Nhập mô tả môn học'}
=======
                            placeholder="Nhập mô tả môn học"
>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730
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
<<<<<<< HEAD
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading || !form.name.trim() || !form.description.trim() || (isChapter && !form.subjectId)}
=======
                        </button>                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading || !form.name.trim() || !form.description.trim()}
>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730
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

export default CreateModal;