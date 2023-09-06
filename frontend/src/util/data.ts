export const data = <T>(initialValue: T) => {

  let value = initialValue
  let subscriptions: ((nextValue: T) => any)[] = []

  const get = () => value
  const next = (nextValue: T) => {
    value = nextValue
    subscriptions.forEach(subscription => subscription(nextValue))
  }

  const subscribe = (subscription: (nextValue: T) => any) => {
    subscriptions = [ ...subscriptions, subscription ]
    subscription(value)
  }

  return {
    get,
    next,
    subscribe
  }
}