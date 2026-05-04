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

        const memberships = await CompanyMember.find({ user: req.userId }).populate("company");
        let duplicate = null;
        for (let i = 0; i < memberships.length; i++) {
            const m = memberships[i];
            if (m.company && m.company.companyName.toLowerCase() === trimmedName.toLowerCase()) {
                duplicate = m.company;
                break;
            }
        }
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
            role: "admin",
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
        const data = [];
        for (let i = 0; i < memberships.length; i++) {
            const m = memberships[i];
            if (!m.company) continue;
            data.push({
                role: m.role,
                joinedAt: m.joinedAt,
                company: m.company,
            });
        }
        return res.json(ok({ memberships: data }));
    } catch (err) {
        console.error("getMyCompanies error:", err);
        return res.status(500).json(fail("Server error loading companies."));
    }
}

async function getCompany(req, res) {
    try {
        const company = await Company.findById(req.params.companyId);
        if (!company) {
            return res.status(404).json(fail("Company not found."));
        }
        return res.json(ok({ company }));
    } catch (err) {
        console.error("getCompany error:", err);
        return res.status(500).json(fail("Server error loading company."));
    }
}

async function updateCompany(req, res) {
    try {
        const { companyName, companyLocation, companyWebsite, description, industry, logoUrl, size } = req.body || {};

        const update = {};
        if (companyName !== undefined) {
            const trimmed = companyName.trim();
            if (!trimmed) {
                return res.status(400).json(fail("Company name is required."));
            }
            update.companyName = trimmed;
        }
        if (companyLocation !== undefined) update.companyLocation = companyLocation.trim();
        if (companyWebsite !== undefined) update.companyWebsite = companyWebsite.trim();
        if (description !== undefined) update.description = description.trim();
        if (industry !== undefined) update.industry = industry.trim();
        if (logoUrl !== undefined) update.logoUrl = logoUrl.trim();
        if (size !== undefined) update.size = size;

        if (update.companyName) {
            const memberships = await CompanyMember.find({ user: req.userId }).populate("company");
            let duplicate = null;
            for (let i = 0; i < memberships.length; i++) {
                const m = memberships[i];
                if (!m.company) continue;
                if (m.company._id.toString() === req.params.companyId) continue;
                if (m.company.companyName.toLowerCase() === update.companyName.toLowerCase()) {
                    duplicate = m.company;
                    break;
                }
            }
            if (duplicate) {
                return res.status(400).json(fail(`You already have a company named "${update.companyName}".`));
            }
        }

        const company = await Company.findByIdAndUpdate(
            req.params.companyId,
            update,
            { new: true, runValidators: true }
        );
        if (!company) {
            return res.status(404).json(fail("Company not found."));
        }
        return res.json(ok({ company }));
    } catch (err) {
        console.error("updateCompany error:", err);
        return res.status(500).json(fail("Server error updating company."));
    }
}

module.exports = { createCompany, getMyCompanies, getCompany, updateCompany };
