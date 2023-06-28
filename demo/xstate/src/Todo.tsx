import { useState } from 'react'
import { useMachine } from '@xstate/react'
import './todo.css'
import todoMachine from './machine'


export function Todo() {
  let [filter, setFilter] = useState('all')
  let [state, send] = useMachine(todoMachine)
  let { todoList } = state.context
  return (
    <div className="container">
      <h1>Todo List</h1>
      <input 
        className="todo-input" 
        type="text" 
        placeholder="Add a new todo item..."
        onKeyDown={(e: any) => {
          if (e.key === 'Enter' && e.target.value) {
            send('ADD', { description: e.target.value })
            e.target.value = ''
          }
        }}
      />
      <div className="todo-filter">
        <input type='radio' name='filter' id='all' hidden checked={filter === 'all'} onChange={() => setFilter('all')}/>
        <label htmlFor='all'>All</label>
        <input type='radio' name='filter' id='active' hidden checked={filter === 'active'} onChange={() => setFilter('active')} />
        <label htmlFor='active'>Active</label>
        <input type='radio' name='filter' id='completed' hidden checked={filter === 'completed'} onChange={() => setFilter('completed')} />
        <label htmlFor='completed'>Complete</label>
      </div>
      <ul className="todo-list">
        {
        todoList
          .filter((todo) => filter === 'all' || (filter === 'active' ? !todo.completed : todo.completed))
          .map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <label htmlFor={todo.id + ''}>
                <input
                  id={todo.id + ''}
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => send('TOGGLE_COMPLETED', { id: todo.id })
                }
                />
                <span>{todo.description}</span>
              </label>
              <button className="delete-button" onClick={() => send('DELETE', { id: todo.id })}>🗑️</button>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
