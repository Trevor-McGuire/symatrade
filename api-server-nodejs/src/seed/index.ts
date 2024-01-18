import { roles } from './roles';
import { loginMethods } from './loginMethods';
import { users } from './users';

export async function seedRoles() {
  console.log('seedRoles called');
  await roles();
  console.log('seedRoles done');
}

export async function seedLoginMethod() {
  console.log('seedLoginMethod called');
  await loginMethods();
  console.log('seedLoginMethod done');
}

export async function clearUsers() {
  console.log('seedUsers called');
  await users();
  console.log('seedUsers done');
}

seedLoginMethod();
seedRoles();
clearUsers();
