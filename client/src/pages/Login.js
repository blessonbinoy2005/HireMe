import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../css/auth.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:9000";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/api/auth/login`, form);
            const { token, user } = res.data.data;
            login(token, user);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.error?.message || "Login failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page login-bg">
            <div className="auth-card">
                <div className="brand">
                    <div className="brand-icon">H</div>
                    <span>HireMe</span>
                </div>

                <h1>Welcome back</h1>
                <p className="sub">Log in to continue tracking applications and exploring jobs.</p>

                {error && <div className="alert error">{error}</div>}

                <form onSubmit={onSubmit}>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>

                <p className="switch-text">
                    Don't have an account? <Link to="/signup">Create one</Link>
                </p>

                <div className="back-wrap">
                    <Link className="back-home" to="/">← Back to home</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
