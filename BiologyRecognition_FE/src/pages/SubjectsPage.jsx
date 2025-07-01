import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';

import CreateModal from '../components/CreateModalSubject.jsx';
import EditModal from '../components/EditModalSubject.jsx';
import DeleteModal from '../components/DeleteModal.jsx';

import { fetchSubjects, fetchSubjectById, createSubject, updateSubject, deleteSubject } from '../redux/thunks/subjectThunks.jsx';
import { fetchCurrentUser } from '../redux/thunks/userThunks.jsx';

import '../styles/SubjectsPage.css';

const SubjectsPage = () => {
  const dispatch = useDispatch();
  const { subjects, selectedSubject: storeSelectedSubject, loading, error, createLoading, updateLoading, deleteLoading, fetchSubjectLoading } = useSelector(state => state.subjects);
  const { currentUser } = useSelector(state => state.user);
  
  // Lấy trạng thái collapsed từ localStorage, mặc định là false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('navbarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Fetch subjects and current user when component mount
  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Lưu trạng thái collapsed vào localStorage khi thay đổi
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('navbarCollapsed', JSON.stringify(newCollapsedState));
  };

  // Handlers
  const handleCreateSubject = (subjectData) => {
    dispatch(createSubject(subjectData))
      .then(() => {
        setShowCreate(false);
        toast.success('Tạo môn học thành công!');
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi tạo môn học!');
      });
  };

  const handleEditSubject = async (subject) => {
    setSelectedSubject(subject);
    
    // Fetch chi tiết subject để đảm bảo có đầy đủ thông tin (bao gồm subject_id)
    if (subject.subject_id) {
      await dispatch(fetchSubjectById(subject.subject_id));
    }
    
    setShowEdit(true);
  };

  const handleUpdateSubject = (subjectData) => {
    const subjectToUpdate = storeSelectedSubject || selectedSubject;
    
    if (subjectToUpdate) {
      const subjectId = subjectToUpdate.subject_id || subjectToUpdate.subjectId;
      
      if (!subjectId) {
        console.error("Lỗi: Không tìm thấy ID của môn học!");
        return;
      }
      
      dispatch(updateSubject({ 
        subjectId, 
        data: subjectData 
      }))
      .then(() => {
        setShowEdit(false);
        setSelectedSubject(null);
        toast.success('Cập nhật môn học thành công!');
      })
      .catch((error) => {
        toast.error('Có lỗi xảy ra khi cập nhật môn học!');
      });
    }
  };

  const handleDeleteSubject = (subject) => {
    setSelectedSubject(subject);
    setShowDelete(true);
  };

  const confirmDeleteSubject = () => {
    if (selectedSubject) {
      dispatch(deleteSubject(selectedSubject.subject_id))
        .then(() => {
          setShowDelete(false);
          setSelectedSubject(null);
          toast.success('Xóa môn học thành công!');
        })
        .catch(() => {
          toast.error('Có lỗi xảy ra khi xóa môn học!');
        });
    }
  };


  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="subjects" isCollapsed={isCollapsed} />
        <Header activeSection="subjects" isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Quản lý các môn sinh học</h1>
              <p className="page-description">Quản lý và tổ chức các môn học sinh học trong hệ thống</p>
            </div>
            
            <div className="action-buttons">
              <button 
                className="btn-primary" 
                onClick={() => setShowCreate(true)}
                disabled={createLoading}
              >
                <i className="fas fa-plus"></i> 
                {createLoading ? 'Đang tạo...' : 'Thêm mới môn học'}
              </button>
            </div>
            
          
            
            {/* Error state */}
            {error && (
              <div className="error-container">
                <i className="fas fa-exclamation-triangle"></i> 
                <span>{error}</span>
              </div>
            )}
            
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="col-name">Tên môn học</th>
                    <th className="col-description">Mô tả</th>
                    <th className="col-date">Ngày tạo</th>
                    <th>Người tạo</th>
                    <th>Người sửa cuối</th>
                    <th className="col-date">Ngày sửa cuối</th>
                    <th className="col-actions">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && subjects.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        <div className="empty-state-icon">
                          <i className="fas fa-inbox"></i>
                        </div>
                        Không có dữ liệu môn học
                      </td>
                    </tr>
                  ) : (
                    subjects.map((subject) => (
                      <tr key={subject.subject_id}>
                        <td className="col-name">{subject.name}</td>
                        <td className="col-description">{subject.description}</td>
                        <td className="col-date">{subject.CreatedDate || subject.createdDate}</td>
                        <td className="col-user">{subject.CreatedBy || subject.createdName}</td>
                        <td className="col-user">{subject.ModifiedBy || subject.modifiedName}</td>
                        <td className="col-date">{subject.ModifiedDate || subject.modifiedDate}</td>
                        <td className="col-actions">
                          <div className="action-buttons-container">
                            <button
                              className="btn-edit"
                              title="Sửa"
                              onClick={() => handleEditSubject(subject)}
                              disabled={updateLoading}
                            >
                              <i className="fas fa-edit"></i>
                              Sửa
                            </button>
                            <button 
                              className="btn-delete" 
                              title="Xóa" 
                              onClick={() => handleDeleteSubject(subject)}
                              disabled={deleteLoading}
                            >
                              <i className="fas fa-trash"></i>
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>            <CreateModal 
              open={showCreate} 
              onClose={() => setShowCreate(false)} 
              onSubmit={handleCreateSubject}
              loading={createLoading}
            />
            <EditModal 
              open={showEdit} 
              onClose={() => {
                setShowEdit(false);
                setSelectedSubject(null);
              }}
              onSubmit={handleUpdateSubject}
              initialData={storeSelectedSubject || selectedSubject}
              loading={updateLoading || fetchSubjectLoading}
            />
            <DeleteModal
              open={showDelete}
              onClose={() => {
                setShowDelete(false);
                setSelectedSubject(null);
              }}
              onConfirm={confirmDeleteSubject}
              loading={deleteLoading}
              itemName={selectedSubject?.name}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default SubjectsPage;