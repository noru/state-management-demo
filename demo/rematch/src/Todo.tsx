import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { TodoItem } from './model'
import './todo.css'

export function Todo() {
  let [filter, setFilter] = useState('all')

  let { todoList, active, completed } = useSelector((state: { todo: TodoItem[] }) => ({
    todoList: state.todo,
    active: state.todo.filter(i => !i.completed),
    completed: state.todo.filter(i => i.completed),
  }))
  let dispatch = useDispatch()

  let toggleTodoCompleted = (id: number) => {
    dispatch.todo.toggleTodoCompleted(id)
  }

  let addTodoItem = (description: string) => {
    dispatch.todo.addTodo(description)
  }

  let deleteTodoItem = (id: number) => {
    dispatch.todo.deleteTodo(id)
  }

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
