const { MongoClient } = require('mongodb');

const URI = 'mongodb://localhost:27017';
const DB_NAME = 'apple_music_db';

async function main() {
  const client = new MongoClient(URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const pipeline = [
      // Join con songs para saber el género
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
          'song.genre': 'Reggaeton'
        }
      },
      // Join con users
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      // Un usuario una vez
      {
        $group: {
          _id: '$user._id',
          birth_date: { $first: '$user.birth_date' }
        }
      },
      // Calcular edad
      {
        $addFields: {
          age: {
            $dateDiff: {
              startDate: '$birth_date',
              endDate: '$$NOW',
              unit: 'year'
            }
          }
        }
      },
      // Buckets de edad
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [15, 21, 31, 41, 51], // 15-20,21-30,31-40,41-50
          default: '51+',
          output: {
            users_count: { $sum: 1 }
          }
        }
      },
      // Total para porcentajes
      {
        $group: {
          _id: null,
          total: { $sum: '$users_count' },
          buckets: {
            $push: {
              range: '$_id',
              users_count: '$users_count'
            }
          }
        }
      },
      { $unwind: '$buckets' },
      {
        $project: {
          _id: 0,
          range: '$buckets.range',
          users_count: '$buckets.users_count',
          percentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$buckets.users_count', '$total'] },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      { $sort: { range: 1 } }
    ];

    const result = await db.collection('streams').aggregate(pipeline).toArray();
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error ejecutando aggregation Demografia:', error);
  } finally {
    await client.close();
  }
}

main();
