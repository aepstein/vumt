const config = require('config')
const mongoURI = config.mongoURI
const mongoDb = config.mongoDb

// In this file you can configure migrate-mongo

const migrationsConfig = {
  mongodb: {
    url: mongoURI,
    databaseName: mongoDb,

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    }
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: "db/migrations",

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: "changelog"
}

// Return the config as a promise
module.exports = migrationsConfig
