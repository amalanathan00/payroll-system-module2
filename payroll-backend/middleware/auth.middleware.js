exports.isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ 
      success: false,
      message: "Authentication required. Please login." 
    });
  }
  next();
};

exports.hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ 
        success: false,
        message: "Authentication required" 
      });
    }
    
    if (!req.session.role) {
      return res.status(403).json({ 
        success: false,
        message: "Role not found in session" 
      });
    }
    
    if (!roles.includes(req.session.role)) {
      return res.status(403).json({ 
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}` 
      });
    }
    
    next();
  };
};
