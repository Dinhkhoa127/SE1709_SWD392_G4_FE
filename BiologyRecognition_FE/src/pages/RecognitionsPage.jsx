import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import ViewDetailRecognition from '../components/ViewDetailRecognition.jsx';
import { fetchRecognitionsThunk, searchRecognitions } from '../redux/thunks/recognitionThunks';
import { clearRecognitionError } from '../redux/actions/recognitionActions';
import { fetchCurrentUser } from '../redux/thunks/userThunks.jsx';
import { formatDate } from '../utils/dateUtils';
import '../styles/AdminPage.css';
import '../styles/RecognitionsPage.css';

const RecognitionsPage = () => {
  // Redux
  const dispatch = useDispatch();
  const recognitionsState = useSelector((state) => state.recognitions || {});
  const { recognitions = [], loading = false, error = null } = recognitionsState;
  const { currentUser } = useSelector(state => state.user);

  // Local state
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRecognition, setSelectedRecognition] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  // Fetch recognitions when component mount or pagination changes
  useEffect(() => {
    dispatch(fetchRecognitionsThunk({ 
      page: currentPage, 
      pageSize: pageSize 
    }));
    // Fetch current user
    dispatch(fetchCurrentUser());
  }, [dispatch, currentPage, pageSize]);

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
      dispatch(fetchRecognitionsThunk({ 
        page: 1,
        pageSize: pageSize
      }));
      return;
    }
    
    // Debounce search
    const newTimeout = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      dispatch(searchRecognitions({
        artifactName: value.trim(),
        page: 1,
        pageSize: pageSize
      }));
    }, 500);
    
    setSearchTimeout(newTimeout);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    
    // Use search or regular fetch based on search term
    if (searchTerm.trim()) {
      dispatch(searchRecognitions({
        artifactName: searchTerm.trim(),
        page: newPage,
        pageSize: pageSize
      }));
    } else {
      dispatch(fetchRecognitionsThunk({ 
        page: newPage,
        pageSize: pageSize
      }));
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    
    // Use search or regular fetch based on search term
    if (searchTerm.trim()) {
      dispatch(searchRecognitions({
        artifactName: searchTerm.trim(),
        page: 1,
        pageSize: newPageSize
      }));
    } else {
      dispatch(fetchRecognitionsThunk({ 
        page: 1,
        pageSize: newPageSize
      }));
    }
  };

  // Handle refresh data
  const handleRefresh = () => {
    if (searchTerm.trim()) {
      dispatch(searchRecognitions({
        artifactName: searchTerm.trim(),
        page: currentPage,
        pageSize: pageSize
      }));
    } else {
      dispatch(fetchRecognitionsThunk({ 
        page: currentPage,
        pageSize: pageSize
      }));
    }
  };

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

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#10B981'; // Green
      case 'processing':
        return '#F59E0B'; // Yellow  
      case 'failed':
        return '#EF4444'; // Red
      default:
        return '#6B7280'; // Gray
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Hoàn thành';
      case 'processing':
        return 'Đang xử lý';
      case 'failed':
        return 'Thất bại';
      default:
        return status || 'Không xác định';
    }
  };

  // Handle view detail
  const handleViewDetail = (recognition) => {
    setSelectedRecognition(recognition);
    setShowDetail(true);
  };

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearRecognitionError());
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
        <Navbar activeSection="recognitions" isCollapsed={isCollapsed} />
        <Header activeSection="recognitions" isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Quản lý nhận diện sinh học</h1>
              <p className="page-description">Theo dõi và quản lý các kết quả nhận diện sinh học trong hệ thống</p>
            </div>
            
         
            
            {/* Search Bar */}
            <div className="search-container" style={{ marginBottom: 24 }}>
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên mẫu vật..."
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
                  Tìm kiếm theo tên mẫu vật: "{searchTerm}"
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
                    <th>Tên mẫu vật</th>
                    <th>Độ tin cậy</th>
                    <th>Kết quả AI</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {(recognitions.length === 0) ? (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        <div className="empty-state-icon">
                          <i className="fas fa-inbox"></i>
                        </div>
                        {searchTerm ? `Không tìm thấy kết quả nhận diện nào với tên mẫu vật "${searchTerm}"` : 'Không có dữ liệu nhận diện'}
                      </td>
                    </tr>
                  ) : (
                    recognitions.map(recognition => {
                      // Defensive check for recognition object
                      if (!recognition || typeof recognition !== 'object') {
                        return null;
                      }
                      
                      return (
                        <tr key={recognition.recognitionId || Math.random()}>
                          <td>{highlightText(recognition.artifactName?.toString(), searchTerm) || 'N/A'}</td>
                          <td className="confidence-score">
                            {recognition.confidenceScore ? 
                              `${(recognition.confidenceScore * 100).toFixed(2)}%` : 
                              'N/A'
                            }
                          </td>
                          <td className="ai-result" title={recognition.aiResult}>
                            {recognition.aiResult && recognition.aiResult.length > 50
                              ? `${recognition.aiResult.substring(0, 50)}...`
                              : (recognition.aiResult || 'N/A')
                            }
                          </td>
                          <td>
                            <span 
                              className="status-badge"
                              style={{ 
                                backgroundColor: `${getStatusColor(recognition.status)}15`,
                                color: getStatusColor(recognition.status),
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                border: `1px solid ${getStatusColor(recognition.status)}30`
                              }}
                            >
                              {getStatusText(recognition.status)}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons-container">
                              <button 
                                className="btn-view" 
                                title="Xem chi tiết"
                                onClick={() => handleViewDetail(recognition)}
                              >
                                <i className="fas fa-eye"></i>
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
                  disabled={loading || (recognitions && recognitions.length < pageSize)}
                  className={`pagination-btn ${loading || (recognitions && recognitions.length < pageSize) ? 'disabled' : 'enabled'}`}
                >
                  Sau
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>

            {/* View Detail Modal */}
            <ViewDetailRecognition
              open={showDetail}
              onClose={() => {
                setShowDetail(false);
                setSelectedRecognition(null);
              }}
              recognitionData={selectedRecognition}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default RecognitionsPage;
