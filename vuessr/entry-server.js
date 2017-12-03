import { createApp } from './app'

export default context => {
  return new Primise((resolve, reject) => {
    const { app, router} = createApp()
    router.push(context.url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents) {
        return reject({ code: 404 })
      }
      resolve(app)
    }, reject)
  })
}