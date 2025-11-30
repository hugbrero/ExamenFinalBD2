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
          subscription: 'Premium'
        }
      },
      {
        $lookup: {
          from: 'streams',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$user_id', '$$userId'] },
                    { $gte: ['$date', last30Days] }
                  ]
                }
              }
            }
          ],
          as: 'recent_streams'
        }
      },
      {
        $match: {
          recent_streams: { $size: 0 }
        }
      },
      {
        $project: {
          _id: 0,
          user_id: '$_id',
          username: 1,
          email: 1,
          country: 1,
          subscription: 1,
          created_at: 1
        }
      }
    ];

    const result = await db.collection('users').aggregate(pipeline).toArray();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error ejecutando aggregation Zombies:', error);
  } finally {
    await client.close();
  }
}

main();
