import * as express from 'express'
import { handleRequest } from './utils/request-handler'

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

app.listen(PORT, () => console.log('App listening on', PORT))
