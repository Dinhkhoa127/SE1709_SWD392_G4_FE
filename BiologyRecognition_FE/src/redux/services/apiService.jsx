import instance from "../util/axiosCustomize";

const loginAPI = async (usernameOrEmail, password) => {
    const URL_API = "/auth/login";
    let data = {
        usernameOrEmail: usernameOrEmail,
        password: password,
    };
    return instance.post(URL_API, data);
}

const loginGoogleAPI = async (redirectUrl = null) => {
    // Tạo redirect URL mặc định nếu không được cung cấp
    const defaultRedirect = window.location.origin + '/auth/google-callback';
    const redirect = redirectUrl || defaultRedirect;
    
    // Redirect đến Google OAuth với callback URL
    window.location.href = `${import.meta.env.VITE_BE_API_URL}/auth/login-google?redirect=${encodeURIComponent(redirect)}`;
}

const getCurrentUserAPI = async () => {
    // Thử với endpoint auth/current-user trước
    try {
        const URL_API = "/auth/current-user";
        console.log('🔍 Trying getCurrentUserAPI with:', URL_API);
        return await instance.get(URL_API);
    } catch (error) {
        console.error('❌ getCurrentUserAPI failed with /auth/current-user:', error.response?.status);
        
        // Nếu không thành công, thử với endpoint khác hoặc lấy từ localStorage
        if (error.response?.status === 400 || error.response?.status === 404) {
            console.log('🔄 Fallback: Getting user from localStorage');
            
            const currentUserData = localStorage.getItem('currentUser');
            if (currentUserData) {
                try {
                    const user = JSON.parse(currentUserData);
                    return { data: user };
                } catch (parseError) {
                    console.error('Error parsing localStorage user:', parseError);
                    throw error;
                }
            }
        }
        throw error;
    }
}

// Subject APIs
const getSubjectsAPI = async (params = {}) => {
    const URL_API = "/subject";
    return instance.get(URL_API, { params });
}

const createSubjectAPI = async (subjectData) => {
    const URL_API = "/subject";
    return instance.post(URL_API, subjectData);
}

const updateSubjectAPI = async (subjectData) => {
    const URL_API = "/subject";
    return instance.put(URL_API, subjectData);
}

const deleteSubjectAPI = async (subjectId) => {
    const URL_API = `/subject/${subjectId}`;
    return instance.delete(URL_API);
}

// Topic APIs
const getTopicsAPI = async (params = {}) => {
    const URL_API = "/topic";
    return instance.get(URL_API, { params });
}

const getTopicsByChapterAPI = async (chapterId) => {
    const URL_API = `/topic/by-chapter/${chapterId}`;
    return instance.get(URL_API);
}


const createTopicAPI = async (topicData) => {
    const URL_API = "/topic";
    return instance.post(URL_API, topicData);
}

const updateTopicAPI = async (topicData) => {
    const URL_API = "/topic";
    return instance.put(URL_API, topicData);
}

const deleteTopicAPI = async (topicId) => {
    const URL_API = `/topic/${topicId}`;
    return instance.delete(URL_API);
}

// Chapter APIs
const getChaptersAPI = async (params = {}) => {
    const URL_API = "/chapter";
    return instance.get(URL_API, { params });
}

const createChapterAPI = async (chapterData) => {
    const URL_API = "/chapter";
    return instance.post(URL_API, chapterData);
}

const updateChapterAPI = async (chapterData) => {
    const URL_API = "/chapter";
    return instance.put(URL_API, chapterData);
}

const deleteChapterAPI = async (chapterId) => {
    const URL_API = `/chapter/${chapterId}`;
    return instance.delete(URL_API);
}

// Artifact APIs
const getArtifactsAPI = async (params = {}) => {
    const URL_API = "/artifact";
    return instance.get(URL_API, { params });
}


const createArtifactAPI = async (artifactData) => {
    const URL_API = "/artifact";
    return instance.post(URL_API, artifactData);
}

const updateArtifactAPI = async (artifactData) => {
    const URL_API = "/artifact";
    return instance.put(URL_API, artifactData);
}

const deleteArtifactAPI = async (artifactId) => {
    const URL_API = `/artifact/${artifactId}`;
    return instance.delete(URL_API);
}

// Artifact Type APIs
const getArtifactTypesAPI = async (params = {}) => {
    const URL_API = "/artifacttype";
    return instance.get(URL_API, { params });
}

const createArtifactTypeAPI = async (artifactTypeData) => {
    const URL_API = "/artifacttype";
    return instance.post(URL_API, artifactTypeData);
}

const updateArtifactTypeAPI = async (artifactTypeData) => {
    const URL_API = "/artifacttype";
    return instance.put(URL_API, artifactTypeData);
}

const deleteArtifactTypeAPI = async (artifactTypeId) => {
    const URL_API = `/artifacttype/${artifactTypeId}`;
    return instance.delete(URL_API);
}

// Artifact Media APIs
const getArtifactMediaAPI = async (params = {}) => {
    const URL_API = "/artifactMedia";
    return instance.get(URL_API, { params });
}


const createArtifactMediaAPI = async (artifactMediaData) => {
    const URL_API = "/artifactMedia";
    return instance.post(URL_API, artifactMediaData);
}

const updateArtifactMediaAPI = async (artifactMediaData) => {
    const URL_API = "/artifactMedia";
    return instance.put(URL_API, artifactMediaData);
}

const deleteArtifactMediaAPI = async (artifactMediaId) => {
    const URL_API = `/artifactMedia/${artifactMediaId}`;
    return instance.delete(URL_API);
}

// Article APIs
const getArticlesAPI = async (params = {}) => {
    const URL_API = "/article";
    return instance.get(URL_API, { params });
}


const createArticleAPI = async (articleData) => {
    const URL_API = "/article";
    return instance.post(URL_API, articleData);
}

const updateArticleAPI = async (articleData) => {
    const URL_API = "/article";
    return instance.put(URL_API, articleData);
}

const deleteArticleAPI = async (articleId) => {
    const URL_API = `/article/${articleId}`;
    return instance.delete(URL_API);
}

// Users Management APIs
const getUsersAPI = async (params = {}) => {
    const URL_API = "/user-accounts";
    return instance.get(URL_API, { params });
}

const getUserByIdAPI = async (userId) => {
    const URL_API = `/user-accounts/${userId}`;
    return instance.get(URL_API);
}

const createUserAPI = async (userData) => {
    const URL_API = "/user-accounts";
    console.log('Sending create user request:', userData); // Debug log
    try {
        const response = await instance.post(URL_API, userData);
        console.log('Create user API response:', response); // Debug log
        return response;
    } catch (error) {
        console.error('Create user API error:', error); // Debug log
        throw error;
    }
}

const updateUserAPI = async (userData) => {
    const URL_API = "/user-accounts/admin";
    console.log('Sending update user request:', userData); // Debug log
    try {
        const response = await instance.put(URL_API, userData);
        console.log('Update user API response:', response); // Debug log
        return response;
    } catch (error) {
        console.error('Update user API error:', error); // Debug log
        throw error;
    }
}

const updateMyInfoAPI = async (userData) => {
    const URL_API = "/user-accounts/me/info";
    console.log('🔄 Sending update my info request:', userData);
    console.log('🔗 Full URL:', `${import.meta.env.VITE_BE_API_URL}${URL_API}`);
    
    // Lấy current user từ localStorage để có UserAccountId
    const currentUserData = localStorage.getItem('currentUser');
    let userAccountId = null;
    
    if (currentUserData) {
        try {
            const currentUser = JSON.parse(currentUserData);
            userAccountId = currentUser.userAccountId || currentUser.id;
        } catch (error) {
            console.error('Error parsing current user data:', error);
        }
    }
    
    if (!userAccountId) {
        throw new Error('Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.');
    }
    
    // Thêm UserAccountId vào request body theo yêu cầu của backend
    const requestData = {
        userAccountId: userAccountId,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone
    };
    
    console.log('🔄 Final request data with UserAccountId:', requestData);
    
    try {
        const response = await instance.put(URL_API, requestData);
        console.log('✅ Update my info API response:', response);
        return response;
    } catch (error) {
        console.error('❌ Update my info API error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url
        });
        throw error;
    }
}

const deleteUserAPI = async (userId) => {
    const URL_API = `/user/${userId}`;
    return instance.delete(URL_API);
}

// Recognition APIs
const getRecognitionsAPI = async (params = {}) => {
    const URL_API = "/recognition";
    return instance.get(URL_API, { params });
}



export { 
    loginAPI, 
    loginGoogleAPI,
    getCurrentUserAPI,

    // Subject APIs
    getSubjectsAPI,
    createSubjectAPI,
    updateSubjectAPI,
    deleteSubjectAPI,

    // Chapter APIs
    getChaptersAPI,
    createChapterAPI,
    updateChapterAPI,
    deleteChapterAPI,

    // Topic APIs
    getTopicsAPI,
    createTopicAPI,
    updateTopicAPI,
    deleteTopicAPI,

    // Artifact APIs
    getArtifactsAPI,
    createArtifactAPI,
    updateArtifactAPI,
    deleteArtifactAPI,

    // Artifact Type APIs
    getArtifactTypesAPI,
    createArtifactTypeAPI,
    updateArtifactTypeAPI,
    deleteArtifactTypeAPI,

    //Artifact Media APIs
    getArtifactMediaAPI,
    createArtifactMediaAPI,
    updateArtifactMediaAPI,
    deleteArtifactMediaAPI,

    // Article APIs
    getArticlesAPI,
    createArticleAPI,
    updateArticleAPI,
    deleteArticleAPI,

    // User APIs
    getUsersAPI,
    getUserByIdAPI,
    createUserAPI,
    updateUserAPI,
    updateMyInfoAPI,
    deleteUserAPI,

    // Recognition APIs
    getRecognitionsAPI,
  
};