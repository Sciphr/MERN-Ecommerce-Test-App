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

export { authUser, getUserProfile, registerUser };
