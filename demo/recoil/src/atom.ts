import { atom, selector } from 'recoil'

export type TodoItem = {
  id: number
  description: string
  completed?: boolean
}

export const todoListState = atom({
  key: 'todoListState',
  default: [] as TodoItem[],
})

export const todoListDerivedState = selector({
  key: 'todoListDerivedState',
  get: ({ get }) => {
    let todoList = get(todoListState)
    return {
      active: todoList.filter((item) => !item.completed),
      completed: todoList.filter((item) => item.completed),
    }
  },
})
