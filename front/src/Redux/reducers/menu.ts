import {
  ADD_GROUP_PRODUCTS,
  GET_MENU,
  SET_ERROR,
  SET_LOADING,
  SET_PRODUCTS_LOADING,
  SET_TERMINALS,
} from '../constants/ActionTypes'
import { MenuState } from '../interfaces/interfaces'
import { MenuAction } from '../interfaces/menu'

const initialState: MenuState = {
  menu: [],
  terminals: [],
  loading: false,
  error: '',
  date: new Date(),
  productsLoading: false,
}

export default (state: MenuState = initialState, action: MenuAction): MenuState => {
  switch (action.type) {
    case GET_MENU:
      return {
        ...state,
        menu: [...action.menu],
        loading: false,
        error: '',
        date: new Date(),
      }
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      }
    case SET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      }

    case SET_TERMINALS:
      return {
        ...state,
        loading: false,
        terminals: action.terminals,
      }
    case ADD_GROUP_PRODUCTS:
      return {
        ...state,
        productsLoading: false,
        menu: [
          ...state.menu.map((group) => {
            if (group.id === action.group.id) {
              group = action.group
            }
            return group
          }),
        ],
      }
    case SET_PRODUCTS_LOADING:
      return {
        ...state,
        productsLoading: true,
      }
    default:
      return state
  }
}
