import express from 'express'
import { handleRequest } from './utils/request-handler'
import {v4} from 'uuid'

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

app.get('/session', handleRequest(async eq => {
  const sid = v4()
  return {
    status: 200,
    body: {
      sessionId: sid
    }
  }
}))

app.listen(PORT, () => console.log('App listening on', PORT))
