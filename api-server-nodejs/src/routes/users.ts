import bcrypt from 'bcrypt';
/*

Copyright (c) 2019 - present AppSeed.us

*/
import express from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

import { checkToken } from '../config/safeRoutes';
import ActiveSession from '../models/user/activeSession';
import { User, LoginMethod, Role } from '../models/index';
import { connection } from '../server/database';
import { logoutUser } from '../controllers/logout.controller';

// eslint-disable-next-line new-cap
const router = express.Router();
// Route: <HOST>:PORT/api/users/

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(4).max(32).required(),
  password: Joi.string().required().min(6).max(72),
  loginMethod: Joi.string().length(24).optional(),
  role: Joi.string().length(24).optional(),
  date: Joi.date().optional(),
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Joy Validation
    const result = userSchema.validate(req.body);
    if (result.error) {
      res.status(422).json({
        success: false,
        msg: `Validation err: ${result.error.details[0].message}`,
      });
      return;
    }

    const userRepository = connection!.getMongoRepository(User);
    const loginMethodRepository = connection!.getMongoRepository(LoginMethod);
    const roleRepository = connection!.getMongoRepository(Role);

    // Check if username already exists
    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
      res.status(400).json({
        success: false,
        msg: 'Username already exists',
      });
      return;
    }

    // Check if email already exists
    const existingEmail = await userRepository.findOne({ where: { email } });
    if (existingEmail) {
      res.status(400).json({
        success: false,
        msg: 'Email already exists',
      });
      return;
    }

    // Find the login method by its name
    const foundLoginMethod = await loginMethodRepository.findOne({ where: { name: "email" } });
    if (!foundLoginMethod) {
      res.status(400).json({
        success: false,
        msg: 'Invalid login method',
      });
      return;
    }

    // find the role by its ID
    const foundRole = await roleRepository.findOne({ where: { name: "user" } });
    if (!foundRole) {
      res.status(400).json({
        success: false,
        msg: 'Invalid role',
      });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create a new user with the login method
    const newUser = userRepository.create({
      username,
      email,
      password: hash,
      loginMethod: foundLoginMethod.id,
      role: foundRole.id,
      date: new Date(),
    });
    await userRepository.save(newUser);

    res.status(201).json({ success: true, userID: newUser.id, msg: 'The user was successfully registered' });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});


router.post('/login', (req, res) => {
  // Joy Validation
  const result = userSchema.validate(req.body);
  if (result.error) {
    res.status(422).json({
      success: false,
      msg: `Validation err: ${result.error.details[0].message}`,
    });
    return;
  }

  const { email } = req.body;
  const { password } = req.body;

  const userRepository = connection!.getMongoRepository(User);
  const activeSessionRepository = connection!.getMongoRepository(ActiveSession);
  userRepository.findOne({ where: { email: email } }).then((user) => {
    if (!user) {
      return res.json({ success: false, msg: 'Wrong credentials' });
    }

    if (!user.password) {
      return res.json({ success: false, msg: 'No password' });
    }

    bcrypt.compare(password, user.password, (_err2, isMatch) => {
      if (isMatch) {
        if (!process.env.SECRET) {
          throw new Error('SECRET not provided');
        }

        const token = jwt.sign({
          id: user.id,
          username: user.username,
          email: user.email,
        }, process.env.SECRET, {
          expiresIn: 86400, // 1 week
        });

        const query = { userId: user.id.toHexString(), token };

        activeSessionRepository.save(query);
        // Delete the password (hash)
        (user as { password: string | undefined }).password = undefined;
        return res.json({
          success: true,
          token,
          user,
        });
      }
      return res.json({ success: false, msg: 'Wrong credentials' });
    });
  });
});

router.post('/logout', checkToken, logoutUser);

router.post('/checkSession', checkToken, (_req, res) => {
  res.json({ success: true });
});

router.post('/all', checkToken, (_req, res) => {
  const userRepository = connection!.getMongoRepository(User);

  userRepository.find({}).then((users) => {
    users = users.map((item) => {
      const x = item;
      (x as { password: string | undefined }).password = undefined;
      return x;
    });
    res.json({ success: true, users });
  }).catch(() => res.json({ success: false }));
});

router.post('/edit', checkToken, (req, res) => {
  const { userID, username, email } = req.body;

  const userRepository = connection!.getMongoRepository(User);

  userRepository.find({ id: userID }).then((user) => {
    if (user.length === 1) {
      const query = { id: user[0].id };
      const newvalues = { username, email };
      userRepository.update(query, newvalues).then(
        () => {
          res.json({ success: true });
        },
      ).catch(() => {
        res.json({ success: false, msg: 'There was an error. Please contract the administrator' });
      });
    } else {
      res.json({ success: false, msg: 'Error updating user' });
    }
  });
});

// Used for tests (nothing functional)
router.get('/testme', (_req, res) => {
  console.log('testme');
  res.status(200).json({ success: true, msg: 'all good' });
});

export default router;
