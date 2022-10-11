import { createClient } from "@supabase/supabase-js";

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabase_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
console.log(supabase_url)
const supabase = createClient(supabase_url ? supabase_url : '', supabase_key ? supabase_key : '')

export {
    supabase
}
