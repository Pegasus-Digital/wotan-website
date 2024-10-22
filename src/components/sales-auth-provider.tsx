'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { Salesperson } from '../payload/payload-types'

// eslint-disable-next-line no-unused-vars
type ResetPassword = (args: {
  password: string
  passwordConfirm: string
  token: string
}) => Promise<void>

type ForgotPassword = (args: { email: string }) => Promise<void> // eslint-disable-line no-unused-vars

type Login = (args: {
  email?: string
  password?: string
}) => Promise<Salesperson> // eslint-disable-line no-unused-vars

type Logout = () => Promise<void>

type SalesAuthContext = {
  user?: Salesperson | null
  setUser: (user: Salesperson | null) => void // eslint-disable-line no-unused-vars
  logout: Logout
  login: Login
  resetPassword: ResetPassword
  forgotPassword: ForgotPassword
  status: undefined | 'loggedOut' | 'loggedIn'
}

const Context = createContext({} as SalesAuthContext)

export const SalesAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Salesperson | null>()

  // used to track the single event of logging in or logging out
  // useful for `useEffect` hooks that should only run once
  const [status, setStatus] = useState<undefined | 'loggedOut' | 'loggedIn'>()

  const login = useCallback<Login>(async (args) => {
    try {
      if (!args.email) throw new Error('Email obrigatório')
      if (!args.password) throw new Error('Senha obrigatória')

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/salespersons/login`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: args.email,
            password: args.password,
          }),
        },
      )

      if (res.ok) {
        const { user, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(user)
        setStatus('loggedIn')
        return user
      }

      throw new Error('Credenciais Inválidas')
    } catch (e) {
      throw new Error('Ocorreu um erro ao tentar realizar login.')
    }
  }, [])

  const logout = useCallback<Logout>(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/salespersons/logout`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (res.ok) {
        setUser(null)
        setStatus('loggedOut')
      } else {
        throw new Error('Ocorreu um erro ao tentar realizar logout.')
      }
    } catch (e) {
      throw new Error('Ocorreu um erro ao tentar realizar logout.')
    }
  }, [])

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        if (res.ok) {
          setUser(null)
          setStatus('loggedOut')
        } else {
          throw new Error('Ocorreu um erro ao tentar realizar logout.')
        }
      } catch (e) {
        throw new Error('Ocorreu um erro ao tentar realizar logout.')
      }
    }

    const fetchMe = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/salespersons/me`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        if (res.ok) {
          const { user: meUser } = await res.json()
          setUser(meUser || null)
          setStatus(meUser ? 'loggedIn' : undefined)
        } else {
          throw new Error('Ocorreu um erro ao buscar informações de sua conta.')
        }
      } catch (e) {
        setUser(null)
        throw new Error('Ocorreu um erro ao buscar informações de sua conta.')
      }
    }

    const checkKind = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-salesperson`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        if (res.ok) {
          const { type } = await res.json()
          if (type === 'salesperson') {
            fetchMe()
          } else {
            logoutUser()
          }
        } else {
          setUser(null)
          setStatus('loggedOut')
        }
      } catch (e) {
        setUser(null)
        setStatus('loggedOut')
      }
    }

    checkKind()
  }, [])

  const forgotPassword = useCallback<ForgotPassword>(async (args) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/salespersons/forgot-password`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: args.email,
          }),
        },
      )

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
      } else {
        throw new Error('Credenciais inválidas')
      }
    } catch (e) {
      throw new Error('Ocorreu um erro ao tentar realizar login.')
    }
  }, [])

  const resetPassword = useCallback<ResetPassword>(async (args) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/salespersons/reset-password`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: args.password,
            passwordConfirm: args.passwordConfirm,
            token: args.token,
          }),
        },
      )

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
        setStatus(data?.loginUser?.user ? 'loggedIn' : undefined)
      } else {
        throw new Error('Credenciais inválidas')
      }
    } catch (e) {
      throw new Error('Ocorreu um erro ao tentar realizar login.')
    }
  }, [])

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        resetPassword,
        forgotPassword,
        status,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type UseSalesAuth<T = Salesperson> = () => SalesAuthContext // eslint-disable-line no-unused-vars

export const useSalesAuth: UseSalesAuth = () => useContext(Context)
