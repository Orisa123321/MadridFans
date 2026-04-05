import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yjdkyjppeiimxxrlwdly.supabase.co';
const supabaseAnonKey = 'sb_secret_d17qyLhtHWKKKKDHIFtAug_FhBLi77p';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);