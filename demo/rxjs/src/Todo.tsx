import { useEffect, useState } from 'react'
import { Subject } from 'rxjs'
import { filter, scan } from 'rxjs/operators'
import './todo.css'

type TodoItem = {
  id: number
  description: string
  completed?: boolean
}

type Action = {
  type: 'ADD' | 'DELETE' | 'COMPLETE'
  payload: TodoItem | number
}

const TodoSubject = new Subject<Action>()
const TodoObservable = TodoSubject.pipe(
  scan((list, action) => {
    if (action.type === 'ADD') {
      return [...list, action.payload as TodoItem]
    } else if (action.type === 'COMPLETE') {
      return list.map((todo) => {
        if (todo.id === action.payload) {
          return { ...todo, completed: !todo.completed }
        }
        return todo
      })
    } else if (action.type === 'DELETE') {
      return list.filter((todo) => todo.id !== action.payload)
    }
    return list
  }, [] as TodoItem[])
)


export function Todo() {
  let [todoList, setTodoList] = useState<TodoItem[]>([])
  let [filter, setFilter] = useState('all')

  useEffect(() => {
    TodoObservable.subscribe((list) => {
      setTodoList(list)
    })
  }, [])

  const addTodoItem = (description: string) => {
    let newItem = {
      id: Date.now(),
      description,
      completed: false,
    }
    TodoSubject.next({ type: 'ADD', payload: newItem })
  }

  const completeTodoItem = (id: number) => {
    TodoSubject.next({ type: 'COMPLETE', payload: id })
  }

  const deleteTodoItem = (id: number) => {
    TodoSubject.next({ type: 'DELETE', payload: id })
  }
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
        {todoList
          .filter((todo) => {
            if (filter === 'all') return true
            if (filter === 'completed') return todo.completed
            if (filter === 'active') return !todo.completed
          })
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
