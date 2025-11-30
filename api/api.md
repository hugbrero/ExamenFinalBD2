# API Reference – Apple Music Analytics
## 1) GET /api/royalties
Obtiene el tiempo total reproducido por artista.
### Ejemplo:
GET /api/royalties?days=30
### Respuesta:
[
{
"artist_id": "692b9cbb9f814b52df23f687",
"artist_name": "Bad Bunny",
"genre": "Reggaeton",
"total_seconds": 227341
}
]
---
## 2) GET /api/top-songs?country=GT&days;=7
Top 10 canciones por país.
### Ejemplo:
GET /api/top-songs?country=GT&days;=7
### Respuesta:
[
{
"title": "Tití Me Preguntó",
"artist_name": "Bad Bunny",
"genre": "Reggaeton",
"play_count": 150
}
]
---
## 3) GET /api/zombies?days=30&subscription;=Premium
Usuarios sin actividad reciente.
### Ejemplo:
GET /api/zombies?days=30&subscription;=Premium
### Respuesta:
[
{
"user_id": "64ffabcd1234ef5678901111",
"username": "juan_premium",
"email": "juan@example.com"
}
]
---
## 4) GET /api/demografia/reggaeton
Distribución de edades de oyentes de reggaeton.
### Ejemplo:
GET /api/demografia/reggaeton
### Respuesta:
[
{
"range": 21,
"users_count": 30,
"percentage": 60.0
}
]
---
## 5) GET /api/heavy-users/badbunny?limit=5
Usuarios con más canciones distintas escuchadas de Bad Bunny.
### Ejemplo:
GET /api/heavy-users/badbunny?limit=5
### Respuesta:
[
{
"user_id": "64ffaa111122223333444401",
"username": "superfan_gt",
"distinct_songs_count": 18
}
]