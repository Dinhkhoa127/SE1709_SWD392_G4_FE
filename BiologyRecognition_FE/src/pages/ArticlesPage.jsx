import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import CreateModalArticle from '../components/CreateModalArticle.jsx';
import EditModalArticle from '../components/EditModalArticle.jsx';
import { fetchArticlesThunk, deleteArticleThunk, createArticleThunk, updateArticleThunk } from '../redux/thunks/articleThunks';
import { clearArticleError } from '../redux/actions/articleActions';
import { fetchArtifactsThunk } from '../redux/thunks/artifactThunks';
import { fetchCurrentUser } from '../redux/thunks/userThunks.jsx';
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
  const { currentUser } = useSelector(state => state.user);

  // Local state
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchTermRef = useRef('');

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Fetch articles when component mount or pagination changes
  useEffect(() => {
    // Always fetch on mount and pagination changes
    dispatch(fetchArticlesThunk({ 
      page: currentPage, 
      pageSize: pageSize,
      includeDetails: true // Add this to get artifact relationships
    }));
    // Fetch current user
    dispatch(fetchCurrentUser());
  }, [dispatch, currentPage, pageSize]);

  // Fetch artifacts để map artifactIds thành tên
  useEffect(() => {
    // Fetch all artifacts with high page size to get complete list with details
    console.log('ArticlesPage - Fetching artifacts...');
    dispatch(fetchArtifactsThunk({ 
      page: 1, 
      pageSize: 1000,
      includeDetails: true 
    }));
  }, [dispatch]);

  // Debug artifacts state
  useEffect(() => {
    console.log('ArticlesPage - artifacts state updated:', artifacts);
  }, [artifacts]);

  // Handle search with debounce - Server-side search
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // If search term is empty, fetch regular data
    if (!value.trim()) {
      setCurrentPage(1);
      dispatch(fetchArticlesThunk({ 
        page: 1,
        pageSize: pageSize,
        includeDetails: true
      }));
      return;
    }
    
    // Debounce search
    const newTimeout = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      dispatch(searchArticles({
        artifactName: value.trim(),
        page: 1,
        pageSize: pageSize,
        includeDetails: true
      }));
    }, 500);
    
    setSearchTimeout(newTimeout);
  };

  // Handle page change - Simplified for client-side search
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    
    // Only use pagination when not searching (client-side search shows all results)
    if (!searchTerm.trim()) {
      dispatch(fetchArticlesThunk({ 
        page: newPage,
        pageSize: pageSize,
        includeDetails: true
      }));
    }
  };

  // Handle page size change - Simplified for client-side search  
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    
    // Only use pagination when not searching (client-side search shows all results)
    if (!searchTerm.trim()) {
      dispatch(fetchArticlesThunk({ 
        page: 1,
        pageSize: newPageSize,
        includeDetails: true
      }));
    }
  };

  // Handle refresh data - Simplified for client-side search
  const handleRefresh = () => {
    dispatch(fetchArticlesThunk({ 
      page: currentPage,
      pageSize: searchTerm.trim() ? 1000 : pageSize, // Get more data when searching
      includeDetails: true
    }));
    // Refresh artifacts để map artifactIds thành tên
    dispatch(fetchArtifactsThunk({ 
      page: 1, 
      pageSize: 1000,
      includeDetails: true 
    }));
  };

  // Helper function để map artifactIds thành tên
  const getArtifactNames = (article, highlightTerm = null) => {
    // Try to get artifactIds from different possible field names
    const artifactIds = article?.artifactIds || 
                       article?.artifact_ids || 
                       article?.ArtifactIds || 
                       article?.artifacts || 
                       [];
    
    console.log('getArtifactNames called with article:', article);
    console.log('Extracted artifactIds:', artifactIds);
    console.log('Available artifacts:', artifacts);
    
    if (!artifactIds || !Array.isArray(artifactIds) || artifactIds.length === 0) {
      return 'Không có';
    }
    
    // Defensive check for artifacts array
    if (!artifacts || !Array.isArray(artifacts)) {
      return 'Đang tải...';
    }
    
    const names = artifactIds.map(id => {
      const artifact = artifacts.find(art => art && art.artifactId === id);
      console.log(`Looking for artifact with ID ${id}:`, artifact);
      return artifact ? artifact.artifactName : `ID: ${id}`;
    });
    
    console.log('Mapped names:', names);
    const fullText = names.join(', ');
    
    // If highlightTerm is provided, return JSX with highlighting
    if (highlightTerm && highlightTerm.trim()) {
      return highlightText(fullText, highlightTerm);
    }
    
    return fullText;
  };

  // Helper function để lấy tên artifact dạng text (không có highlighting) - dùng cho filtering
  const getArtifactNamesText = (article) => {
    const artifactIds = article?.artifactIds || 
                       article?.artifact_ids || 
                       article?.ArtifactIds || 
                       article?.artifacts || 
                       [];
    
    if (!artifactIds || !Array.isArray(artifactIds) || artifactIds.length === 0) {
      return 'Không có';
    }
    
    if (!artifacts || !Array.isArray(artifacts)) {
      return 'Đang tải...';
    }
    
    const names = artifactIds.map(id => {
      const artifact = artifacts.find(art => art && art.artifactId === id);
      return artifact ? artifact.artifactName : `ID: ${id}`;
    });
    
    return names.join(', ');
  };

  // Use client-side filtering when searching since API search doesn't include artifactIds
  const displayedArticles = useMemo(() => {
    if (!Array.isArray(articles)) return [];
    
    if (!searchTerm.trim()) {
      return articles;
    }
    
    // Client-side filtering with full artifact relationship data
    return articles.filter(article => {
      if (!article) return false;
      
      const searchLower = searchTerm.toLowerCase();
      const title = (article.title || '').toLowerCase();
      const content = (article.content || '').toLowerCase();
      
      // Also search in artifact names using the helper function (without highlighting for filtering)
      const artifactNames = getArtifactNamesText(article).toLowerCase();
      
      return title.includes(searchLower) || 
             content.includes(searchLower) || 
             artifactNames.includes(searchLower);
    });
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
        
        // Use search + pagination if there's a search term
        if (searchTerm.trim()) {
          dispatch(searchArticles({
            artifactName: searchTerm.trim(),
            page: currentPage,
            pageSize: pageSize,
            includeDetails: true
          }));
        } else {
          // Use regular pagination when no search term
          dispatch(fetchArticlesThunk({ 
            page: currentPage,
            pageSize: pageSize,
            includeDetails: true
          }));
        }
        
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa bài viết!');
      }
    }
  };

  // Handle create article
  const handleCreateArticle = () => {
    console.log('Opening create modal with artifacts:', artifacts);
    setShowCreate(true);
  };

  const handleCreateSubmit = async (formData) => {
    try {
      const result = await dispatch(createArticleThunk(formData));
      toast.success('Tạo bài viết thành công!');
      setShowCreate(false);
      
      // Use search + pagination if there's a search term
      if (searchTerm.trim()) {
        dispatch(searchArticles({
          artifactName: searchTerm.trim(),
          page: currentPage,
          pageSize: pageSize,
          includeDetails: true
        }));
      } else {
        // Use regular pagination when no search term
        dispatch(fetchArticlesThunk({ 
          page: currentPage,
          pageSize: pageSize,
          includeDetails: true
        }));
      }
      
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo bài viết!');
    }
  };

  // Handle edit article
  const handleEditArticle = (article) => {
    console.log('Article to edit:', article);
    console.log('Available artifacts for mapping:', artifacts);
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
      
      // Use search + pagination if there's a search term
      if (searchTerm.trim()) {
        dispatch(searchArticles({
          artifactName: searchTerm.trim(),
          page: currentPage,
          pageSize: pageSize,
          includeDetails: true
        }));
      } else {
        // Use regular pagination when no search term
        dispatch(fetchArticlesThunk({ 
          page: currentPage,
          pageSize: pageSize,
          includeDetails: true
        }));
      }
      
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
                  placeholder="Tìm kiếm theo mẫu vật liên quan"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    className="clear-search-btn"
                    title="Xóa tìm kiếm"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="search-results-info">
                  Tìm thấy {displayedArticles.length} kết quả cho "{searchTerm}"
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
                 
                    <th>Mẫu vật liên quan</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {(displayedArticles.length === 0 && !loading) ? (
                    <tr>
                      <td colSpan="3" className="empty-state">
                        <div className="empty-state-icon">
                          <i className="fas fa-inbox"></i>
                        </div>
                        {searchTerm ? `Không tìm thấy bài viết nào với từ khóa "${searchTerm}"` : 'Không có dữ liệu bài viết'}
                      </td>
                    </tr>
                  ) : (
                    displayedArticles.map(article => {
                      // Defensive check for article object
                      if (!article || typeof article !== 'object') {
                        return null;
                      }
                     
                      
                      return (
                        <tr key={article.articleId || article.article_id || Math.random()}>
                          <td>{highlightText(article.title, searchTerm) || 'N/A'}</td>
                       
                          <td title={getArtifactNamesText(article)}>
                            {getArtifactNames(article, searchTerm)}
                          </td>
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

            {/* Pagination Controls - Only show when not searching */}
            {/* Pagination Controls */}
            <div className="pagination-container">
              <div className="pagination-info">
                <span>Hiển thị</span>
                <select 
                  value={pageSize} 
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>mục mỗi trang</span>
              </div>
              
              <div className="pagination-controls">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                  className={`pagination-btn ${currentPage <= 1 || loading ? 'disabled' : 'enabled'}`}
                >
                  <i className="fas fa-chevron-left"></i>
                  Trước
                </button>
                
                <div className="pagination-current-page">
                  Trang {currentPage}
                </div>
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={loading || (displayedArticles && displayedArticles.length < pageSize)}
                  className={`pagination-btn ${loading || (displayedArticles && displayedArticles.length < pageSize) ? 'disabled' : 'enabled'}`}
                >
                  Sau
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>

            {/* Create Modal */}
            <CreateModalArticle
              open={showCreate}
              onClose={() => setShowCreate(false)}
              onSubmit={handleCreateSubmit}
              loading={creating}
              artifacts={artifacts}
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
              artifacts={artifacts}
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
