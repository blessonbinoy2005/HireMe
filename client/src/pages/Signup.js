import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/auth.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:9000";

function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/api/auth/register`, form);
            const { token, user } = res.data.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.error?.message || "Sign up failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page signup-bg">
            <div className="auth-card wide">
                <div className="brand">
                    <div className="brand-icon">H</div>
                    <span>HireMe</span>
                </div>

                <h1>Create account</h1>
                <p className="sub">Start building your future with a cleaner way to search and track jobs.</p>

                {error && <div className="alert error">{error}</div>}

                <form onSubmit={onSubmit}>
                    <div className="grid">
                        <div className="field">
                            <label htmlFor="firstName">First name</label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="First name"
                                value={form.firstName}
                                onChange={onChange}
                                required
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="lastName">Last name</label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Last name"
                                value={form.lastName}
                                onChange={onChange}
                                required
                            />
                        </div>
                    </div>

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
                            placeholder="Create a password"
                            value={form.password}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm password"
                            value={form.confirmPassword}
                            onChange={onChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                <p className="switch-text">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>

                <div className="back-wrap">
                    <Link className="back-home" to="/">← Back to home</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
