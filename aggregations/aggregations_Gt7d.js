const { MongoClient } = require('mongodb');

const URI = 'mongodb://localhost:27017';
const DB_NAME = 'apple_music_db';

async function main() {
  const client = new MongoClient(URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const pipeline = [
      {
        $match: {
          date: { $gte: last7Days }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $match: {
          'user.country': 'GT' // o el código que uses en el seed
        }
      },
      {
        $lookup: {
          from: 'songs',
          localField: 'song_id',
          foreignField: '_id',
          as: 'song'
        }
      },
      { $unwind: '$song' },
      {
        $group: {
          _id: '$song._id',
          title: { $first: '$song.title' },
          artist_name: { $first: '$song.artist_name' },
          genre: { $first: '$song.genre' },
          play_count: { $sum: 1 }
        }
      },
      { $sort: { play_count: -1 } },
      { $limit: 10 }
    ];

    const result = await db.collection('streams').aggregate(pipeline).toArray();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error ejecutando aggregation Gt7d:', error);
  } finally {
    await client.close();
  }
}

main();
