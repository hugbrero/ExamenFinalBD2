const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const URI = 'mongodb://localhost:27017';
const DB_NAME = 'apple_music_db';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let cachedClient = null;
let cachedDb = null;

async function getDb() {
  if (cachedDb) return cachedDb;

  const client = new MongoClient(URI);
  await client.connect();
  cachedClient = client;
  cachedDb = client.db(DB_NAME);
  console.log('✅ Conectado a MongoDB desde API');
  return cachedDb;
}

/**
 * 1) ROYALTIES POR ARTISTA
 * GET /api/royalties?days=30
 */
app.get('/api/royalties', async (req, res) => {
  try {
    const days = parseInt(req.query.days || '30', 10);
    const db = await getDb();

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const pipeline = [
      { $match: { date: { $gte: since } } },
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
    res.json(result);
  } catch (err) {
    console.error('Error /api/royalties:', err);
    res.status(500).json({ error: 'Error interno en royalties' });
  }
});

/**
 * 2) TOP 10 CANCIONES POR PAÍS
 * GET /api/top-songs?country=GT&days=7
 */
app.get('/api/top-songs', async (req, res) => {
  try {
    const days = parseInt(req.query.days || '7', 10);
    const country = req.query.country || 'GT';
    const db = await getDb();

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const pipeline = [
      { $match: { date: { $gte: since } } },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $match: { 'user.country': country } },
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
    res.json(result);
  } catch (err) {
    console.error('Error /api/top-songs:', err);
    res.status(500).json({ error: 'Error interno en top-songs' });
  }
});

/**
 * 3) USUARIOS ZOMBIES (PREMIUM SIN ACTIVIDAD)
 * GET /api/zombies?days=30&subscription=Premium
 */
app.get('/api/zombies', async (req, res) => {
  try {
    const days = parseInt(req.query.days || '30', 10);
    const subscription = req.query.subscription || 'Premium';
    const db = await getDb();

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const pipeline = [
      { $match: { subscription } },
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
                    { $gte: ['$date', since] }
                  ]
                }
              }
            }
          ],
          as: 'recent_streams'
        }
      },
      { $match: { recent_streams: { $size: 0 } } },
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
    res.json(result);
  } catch (err) {
    console.error('Error /api/zombies:', err);
    res.status(500).json({ error: 'Error interno en zombies' });
  }
});

/**
 * 4) DEMOGRAFÍA DE REGGAETON
 * GET /api/demografia/reggaeton
 */
app.get('/api/demografia/reggaeton', async (req, res) => {
  try {
    const db = await getDb();

    const pipeline = [
      {
        $lookup: {
          from: 'songs',
          localField: 'song_id',
          foreignField: '_id',
          as: 'song'
        }
      },
      { $unwind: '$song' },
      { $match: { 'song.genre': 'Reggaeton' } },
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
        $group: {
          _id: '$user._id',
          birth_date: { $first: '$user.birth_date' }
        }
      },
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
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [15, 21, 31, 41, 51],
          default: '51+',
          output: {
            users_count: { $sum: 1 }
          }
        }
      },
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
    res.json(result);
  } catch (err) {
    console.error('Error /api/demografia/reggaeton:', err);
    res.status(500).json({ error: 'Error interno en demografía' });
  }
});

/**
 * 5) HEAVY USERS BAD BUNNY
 * GET /api/heavy-users/badbunny?limit=5
 */
app.get('/api/heavy-users/badbunny', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '5', 10);
    const db = await getDb();

    const pipeline = [
      {
        $lookup: {
          from: 'songs',
          localField: 'song_id',
          foreignField: '_id',
          as: 'song'
        }
      },
      { $unwind: '$song' },
      { $match: { 'song.artist_name': 'Bad Bunny' } },
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
      { $limit: limit },
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
    res.json(result);
  } catch (err) {
    console.error('Error /api/heavy-users/badbunny:', err);
    res.status(500).json({ error: 'Error interno en heavy-users' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API escuchando en http://localhost:${PORT}`);
});

// Cerrar conexión limpia al terminar
process.on('SIGINT', async () => {
  if (cachedClient) {
    await cachedClient.close();
    console.log('\n🛑 Conexión a Mongo cerrada');
  }
  process.exit(0);
});
