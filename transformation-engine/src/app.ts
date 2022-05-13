import express from 'express'
import { handleRequest } from './utils/request-handler'
import { v4 } from 'uuid'
import { generateTypo } from './typogen'

const app = express()
const PORT = process.env.PORT || 8080

app.get(
  '/',
  handleRequest(async req => {
    return {
      status: 200,
      body: {
        wtf: true,
      },
    }
  })
)

app.get(
  '/session',
  handleRequest(async eq => {
    const sid = v4()
    return {
      status: 200,
      body: {
        sessionId: sid,
      },
    }
  })
)

app.get(
  '/typo',
  handleRequest(async req => {
    const typo = generateTypo(req.query?.char?.toString())
    return {
      status: 200,
      body: {
        typo,
      },
    }
  })
)

app.listen(PORT, () => console.log('App listening on', PORT))
