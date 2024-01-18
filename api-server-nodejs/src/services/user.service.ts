import jwt from "jsonwebtoken";
import User from "../models/user/user";
import Role from '../models/user/role'
import ActiveSession from "../models/user/activeSession";
import { connection } from "../server/database";
import { DEFAULT_ROLE } from '../constants'


export const createUserWithToken = async (userData: any) => {
  console.log("userData", userData);
  const userRole = DEFAULT_ROLE
  const userRepository = connection!.getMongoRepository(User);
  const activeSessionRepository = connection!.getMongoRepository(ActiveSession);
  const roleRepository = connection!.getMongoRepository(Role)

  let { login: username, email } = userData;
  console.log("username", username, "email", email);
  let requiredUser: any = null;

  const user = await userRepository.findOne({ where: { username: username } });
  console.log("user", user);
  const role = await roleRepository.findOne({ where: { name: 'user' } });
  console.log("rolee", role);
  if (!role) {
    console.log("no role exists for user in db");
    throw new Error(`no role exists for ${userRole} in db`)
  }

  if (user) {
    requiredUser = user;
  } else {
    const query = {
      username,
      email,
      user_role: role.id.toHexString()
    };
    const u = await userRepository.save(query)
    requiredUser = u;
  }

  if (!process.env.SECRET) {
    throw new Error("SECRET not provided");
  }

  if (requiredUser) {
    const token: any = jwt.sign(
      {
        id: requiredUser.id,
        username: requiredUser.username,
      },
      process.env.SECRET,
      {
        expiresIn: 86400, // 1 week
      }
    );
    const query = { userId: requiredUser.id, token };
    activeSessionRepository.save(query);
    requiredUser.token = token;
  }
  return requiredUser;
};
