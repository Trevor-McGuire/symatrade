import express from 'express';
import { githubOauthHandler, googleOauthHandler } from '../controllers/auth.controller';

const router = express.Router();

router.get('/oauth/github', githubOauthHandler);
router.get('/oauth/google', googleOauthHandler);

export default router;
