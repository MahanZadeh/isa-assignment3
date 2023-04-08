import React from "react";
import { Navigate } from "react-router-dom";

import { apiGetAuthUser } from "../api/pokeAPI";

function withBasicAuth(WrappedComponent) {

    const AuthenticatedComponent = () => {

        const [isLoggedIn, setIsLoggedIn] = React.useState(undefined);

        const getCurrentUser = async () => {
            var { error, data } = await apiGetAuthUser();

            if (!error && data.data.access_token) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        };

        React.useEffect(() => {
            getCurrentUser()
        }, []);

        if (isLoggedIn) {
            return <WrappedComponent />;
        } else if (isLoggedIn === false) {
            return <Navigate to="/login" replace />;
        } else {
            return <p>Loading...</p>;
        }
    };

    return AuthenticatedComponent;
};

export default withBasicAuth;