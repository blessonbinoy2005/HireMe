const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(user) {
    return jwt.sign(
        { sub: user._id.toString(), email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
}

function publicUser(user) {
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
    };
}

async function register(req, res) {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body || {};

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters." });
        }
        if (confirmPassword !== undefined && confirmPassword !== password) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: "An account with that email already exists." });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            passwordHash,
        });

        const token = signToken(user);
        return res.status(201).json({ token, user: publicUser(user) });
    } catch (err) {
        console.error("register error:", err);
        return res.status(500).json({ message: "Server error creating account." });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const token = signToken(user);
        return res.json({ token, user: publicUser(user) });
    } catch (err) {
        console.error("login error:", err);
        return res.status(500).json({ message: "Server error during login." });
    }
}

async function me(req, res) {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found." });
        return res.json({ user: publicUser(user) });
    } catch (err) {
        console.error("me error:", err);
        return res.status(500).json({ message: "Server error." });
    }
}

module.exports = { register, login, me };
