import { ThunkAction } from 'redux-thunk'
import { RootState } from '..'
import Category from '../../Interfaces/Category'
import { GET_MENU, SET_ERROR, SET_LOADING } from '../constants/ActionTypes'
import { MenuAction } from '../interfaces/menu'

const apiServer = 'http://localhost:3001'

export const getMenu = (): ThunkAction<void, RootState, null, MenuAction> => {
  return async (dispatch) => {
    try {
      dispatch(setLoading())
      const res = await fetch(`${apiServer}/api/menu`)
      if (!res.ok) {
        const resData: Error = await res.json()
        throw new Error(resData.message)
      }

      const resData: [] = await res.json()

      dispatch(fetchMenu(resData))
    } catch (err) {
      dispatch(setError(err))
    }
  }
}

export const fetchMenu = (menu: Category[]): MenuAction => {
  return {
    type: GET_MENU,
    menu: menu,
  }
}

export const setLoading = (): MenuAction => {
  return {
    type: SET_LOADING,
  }
}

export const setError = (error: Error): MenuAction => {
  return {
    type: SET_ERROR,
    error: error.message,
  }
}
