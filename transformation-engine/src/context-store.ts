import { TrieNode } from '@datastructures-js/trie'
import { Stripe } from 'stripe'

type CtxItem = {
  setupIntent: Stripe.SetupIntent
  customer: Stripe.Customer
  characters: string[]
  lastNameMatchingValue: string,
  alreadyScammed: boolean
}

type CtxStore = Record<string, CtxItem>

let ctxStore: CtxStore = {}

export const initSession = (
  sessionId: string,
  setupIntent: Stripe.SetupIntent,
  customer: Stripe.Customer
) => {
  ctxStore[sessionId] = {
    setupIntent,
    customer,
    characters: [],
    lastNameMatchingValue: '',
    alreadyScammed: false
  }
}

export const addItem = (sessionId: string, c: string) => {
  const content = ctxStore[sessionId]
  ctxStore[sessionId] = {
    ...content,
    characters: [...(content?.characters ? content.characters : ''), c],
  }
}

export const setScammed = (sessionId: string, scammed: boolean) => {
  const content = ctxStore[sessionId]
  ctxStore[sessionId] = {
    ...content,
    alreadyScammed: scammed
  }
}

export const addMatching = (sessionId: string, c: string) => {
  const content = ctxStore[sessionId]

  ctxStore[sessionId] = {
    ...content,
    lastNameMatchingValue: c,
  }
}

export const getItem = (sessionId: string) => ctxStore[sessionId] ?? null

export const exists = (sessionId: string) =>
  ctxStore[sessionId] ? true : false
