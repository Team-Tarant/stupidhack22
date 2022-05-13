import express from 'express'
import { handleRequest } from './utils/request-handler'
import { v4 } from 'uuid'
import { generateTypo } from './typogen'
import {setItem} from './context-store'

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
  handleRequest(async req => {
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
    const character = req.query?.char?.toString()?.trim() ?? null
    const sessionId = req.query?.sessionId?.toString() ?? null
    
    if (!character || character.length === 0) {
      return {
        status: 400,
        body: {
          message: 'No chatacter given or empty'
        }
      }
    }

    const typo = generateTypo(character)

    if (!sessionId) {
      return {
        status: 401,
        body: {
          message: 'Pls request a session id first and then try again :)'
        }
      }
    }

    setItem(sessionId, character)

    return {
      status: 200,
      body: typo,
    }
  })
)

app.listen(PORT, () => console.log('App listening on', PORT))
