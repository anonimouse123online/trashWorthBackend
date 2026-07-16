const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('--- Supabase Init Diagnostics ---');
console.log('SUPABASE_URL loaded:', !!supabaseUrl);
console.log('Using Service Role Key:', !!supabaseServiceRoleKey);
console.log('Service Role Key prefix:', supabaseServiceRoleKey ? supabaseServiceRoleKey.substring(0, 20) + '...' : 'MISSING');

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables. ' +
    'The Express backend must use the service role key to bypass RLS.'
  );
}

// Server-side client: uses the service role key, bypasses Row Level Security.
// This is correct for an Express backend — RLS is a browser/client-side concern.
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Keep supabaseAdmin as an alias for backwards-compatibility with profile.controller.js
const supabaseAdmin = supabase;

console.log('✓ Supabase service-role client initialized (RLS bypassed)');

module.exports = {
  supabase,
  supabaseAdmin
};
