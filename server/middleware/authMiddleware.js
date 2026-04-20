const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
        return res.status(401).json({ success: false, error: { message: "Missing auth token." } });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.sub;
        req.userRole = payload.role;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: { message: "Invalid or expired token." } });
    }
}

module.exports = { verifyToken };
