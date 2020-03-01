module.exports = {
  async up(db, client) {
    await db.collection('users').createIndex(
      { email: 1 },
      { unique: true }
    )
  },

  async down(db, client) {
    await db.collection('users').dropIndex(
      { email: 1 },
      { unique: true }
    )
  }
}
