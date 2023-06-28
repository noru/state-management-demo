import { useState } from 'react'
import { hookstate, useHookstate } from '@hookstate/core'
import './todo.css'

type TodoItem = {
  id: number
  description: string
  completed?: boolean
}

const todoState = hookstate([] as TodoItem[])

function useTodoState () {
  let state = useHookstate(todoState)
  return ({
    get todoList() {
      return state.value
    },
    get active() {
      return state.get().filter(i => !i.completed)
    },
    get completed() {
      return state.get().filter(i => i.completed)
    },
    addTodoItem(description: string) {
      todoState.set(state => [...state, { id: Date.now(), description, completed: false }])
    }, 
    toggleTodoCompleted(id: number) {
      todoState.set((list) => {
        return list.map((todo) => {
          if (todo.id === id) {
            return { ...todo, completed: !todo.completed }
          }
          return todo
        })
      })
    }
  })
}

const deleteTodoItem = (id: number) => {
  todoState.set((list) => list.filter((todo) => todo.id !== id))
}

export function Todo() {
  let [filter, setFilter] = useState('all')
  let { todoList, active, completed, addTodoItem, toggleTodoCompleted } = useTodoState()
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
                  onChange={() => toggleTodoCompleted(todo.id)}
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
