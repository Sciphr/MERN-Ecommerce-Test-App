import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      return next();
    } catch (err) {
      const error = new Error('Not authorized, token failed');
      res.status(401);
      return next(error);
    }
  }

  if (!token) {
    res.status(401);
    const error = new Error('No token');
    return next(error);
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    const error = new Error(
      "You aren't authorized to be here silly goose! Try asking the server administrator if you should be an Admin"
    );
    return next(error);
  }
};

export { protect, admin };
