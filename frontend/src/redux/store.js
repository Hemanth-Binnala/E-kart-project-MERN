import userSlice from './userslice'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import productSlice from './productSlice'

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

import storageModule from 'redux-persist/lib/storage'

const storage = storageModule.default || storageModule

const persistConfig = {
  key: 'Ekart',
  version: 1,
  storage: storage,
}

const rootReducer = combineReducers({
  user: userSlice,
  product : productSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
})

export const persistor = persistStore(store)

export default store