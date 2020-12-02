import Category from '../../Interfaces/Category'
import Terminal from '../../Interfaces/Terminal'
import {
  ADD_GROUP_PRODUCTS,
  GET_MENU,
  SET_ERROR,
  SET_LOADING,
  SET_PRODUCTS_LOADING,
  SET_TERMINALS,
} from '../constants/ActionTypes'

interface GetMenuAction {
  type: typeof GET_MENU
  menu: Category[]
}

interface SetLoadingAction {
  type: typeof SET_LOADING
}

interface SetProductsLoadingAction {
  type: typeof SET_PRODUCTS_LOADING
}

interface SetErrorAction {
  type: typeof SET_ERROR
  error: string
}

interface SetTerminalsAction {
  type: typeof SET_TERMINALS
  terminals: Terminal[]
}

interface AddGroupProductsAction {
  type: typeof ADD_GROUP_PRODUCTS
  group: Category
}

export type MenuAction =
  | GetMenuAction
  | SetLoadingAction
  | SetErrorAction
  | SetTerminalsAction
  | AddGroupProductsAction
  | SetProductsLoadingAction
