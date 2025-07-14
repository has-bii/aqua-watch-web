import { Database } from "@/types/database"
import { SupabaseClient } from "@supabase/supabase-js"

type TSupabaseClient = SupabaseClient<Database>

export default TSupabaseClient