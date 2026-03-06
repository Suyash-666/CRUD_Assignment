const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ErrorHandler } = require('../utils/errorHandler');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_secret_key', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorHandler('Please provide all required fields', 400));
    }

    if (password !== confirmPassword) {
      return next(new ErrorHandler('Passwords do not match', 400));
    }

    if (password.length < 6) {
      return next(new ErrorHandler('Password must be at least 6 characters', 400));
    }

    let user = await User.findOne({ email });
    if (user) {
      return next(new ErrorHandler('User already exists with this email', 400));
    }

    user = await User.create({
      name,
      email,
      password,
      role: 'user',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorHandler('Invalid credentials', 401));
    }

    if (!user.isActive) {
      return next(new ErrorHandler('User account is inactive', 401));
    }

    const isPasswordMatched = await user.matchPassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler('Invalid credentials', 401));
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return next(new ErrorHandler('Please provide name and email', 400));
    }

    const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existingUser) {
      return next(new ErrorHandler('Email already in use', 400));
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return next(new ErrorHandler('Please provide all required fields', 400));
    }

    if (newPassword !== confirmPassword) {
      return next(new ErrorHandler('New passwords do not match', 400));
    }

    const user = await User.findById(req.user._id).select('+password');

    const isPasswordMatched = await user.matchPassword(oldPassword);
    if (!isPasswordMatched) {
      return next(new ErrorHandler('Old password is incorrect', 401));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};
