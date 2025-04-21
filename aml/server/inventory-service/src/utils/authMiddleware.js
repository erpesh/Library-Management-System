const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    console.log("Authentication middleware triggered"); // Debugging line
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    console.log('req.headers:', req.headers); // Debugging line
    console.log("Auth header:", authHeader); // Debugging line
    console.log("Token:", token); // Debugging line
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
        req.user = decoded; // Attach decoded user info to request
        console.log("Decoded user info:", req.user); // Debugging line
        next();
    } catch (err) {
        console.error("Token verification error:", err); // Debugging line
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
    }
    next();
};

module.exports = {
    authenticateToken,
    requireAdmin,
};
