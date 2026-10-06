import React, { useState } from "react";

import {
    Link,
    useNavigate,
} from "react-router";

import "../auth.form.scss";

import { useAuth } from "../hooks/useAuth";

const Register = () => {
    const {
        loading,
        handleRegister,
    } = useAuth();

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await handleRegister({
                username,
                email,
                password,
            });

            navigate("/", {
                replace: true,
            });
        } catch (error) {
            alert(
                error?.response?.data?.message ||
                    "Registration failed."
            );
        }
    };

    return (
        <main className="auth-page">
            <div className="form-container">
                <h1>Register</h1>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">
                            Username
                        </label>

                        <input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(event) =>
                                setUsername(
                                    event.target.value
                                )
                            }
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="button primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Register"}
                    </button>
                </form>

                <p>
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default Register;