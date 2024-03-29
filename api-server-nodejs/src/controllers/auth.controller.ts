import { Request, Response } from 'express';
import {
  getGithubOathToken,
  getGithubUser,
  getGoogleOathToken,
  getGoogleUser,
} from '../services/session.service';
import { createUserWithToken } from '../services/user.service';

export const githubOauthHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.json({ error: 'authorization code not provided' })
    }
    // Get access_token using code
    const { access_token } = await getGithubOathToken({ code });
    // Get user details using access token
    const userData = await getGithubUser({ access_token });
    const returnedUser = await createUserWithToken(userData)
    res.json({ user: returnedUser })
  } catch (err: any) {
    res.json({ 'error': err.message })
  }
};

export const googleOauthHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    console.log("hello")
    const code = req.query.code as string;
    if (!code) {
      return res.json({ error: 'authorization code not provided' })
    }
    // Get access_token using code
    console.log("before")
    const { access_token } = await getGoogleOathToken({ code });
    console.log("after")
    // Get user details using access token
    const userData = await getGoogleUser({ access_token });
    const returnedUser = await createUserWithToken(userData)
    res.json({ user: returnedUser })
  } catch (err: any) {
    res.json({ 'error': err.message })
  }
};


