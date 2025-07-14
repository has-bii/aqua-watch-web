import { Database } from '@/types/database'
import { createBrowserClient } from '@supabase/ssr'
import { useMemo } from 'react'

function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}

const useSupabase = () => useMemo(() => createClient(), [])

export default useSupabase