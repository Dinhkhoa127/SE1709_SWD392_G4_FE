import instance from "../util/axiosCustomize";

const loginAPI = async (usernameOrEmail, password) => {
    const URL_API = "/authentication/login";
    let data = {
        usernameOrEmail: usernameOrEmail,
        password: password,
    };
    return instance.post(URL_API, data);
}

const loginGoogleAPI = async () => {
    window.location.href = `${import.meta.env.VITE_BE_API_URL}/authentication/login-google`;
}

const getCurrentUserAPI = async () => {
    const URL_API = "/authentication/current-user";
    return instance.get(URL_API);
}

// Subject APIs
const getSubjectsAPI = async () => {
    const URL_API = "/subject";
    return instance.get(URL_API);
}

const getSubjectByIdAPI = async (subjectId) => {
    const URL_API = `/subject/${subjectId}`;
    return instance.get(URL_API);
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
const getTopicsAPI = async () => {
    const URL_API = "/topic";
    return instance.get(URL_API);
}

const getTopicsByChapterAPI = async (chapterId) => {
    const URL_API = `/topic/by-chapter/${chapterId}`;
    return instance.get(URL_API);
}

const getTopicByIdAPI = async (topicId) => {
    const URL_API = `/topic/${topicId}`;
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
const getChaptersAPI = async () => {
    const URL_API = "/chapter";
    return instance.get(URL_API);
}

const getChaptersBySubjectAPI = async (subjectId) => {
    const URL_API = `/chapter/by-subject/${subjectId}`;
    return instance.get(URL_API);
}

const getChapterByIdAPI = async (chapterId) => {
    const URL_API = `/chapter/${chapterId}`;
    return instance.get(URL_API);
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
const getArtifactsAPI = async () => {
    const URL_API = "/artifact";
    return instance.get(URL_API);
}

const getArtifactByIdAPI = async (artifactId) => {
    const URL_API = `/artifact/${artifactId}`;
    return instance.get(URL_API);
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
const getArtifactTypesAPI = async () => {
    const URL_API = "/artifactType";
    return instance.get(URL_API);
}


const getArtifactTypesByTopicAPI = async (topicId) => {
    const URL_API = `/artifactType/by-topic/${topicId}`;
    return instance.get(URL_API);
}

const getArtifactTypeByIdAPI = async (artifactTypeId) => {
    const URL_API = `/artifactType/${artifactTypeId}`;
    return instance.get(URL_API);
}

const createArtifactTypeAPI = async (artifactTypeData) => {
    const URL_API = "/artifactType";
    return instance.post(URL_API, artifactTypeData);
}

const updateArtifactTypeAPI = async (artifactTypeData) => {
    const URL_API = "/artifactType";
    return instance.put(URL_API, artifactTypeData);
}

const deleteArtifactTypeAPI = async (artifactTypeId) => {
    const URL_API = `/artifactType/${artifactTypeId}`;
    return instance.delete(URL_API);
}

// Artifact Media APIs
const getArtifactMediaAPI = async () => {
    const URL_API = "/artifactMedia";
    return instance.get(URL_API);
}

const getArtifactMediaByIdAPI = async (artifactMediaId) => {
    const URL_API = `/artifactMedia/${artifactMediaId}`;
    return instance.get(URL_API);
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
const getArticlesAPI = async () => {
    const URL_API = "/article/details";
    return instance.get(URL_API);
}

const getArticleByIdAPI = async (articleId) => {
    const URL_API = `/article/${articleId}`;
    return instance.get(URL_API);
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
const getUsersAPI = async () => {
    const URL_API = "/user-accounts";
    return instance.get(URL_API);
}

const getUserByIdAPI = async (userId) => {
    const URL_API = `/user-accounts/${userId}`;
    return instance.get(URL_API);
}

const createUserAPI = async (userData) => {
    const URL_API = "/user";
    return instance.post(URL_API, userData);
}

const updateUserAPI = async (userData) => {
    const URL_API = "/user";
    return instance.put(URL_API, userData);
}

const deleteUserAPI = async (userId) => {
    const URL_API = `/user/${userId}`;
    return instance.delete(URL_API);
}

export { 
    loginAPI, 
    loginGoogleAPI,
    getCurrentUserAPI,

    // Subject APIs
    getSubjectsAPI,
    getSubjectByIdAPI,
    createSubjectAPI,
    updateSubjectAPI,
    deleteSubjectAPI,

    // Topic APIs
    getTopicsAPI,
    getTopicsByChapterAPI,
    getTopicByIdAPI,
    createTopicAPI,
    updateTopicAPI,
    deleteTopicAPI,

    // Chapter APIs
    getChaptersAPI,
    getChaptersBySubjectAPI,
    getChapterByIdAPI,
    createChapterAPI,
    updateChapterAPI,
    deleteChapterAPI,

    // Artifact APIs
    getArtifactsAPI,
    getArtifactByIdAPI,
    createArtifactAPI,
    updateArtifactAPI,
    deleteArtifactAPI,

    // Artifact Type APIs
    getArtifactTypesAPI,
    getArtifactTypesByTopicAPI,
    createArtifactTypeAPI,
    getArtifactTypeByIdAPI,
    updateArtifactTypeAPI,
    deleteArtifactTypeAPI,

    //Artifact Media APIs
    getArtifactMediaAPI,
    getArtifactMediaByIdAPI,
    createArtifactMediaAPI,
    updateArtifactMediaAPI,
    deleteArtifactMediaAPI,

    // Article APIs
    getArticlesAPI,
    getArticleByIdAPI,
    createArticleAPI,
    updateArticleAPI,
    deleteArticleAPI,

    // User APIs
    getUsersAPI,
    getUserByIdAPI,
    createUserAPI,
    updateUserAPI,
    deleteUserAPI
};