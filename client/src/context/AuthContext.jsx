import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    });
    const [membershipsVersion, setMembershipsVersion] = useState(0);

    const login = (token, nextUser) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(nextUser));
        setUser(nextUser);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    const refreshMemberships = () => setMembershipsVersion(membershipsVersion + 1);

    return (
        <AuthContext.Provider
            value={{ user, login, logout, membershipsVersion, refreshMemberships }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);