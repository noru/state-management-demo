import { types } from 'mobx-state-tree'

export const Todo = types
  .model('Todo', {
    id: types.identifierNumber,
    description: types.string,
    completed: false,
  })
  .actions((self) => ({
    toggleCompleted() {
      self.completed = !self.completed
    },
  }))

export const TodoStore = types
  .model('TodoStore', {
    todoList: types.array(Todo),
  })
  .views(self => ({
    get active() {
      return self.todoList.filter((todo) => !todo.completed)
    },
    get completed() {
      return self.todoList.filter((todo) => todo.completed)
    }
  }))
  .actions((self) => ({
    addTodo(text: string) {
      self.todoList.push({ id: Date.now(), description: text, completed: false })
    },
    deleteTodo(id: number) {
      self.todoList = self.todoList.filter((todo) => todo.id !== id) as any
    }
  }))
