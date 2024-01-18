import request from 'supertest';
import app from '../../src/server';
import nock from 'nock';
import { getMongoRepository } from 'typeorm';
import { User } from '../../src/models';
import { connect, connection } from '../../src/server/database';

beforeAll(async () => {
  await connect();
});

afterAll(async () => connection?.close());

// Setup the mock OAuth server and GitHub API
nock('https://github.com')
  .get('/login/oauth/authorize')
  .reply(302, { location: 'https://your-app.com/callback?code=1234' });

nock('https://github.com')
  .post('/login/oauth/access_token', { client_id: 'your-client-id', client_secret: 'your-client-secret', code: '1234' })
  .reply(200, { access_token: 'abcd' });

nock('https://api.github.com')
  .get('/user')
  .reply(200, { id: 1, login: 'github-user', email: 'github-user@example.com' });

// Test the OAuth request
it('should redirect to GitHub', async () => {
  const response = await request(app).get('/oauth/github');
  expect(response.statusCode).toBe(302);
  expect(response.headers.location).toBe('https://github.com/login/oauth/authorize');
});

// Test the OAuth response
it('should exchange code for access token', async () => {
  const response = await request(app).get('/callback?code=1234');
  expect(response.statusCode).toBe(200);
});

// Test the user creation
it('should create a new user', async () => {
  const userRepository = getMongoRepository(User);
  const user = await userRepository.findOne({ where: { username: 'github-user' } });
  if (!user) {
    throw new Error('User not found');
  }
  expect(user).toBeDefined();
  expect(user.username).toBe('github-user');
});