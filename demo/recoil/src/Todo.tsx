import { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { todoListState, todoListDerivedState } from './atom'
import './todo.css'


export function Todo() {
  let [filter, setFilter] = useState('all')
  let todoList = useRecoilValue(todoListState)
  let setTodoList = useSetRecoilState(todoListState)
  let { active, completed } = useRecoilValue(todoListDerivedState)
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
            setTodoList((prev) => {
              return [...prev, {
                id: Date.now(),
                description: e.target.value,
                completed: false,
              }]
            })
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
                  onChange={() => {
                    setTodoList((prev) => {
                      return prev.map((item) => {
                        item = { ...item }
                        if (item.id === todo.id) {
                          item.completed = !item.completed
                        }
                        return item
                      })
                    })
                  }}
                />
                <span>{todo.description}</span>
              </label>
              <button className="delete-button" onClick={() => setTodoList(prev => prev.filter(i => i.id !== todo.id))}>🗑️</button>
            </li>
          ))
        }
      </ul>
    </div>
  )
}
