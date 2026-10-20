const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).send({ message: "No token provided" });

    // Strip "Bearer " prefix if present
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

    try {
        const decoded = jwt.verify(token, "SECRET123");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).send({ message: "Invalid token" });
    }
};