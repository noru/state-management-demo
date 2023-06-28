import { init } from '@rematch/core'
import todo from './model'

const models = { todo }

const store = init({
  models,
})

export default store