const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    console.log("Token:", token); // Log the token for debugging
    if (!token) {
        return res.status(401).json({ error: "Authorization token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
        req.user = decoded; // Attach decoded user info to request
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
};

module.exports = {
    authenticateToken,
    requireAdmin,
};
