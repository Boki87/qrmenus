import { createClient } from "@supabase/supabase-js";

const APP_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://qrmenus-nu.vercel.app'

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabase_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabase_url, supabase_key)

export {
    supabase,
    APP_URL
}
