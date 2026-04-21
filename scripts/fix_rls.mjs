// Script to fix RLS policies on demandes table to allow anonymous inserts
// and add missing columns
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  'https://qzqphzfbkdtglghloplo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cXBoemZia2R0Z2xnaGxvcGxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA3MjUyNCwiZXhwIjoyMDg5NjQ4NTI0fQ.8NSCK72hcwTz_pcxn4yWVXvY8E3kbV_2qZR1OjCzeDo',
  {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: {
      headers: {
        apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cXBoemZia2R0Z2xnaGxvcGxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA3MjUyNCwiZXhwIjoyMDg5NjQ4NTI0fQ.8NSCK72hcwTz_pcxn4yWVXvY8E3kbV_2qZR1OjCzeDo',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cXBoemZia2R0Z2xnaGxvcGxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA3MjUyNCwiZXhwIjoyMDg5NjQ4NTI0fQ.8NSCK72hcwTz_pcxn4yWVXvY8E3kbV_2qZR1OjCzeDo'
      }
    }
  }
)

async function fixRLS() {
  console.log('🔧 Fixing RLS policies and adding missing columns...\n')

  // Step 1: Add missing column statut_activite to demandes
  console.log('1️⃣ Adding statut_activite column to demandes...')
  const { error: e1 } = await supabaseAdmin.rpc('exec_sql', {
    query: `ALTER TABLE demandes ADD COLUMN IF NOT EXISTS statut_activite TEXT;`
  })
  if (e1) {
    console.log('⚠️ RPC exec_sql not available. Please run this SQL manually in Supabase SQL Editor:')
    console.log(`
-- Step 1: Add missing columns
ALTER TABLE demandes ADD COLUMN IF NOT EXISTS statut_activite TEXT;
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS date_anniversaire DATE;
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS statut_activite TEXT;
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Step 2: Allow anonymous users to INSERT into demandes
CREATE POLICY "Allow anonymous insert on demandes" 
  ON demandes 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Step 3: Allow service_role full access (for admin)
CREATE POLICY "Allow service_role full access on demandes" 
  ON demandes 
  FOR ALL 
  TO service_role 
  USING (true) 
  WITH CHECK (true);

-- Step 4: Allow authenticated users to read demandes (for admin panel)
CREATE POLICY "Allow authenticated read on demandes" 
  ON demandes 
  FOR SELECT 
  TO authenticated 
  USING (true);
    `)
    console.log('\n📋 Copy the SQL above and run it in Supabase Dashboard > SQL Editor')
  } else {
    console.log('✅ Column added successfully')

    // Add other missing columns
    console.log('2️⃣ Adding missing columns to utilisateurs...')
    await supabaseAdmin.rpc('exec_sql', {
      query: `
        ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS date_anniversaire DATE;
        ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS statut_activite TEXT;
        ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS avatar_url TEXT;
      `
    })
    console.log('✅ Columns added')

    // Fix RLS policies
    console.log('3️⃣ Fixing RLS policies for demandes...')
    
    // Drop existing restrictive policies and add permissive ones
    await supabaseAdmin.rpc('exec_sql', {
      query: `
        -- Allow anonymous inserts
        DROP POLICY IF EXISTS "Allow anonymous insert on demandes" ON demandes;
        CREATE POLICY "Allow anonymous insert on demandes" 
          ON demandes FOR INSERT TO anon WITH CHECK (true);

        -- Allow service_role full access
        DROP POLICY IF EXISTS "Allow service_role full access on demandes" ON demandes;
        CREATE POLICY "Allow service_role full access on demandes" 
          ON demandes FOR ALL TO service_role USING (true) WITH CHECK (true);

        -- Allow authenticated read
        DROP POLICY IF EXISTS "Allow authenticated read on demandes" ON demandes;
        CREATE POLICY "Allow authenticated read on demandes" 
          ON demandes FOR SELECT TO authenticated USING (true);
      `
    })
    console.log('✅ RLS policies fixed')
  }

  // Test: try anon insert
  console.log('\n4️⃣ Testing anonymous insert...')
  const anonClient = createClient(
    'https://qzqphzfbkdtglghloplo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cXBoemZia2R0Z2xnaGxvcGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNzI1MjQsImV4cCI6MjA4OTY0ODUyNH0.rAPY__od2mdHrvP_6O5RKclw8U52SUdbscht60DjFCI'
  )
  
  const { data, error: testErr } = await anonClient
    .from('demandes')
    .insert({ 
      nom: 'TEST_RLS_FIX', 
      prenom: 'Test',
      whatsapp: '+22800000000', 
      email: 'test@test.com',
      statut: 'en_attente' 
    })
    .select()

  if (testErr) {
    console.log('❌ Anonymous insert still blocked:', testErr.message)
    console.log('\n⚠️ You need to run the SQL manually in Supabase SQL Editor (see above)')
  } else {
    console.log('✅ Anonymous insert works! Row:', data)
    // Clean up
    await supabaseAdmin.from('demandes').delete().eq('nom', 'TEST_RLS_FIX')
    console.log('🧹 Test row cleaned up')
  }

  console.log('\n✅ Done!')
}

fixRLS()
