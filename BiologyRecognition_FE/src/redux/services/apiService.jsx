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
const getChaptersAPI = async () => {
    const URL_API = "/chapter";
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

// ArtifactType APIs
const getArtifactTypesAPI = async () => {
    const URL_API = "/artifactType";
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
const getTopicsAPI = async () => {
    const URL_API = "/topic";
    return instance.get(URL_API);
}
const getTopicByIdAPI = async (topicId) => {
    const URL_API = `/topic/${topicId}`;
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

// ArtifactMedia APIs
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

export { 
    loginAPI, 
    loginGoogleAPI,
    getCurrentUserAPI,
    getSubjectsAPI,
    getSubjectByIdAPI,
    createSubjectAPI,
    updateSubjectAPI,
    deleteSubjectAPI,
    getChaptersAPI,
    getChapterByIdAPI,
    createChapterAPI,
    updateChapterAPI,
    deleteChapterAPI,
    getArtifactTypesAPI,
    getArtifactTypeByIdAPI,
    createArtifactTypeAPI,
    updateArtifactTypeAPI,
    deleteArtifactTypeAPI,
    getTopicsAPI,
    getTopicByIdAPI,
    getArtifactsAPI,
    getArtifactByIdAPI,
    getArtifactMediaAPI,
    getArtifactMediaByIdAPI,
    createArtifactMediaAPI,
    updateArtifactMediaAPI,
    deleteArtifactMediaAPI,
};