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
<<<<<<< HEAD
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
=======

>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730
export { 
    loginAPI, 
    loginGoogleAPI,
    getCurrentUserAPI,
    getSubjectsAPI,
    getSubjectByIdAPI,
    createSubjectAPI,
    updateSubjectAPI,
<<<<<<< HEAD
    deleteSubjectAPI,
    getChaptersAPI,
    getChapterByIdAPI,
    createChapterAPI,
    updateChapterAPI,
    deleteChapterAPI,
=======
    deleteSubjectAPI
>>>>>>> e19e7a94f29870a9832573f66fcd199990bce730
};