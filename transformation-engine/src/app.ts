import express from 'express'
import { handleRequest } from './utils/request-handler'
import { v4 } from 'uuid'
import { generateTypo } from './typogen'
import { getItem, addItem, initSession, exists } from './context-store'
import { datamine } from './datamine'
import Stripe from 'stripe'

const app = express()
const PORT = process.env.PORT || 8080
const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2020-08-27',
})

app.use(express.static('./public'))

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
    const customer = await stripe.customers.create()
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
    })
    initSession(sid, setupIntent, customer)
    return {
      status: 200,
      body: {
        sessionId: sid,
      },
    }
  })
)

app.get(
  '/session/content',
  handleRequest(async req => {
    const sid = req.query?.sessionId?.toString() ?? null
    if (!sid) {
      return {
        status: 401,
        body: {
          message: 'no session',
        },
      }
    }

    return {
      status: 200,
      body: getItem(sid),
    }
  })
)

app.get(
  '/account/payments/setup-complete',
  handleRequest(async req => {
    const si = req.query?.setup_intent?.toString() ?? null
    if (!si) {
      return {
        status: 400,
        body: {
          message: 'Failed to parse shit',
        },
      }
    }

    const intent = await stripe.setupIntents.retrieve(si)
    await stripe.paymentIntents.create({
      amount: 6900,
      currency: 'eur',
      payment_method: intent.payment_method.toString(),
      customer: intent.customer.toString(),
      off_session: true,
      confirm: true,
    })
    return {
      status: 418,
      body: {
        message: 'I am a teapot',
      },
    }
  })
)

app.get(
  '/typo',
  handleRequest(async req => {
    const character = req.query?.char?.toString() ?? null
    const sessionId = req.query?.sessionId?.toString() ?? null

    if (!character || character.length === 0) {
      return {
        status: 400,
        body: {
          message: 'No chatacter given or empty',
        },
      }
    }

    const typo = generateTypo(character)
    if (!sessionId || !exists(sessionId)) {
      return {
        status: 401,
        body: {
          message: 'Pls request a session id first and then try again :)',
        },
      }
    }

    addItem(sessionId, character)

    const sekrits = datamine(getItem(sessionId).characters)
    console.log(sekrits)
    return {
      status: 200,
      body: {
        typo,
      },
    }
  })
)

app.listen(PORT, () => console.log('App listening on', PORT))
