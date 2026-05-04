const Company = require("../models/Company");
const CompanyMember = require("../models/CompanyMember");

function ok(data) {
    return { success: true, data };
}

function fail(message) {
    return { success: false, error: { message } };
}

async function createCompany(req, res) {
    try {
        const {
            companyName,
            companyLocation,
            companyWebsite,
            description,
            industry,
            logoUrl,
            size,
        } = req.body || {};

        if (!companyName || !companyName.trim()) {
            return res.status(400).json(fail("Company name is required."));
        }

        const trimmedName = companyName.trim();

        const existing = await CompanyMember.find({ user: req.userId }).populate("company");
        const duplicate = existing.find(
            (m) => m.company && m.company.companyName.toLowerCase() === trimmedName.toLowerCase()
        );
        if (duplicate) {
            return res.status(400).json(fail(`You already have a company named "${trimmedName}".`));
        }

        const company = await Company.create({
            companyName: trimmedName,
            companyLocation: (companyLocation || "").trim(),
            companyWebsite: (companyWebsite || "").trim(),
            description: (description || "").trim(),
            industry: (industry || "").trim(),
            logoUrl: (logoUrl || "").trim(),
            size: size || "",
            createdBy: req.userId,
        });

        await CompanyMember.create({
            user: req.userId,
            company: company._id,
            role: "owner",
        });

        return res.status(201).json(ok({ company }));
    } catch (err) {
        console.error("createCompany error:", err);
        return res.status(500).json(fail("Server error creating company."));
    }
}

async function getMyCompanies(req, res) {
    try {
        const memberships = await CompanyMember.find({ user: req.userId })
            .populate("company")
            .sort({ joinedAt: -1 });
        const data = memberships
            .filter((m) => m.company)
            .map((m) => ({
                role: m.role,
                joinedAt: m.joinedAt,
                company: m.company,
            }));
        return res.json(ok({ memberships: data }));
    } catch (err) {
        console.error("getMyCompanies error:", err);
        return res.status(500).json(fail("Server error loading companies."));
    }
}

async function getCompany(req, res) {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json(fail("Company not found."));
        }
        return res.json(ok({ company }));
    } catch (err) {
        console.error("getCompany error:", err);
        return res.status(500).json(fail("Server error loading company."));
    }
}

module.exports = { createCompany, getMyCompanies, getCompany };
