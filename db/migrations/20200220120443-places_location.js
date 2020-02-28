module.exports = {
  async up(db, client) {
    await db.collection('places').createIndex(
      { location: '2dsphere' }
    )
  },

  async down(db, client) {
    await db.collection('places').dropIndex(
      { location: '2dsphere' }
    )
  }
};
