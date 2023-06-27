import { useState } from 'react'
import { proxy, useSnapshot } from 'valtio'
import { derive } from 'valtio/utils'
import './todo.css'

type TodoItem = {
  id: number
  description: string
  completed?: boolean
}

const state = proxy({
  todoList: [] as TodoItem[],
})

derive({
  active: (get) => get(state).todoList.filter((todo) => !todo.completed),
  completed: (get) => get(state).todoList.filter((todo) => todo.completed),
}, { proxy: state })

function addTodoItem(description: string) {
  state.todoList.push({
    id: Date.now(),
    description,
    completed: false,
  })
}
function completeTodoItem(id: number) {
  const todo = state.todoList.find((todo) => todo.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}
function deleteTodoItem(id: number) {
  const index = state.todoList.findIndex((todo) => todo.id === id)
  if (index !== -1) {
    state.todoList.splice(index, 1)
  }
}

export function Todo() {
  let [filter, setFilter] = useState('all')

  const { todoList, active, completed } = useSnapshot(state)

  let list = filter === 'all' ? todoList : filter === 'active' ? active : completed
  return (
    <div className="container">
      <h1>Todo List</h1>
      <input 
        className="todo-input" 
        type="text" 
        placeholder="Add a new todo item..."
        onKeyDown={(e: any) => {
          if (e.key === 'Enter' && e.target.value) {
            addTodoItem(e.target.value)
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
        {list
          .map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <label htmlFor={todo.id + ''}>
                <input
                  id={todo.id + ''}
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => completeTodoItem(todo.id)}
                />
                <span>{todo.description}</span>
              </label>
              <button className="delete-button" onClick={() => deleteTodoItem(todo.id)}>🗑️</button>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
