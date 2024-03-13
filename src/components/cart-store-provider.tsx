'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { type StoreApi, useStore } from 'zustand'
import { Store, createCartStore } from './cart-store'

export const CartStoreContext = createContext<StoreApi<Store> | null>(null)

export interface CartStoreProviderProps {
  children: ReactNode
}

export const CartStoreProvider = ({ children }: CartStoreProviderProps) => {
  const storeRef = useRef<StoreApi<Store>>()

  if (!storeRef.current) {
    storeRef.current = createCartStore()
  }

  return (
    <CartStoreContext.Provider value={storeRef.current}>
      {children}
    </CartStoreContext.Provider>
  )
}

export const useCartStore = <T,>(selector: (store: Store) => T): T => {
  const cartStoreContext = useContext(CartStoreContext)

  if (!cartStoreContext) {
    throw new Error(`useCartStore must be use within CartStoreProvider`)
  }

  return useStore(cartStoreContext, selector)
}
