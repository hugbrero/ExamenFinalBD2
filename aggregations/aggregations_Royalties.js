const { MongoClient } = require('mongodb');

const URI = 'mongodb://localhost:27017';
const DB_NAME = 'apple_music_db';

async function main() {
  const client = new MongoClient(URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const pipeline = [
      {
        $match: {
          date: { $gte: last30Days } // campo de streams
        }
      },
      {
        $group: {
          _id: '$artist_id',
          total_seconds: { $sum: '$seconds_played' }
        }
      },
      {
        $lookup: {
          from: 'artists',
          localField: '_id',
          foreignField: '_id',
          as: 'artist'
        }
      },
      { $unwind: '$artist' },
      {
        $project: {
          _id: 0,
          artist_id: '$_id',
          artist_name: '$artist.name',
          genre: '$artist.genre',
          total_seconds: 1
        }
      },
      { $sort: { total_seconds: -1 } }
    ];

    const result = await db.collection('streams').aggregate(pipeline).toArray();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error ejecutando aggregation Royalties:', error);
  } finally {
    await client.close();
  }
}

main();
