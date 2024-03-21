'use client'

import { Attribute } from '@/payload/payload-types'

import { createStore } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import { filterAttributesByNotName } from '@/lib/attribute-hooks'

export interface CartItem {
  id: string

  productId: string
  productName: string
  attributes: Attribute[]
  amount: number
}

interface State {
  cart: CartItem[]
  favorites: string[]
}

interface Actions {
  add: (item: CartItem) => void
  remove: (id: string) => void
  flushToilet: () => void
  incrementAmount: (id: string, quantity: number) => void
  decrementAmount: (id: string, quantity: number) => void
  updateAttr: (id: string, attr: Attribute) => void

  addFavorite: (productId: string) => void
  removeFavorite: (productId: string) => void
}

export type Store = State & Actions

export const defaultInitState: State = {
  cart: [],
  favorites: [],
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

        flushToilet: () => {
          set({ cart: [] })
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

        updateAttr(id, attr) {
          const { cart } = get()

          // Encontrando o cartItem correspondente ao cartItemId
          const updatedCart = cart.map((item) => {
            if (item.id === id) {
              if (typeof attr.type !== 'object') {
                return
              }

              // Filtrando os atributos do cartItem com base no nome do tipo
              const filteredAttributes = filterAttributesByNotName(
                item.attributes,
                attr.type.name,
              )

              // Adicionando o novo objeto Attribute a um novo array
              const updatedAttributes = [...filteredAttributes, attr]

              // Retornando o cartItem atualizado com os novos atributos
              return {
                ...item,
                attributes: updatedAttributes,
              }
            }
            return item
          })

          set({ cart: updatedCart })
        },

        addFavorite(item) {
          const { favorites } = get()

          const updatedFavorites = [...favorites, item]

          set({ favorites: updatedFavorites })
        },

        removeFavorite(productId) {
          const { favorites } = get()

          const updatedFavorites = favorites.filter((id) => id !== productId)

          set({ favorites: updatedFavorites })
        },
      }),
      {
        name: 'cart-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  )
}
