import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://bbluamawfpobxxfypfys.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJibHVhbWF3ZnBvYnh4ZnlwZnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyODk0MTUsImV4cCI6MjA4NTg2NTQxNX0.6JSMZJ9vRHkabFYTBG3RByYFA4YhgBVy-2bqcH4wlSM"

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)
