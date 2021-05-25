export const compose = (...fns: ((payload: any) => any)[]) => {
  return (payload: any) => {
    return fns.reduce((buf, fn) => {
      return fn(buf)
    }, payload)
  }
}
