import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { observable } from 'mobx'
import './todo.css'

type TodoItem = {
  id: number
  description: string
  completed?: boolean
}


const todoStore = observable({
  todoList: [] as TodoItem[],
  get active() {
    return this.todoList.filter((todo: TodoItem) => !todo.completed)
  },
  get completed() {
    return this.todoList.filter((todo: TodoItem) => todo.completed)
  },
  addTodo(description: string) {
    this.todoList.push({
      id: Date.now(),
      description,
      completed: false,
    })
  },
  deleteTodo(id: number) {
    this.todoList = this.todoList.filter((todo) => todo.id !== id)
  },
  toggleComplete(id: number) {
    const todo = this.todoList.find((todo) => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  },
})

export const Todo = observer(() => {

  let [filter, setFilter] = useState('all')
  let { todoList, active, completed } = todoStore
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
            todoStore.addTodo(e.target.value)
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
          .map((todo: TodoItem) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <label htmlFor={todo.id + ''}>
                <input
                  id={todo.id + ''}
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => todoStore.toggleComplete(todo.id)}
                />
                <span>{todo.description}</span>
              </label>
              <button className="delete-button" onClick={() => todoStore.deleteTodo(todo.id)}>🗑️</button>
            </li>
          ))
        }
      </ul>
    </div>
  )
})
