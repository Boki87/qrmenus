import { createClient } from "@supabase/supabase-js";

const APP_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://qrmenus-nu.vercel.app'

//const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL
//const supabase_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient("https://hvuxclagvnwtryxuskjy.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dXhjbGFndm53dHJ5eHVza2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQxODcyNzcsImV4cCI6MTk3OTc2MzI3N30.rS3ATJA8rA0kfNcHHNn7Hg7I_3zOwIpdiK5xIpLvo0w")

export {
    supabase,
    APP_URL
}
