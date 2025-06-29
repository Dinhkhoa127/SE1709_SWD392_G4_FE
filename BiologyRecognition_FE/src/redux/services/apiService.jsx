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
    getTopicByIdAPI,
    createTopicAPI,
    updateTopicAPI,
    deleteTopicAPI,
    getChaptersAPI
};