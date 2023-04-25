import { createClient } from '@supabase/supabase-js';
// supabase client

let supabase;

const initSupabase = (supabaseUrl, supabaseKey) => {
	supabase = createClient(supabaseUrl, supabaseKey);
};

export { initSupabase, supabase };
