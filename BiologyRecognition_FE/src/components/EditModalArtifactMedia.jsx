import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchArtifactTypes } from '../redux/thunks/artifactTypeThunks';
import { uploadToCloudinary, uploadMediaToCloudinary } from '../services/cloudinaryService';
import '../styles/EditModal.css';

const EditModalArtifactMedia = ({ open, onClose, onSubmit, loading, artifactMedia }) => {
    const dispatch = useDispatch();
    const { artifactTypes, loading: artifactTypesLoading } = useSelector(state => state.artifactTypes);
    
    const [form, setForm] = useState({
        artifactMediaId: '',
        artifactId: '',
        type: 'IMAGE',
        url: '',
        description: '',
        fileName: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        if (open) {
            dispatch(fetchArtifactTypes());
            if (artifactMedia) {
                setForm({
                    artifactMediaId: artifactMedia.artifactMediaId || '',
                    artifactId: artifactMedia.artifactId || '',
                    type: artifactMedia.type || 'IMAGE',
                    url: artifactMedia.url || '',
                    description: artifactMedia.description || '',
                    fileName: ''
                });
                setIsEditing(false); // Reset to view mode when opening
                setSelectedFile(null);
                setPreviewUrl('');
                setUploading(false);
                setUploadProgress(0);
            }
        }
    }, [open, artifactMedia, dispatch]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file name is required
            if (!form.fileName.trim()) {
                toast.error('Vui lòng nhập tên file trước khi upload!');
                e.target.value = '';
                return;
            }
            
            setSelectedFile(file);
            setUploading(true);
            setUploadProgress(0);
            
            try {
                // Create preview URL for images
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setPreviewUrl(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }

                // Upload to Cloudinary
                toast.info('Đang tải file lên Cloudinary...');
                
                let uploadResult;
                const customFileName = form.fileName.trim();
                
                if (file.type.startsWith('image/')) {
                    uploadResult = await uploadToCloudinary(file, customFileName);
                } else {
                    uploadResult = await uploadMediaToCloudinary(file, customFileName);
                }

                // Set the Cloudinary URL to form
                setForm({ ...form, url: uploadResult.url });
                toast.success('Tải file lên thành công!');
                
            } catch (error) {
                toast.error('Lỗi khi tải file lên Cloudinary. Vui lòng thử lại!');
                setSelectedFile(null);
                setPreviewUrl('');
            } finally {
                setUploading(false);
                setUploadProgress(0);
            }
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSubmit = () => {
        if (!form.artifactId || !form.url.trim()) {
            toast.error('Vui lòng chọn mẫu vật và có URL media!');
            return;
        }
        
        if (isEditing) {
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
            description: '',
            fileName: ''
        });
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewUrl('');
        setUploading(false);
        setUploadProgress(0);
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
                    {isEditing && (
                        <>
                            <div className="form-group full-width">
                                <label>Tên file <span className="required">*</span></label>
                                <input
                                    type="text"
                                    name="fileName"
                                    value={form.fileName}
                                    onChange={handleChange}
                                    placeholder="Nhập tên file (không bao gồm phần mở rộng)"
                                    required
                                />
                                <small className="form-text text-muted">
                                    Tên file sẽ được sử dụng khi upload lên Cloudinary
                                </small>
                            </div>
                            <div className="form-group full-width">
                                <label>Upload file mới</label>
                                <div className="upload-area">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        onChange={handleFileChange}
                                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                                        className="file-input"
                                        disabled={uploading}
                                    />
                                    <label htmlFor="file-upload" className="upload-label">
                                        {uploading ? (
                                            <div className="upload-progress">
                                                <i className="fas fa-spinner fa-spin"></i>
                                                <span>Đang tải lên...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <i className="fas fa-cloud-upload-alt"></i>
                                                <span>Chọn file để upload</span>
                                                <small>Hỗ trợ hình ảnh, video, audio, tài liệu</small>
                                            </>
                                        )}
                                    </label>
                                </div>
                                {selectedFile && (
                                    <div className="file-info">
                                        <span><i className="fas fa-file"></i> {selectedFile.name}</span>
                                        <button
                                            type="button"
                                            className="remove-file-btn"
                                            onClick={() => {
                                                setSelectedFile(null);
                                                setPreviewUrl('');
                                                // Reset file input
                                                const fileInput = document.getElementById('file-upload');
                                                if (fileInput) fileInput.value = '';
                                            }}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                )}
                                {previewUrl && (
                                    <div className="preview-container">
                                        <div className="new-file-preview">
                                            <span className="preview-label">Preview file mới:</span>
                                            <img src={previewUrl} alt="New file preview" className="preview-image" />
                                        </div>
                                    </div>
                                )}
                                {selectedFile && !previewUrl && (
                                    <div className="preview-container">
                                        <div className="file-type-preview">
                                            <i className="fas fa-file-alt"></i>
                                            <span>File đã chọn: {selectedFile.name}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    <div className="form-group full-width">
                        <label>Media hiện tại</label>
                        {form.url && (
                            <div className="current-media-preview">
                                {form.type === 'IMAGE' && (
                                    <div className="image-preview">
                                        <img 
                                            src={form.url} 
                                            alt="Current media" 
                                            className="current-media-image"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                        <div className="image-error" style={{ display: 'none' }}>
                                            <i className="fas fa-exclamation-triangle"></i>
                                            <span>Không thể tải ảnh</span>
                                        </div>
                                    </div>
                                )}
                                {form.type === 'VIDEO' && (
                                    <div className="video-preview">
                                        <video 
                                            src={form.url} 
                                            controls 
                                            className="current-media-video"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                        <div className="video-error" style={{ display: 'none' }}>
                                            <i className="fas fa-exclamation-triangle"></i>
                                            <span>Không thể tải video</span>
                                        </div>
                                    </div>
                                )}
                                {form.type === 'AUDIO' && (
                                    <div className="audio-preview">
                                        <audio 
                                            src={form.url} 
                                            controls 
                                            className="current-media-audio"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'block';
                                            }}
                                        />
                                        <div className="audio-error" style={{ display: 'none' }}>
                                            <i className="fas fa-exclamation-triangle"></i>
                                            <span>Không thể tải audio</span>
                                        </div>
                                    </div>
                                )}
                                {form.type === 'DOCUMENT' && (
                                    <div className="document-preview">
                                        <div className="document-icon">
                                            <i className="fas fa-file-alt"></i>
                                            <span>Tài liệu</span>
                                        </div>
                                    </div>
                                )}
                                <div className="media-actions">
                                    <a href={form.url} target="_blank" rel="noopener noreferrer" className="view-link">
                                        <i className="fas fa-external-link-alt"></i> Xem toàn màn hình
                                    </a>
                                </div>
                            </div>
                        )}
                        {isEditing && (
                            <textarea
                                name="url"
                                value={form.url}
                                onChange={handleChange}
                                placeholder="URL media"
                                rows="2"
                                required
                            />
                        )}
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
                                            description: artifactMedia.description || '',
                                            fileName: ''
                                        });
                                    }
                                    setIsEditing(false);
                                    setSelectedFile(null);
                                    setPreviewUrl('');
                                    setUploading(false);
                                    setUploadProgress(0);
                                }}
                                disabled={loading || uploading}
                            >
                                Hủy
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={loading || uploading || !form.artifactId || !form.url.trim()}
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