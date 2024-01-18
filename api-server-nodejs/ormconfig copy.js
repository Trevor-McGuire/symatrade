module.exports = {
  type: "mongodb",
  url: process.env.MONGODB_URI,
  synchronize: true,
  logging: false,
  entities: [
    "src/models/**/*.ts"
  ],
  migrations: [
    "src/migration/**/*.ts"
  ],
  // subscribers: [
  //   "src/subscriber/**/*.ts"
  // ],
  cli: {
    entitiesDir: "src/models",
    migrationsDir: "src/migration",
    // subscribersDir: "src/subscriber"
  }
};