import { ThunkAction } from 'redux-thunk'
import { RootState } from '..'
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
import { MenuAction } from '../interfaces/menu'

import { API_URL } from '../../utils/config'

const apiServer = API_URL

export const getMenu = (): ThunkAction<void, RootState, null, MenuAction> => {
  return async (dispatch) => {
    try {
      dispatch(setLoading())

      const res = await fetch(`${apiServer}/api/menu`)
      if (!res.ok) {
        const resData: Error = await res.json()
        throw new Error(resData.message)
      }

      const resData = await res.json()

      /*
        Получаем комбо и доставку
      */
      // resData.products.map((category: Category) => {
      //   if (category.isCombo || category.isService) {
      //     dispatch(getGroupProducts(category.id))
      //   }
      // })

      dispatch(fetchMenu(resData.products))
      dispatch(setTerminals(resData.terminals))
    } catch (err) {
      dispatch(setError(err))
    }
  }
}

export const getGroupProducts = (groupId: string): ThunkAction<void, RootState, null, MenuAction> => {
  return async (dispatch) => {
    try {
      dispatch(setProductsLoading())
      const res = await fetch(`${apiServer}/api/group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId }),
      })
      if (!res.ok) {
        const resData: Error = await res.json()
        throw new Error(resData.message)
      }

      const resData = await res.json()
      dispatch(addGroupProducts(resData.products))
    } catch (err) {
      dispatch(setError(err))
    }
  }
}

export const addGroupProducts = (group: Category): MenuAction => {
  return {
    type: ADD_GROUP_PRODUCTS,
    group,
  }
}

export const setProductsLoading = (): MenuAction => {
  return {
    type: SET_PRODUCTS_LOADING,
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

const setTerminals = (terminals: Terminal[]): MenuAction => {
  return {
    type: SET_TERMINALS,
    terminals: terminals,
  }
}
