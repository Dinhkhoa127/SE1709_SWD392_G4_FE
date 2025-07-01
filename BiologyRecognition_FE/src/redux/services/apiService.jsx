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
    const URL_API = "/artifacttype";
    return instance.get(URL_API);
}

const getArtifactTypesByTopicAPI = async (topicId) => {
    const URL_API = `/artifacttype/by-topic/${topicId}`;
    return instance.get(URL_API);
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

export { 
    loginAPI, 
    loginGoogleAPI,
    getCurrentUserAPI,
    getSubjectsAPI,
    getSubjectByIdAPI,
    createSubjectAPI,
    updateSubjectAPI,
    deleteSubjectAPI,
    getTopicsAPI,
    getTopicsByChapterAPI,
    getTopicByIdAPI,
    createTopicAPI,
    updateTopicAPI,
    deleteTopicAPI,
    getChaptersAPI,
    getChaptersBySubjectAPI,
    getArtifactsAPI,
    getArtifactByIdAPI,
    createArtifactAPI,
    updateArtifactAPI,
    deleteArtifactAPI,
    getArtifactTypesAPI,
    getArtifactTypesByTopicAPI,
    getArticlesAPI,
    getArticleByIdAPI,
    createArticleAPI,
    updateArticleAPI,
    deleteArticleAPI
};