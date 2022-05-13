import * as express from 'express'

type Response = {
  status: number
  body: Record<string, any>
  url?: string
}

export const handleRequest =
  (handler: (req: express.Request) => Promise<Response>) =>
  async (req: express.Request, res: express.Response) => {
    try {
      const response = await handler(req)
      if (response.status === 302) {
        return res.redirect(response.url!)
      }
      res.status(response.status).json(response.body)
    } catch (e) {
      console.log(e)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
