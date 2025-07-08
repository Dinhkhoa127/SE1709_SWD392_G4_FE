import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import CreateModalArticle from '../components/CreateModalArticle.jsx';
import EditModalArticle from '../components/EditModalArticle.jsx';
import { fetchArticlesThunk, deleteArticleThunk, createArticleThunk, updateArticleThunk } from '../redux/thunks/articleThunks';
import { clearArticleError } from '../redux/actions/articleActions';
import { fetchArtifactsThunk } from '../redux/thunks/artifactThunks';
import { formatDate } from '../utils/dateUtils';
import '../styles/AdminPage.css';
import '../styles/ArticlesPage.css';

const ArticlesPage = () => {
  // Redux
  const dispatch = useDispatch();
  const articlesState = useSelector((state) => state.articles || {});
  const { articles = [], loading = false, error = null, deleting = false, creating = false, updating = false } = articlesState;
  const artifactsState = useSelector((state) => state.artifacts || {});
  const { artifacts = [] } = artifactsState;

  // Local state
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    
    // Defensive check for artifacts array
    if (!artifacts || !Array.isArray(artifacts)) {
      return 'Đang tải...';
    }
    
    const names = artifactIds.map(id => {
      const artifact = artifacts.find(art => art && art.artifactId === id);
      return artifact ? artifact.artifactName : `ID: ${id}`;
    });
    
    return names.join(', ');
  };

  // Filter articles based on search term with error handling
  const filteredArticles = useMemo(() => {
    try {
      if (!articles || !Array.isArray(articles)) {
        return [];
      }
      
      return articles.filter(article => {
        // Defensive check for article object
        if (!article || typeof article !== 'object') {
          return false;
        }
        
        if (!searchTerm) return true;
        
        const title = article.title || '';
        const content = article.content || '';
        const artifactNames = getArtifactNames(article.artifactIds) || '';
        
        return (
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artifactNames.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    } catch (error) {
      return [];
    }
  }, [articles, searchTerm, artifacts]);
  
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
      setTimeout(() => {
        dispatch(fetchArticlesThunk());
      }, 100);
      
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
      setTimeout(() => {
        dispatch(fetchArticlesThunk());
      }, 100);
      
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
            
            {/* Search Bar */}
            <div className="search-container" style={{ marginBottom: 24 }}>
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tiêu đề, nội dung hoặc mẫu vật liên quan..."
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
                  Tìm thấy {filteredArticles.length} kết quả cho "{searchTerm}"
                </div>
              )}
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
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {(filteredArticles.length === 0 && !loading) ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        <div className="empty-state-icon">
                          <i className="fas fa-inbox"></i>
                        </div>
                        {searchTerm ? `Không tìm thấy bài viết nào với từ khóa "${searchTerm}"` : 'Không có dữ liệu bài viết'}
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map(article => {
                      // Defensive check for article object
                      if (!article || typeof article !== 'object') {
                        return null;
                      }
                      
                      return (
                        <tr key={article.articleId || article.article_id || Math.random()}>
                          <td>{highlightText(article.title, searchTerm) || 'N/A'}</td>
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
                          <td>{formatDate(article.createdDate || article.CreatedDate)}</td>
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
