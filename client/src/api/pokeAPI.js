import { get, post, getUsers, getAuth } from "../utils/fetchUtils";

export const apiGetAllPokemon = () => {
    return get("/api/v1/pokemons");
};

export const apiGetSinglePokemon = (id) => {
    return get("/api/v1/pokemon/" + id);
};

export const apiLogin = (data) => {
    return post("/login", data);
};

export const apiLogout = () => {
    return post("/logout", {});
};

export const apiSignup = (data) => {
    return post("/register", data);
};

export const apiGetAuthUser = () => {
    return getAuth("/authUser");
};

export const apiGetTopUser = (data) => {
    const date = {date: data};
    return getUsers('/admin/users/', date);
};

export const apiGetUniqueUsers = (data) => {
    return getUsers('/admin/unique/', data);
};

export const apiEndpointUsers = () => {
    return get('/admin/endpoints');
};

export const apiErrorCount = () => {
    return get('/admin/accesslogs');
};