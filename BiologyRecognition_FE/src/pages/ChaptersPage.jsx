import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChapters, createChapter, updateChapter, deleteChapter } from '../redux/thunks/chapterThunks';
import { fetchSubjects } from '../redux/thunks/subjectThunks';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import '../styles/ChaptersPage.css';
<<<<<<< HEAD
import { toast } from 'react-toastify';
import CreateModal from '../components/CreateModal';
import EditModal from '../components/EditModal.jsx';
import DeleteModal from '../components/DeleteModal.jsx';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
=======

>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730

const ChaptersPage = () => {
  // Lấy trạng thái collapsed từ localStorage, mặc định là false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('navbarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
<<<<<<< HEAD

  const dispatch = useDispatch();
  const { chapters, loading, error, createLoading, updateLoading, fetchChapterByIdLoading, selectedChapter, deleteLoading } = useSelector(state => state.chapters);
  const { subjects } = useSelector(state => state.subjects);
  const { currentUser } = useSelector(state => state.user);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [deletingChapter, setDeletingChapter] = useState(null);
  
  useEffect(() => {
    dispatch(fetchChapters());
    dispatch(fetchCurrentUser());
  }, [dispatch]);

=======
  const [chapters] = useState([
    { chapter_id: 1, name: 'Cấu trúc tế bào', subject: 'Sinh học tế bào', description: 'Các thành phần cơ bản của tế bào', CreatedDate: '2024-01-16', CreatedBy: 'admin', ModifiedBy: 'admin', ModifiedDate: '2024-01-17', status: 'active' },
    { chapter_id: 2, name: 'Quang hợp', subject: 'Thực vật học', description: 'Quá trình quang hợp ở thực vật', CreatedDate: '2024-01-21', CreatedBy: 'admin', ModifiedBy: 'admin', ModifiedDate: '2024-01-22', status: 'active' }
  ]);

>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730
  // Lưu trạng thái collapsed vào localStorage khi thay đổi
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('navbarCollapsed', JSON.stringify(newCollapsedState));
<<<<<<< HEAD
  };

  const handleCreateChapter = (chapterData) => {
    dispatch(createChapter(chapterData))
      .then(() => {
        setShowCreate(false);
        toast.success('Tạo chương thành công!');
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi tạo chương!');
      });
  };

  const handleEditClick = (chapter) => {
    setEditingChapter(chapter);
    setShowEdit(true);
  };

  const handleUpdateChapter = (chapterData) => {
    const chapterId = editingChapter.chapterId || editingChapter.chapter_id;
    if (!chapterId) {
      toast.error('Không tìm thấy ID chương!');
      return;
    }
    dispatch(updateChapter({ chapterId, data: chapterData }))
      .then(() => {
        setShowEdit(false);
        setEditingChapter(null);
        toast.success('Cập nhật chương thành công!');
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi cập nhật chương!');
      });
  };

  const handleDeleteChapter = (chapterId) => {
    const chapter = chapters.find(ch => (ch.chapterId || ch.chapter_id) === chapterId);
    setDeletingChapter(chapter);
    setShowDelete(true);
  };

  const handleConfirmDelete = () => {
    const chapterId = deletingChapter.chapterId || deletingChapter.chapter_id;
    if (!chapterId) {
      toast.error('Không tìm thấy ID chương!');
      return;
    }
    
    dispatch(deleteChapter(chapterId))
      .then(() => {
        setShowDelete(false);
        setDeletingChapter(null);
        toast.success('Xóa chương thành công!');
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi xóa chương!');
      });
=======
>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730
  };

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        rel="stylesheet" 
      />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar 
          activeSection="chapters" 
          isCollapsed={isCollapsed} 
        />
        <Header 
          activeSection="chapters" 
          isCollapsed={isCollapsed} 
          onToggleCollapse={handleToggleCollapse} 
        />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Chapters Management</h1>
              <p className="page-description">Quản lý các chương học sinh học</p>
            </div>
            <div className="action-buttons" style={{ marginBottom: 24 }}>
              <button className="btn btn-primary" onClick={() => setShowCreate(true)} disabled={createLoading}>
                <i className="fas fa-plus"></i> {createLoading ? 'Đang tạo...' : 'Thêm mới chương'}
              </button>
            </div>
            <CreateModal
              open={showCreate}
              onClose={() => setShowCreate(false)}
              onSubmit={handleCreateChapter}
              loading={createLoading}
              subjects={subjects}
              isChapter={true}
            />
            <EditModal
              open={showEdit}
              onClose={() => {
                setShowEdit(false);
                setEditingChapter(null);
              }}
              onSubmit={handleUpdateChapter}
              initialData={editingChapter}
              loading={updateLoading || fetchChapterByIdLoading}
            />
            <DeleteModal
              open={showDelete}
              onClose={() => {
                setShowDelete(false);
                setDeletingChapter(null);
              }}
              onConfirm={handleConfirmDelete}
              title="Xóa chương học"
              message={`Bạn có chắc chắn muốn xóa chương "${deletingChapter?.name || ''}"? Hành động này không thể hoàn tác.`}
            />
            {/* Loading state */}
            {loading && (
              <div className="loading-container">
                <i className="fas fa-spinner fa-spin"></i>
                <div>Đang tải dữ liệu...</div>
              </div>
            )}
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
                    <th>Tên chương</th>
                    <th>Môn học</th>
                    <th>Mô tả</th>
                    <th>Ngày tạo</th>
                    <th>Người tạo</th>
                    <th>Người sửa cuối</th>
                    <th>Ngày sửa cuối</th>
<<<<<<< HEAD
=======
                 
>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
<<<<<<< HEAD
                  {!loading && chapters.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="empty-state">
                        <div className="empty-state-icon">
                          <i className="fas fa-inbox"></i>
                        </div>
                        Không có dữ liệu chương học
=======
                  {chapters.map(chapter => (
                    <tr key={chapter.chapter_id}>
                      <td>{chapter.name}</td>
                      <td>{chapter.subject}</td>
                      <td>{chapter.description}</td>
                      <td>{chapter.CreatedDate}</td>
                      <td>{chapter.CreatedBy}</td>
                      <td>{chapter.ModifiedBy}</td>
                      <td>{chapter.ModifiedDate}</td>
                    
                      <td>
                        <div className="action-buttons-container">
                          <button className="btn btn-edit" title="Sửa">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn btn-delete" title="Xóa">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730
                      </td>
                    </tr>
                  ) : (
                    chapters.map(chapter => (
                      <tr key={chapter.chapterId || chapter.chapter_id}>
                        <td>{chapter.name}</td>
                        <td>{chapter.subjectName || chapter.subject}</td>
                        <td>{chapter.description}</td>
                        <td>{chapter.createdDate || chapter.CreatedDate}</td>
                        <td>{chapter.createdName || chapter.CreatedBy}</td>
                        <td>{chapter.modifiedName || chapter.ModifiedBy}</td>
                        <td>{chapter.modifiedDate || chapter.ModifiedDate}</td>
                        <td>
                          <div className="action-buttons-container">
                            <button className="btn btn-edit" title="Sửa" onClick={() => handleEditClick(chapter)}>
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-delete" title="Xóa" onClick={() => handleDeleteChapter(chapter.chapterId || chapter.chapter_id)}>
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ChaptersPage;