import request from 'supertest';
import app from '../../src/server';
import { connect, connection } from '../../src/server/database';
import { getMongoRepository } from 'typeorm';
import { LoginMethod, Role, User } from '../../src/models';
import { getConnection } from 'typeorm';

// should pass
//   test('should register a new user', async () => {

// should fail

//   username
//   test('should fail when the username is already in use', async () => {
//   test('should fail when the username is too short', async () => {
//   test('should fail when the username is too long', async () => {

//   email
//   test('should fail when the email is invalid', async () => {
//   test('should fail when the email is already in use', async () => {

//   password
//   test('should fail when the password is too short', async () => {
//   test('should fail when the password is too long', async () => {


beforeAll(async () => {
  await connect();
});

afterAll(async () => connection?.close());

describe('User registration', () => {
  test('should register a new user', async () => {
    const timestamp = Date.now();
    const newUser = {
      username: 't' + timestamp,
      email: 'testuser' + timestamp + '@test.com',
      password: 'testpassword',
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);

    // Fetch the user from the database
    const connection = getConnection();
    const userRepository = connection.getMongoRepository(User);
    const savedUser = await userRepository.findOne({
      where: { username: newUser.username },
      relations: ["loginMethod", "role"]
    });

    if (!savedUser) {
      throw new Error('User not found');
    }

    // Check if the user's loginMethod and role are as expected
    const loginMethod = await getMongoRepository(LoginMethod).findOne({ where: { name: 'email' } });
    const role = await getMongoRepository(Role).findOne({ where: { name: 'user' } });
    if (!loginMethod || !role) {
      throw new Error('Login method or role not found');
    }
    expect(savedUser.loginMethod.toHexString()).toEqual(loginMethod.id.toHexString());
    expect(savedUser.role.toHexString()).toEqual(role.id.toHexString());
  });
  test('should fail when the username is too short', async () => {
    const newUser = {
      username: 't',
      email: 'user@test.com',
      password: 'testpassword',
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(newUser);

    expect(response.statusCode).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe('Validation err: "username" length must be at least 4 characters long');
  });
  test('should fail when the email is invalid', async () => {
    const newUser = {
      username: 'testuser',
      email: 'usertest.com',
      password: 'testpassword',
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(newUser);

    expect(response.statusCode).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe('Validation err: "email" must be a valid email');
  });
  test('should fail when the email is already in use', async () => {
    const timestamp = Date.now();
    const newUserA = {
      username: 'A' + timestamp,
      email: 'test' + timestamp + '@test.com',
      password: 'testpassword',
    };

    const newUserB = {
      username: 'B' + timestamp,
      email: 'test' + timestamp + '@test.com',
      password: 'testpassword',
    };

    const responseA = await request(app)
      .post('/api/users/register')
      .send(newUserA);

    expect(responseA.statusCode).toBe(201);
    expect(responseA.body.success).toBe(true);

    const responseB = await request(app)
      .post('/api/users/register')
      .send(newUserB);

    expect(responseB.statusCode).toBe(400);
    expect(responseB.body.success).toBe(false);
    expect(responseB.body.msg).toBe('Email already exists');
  });
  test('should fail when the username is already in use', async () => {
    const timestamp = Date.now();
    const newUserA = {
      username: 'A' + timestamp,
      email: 'test' + timestamp + '@test.com',
      password: 'testpassword',
    };

    const newUserB = {
      username: 'A' + timestamp,
      email: 'test' + timestamp + '@test.com',
      password: 'testpassword',
    };

    const responseA = await request(app)
      .post('/api/users/register')
      .send(newUserA);

    expect(responseA.statusCode).toBe(201);
    expect(responseA.body.success).toBe(true);

    const responseB = await request(app)
      .post('/api/users/register')
      .send(newUserB);

    expect(responseB.statusCode).toBe(400);
    expect(responseB.body.success).toBe(false);
    expect(responseB.body.msg).toBe('Username already exists');
  });
  test('should fail when the username is too long', async () => {
    const timestamp = Date.now();
    const newUser = {
      username: 't'.repeat(33),
      email: 'test' + timestamp + '@test.com',
      password: 'testpassword',
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(newUser);

    expect(response.statusCode).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe('Validation err: "username" length must be less than or equal to 32 characters long');
  });
  test('should fail when the password is too short', async () => {
    const timestamp = Date.now();
    const newUser = {
      username: 'testuser' + timestamp,
      email: 'test' + timestamp + '@test.com',
      password: 't',
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(newUser);

    expect(response.statusCode).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe('Validation err: "password" length must be at least 6 characters long');
  });
  test('should fail when the password is too long', async () => {
    const timestamp = Date.now();
    const newUser = {
      username: 'testuser' + timestamp,
      email: 'test' + timestamp + '@test.com',
      password: 't'.repeat(73),
    };

    const response = await request(app)
      .post('/api/users/register')
      .send(newUser);

    expect(response.statusCode).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe('Validation err: "password" length must be less than or equal to 72 characters long');
  });


});