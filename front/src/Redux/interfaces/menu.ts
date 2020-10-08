import Category from '../../Interfaces/Category'
import { GET_MENU, SET_ERROR, SET_LOADING } from '../constants/ActionTypes'

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

export type MenuAction = GetMenuAction | SetLoadingAction | SetErrorAction
