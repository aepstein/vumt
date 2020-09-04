module.exports = {
  async up(db, client) {
    await db.collection('districts').createIndex(
      { boundaries: '2dsphere' }
    )
  },

  async down(db, client) {
    await db.collection('districts').dropIndex(
      { boundaries: '2dsphere' }
    )
  }
};
