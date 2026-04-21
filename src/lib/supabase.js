import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qzqphzfbkdtglghloplo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cXBoemZia2R0Z2xnaGxvcGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNzI1MjQsImV4cCI6MjA4OTY0ODUyNH0.rAPY__od2mdHrvP_6O5RKclw8U52SUdbscht60DjFCI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})