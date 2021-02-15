const {ObjectId} = require('mongodb')

module.exports = {
  async up(db, client) {
    const advisory = await db.collection('advisories').findOne({})
    if (advisory) {
      const existingTheme = await db.collection('themes').findOne({})
      const theme = existingTheme ? existingTheme :
        await db.collection('themes').insertOne({name: 'Notice', color: 'info', labels: []})
      const themeId = theme._id ? theme._id : theme.insertedId
      console.log(themeId)
      await db.collection('advisories').updateMany({},{$set: {theme: ObjectId(themeId)}})
    }
  },

  async down(db, client) {
    await db.collection('advisories').updateMany({},{$unset: {theme: ''}})
  }
};
