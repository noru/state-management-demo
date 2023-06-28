import { createMachine, assign } from 'xstate'

type TodoItem = {
  id: number
  description: string
  completed?: boolean
}

const todoMachine = createMachine({
  id: 'todo',
  initial: 'active',
  context: {
    todoList: [] as TodoItem[],
  },
  states: {
    active: {
      on: {
        TOGGLE_COMPLETED: {
          actions: assign({
            todoList: (context, event) => {
              let { id } = event as any
              return context.todoList.map((todo) => {
                if (todo.id === id) {
                  return { ...todo, completed: !todo.completed }
                }
                return todo
              })
            }
          }),
        },
        DELETE: {
          actions: assign({
            todoList: (context, event) => {
              let { id } = event as any
              return context.todoList.filter((todo) => todo.id !== id)
            },
          }),
        },
        ADD: {
          actions: assign({
            todoList: (context, event) => {
              let { description } = event as any
              return [...context.todoList, { id: Date.now(), description, completed: false }]
            },
          }),
        }
      },
    },
  },
})

export default todoMachine