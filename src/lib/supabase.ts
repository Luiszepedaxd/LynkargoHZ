import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eddhbaovqdecryoanmik.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZGhiYW92cWRlY3J5b2FubWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMDY5NTYsImV4cCI6MjA3MDg4Mjk1Nn0.4YATckHCgRmXeJY-m9HmH2swybq5rhggFM2J9KSI2g0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Re-export types from centralized location
export type { UserProfile, AuthUser } from '@/types'
