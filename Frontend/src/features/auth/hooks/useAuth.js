import { useContext } from "react";

import { AuthContext } from "../auth.context";

import {
    login,
    register,
    logout,
} from "../services/auth.api";

export const useAuth = () => {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used within an AuthProvider"
        );
    }

    const {
        user,
        setUser,
        loading,
        setLoading,
    } = context;

    const handleLogin = async ({
        email,
        password,
    }) => {
        setLoading(true);

        try {
            const data = await login({
                email,
                password,
            });

            setUser(data.user);

            return data;
        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({
        username,
        email,
        password,
    }) => {
        setLoading(true);

        try {
            const data = await register({
                username,
                email,
                password,
            });

            setUser(data.user);

            return data;
        } catch (error) {
            console.error(
                "Register error:",
                error
            );

            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);

        try {
            const data = await logout();

            setUser(null);

            return data;
        } catch (error) {
            console.error(
                "Logout error:",
                error
            );

            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
    };
};