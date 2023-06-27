import { create } from 'zustand'

export type TodoItem = {
  id: number
  description: string
  completed?: boolean
}

type Store = {
  todoList: TodoItem[],
  computed: {
    active: TodoItem[],
    completed: TodoItem[],
  }
  addTodo: (text: TodoItem) => void,
  toggleTodoCompleted: (index: number) => void,
  deleteTodo: (index: number) => void,
}

const useTodoStore = create<Store>((set, get) => ({
  todoList: [],
  computed: {
    get active() {
      return get().todoList.filter(i => !i.completed)
    },
    get completed() {
      return get().todoList.filter(i => i.completed)
    },
  },
  addTodo: (todo: TodoItem) => set((state) => ({ todoList: [...state.todoList, todo] })),
  toggleTodoCompleted: (id) =>
    set((state) => {
      let todoList = state.todoList.map(todo=> {
        if(todo.id === id) {
          todo.completed = !todo.completed
        }
        return todo
      })
      return { todoList }
    }),
  deleteTodo: (id) => set((state) => ({ todoList: state.todoList.filter((i) => i.id !== id) })),
}))

export default useTodoStore
