const jwt = require("jsonwebtoken");
const Candidate = require("../models/Candidate");

const protectCandidate = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.candidate = await Candidate.findById(decoded.id).select("-password");
      if (!req.candidate) {
        return res.status(401).json({ message: "Candidate not found. Authorization denied." });
      }
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided." });
  }
};

module.exports = { protectCandidate };
