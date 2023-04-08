import axios from "axios";

const formatAPIURL = (url) => {
    return "http://localhost:5000" + url;
};

const formatAuthAPI = (url) => {
    return "http://localhost:4000" + url;
}

export const get = async (url) => {
    try {
        const data  = await axios.get(formatAPIURL(url), {
            withCredentials: true
        });
        return data;
    } catch (err) {
        return { error: -1, ...err.response.data };        
    } 
};

export const getAuth = async (url) => {
    try {
        const data  = await axios.get(formatAuthAPI(url), {
            withCredentials: true
        });
        return data;
    } catch (err) {
        return { error: -1, ...err.response.data };        
    } 
};

export const post = async (url, body ) => {
    try {
        const res = await axios.post(formatAuthAPI(url), body, {
            withCredentials: true
        });
        return res;
    }
    catch (err) {
        return { error: -1, ...err.response };
    }
};

export const getUsers = async (url, body ) => {
    try {
        const data  = await axios.post(formatAPIURL(url), body, {
            withCredentials: true
        });
        return data;
    } catch (err) {
        return { error: -1, ...err.response };
    }
};