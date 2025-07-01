import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { fetchArtifactTypes } from '../redux/thunks/artifactTypeThunks';
import '../styles/CreateModal.css';

const CreateModalArtifactMedia = ({ open, onClose, onSubmit, loading }) => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { artifactTypes, loading: artifactTypesLoading } = useSelector(state => state.artifactTypes);
    
    const [form, setForm] = useState({
        artifactId: '',
        type: 'IMAGE',
        url: '',
        description: ''
    });

    // Fetch current user and artifact types when modal opens
    useEffect(() => {
        if (open) {
            // Chỉ fetch current user nếu chưa có trong Redux store
            if (!currentUser) {
                dispatch(fetchCurrentUser());
            }
            dispatch(fetchArtifactTypes());
        }
    }, [open, dispatch]); // Loại bỏ currentUser từ dependencies để tránh vòng lặp

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            toast.error('Không thể lấy thông tin người dùng hiện tại!');
            return;
        }

        if (!form.artifactId || !form.url) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        const artifactMediaData = {
            artifactId: parseInt(form.artifactId),
            type: form.type,
            url: form.url,
            description: form.description
        };

        onSubmit(artifactMediaData);
        
        setForm({
            artifactId: '',
            type: 'IMAGE',
            url: '',
            description: ''
        });
    };

    const handleClose = () => {
        setForm({
            artifactId: '',
            type: 'IMAGE',
            url: '',
            description: ''
        });
        onClose();
    };

    if (!open) return null;

    return (
        <div className="create-modal-overlay">
            <div className="create-modal-content create-modal">
                <div className="create-modal-title">Tạo media mẫu vật mới</div>
                <button className="close-btn" onClick={handleClose} aria-label="Đóng">
                    <i className="fas fa-times"></i>
                </button>
                <form className="create-modal-form" onSubmit={handleSubmit}>
                    <div className="form-group full-width">
                        <label>Mẫu vật *</label>
                        <select
                            name="artifactId"
                            value={form.artifactId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Chọn mẫu vật --</option>
                            {artifactTypesLoading ? (
                                <option value="">Đang tải...</option>
                            ) : artifactTypes && artifactTypes.length > 0 ? (
                                artifactTypes.map(artifactType => (
                                    <option key={artifactType.artifactTypeId} value={artifactType.artifactTypeId}>
                                        {artifactType.name}
                                    </option>
                                ))
                            ) : (
                                <option value="">Không có dữ liệu mẫu vật</option>
                            )}
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label>Loại media *</label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="IMAGE">IMAGE</option>
                            <option value="VIDEO">VIDEO</option>
                            <option value="AUDIO">AUDIO</option>
                            <option value="DOCUMENT">DOCUMENT</option>
                        </select>
                    </div>
                    <div className="form-group full-width">
                        <label>URL *</label>
                        <textarea
                            name="url"
                            value={form.url}
                            onChange={handleChange}
                            placeholder="Nhập URL media"
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
                            disabled={loading || !form.artifactId || !form.url.trim()}
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

export default CreateModalArtifactMedia;