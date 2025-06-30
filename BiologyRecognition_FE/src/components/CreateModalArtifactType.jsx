import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { fetchTopics } from '../redux/thunks/topicThunks';
import '../styles/CreateModal.css';
const CreateModalArtifactType = ({ open, onClose, onSubmit, loading }) => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { topics } = useSelector(state => state.topics);
    
    const [form, setForm] = useState({
        topicId: '',
        name: '',
        description: ''
    });

    // Fetch current user and topics when modal opens
    useEffect(() => {
        if (open) {
            if (!currentUser) {
                dispatch(fetchCurrentUser());
            }
            dispatch(fetchTopics());
        }
    }, [open, currentUser, dispatch]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            toast.error('Không thể lấy thông tin người dùng hiện tại!');
            return;
        }

        if (!form.topicId || !form.name) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        const artifactTypeData = {
            topicId: parseInt(form.topicId),
            name: form.name,
            description: form.description
        };

        onSubmit(artifactTypeData);
        
        setForm({
            topicId: '',
            name: '',
            description: ''
        });
    };

    const handleClose = () => {
        setForm({
            topicId: '',
            name: '',
            description: ''
        });
        onClose();
    };

    if (!open) return null;

    return (
        <div className="create-modal-overlay">
            <div className="create-modal-content create-modal">
                <div className="create-modal-title">Tạo loại mẫu vật mới</div>
                <button className="close-btn" onClick={handleClose} aria-label="Đóng">
                    <i className="fas fa-times"></i>
                </button>
                <form className="create-modal-form" onSubmit={handleSubmit}>
                    <div className="form-group full-width">
                        <label>Chủ đề *</label>
                        <select
                            name="topicId"
                            value={form.topicId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Chọn chủ đề --</option>
                            {topics && topics.map(topic => (
                                <option key={topic.topicId} value={topic.topicId}>
                                    {topic.name || topic.topicName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label>Tên loại mẫu vật *</label>
                        <textarea
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Nhập tên loại mẫu vật"
                            rows="2"
                            required
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>Mô tả</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Nhập mô tả"
                            rows="4"
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
                            disabled={loading || !form.topicId || !form.name.trim()}
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

export default CreateModalArtifactType;
