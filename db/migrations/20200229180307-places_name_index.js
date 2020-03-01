module.exports = {
  async up(db, client) {
    await db.collection('places').createIndex(
      { name: 1 },
      { unique: true }
    )
  },

  async down(db, client) {
    await db.collection('places').dropIndex(
      { name: 1 },
      { unique: true }
    )
  }
}
