module.exports = {
  async up(db) {
    const collection = db.collection('districts')
    const cursor = collection.find({"boundaries.type": "Polygon"})
    for await (const doc of cursor) {
      await collection.update({_id: doc._id},{
        ...doc,
        boundaries: {
          type: 'MultiPolygon',
          coordinates: [doc.boundaries.coordinates]
        }
      })
    }
  },

  async down(db, client) {
    const collection = db.collection('districts')
    const cursor = collection.find({"boundaries.type": "MultiPolygon"})
    for await (const doc of cursor) {
      await collection.update({_id: doc._id},{
        ...doc,
        boundaries: {
          type: 'Polygon',
          coordinates: doc.boundaries.coordinates[0]
        }
      })
    }
  }
};
