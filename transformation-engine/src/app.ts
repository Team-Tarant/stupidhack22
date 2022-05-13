import express from 'express'

const app = express()
const PORT = process.env.PORT || 8080

app.get('/', (req, res) => res.json({wtf: true}))

app.listen(PORT, () => console.log('App listening on', PORT))

