import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yjdkyjppeiimxxrlwdly.supabase.co';
const supabaseAnonKey = 'sb_publishable_UAmYKRGvuWHL5bk54ttD4g_TRTKPzfo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
