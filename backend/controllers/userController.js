import User from '../models/userModel.js';
import express from 'express';
import generateToken from '../utils/generateToken.js';

//@desc Auth user & get token
//@route POST /api/users/login
//@access Public
const authUser = async (req, res, next) => {
  const { email, password } = req.body;

  //Find email in database, based on the email we got from the request (request being the user input)
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    const error = new Error('Invalid email/password match');
    return next(error);
  }
};

//@desc Register a new user
//@route POST /api/users
//@access Public
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  //Here we are error handling if the name/email/or password fields were sent somehow empty
  if (!name || !email || !password) {
    res.status(400);
    const error = new Error('Where is the data!?!? Fill in the form plz');
    return next(error);
  }

  const userExists = await User.findOne({ email });

  //We then error handle if the email is already in use
  if (userExists) {
    res.status(400);
    const error = new Error('User already exists :(');
    return next(error);
  }

  //Now we can create a user since there is no current user with the same info, and the correct amount of info was passed
  const user = await User.create({
    name,
    email,
    password,
  });

  //Finally assuming a user is created and we got this far, we then send that data to the server. We also cover ourselves for any potential issues up to this point
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    const error = new Error('Invalid User data :O');
    return next(error);
  }
};

//@desc GET user profile
//@route GET /api/users/profile
//@access Private
const getUserProfile = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    const error = new Error('User Not Found');
    return next(error);
  }
};

//@desc Update user profile
//@route PUT /api/users/profile
//@access Private
const updateUserProfile = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const emailExists = await User.findOne({ email: req.body.email });

  //This is if another user has the same email, not including the current user since the error message wouldn't make as much sense if you simply overrote your email with the same email
  if (emailExists && emailExists._id.toString() !== req.user._id.toString()) {
    res.status(400);
    const error = new Error('User already exists :(');
    return next(error);
  }

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    const error = new Error('Update Failed');
    return next(error);
  }
};

//@desc GET all users
//@route GET /api/users
//@access Private/Admin
const getUsers = async (req, res, next) => {
  const users = await User.find({});

  res.json(users);
};

//@desc DELETE user
//@route DELETE /api/users/:id
//@access Private/Admin
const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    const error = new Error('User not found');
    return next(error);
  }
};

//@desc GET user by ID
//@route GET /api/users/:id
//@access Private/Admin
const getUserById = async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    const error = new Error('User not found');
    return next(error);
  }
};

//@desc Update user
//@route PUT /api/users/:id
//@access Private/Admin
const updateUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin ?? user.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    const error = new Error('Update Failed');
    return next(error);
  }
};

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
