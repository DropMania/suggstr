import express from 'express'
const app = express()
import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

app.use(express.static('public/public'))
app.get('/login', function (req, res) {
    let scopes = 'user-read-private user-read-email'
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
    console.log(req)
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
    res.redirect(`/#create?token=${data.refresh_token}`)
})

app.listen(8000, () => {
    console.log('Example app listening on port 8000!')
})
