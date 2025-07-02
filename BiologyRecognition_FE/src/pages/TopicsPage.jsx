import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';

import CreateModalTopic from '../components/CreateModalTopic.jsx';
import EditModalTopic from '../components/EditModalTopic.jsx';
import DeleteModal from '../components/DeleteModal.jsx';

import { fetchTopics, fetchTopicById, createTopic, updateTopic, deleteTopic } from '../redux/thunks/topicThunks.jsx';
import { fetchCurrentUser } from '../redux/thunks/userThunks.jsx';

import '../styles/TopicsPage.css';

const TopicsPage = () => {
  const dispatch = useDispatch();
  const { topics = [], selectedTopic: storeSelectedTopic, loading, error, createLoading, updateLoading, deleteLoading, fetchTopicLoading } = useSelector(state => state.topics || {});
  const { currentUser } = useSelector(state => state.user);
  
  // Lấy trạng thái collapsed từ localStorage, mặc định là false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('navbarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch topics and current user when component mount
  useEffect(() => {
    dispatch(fetchTopics());
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Lưu trạng thái collapsed vào localStorage khi thay đổi
  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('navbarCollapsed', JSON.stringify(newCollapsedState));
  };

  // Filter topics based on search term
  const filteredTopics = (Array.isArray(topics) ? topics : []).filter(topic =>
    topic.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (topic.chapterName || topic.chapter)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.description?.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Handlers
  const handleCreateTopic = (topicData) => {
    dispatch(createTopic(topicData))
      .then(() => {
        setShowCreate(false);
        toast.success('Tạo chủ đề thành công!');
      })
      .catch(() => {
        toast.error('Có lỗi xảy ra khi tạo chủ đề!');
      });
  };

  const handleEditTopic = async (topic) => {
    setSelectedTopic(topic);
    
    // Fetch chi tiết topic để đảm bảo có đầy đủ thông tin (bao gồm topic_id)
    if (topic.topicId || topic.topic_id) {
      await dispatch(fetchTopicById(topic.topicId || topic.topic_id));
    }
    
    setShowEdit(true);
  };

  const handleUpdateTopic = (topicData) => {
    const topicToUpdate = storeSelectedTopic || selectedTopic;
    
    if (topicToUpdate) {
      const topicId = topicToUpdate.topicId || topicToUpdate.topic_id;
      
      if (!topicId) {

        return;
      }
      
      dispatch(updateTopic({ 
        topicId, 
        data: topicData 
      }))
      .then(() => {
        setShowEdit(false);
        setSelectedTopic(null);
        toast.success('Cập nhật chủ đề thành công!');
      })
      .catch((error) => {
        toast.error('Có lỗi xảy ra khi cập nhật chủ đề!');
      });
    }
  };

  const handleDeleteTopic = (topic) => {
    setSelectedTopic(topic);
    setShowDelete(true);
  };

  const confirmDeleteTopic = () => {
    if (selectedTopic) {
      dispatch(deleteTopic(selectedTopic.topicId || selectedTopic.topic_id))
        .then(() => {
          setShowDelete(false);
          setSelectedTopic(null);
          toast.success('Xóa chủ đề thành công!');
        })
        .catch(() => {
          toast.error('Có lỗi xảy ra khi xóa chủ đề!');
        });
    }
  };

  return (
    <>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      <div className={`admin-container${isCollapsed ? ' sidebar-hidden' : ''}`}>
        <Navbar activeSection="topics" isCollapsed={isCollapsed} />
        <Header activeSection="topics" isCollapsed={isCollapsed} onToggleCollapse={handleToggleCollapse} />
        <main className={`main-content${isCollapsed ? ' collapsed' : ''}`}>
          <div className="content-area">
            <div className="page-header">
              <h1 className="page-title">Quản lý các chủ đề sinh học</h1>
              <p className="page-description">Quản lý các chủ đề sinh học trong hệ thống</p>
            </div>
            
            <div className="action-buttons">
              <button 
                className="btn-primary" 
                onClick={() => setShowCreate(true)}
                disabled={createLoading}
              >
                <i className="fas fa-plus"></i> 
                {createLoading ? 'Đang tạo...' : 'Thêm mới chủ đề'}
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="search-container" style={{ marginBottom: 24 }}>
              <div className="search-input-wrapper">
                <i className="fas fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên chủ đề, chương hoặc mô tả..."
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
                  Tìm thấy {filteredTopics.length} kết quả cho "{searchTerm}"
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
                    <th>Tên chủ đề</th>
                    <th>Chương</th>
                    <th>Mô tả</th>
                    <th>Ngày tạo</th>
                    <th>Người tạo</th>
                    <th>Người sửa cuối</th>
                    <th>Ngày sửa cuối</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && filteredTopics.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="empty-state">
                        <div className="empty-state-icon">
                          <i className="fas fa-inbox"></i>
                        </div>
                        Không có dữ liệu chủ đề
                      </td>
                    </tr>
                  ) : (
                    filteredTopics.map(topic => (
                      <tr key={topic.topicId || topic.topic_id}>
                        <td>{highlightText(topic.name, searchTerm)}</td>
                        <td>{highlightText(topic.chapterName || topic.chapter, searchTerm)}</td>
                        <td>{highlightText(topic.description, searchTerm)}</td>
                        <td>{topic.createdDate || topic.CreatedDate}</td>
                        <td>{topic.createdName || topic.CreatedBy}</td>
                        <td>{topic.modifiedName || topic.ModifiedBy}</td>
                        <td>{topic.modifiedDate || topic.ModifiedDate}</td>
                        <td>
                          <div className="action-buttons-container">
                            <button
                              className="btn-edit"
                              title="Sửa"
                              onClick={() => handleEditTopic(topic)}
                              disabled={updateLoading}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              className="btn-delete" 
                              title="Xóa" 
                              onClick={() => handleDeleteTopic(topic)}
                              disabled={deleteLoading}
                            >
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
            
            <CreateModalTopic 
              open={showCreate} 
              onClose={() => setShowCreate(false)} 
              onSubmit={handleCreateTopic}
              loading={createLoading}
            />
            <EditModalTopic 
              open={showEdit} 
              onClose={() => {
                setShowEdit(false);
                setSelectedTopic(null);
              }}
              onSubmit={handleUpdateTopic}
              initialData={storeSelectedTopic || selectedTopic}
              loading={updateLoading || fetchTopicLoading}
            />
            <DeleteModal
              open={showDelete}
              onClose={() => {
                setShowDelete(false);
                setSelectedTopic(null);
              }}
              onConfirm={confirmDeleteTopic}
              loading={deleteLoading}
              itemName={selectedTopic?.name}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default TopicsPage;