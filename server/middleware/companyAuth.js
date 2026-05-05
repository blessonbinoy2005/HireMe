const CompanyMember = require("../models/CompanyMember");

function fail(message) {
    return { success: false, error: { message } };
}

async function companyAuth(req, res, next) {
    try {
        const companyId = req.params.companyId;
        if (!companyId) {
            return res.status(400).json(fail("Missing company id."));
        }
        const membership = await CompanyMember.findOne({
            company: companyId,
            user: req.userId,
        });
        if (!membership) {
            return res.status(403).json(fail("You are not a member of this company."));
        }
        req.companyId = companyId;
        req.companyRole = membership.role;
        next();
    } catch (err) {
        console.error("companyAuth error:", err);
        return res.status(500).json(fail("Server error verifying company access."));
    }
}

function requireRole(...roles) {
    return function (req, res, next) {
        if (!roles.includes(req.companyRole)) {
            return res.status(403).json(fail("Insufficient permissions."));
        }
        next();
    };
}

module.exports = { companyAuth, requireRole };
