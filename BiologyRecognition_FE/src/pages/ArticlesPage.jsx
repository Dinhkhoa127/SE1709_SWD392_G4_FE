import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import CreateModalArticle from '../components/CreateModalArticle.jsx';
import EditModalArticle from '../components/EditModalArticle.jsx';
import { fetchArticlesThunk, deleteArticleThunk, createArticleThunk, updateArticleThunk } from '../redux/thunks/articleThunks';
import { clearArticleError } from '../redux/actions/articleActions';
import { fetchArtifactsThunk } from '../redux/thunks/artifactThunks';
import '../styles/AdminPage.css';
import '../styles/ArticlesPage.css';

const ArticlesPage = () => {
  // Redux
  const dispatch = useDispatch();
  const { articles = [], loading = false, error = null, deleting = false, creating = false, updating = false } = useSelector((state) => state.articles || {});
  const { artifacts = [] } = useSelector((state) => state.artifacts || {});

  // Local state
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Lấy trạng thái collapsed từ localStorage, mặc định là false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('navbarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Lưu trạng thái collapsed vào localStorage khi thay đổi
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('navbarCollapsed', JSON.stringify(newCollapsedState));
  };

  // Fetch articles và artifacts khi component mount
  useEffect(() => {
    dispatch(fetchArticlesThunk());
    // Fetch artifacts để map artifactIds thành tên
    dispatch(fetchArtifactsThunk());
  }, [dispatch]);

  // Handle refresh data
  const handleRefresh = () => {
    dispatch(fetchArticlesThunk());
    dispatch(fetchArtifactsThunk());
  };

  // Helper function để map artifactIds thành tên
  const getArtifactNames = (artifactIds) => {
    if (!artifactIds || !Array.isArray(artifactIds) || artifactIds.length === 0) {
      return 'Không có';
    }
    
    const names = artifactIds.map(id => {
      const artifact = artifacts.find(art => art.artifactId === id);
      return artifact ? artifact.artifactName : `ID: ${id}`;
    });
    
    return names.join(', ');
  };

  // Handle delete article
  const handleDeleteArticle = (article) => {
    setSelectedArticle(article);
    setShowDelete(true);
  };

  const confirmDeleteArticle = async () => {
    if (selectedArticle) {
      try {
        await dispatch(deleteArticleThunk(selectedArticle.articleId || selectedArticle.article_id));
        toast.success('Xóa bài viết thành công!');
        setShowDelete(false);
        setSelectedArticle(null);
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa bài viết!');
      }
    }
  };

  // Handle create article
  const handleCreateArticle = () => {
    setShowCreate(true);
  };

  const handleCreateSubmit = async (formData) => {
    try {
      const result = await dispatch(createArticleThunk(formData));
      toast.success('Tạo bài viết thành công!');
      setShowCreate(false);
      
      // Force immediate refresh to ensure UI update
      dispatch(fetchArticlesThunk());
      
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo bài viết!');
    }
  };

  // Handle edit article
  const handleEditArticle = (article) => {
    setSelectedArticle(article);
    setShowEdit(true);
  };

  const handleEditSubmit = async (formData) => {
    try {
      const articleId = selectedArticle.articleId || selectedArticle.article_id;
      const result = await dispatch(updateArticleThunk({ articleId, data: formData }));
      toast.success('Cập nhật bài viết thành công!');
      setShowEdit(false);
      setSelectedArticle(null);
      
      // Force immediate refresh to ensure UI update
      dispatch(fetchArticlesThunk());
      
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật bài viết!');
    }
  };

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearArticleError());
      }
    };
  }, [dispatch, error]);

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
        rel="stylesheet" 
      />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="articles" isCollapsed={isCollapsed} />
        <Header activeSection="articles" isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Quản lý các bài báo sinh học</h1>
              <p className="page-description">Quản lý và tổ chức các bài viết sinh học trong hệ thống</p>
            </div>
            <div className="action-buttons">
              <button className="btn-primary" onClick={handleCreateArticle}>
                <i className="fas fa-plus"></i> 
                Thêm mới bài viết
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
                    <th>Tiêu đề</th>
                    <th>Nội dung</th>
                    <th>Mẫu vật liên quan</th>
                    <th>Người tạo</th>
                    <th>Ngày tạo</th>
                    <th>Người sửa cuối</th>
                    <th>Ngày sửa cuối</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {(!articles || articles.length === 0) && !loading ? (
                    <tr>
                      <td colSpan="8" className="empty-state">
                        <div className="empty-state-icon">
                          <i className="fas fa-inbox"></i>
                        </div>
                        Không có dữ liệu bài viết
                      </td>
                    </tr>
                  ) : (
                    articles && Array.isArray(articles) && articles.map(article => {
                      // Defensive check for article object
                      if (!article || typeof article !== 'object') {
                        console.warn('⚠️ Invalid article object:', article);
                        return null;
                      }
                      
                      return (
                        <tr key={article.articleId || article.article_id || Math.random()}>
                          <td>{article.title || 'N/A'}</td>
                          <td title={article.content || ''}>
                            {article.content && article.content.length > 100
                              ? `${article.content.substring(0, 100)}...`
                              : (article.content || 'N/A')
                            }
                          </td>
                          <td title={getArtifactNames(article.artifactIds)}>
                            {getArtifactNames(article.artifactIds)}
                          </td>
                          <td>{article.createName || article.createdName || article.CreatedBy || 'N/A'}</td>
                          <td>{article.createdDate ? new Date(article.createdDate).toLocaleDateString('vi-VN') : (article.CreatedDate || 'N/A')}</td>
                          <td>{article.modifiedName || article.ModifiedBy || 'N/A'}</td>
                          <td>{article.modifiedDate ? new Date(article.modifiedDate).toLocaleDateString('vi-VN') : (article.ModifiedDate || 'N/A')}</td>
                          <td>
                            <div className="action-buttons-container">
                              <button 
                                className="btn-edit" 
                                title="Sửa"
                                onClick={() => handleEditArticle(article)}
                                disabled={deleting || updating}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                className="btn-delete" 
                                title="Xóa"
                                onClick={() => handleDeleteArticle(article)}
                                disabled={deleting || updating}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }).filter(Boolean)
                  )}
                </tbody>
              </table>
            </div>

            {/* Create Modal */}
            <CreateModalArticle
              open={showCreate}
              onClose={() => setShowCreate(false)}
              onSubmit={handleCreateSubmit}
              loading={creating}
            />

            {/* Edit Modal */}
            <EditModalArticle
              open={showEdit}
              onClose={() => {
                setShowEdit(false);
                setSelectedArticle(null);
              }}
              onSubmit={handleEditSubmit}
              initialData={selectedArticle}
              loading={updating}
            />

            {/* Delete Modal */}
            {showDelete && (
              <div className="modal fade show" style={{ display: 'block' }} onClick={() => setShowDelete(false)}>
                <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Xác nhận xóa</h5>
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setShowDelete(false)}
                        disabled={deleting}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <p>Bạn có chắc chắn muốn xóa bài viết: <strong>{selectedArticle?.title}</strong>?</p>
                      <p className="text-warning">
                        <i className="fas fa-exclamation-triangle"></i> 
                        Hành động này không thể hoàn tác!
                      </p>
                    </div>
                    <div className="modal-footer">
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setShowDelete(false)}
                        disabled={deleting}
                      >
                        Hủy
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-danger" 
                        onClick={confirmDeleteArticle}
                        disabled={deleting}
                      >
                        {deleting ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Đang xóa...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-trash me-2"></i>
                            Xóa
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ArticlesPage;
