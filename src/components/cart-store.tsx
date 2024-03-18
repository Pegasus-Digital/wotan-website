'use client'

import { Attribute } from '@/payload/payload-types'

import { createStore } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string

  productId: string
  attributes: Attribute[]
  amount: number
}

interface State {
  cart: CartItem[]
}

interface Actions {
  add: (item: CartItem) => void
  remove: (id: string) => void
  incrementAmount: (id: string, quantity: number) => void
  decrementAmount: (id: string, quantity: number) => void
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

        remove: (id) => {
          const { cart } = get()

          const updatedCart = cart.filter((item) => item.id !== id)

          set({ cart: updatedCart })
        },

        incrementAmount: (id, quantity) => {
          const { cart } = get()

          const updatedCart = cart.map((item) => {
            if (item.id === id) {
              item.amount += quantity
            }

            return item
          })

          set({ cart: updatedCart })
        },

        decrementAmount: (id, quantity) => {
          const { cart } = get()

          const updatedCart = cart.map((item) => {
            if (item.id === id) {
              item.amount -= quantity
            }

            return item
          })

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
