import Category from '../../Interfaces/Category'
import Terminal from '../../Interfaces/Terminal'
import { GET_MENU, SET_ERROR, SET_LOADING, SET_TERMINALS } from '../constants/ActionTypes'

interface GetMenuAction {
  type: typeof GET_MENU
  menu: Category[]
}

interface SetLoadingAction {
  type: typeof SET_LOADING
}

interface SetErrorAction {
  type: typeof SET_ERROR
  error: string
}

interface SetTerminalsAction {
  type: typeof SET_TERMINALS
  terminals: Terminal[]
}

export type MenuAction = GetMenuAction | SetLoadingAction | SetErrorAction | SetTerminalsAction
