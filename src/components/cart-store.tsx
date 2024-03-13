'use client'

import { Atribute } from '@/payload/payload-types'

import { createStore } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  productId: string
  attributes: Atribute[]
  amount: number
}

interface State {
  cart: CartItem[]
}

interface Actions {
  add: (item: CartItem) => void
  remove: (item: CartItem) => void
}

export type Store = State & Actions

export const defaultInitState: State = {
  cart: [],
}

// Gerenciamento do carrinho acontece aqui
export const createCartStore = (initState: State = defaultInitState) => {
  return createStore<Store>()(
    persist(
      (set, get) => ({
        ...initState,

        add: (item) => {
          const { cart } = get()

          // Add item validations (ex.: can't add two products with the same id)
          const updatedCart = [...cart, item]

          set({ cart: updatedCart })
        },

        remove: (item) => {
          const { cart } = get()

          // Remove item validations (ex.: can only remove 1 item at a time)
          const updatedCart = cart.filter(
            // placeholder verification, existingItem must deeply equal item
            (existingItem) =>
              !(
                existingItem.productId === item.productId &&
                existingItem.amount === item.amount &&
                existingItem.attributes === item.attributes
              ),
          )

          set({ cart: updatedCart })
        },
      }),
      {
        name: 'cart-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  )
}
