import {Stripe} from 'stripe'

type CtxItem = {
  setupIntent: Stripe.SetupIntent,
  customer: Stripe.Customer,
  characters: string[]
}

type CtxStore = Record<string, CtxItem>

let ctxStore: CtxStore = {}

export const initSession = (sessionId: string, setupIntent: Stripe.SetupIntent, customer: Stripe.Customer) => {
  ctxStore[sessionId] = {
    setupIntent,
    customer,
    characters: []
  }
}

export const addItem = (sessionId: string, c: string) => {
  const content = ctxStore[sessionId]
  ctxStore[sessionId] = {
    ...content,
    characters: [...content.characters, c]
  }
}

export const getItem = (sessionId: string) =>
  ctxStore[sessionId] ?? null

export const exists = (sessionId: string) => 
  ctxStore[sessionId] ? true : false

