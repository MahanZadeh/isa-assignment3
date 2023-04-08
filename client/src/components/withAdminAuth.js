import React from "react";
import { Navigate } from "react-router-dom";

import { apiGetAuthUser } from "../api/pokeAPI";

function withAdminAuth(WrappedComponent) {

    const AuthenticatedComponent = () => {

        const [isAdmin, setIsAdmin] = React.useState(undefined);

        const getCurrentUser = async () => {
            var { error, data } = await apiGetAuthUser();
            var adminGuy = data.data.is_admin;
         
            if (!error && adminGuy === 'true') {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        };

        React.useEffect(() => {
            getCurrentUser()
        }, []);

        if (isAdmin) {
            return <WrappedComponent />;
        } else if (isAdmin === false) {
            return <Navigate to="/adminlogin" replace />;
        } else {
            return <p>Loading...</p>;
        }
    };

    return AuthenticatedComponent;
};

export default withAdminAuth;