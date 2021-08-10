import { Session, User } from '@supabase/supabase-js'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

import { supabase } from '~supabase/client'

interface Discord3rdPartyApp {
    type: string
    id: string
    name: string
    verified: boolean
}

interface AuthContext {
    user: User
    discord3rdPartyApps: Discord3rdPartyApp[]
}

const authContext = createContext<AuthContext>({
    user: null,
    discord3rdPartyApps: [],
})

export const useAuth = (): AuthContext => useContext(authContext)

interface Props {
    children: ReactNode
}

export const AuthProvider = ({ children }: Props): JSX.Element => {
    const [user, setUser] = useState<User>(null)
    const [discord3rdPartyApps, setDiscord3rdPartyApps] = useState<Discord3rdPartyApp[]>([])

    const fetchProfile = async (session?: Session) => {
        const profileData = supabase.auth.user()

        setUser(profileData)

        if (!profileData) return

        const { error } = await supabase.from('profiles').upsert({ id: profileData.id })
        console.log({ error })

        if (!session || !session.provider_token) return

        try {
            const res = await fetch('https://discord.com/api/users/@me/connections', {
                headers: {
                    authorization: `Bearer ${session.provider_token}`,
                },
            })

            const apps = (await res.json()) as Discord3rdPartyApp[]
            setDiscord3rdPartyApps(apps)
        } catch {}
    }

    useEffect(() => {
        fetchProfile()

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            fetchProfile(session)
        })

        return () => {
            authListener?.unsubscribe()
        }
    }, [])

    useEffect(() => {
        console.log({ user })

        if (!user || discord3rdPartyApps.length < 0) return

        console.log(user, discord3rdPartyApps)
        ;(async () => {
            try {
                const { error } = await supabase.from('third_party').upsert(
                    discord3rdPartyApps.map(({ id, name, type, verified }) => ({
                        app_id: id,
                        unique_app_id: type + id,
                        name,
                        type,
                        verified,
                        user_id: user.id,
                    })),
                    {
                        onConflict: 'unique_app_id',
                    },
                )

                console.log({ error })
            } catch (e) {
                console.error()
            }
        })()
    }, [user, discord3rdPartyApps])

    return (
        <authContext.Provider
            value={{
                user,
                discord3rdPartyApps,
            }}
        >
            {children}
        </authContext.Provider>
    )
}