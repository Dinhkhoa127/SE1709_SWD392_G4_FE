import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchTopics } from '../redux/thunks/topicThunks';
import '../styles/EditModal.css';

const EditModalArtifactType = ({ open, onClose, onSubmit, loading, artifactType }) => {
    const dispatch = useDispatch();
    const { topics } = useSelector(state => state.topics);
    
    const [form, setForm] = useState({
        artifactTypeId: '',
        topicId: '',
        name: '',
        description: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (open) {
            dispatch(fetchTopics());
            if (artifactType) {
                setForm({
                    artifactTypeId: artifactType.artifactTypeId || '',
                    topicId: artifactType.topicId || '',
                    name: artifactType.name || '',
                    description: artifactType.description || ''
                });
                setIsEditing(false); // Reset to view mode when opening
            }
        }
    }, [open, artifactType, dispatch]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSubmit = () => {
        if (form.topicId && form.name.trim() && isEditing) {
            const artifactTypeData = {
                artifactTypeId: form.artifactTypeId,
                topicId: parseInt(form.topicId),
                name: form.name,
                description: form.description
            };

            onSubmit(artifactTypeData);
        }
    };

    const handleClose = () => {
        setForm({
            artifactTypeId: '',
            topicId: '',
            name: '',
            description: ''
        });
        setIsEditing(false);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal-content edit-modal">
                <div className="edit-modal-title">
                    {isEditing ? 'Chỉnh sửa loại mẫu vật' : 'Xem thông tin loại mẫu vật'}
                </div>
                <button className="close-btn" onClick={handleClose} aria-label="Đóng">
                    <i className="fas fa-times"></i>
                </button>
                <form className="edit-modal-form" onSubmit={handleSubmit} id="editForm">
                    <div className="form-group full-width">
                        <label>Chủ đề</label>
                        <select
                            name="topicId"
                            value={form.topicId}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        >
                            <option value="">-- Chọn chủ đề --</option>
                            {topics && topics.map(topic => (
                                <option key={topic.topicId} value={topic.topicId}>
                                    {topic.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label>Tên loại mẫu vật</label>
                        <textarea
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Nhập tên loại mẫu vật"
                            rows="2"
                            disabled={!isEditing}
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
                            disabled={!isEditing}
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
                                    if (artifactType) {
                                        setForm({
                                            artifactTypeId: artifactType.artifactTypeId || '',
                                            topicId: artifactType.topicId || '',
                                            name: artifactType.name || '',
                                            description: artifactType.description || ''
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
                                disabled={loading || !form.topicId || !form.name.trim()}
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

export default EditModalArtifactType;
