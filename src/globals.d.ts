declare module NodeJS {
  interface Global {
    texts: {
      log: (...args: any[]) => void
    }
  }
}
