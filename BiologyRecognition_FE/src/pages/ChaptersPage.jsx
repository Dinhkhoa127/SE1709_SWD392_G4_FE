import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChapters, createChapter, updateChapter, deleteChapter } from '../redux/thunks/chapterThunks';
import { fetchSubjects } from '../redux/thunks/subjectThunks';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import '../styles/ChaptersPage.css';
import { toast } from 'react-toastify';
import CreateModalChapter from '../components/CreateModalChapter';
import EditModalChapter from '../components/EditModalChapter';
import DeleteModal from '../components/DeleteModal.jsx';
import { fetchCurrentUser } from '../redux/thunks/userThunks';
import { formatDate } from '../utils/dateUtils';

const ChaptersPage = () => {
  // Lấy trạng thái collapsed từ localStorage, mặc định là false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('navbarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const dispatch = useDispatch();
  const { chapters = [], loading, error, createLoading, updateLoading, fetchChapterByIdLoading, selectedChapter, deleteLoading } = useSelector(state => state.chapters || {});
  const { subjects } = useSelector(state => state.subjects);
  const { currentUser } = useSelector(state => state.user);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [deletingChapter, setDeletingChapter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter chapters based on search term
  const filteredChapters = (Array.isArray(chapters) ? chapters : []).filter(chapter =>
    chapter.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (chapter.subjectName || chapter.subject)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Helper function to highlight search term in text
  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="highlight-text">{part}</span>
      ) : part
    );
  };
  
  useEffect(() => {
    dispatch(fetchChapters());
    dispatch(fetchSubjects());
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Lưu trạng thái collapsed vào localStorage khi thay đổi
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('navbarCollapsed', JSON.stringify(newCollapsedState));
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
            
            {/* Search Bar */}
            <div className="search-container" style={{ marginBottom: 24 }}>
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên chương, môn học hoặc mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="clear-search-btn"
                    title="Xóa tìm kiếm"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="search-results-info">
                  Tìm thấy {filteredChapters.length} kết quả cho "{searchTerm}"
                </div>
              )}
            </div>
            <CreateModalChapter
              open={showCreate}
              onClose={() => setShowCreate(false)}
              onSubmit={handleCreateChapter}
              loading={createLoading}
              subjects={subjects}
              isChapter={true}
            />
            <EditModalChapter
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
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && filteredChapters.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        <div className="empty-state-icon">
                          <i className="fas fa-inbox"></i>
                        </div>
                        {searchTerm ? `Không tìm thấy chương nào với từ khóa "${searchTerm}"` : 'Không có dữ liệu chương học'}
                      </td>
                    </tr>
                  ) : (
                    filteredChapters.map(chapter => (
                      <tr key={chapter.chapterId || chapter.chapter_id}>
                        <td>{highlightText(chapter.name, searchTerm)}</td>
                        <td>{highlightText(chapter.subjectName || chapter.subject, searchTerm)}</td>
                        <td>{highlightText(chapter.description, searchTerm)}</td>
                        <td>{formatDate(chapter.createdDate || chapter.CreatedDate)}</td>
                        <td>{chapter.createdName || chapter.CreatedBy}</td>
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