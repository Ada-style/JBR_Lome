 import { createContext, useContext, useEffect, useState } from "react";
 import { supabase } from "../lib/supabase";

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Récupérer la session active
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

  // Ecouter les changements de connexion
  const { data: { subsription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setUser(session?.user ?? null)
    if (session?.user) fetchProfile(session.user.id)
    else setProfile(null)
    }
  )

  return () => subscription.unsubscribe()
 }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('utilisateurs')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)