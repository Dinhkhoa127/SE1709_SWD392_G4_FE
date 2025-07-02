import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchArtifactTypes } from '../redux/thunks/artifactTypeThunks';
import '../styles/EditModal.css';

const EditModalArtifactMedia = ({ open, onClose, onSubmit, loading, artifactMedia }) => {
    const dispatch = useDispatch();
    const { artifactTypes, loading: artifactTypesLoading } = useSelector(state => state.artifactTypes);
    
    const [form, setForm] = useState({
        artifactMediaId: '',
        artifactId: '',
        type: 'IMAGE',
        url: '',
        description: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (open) {
            dispatch(fetchArtifactTypes());
            if (artifactMedia) {
                setForm({
                    artifactMediaId: artifactMedia.artifactMediaId || '',
                    artifactId: artifactMedia.artifactId || '',
                    type: artifactMedia.type || 'IMAGE',
                    url: artifactMedia.url || '',
                    description: artifactMedia.description || ''
                });
                setIsEditing(false); // Reset to view mode when opening
            }
        }
    }, [open, artifactMedia, dispatch]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSubmit = () => {
        if (form.artifactId && form.url.trim() && isEditing) {
            const artifactMediaData = {
                artifactMediaId: form.artifactMediaId,
                artifactId: parseInt(form.artifactId),
                type: form.type,
                url: form.url,
                description: form.description
            };

            onSubmit(artifactMediaData);
        }
    };

    const handleClose = () => {
        setForm({
            artifactMediaId: '',
            artifactId: '',
            type: 'IMAGE',
            url: '',
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
                    {isEditing ? 'Chỉnh sửa media mẫu vật' : 'Xem thông tin media mẫu vật'}
                </div>
                <button className="close-btn" onClick={handleClose} aria-label="Đóng">
                    <i className="fas fa-times"></i>
                </button>
                <form className="edit-modal-form" onSubmit={handleSubmit} id="editForm">
                    <div className="form-group full-width">
                        <label>Mẫu vật</label>
                        <select
                            name="artifactId"
                            value={form.artifactId}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        >
                            <option value="">-- Chọn mẫu vật --</option>
                            {artifactTypesLoading ? (
                                <option value="">Đang tải...</option>
                            ) : (
                                artifactTypes && artifactTypes.map(artifactType => (
                                    <option key={artifactType.artifactTypeId} value={artifactType.artifactTypeId}>
                                        {artifactType.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label>Loại media</label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        >
                            <option value="IMAGE">IMAGE</option>
                            <option value="VIDEO">VIDEO</option>
                            <option value="AUDIO">AUDIO</option>
                            <option value="DOCUMENT">DOCUMENT</option>
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label>URL</label>
                        <textarea
                            name="url"
                            value={form.url}
                            onChange={handleChange}
                            placeholder="Nhập URL media"
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
                                    if (artifactMedia) {
                                        setForm({
                                            artifactMediaId: artifactMedia.artifactMediaId || '',
                                            artifactId: artifactMedia.artifactId || '',
                                            type: artifactMedia.type || 'IMAGE',
                                            url: artifactMedia.url || '',
                                            description: artifactMedia.description || ''
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
                                disabled={loading || !form.artifactId || !form.url.trim()}
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

export default EditModalArtifactMedia;