import { useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:9000";

export default function useProfileSave(onSaved) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const save = async (partial) => {
        setSaving(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(`${API_BASE}/api/profile`, partial, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const updated = res.data.data.profile;
            if (onSaved) onSaved(updated);
            return updated;
        } catch (err) {
            const msg = err.response?.data?.error?.message || "Save failed.";
            setError(msg);
            throw err;
        } finally {
            setSaving(false);
        }
    };

    return { save, saving, error };
}
