module.exports = {
  async up(db, client) {
    await db.collection('organizations').createIndex(
      {name: 1},
      {unique: true}
    )
  },

  async down(db, client) {
    await db.collection('organizations').dropIndex(
      {name: 1},
      {unique: true}
    )
  }
};
