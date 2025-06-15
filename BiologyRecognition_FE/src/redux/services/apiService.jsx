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

export { loginAPI, loginGoogleAPI };