import { supabase } from './client'

export async function signUp(email, password, fullName, organization = null) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        organization
      }
    }
  })
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({
    email,
    password
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getCurrentUser() {
  return supabase.auth.getUser()
}

export async function resetPassword(email, redirectTo) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo
  })
}