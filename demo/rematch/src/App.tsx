import './App.css'
import { Provider } from 'react-redux'
import { Todo } from './Todo'
import store from './store'

function App() {
  
  return (
    <Provider store={store}>
      <div>
        <Todo />
      </div>
    </Provider>
  )
}

export default App
