import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zxrtjasxungnpcgxaoip.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4cnRqYXN4dW5nbnBjZ3hhb2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODY0MDIsImV4cCI6MjA2Mjc2MjQwMn0.wR8ExVL3FY_TrQCPY274HHnZCXo40_v31X_uSK-xsXU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)