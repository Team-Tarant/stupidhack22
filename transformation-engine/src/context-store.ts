
type CtxStore = Record<string, string[]>

let ctxStore: CtxStore = {}

export const setItem = (sessionId: string, c: string) => {
  ctxStore[sessionId] = ctxStore[sessionId] ? [c] : [...ctxStore[sessionId], c]
}

export const getItem = (sessionId: string) =>
  ctxStore[sessionId] ?? null

