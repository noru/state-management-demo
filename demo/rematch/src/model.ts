export type TodoItem = {
  id: number
  description: string
  completed?: boolean
}

const todo = {
  state: [] as TodoItem[],
  reducers: {
    addTodo: (state: any, description: string) => [...state, { id: Date.now(), description, completed: false }],
    toggleTodoCompleted: (state: any, id: number) => {
      return state.map((item: TodoItem) => (item.id === id ? { ...item, completed: !item.completed } : item))
    },
    deleteTodo: (state: any, id: number) => {
      return state.filter((item: TodoItem) => item.id !== id)
    }
  },
}

export default todo
