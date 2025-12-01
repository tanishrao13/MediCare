const { verifyTokens } = require("../Utils/token.js");

const authenticateUser = (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    console.log("Auth Middleware - Cookies:", req.cookies);
    console.log("Auth Middleware - Token:", token ? "Found" : "Missing");

    if (!token) {
        console.log("Auth Middleware - No token found");
        return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = verifyTokens(token);
    if (!decoded) {
        console.log("Auth Middleware - Token verification failed");
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    console.log("Auth Middleware - User authenticated:", decoded.userId);
    req.user = decoded;
    next();
};

module.exports = { authenticateUser };
