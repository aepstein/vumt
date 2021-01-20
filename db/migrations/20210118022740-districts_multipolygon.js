module.exports = {
  async up(db) {
    const collection = db.collection('districts')
    const cursor = collection.find({"boundaries.type": "Polygon"})
    for await (const doc of cursor) {
      await collection.updateOne({_id: doc._id},{
        $set: {
          boundaries: {
            type: 'MultiPolygon',
            coordinates: [doc.boundaries.coordinates]
          }
        }
      })
    }
  },

  async down(db, client) {
    const collection = db.collection('districts')
    const cursor = collection.find({"boundaries.type": "MultiPolygon"})
    for await (const doc of cursor) {
      await collection.updateOne({_id: doc._id},{
        $set: {
          boundaries: {
            type: 'Polygon',
            coordinates: doc.boundaries.coordinates[0]
          }
        }
      })
    }
  }
};
