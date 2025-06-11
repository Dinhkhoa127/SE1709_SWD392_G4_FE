import React, { useState } from 'react';
import '../styles/CreateModal.css';

const CreateModal = ({ open, onClose }) => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        CreatedDate: '',
        CreatedBy: '',
        ModifiedBy: '',
        ModifiedDate: '',
        status: 'active'
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    if (!open) return null;

    return (
        <div className="create-modal-overlay">
            <div className="create-modal-content create-modal">
                <div className="create-modal-title">Tạo môn học mới</div>
                <button className="close-btn" onClick={onClose} aria-label="Đóng">
                    <i className="fas fa-times"></i>
                </button>
                <form className="create-modal-form">
                    <div className="form-group">
                        <label>Tên môn học</label>
                        <input name="name" value={form.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Ngày tạo</label>
                        <input type="date" name="CreatedDate" value={form.CreatedDate} onChange={handleChange} />
                    </div>
                    <div className="form-group full-width">
                        <label>Mô tả</label>
                        <textarea name="description" value={form.description} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Người tạo</label>
                        <input name="CreatedBy" value={form.CreatedBy} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Người sửa cuối</label>
                        <input name="ModifiedBy" value={form.ModifiedBy} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Ngày sửa cuối</label>
                        <input type="date" name="ModifiedDate" value={form.ModifiedDate} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Trạng thái</label>
                        <select name="status" value={form.status} onChange={handleChange}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </form>
                <div className="action-buttons">
                    <button className="btn btn-primary">Tạo mới</button>
                </div>
            </div>
        </div>
    );
};

export default CreateModal;