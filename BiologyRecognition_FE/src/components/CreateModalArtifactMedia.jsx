import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { fetchArtifactTypes } from '../redux/thunks/artifactTypeThunks';
import { uploadToCloudinary, uploadMediaToCloudinary } from '../services/cloudinaryService';
import '../styles/CreateModal.css';

const CreateModalArtifactMedia = ({ open, onClose, onSubmit, loading }) => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { artifactTypes, loading: artifactTypesLoading } = useSelector(state => state.artifactTypes);
    
    const [form, setForm] = useState({
        artifactId: '',
        type: 'IMAGE',
        url: '',
        description: '',
        fileName: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setUploading(true);
            setUploadProgress(0);
            
            // Auto-fill file name if empty
            if (!form.fileName) {
                const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
                setForm({ ...form, fileName: fileNameWithoutExt });
            }
            
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
                const customFileName = form.fileName || file.name.replace(/\.[^/.]+$/, "");
                
                if (file.type.startsWith('image/')) {
                    uploadResult = await uploadToCloudinary(file, customFileName);
                } else {
                    uploadResult = await uploadMediaToCloudinary(file, customFileName);
                }

                // Set the Cloudinary URL to form
                setForm({ ...form, url: uploadResult.url });
                toast.success('Tải file lên thành công!');
                
            } catch (error) {
                console.error('Upload error:', error);
                toast.error('Lỗi khi tải file lên Cloudinary. Vui lòng thử lại!');
                setSelectedFile(null);
                setPreviewUrl('');
            } finally {
                setUploading(false);
                setUploadProgress(0);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            toast.error('Không thể lấy thông tin người dùng hiện tại!');
            return;
        }

        if (!form.artifactId || !form.url || !form.fileName.trim()) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        const artifactMediaData = {
            artifactId: parseInt(form.artifactId),
            type: form.type,
            url: form.url, // Now contains Cloudinary URL
            description: form.description
        };

        onSubmit(artifactMediaData);
        
        setForm({
            artifactId: '',
            type: 'IMAGE',
            url: '',
            description: '',
            fileName: ''
        });
        setSelectedFile(null);
        setPreviewUrl('');
        setUploading(false);
        setUploadProgress(0);
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const handleClose = () => {
        setForm({
            artifactId: '',
            type: 'IMAGE',
            url: '',
            description: '',
            fileName: ''
        });
        setSelectedFile(null);
        setPreviewUrl('');
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
                        <label>Tên file *</label>
                        <input
                            type="text"
                            name="fileName"
                            value={form.fileName}
                            onChange={handleChange}
                            placeholder="Nhập tên file (không cần đuôi file)"
                            required
                        />
                        <small style={{ color: '#666', fontSize: '12px' }}>
                            Tên này sẽ được sử dụng khi lưu file lên Cloudinary
                        </small>
                    </div>
                    <div className="form-group full-width">
                        <label>Upload File *</label>
                        <div className="media-input-container">
                            {uploading && (
                                <div className="upload-progress">
                                    <div className="progress-text">
                                        <i className="fas fa-spinner fa-spin"></i> Đang tải lên Cloudinary...
                                    </div>
                                </div>
                            )}
                            
                            {!selectedFile && !uploading ? (
                                <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
                                    <div className="upload-placeholder">
                                        <i className="fas fa-cloud-upload-alt"></i>
                                        <p>Click để chọn file hoặc kéo thả file vào đây</p>
                                        <small>Hỗ trợ: Hình ảnh, Video, Audio, Document</small>
                                    </div>
                                </div>
                            ) : (
                                <div className="file-selected">
                                    <div className="file-info">
                                        <i className="fas fa-file"></i>
                                        <span>{selectedFile ? selectedFile.name : 'File đã tải lên'}</span>
                                        {!uploading && (
                                            <button
                                                type="button"
                                                className="remove-file-btn"
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setPreviewUrl('');
                                                    setUploading(false);
                                                    setUploadProgress(0);
                                                    setForm({ ...form, url: '', fileName: '' });
                                                }}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        )}
                                    </div>
                                    {previewUrl && (
                                        <div className="file-preview">
                                            <img src={previewUrl} alt="Preview" />
                                        </div>
                                    )}
                                    {form.url && !uploading && (
                                        <div className="cloudinary-url">
                                            <label>Cloudinary URL:</label>
                                            <input 
                                                type="text" 
                                                value={form.url} 
                                                readOnly 
                                                className="url-display"
                                                style={{
                                                    width: '100%',
                                                    padding: '8px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#f8f9fa',
                                                    fontSize: '12px',
                                                    marginTop: '8px'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                disabled={uploading}
                            />
                        </div>
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
                            disabled={loading || uploading || !form.artifactId || !form.url || !form.fileName.trim()}
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