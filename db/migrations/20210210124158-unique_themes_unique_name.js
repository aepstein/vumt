module.exports = {
  async up(db, client) {
    await db.collection('themes').createIndex(
      {name: 1},
      {unique: true}
    )
  },

  async down(db, client) {
    await db.collection('themes').dropIndex(
      {name: 1},
      {unique: true}
    )
  }
};
