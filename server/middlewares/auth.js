const jwt = require("jsonwebtoken");
const { getUserById } = require("../modules/auth/auth.repository");

const protect = async (req, res, next) => {
  try {
    // 1. Extract token from cookies
    const token = req.cookies ? req.cookies.token : null;

    // 2. Verify token existence
    if (!token) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    // 3. Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Fetch fresh user details from DB to reflect any role updates immediately
    const dbUser = await getUserById(decoded.id);
    if (!dbUser) {
      return res.status(401).json({ success: false, error: "User no longer exists" });
    }

    req.user = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      username: dbUser.username,
      isVerified: dbUser.is_verified,
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
};


module.exports = protect;