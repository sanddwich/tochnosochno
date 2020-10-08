import { GET_MENU, SET_ERROR, SET_LOADING } from '../constants/ActionTypes'
import { MenuState } from '../interfaces/interfaces'
import { MenuAction } from '../interfaces/menu'

const initialState: MenuState = {
  menu: [],
  loading: false,
  error: '',
  date: new Date(),
}

export default (state: MenuState = initialState, action: MenuAction): MenuState => {
  switch (action.type) {
    case GET_MENU:
      return {
        ...state,
        menu: action.menu,
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
    default:
      return state
  }
}
