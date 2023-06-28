import './App.css'
import { Todo } from './Todo'
import { RecoilRoot } from 'recoil'

function App() {
  
  return (
    <RecoilRoot>
      <div>
        <Todo />
      </div>
    </RecoilRoot>
  )
}

export default App
