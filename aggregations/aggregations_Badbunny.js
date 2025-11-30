const { MongoClient } = require('mongodb');

const URI = 'mongodb://localhost:27017';
const DB_NAME = 'apple_music_db';

async function main() {
  const client = new MongoClient(URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const pipeline = [
      // Join con songs para saber el artista
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
        $match: {
          'song.artist_name': 'Bad Bunny'
        }
      },
      {
        $group: {
          _id: '$user_id',
          distinct_songs: { $addToSet: '$song._id' }
        }
      },
      {
        $project: {
          user_id: '$_id',
          distinct_songs_count: { $size: '$distinct_songs' }
        }
      },
      { $sort: { distinct_songs_count: -1 } },
      { $limit: 5 },
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
        $project: {
          _id: 0,
          user_id: 1,
          username: '$user.username',
          email: '$user.email',
          country: '$user.country',
          distinct_songs_count: 1
        }
      }
    ];

    const result = await db.collection('streams').aggregate(pipeline).toArray();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error ejecutando aggregation Badbunny:', error);
  } finally {
    await client.close();
  }
}

main();
