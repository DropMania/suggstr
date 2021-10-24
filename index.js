import express from 'express'
const app = express()
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import monk from 'monk'
import createId from './createId.mjs'
import SpotifyWebApi from 'spotify-web-api-node'
dotenv.config()
let db = monk(process.env.MONGO_URI)
let party = db.get('party')
app.use(express.json())
app.use(express.static('public/public'))
app.get('/login', function (req, res) {
    let scopes = 'user-modify-playback-state'
    res.redirect(
        'https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' +
            process.env.CLIENT_ID +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            '&redirect_uri=' +
            encodeURIComponent(process.env.REDIRECT_URI)
    )
})
app.get('/callback', async (req, res) => {
    let { code } = req.query
    let params = new URLSearchParams()
    params.append('grant_type', 'authorization_code')
    params.append('code', code)
    params.append('redirect_uri', process.env.REDIRECT_URI)
    let response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
                `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
            ).toString('base64')}`
        },
        body: params
    })
    let data = await response.json()
    res.redirect(`/#/create?token=${data.refresh_token}`)
})
app.post('/create', async (req, res) => {
    let data = req.body
    let partyId = createId(8)
    let doc = await party.insert({ ...data, partyId })
    res.json(doc)
})
app.get('/search', async (req, res) => {
    let { q, p } = req.query
    let partyData = await party.findOne({ partyId: p })
    let api = new SpotifyWebApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: process.env.REDIRECT_URI,
        refreshToken: partyData.token
    })
    let result = await api.refreshAccessToken()
    api.setAccessToken(result.body.access_token)
    if (q) {
        let data = await api.searchTracks(q)
        res.json(
            data.body.tracks.items.map((song) => ({
                id: song.id,
                name: song.name,
                artist: song.artists[0].name,
                album: song.album.name,
                image: song.album.images[0].url,
                uri: song.uri
            }))
        )
    } else {
        res.json([])
    }
})
app.get('/addSong', async (req, res) => {
    let { uri, p } = req.query
    let partyData = await party.findOne({ partyId: p })
    let api = new SpotifyWebApi({
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: process.env.REDIRECT_URI,
        refreshToken: partyData.token
    })
    let result = await api.refreshAccessToken()
    api.setAccessToken(result.body.access_token)
    let data = await api.addToQueue(uri)
    res.json(data)
})
app.get('/exists', async (req, res) => {
    let { p } = req.query
    let partyData = await party.findOne({ partyId: p })
    res.json(!!partyData)
})
app.listen(process.env.PORT || 8000, () => {
    console.log('Example app listening on port 8000!')
})
