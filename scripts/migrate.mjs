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

async function migrate() {
  // Test: insert a row with statut_activite to see if it exists
  console.log('Testing if statut_activite column exists in demandes...')
  const { error: testErr } = await supabaseAdmin
    .from('demandes')
    .insert({ nom: 'MIGRATE_TEST', whatsapp: '0', statut: 'en_attente', statut_activite: 'test' })
    .select()
  
  if (testErr && testErr.message.includes('statut_activite')) {
    console.log('Column statut_activite does NOT exist. Need to add it via SQL Editor.')
    console.log('Please run: ALTER TABLE demandes ADD COLUMN statut_activite TEXT;')
  } else if (testErr) {
    console.log('Other error:', testErr.message)
  } else {
    console.log('Column statut_activite exists! Cleaning up test row...')
    await supabaseAdmin.from('demandes').delete().eq('nom', 'MIGRATE_TEST')
  }

  // Test utilisateurs table
  console.log('\nTesting if statut_activite exists in utilisateurs...')
  const { error: testErr2 } = await supabaseAdmin
    .from('utilisateurs')
    .select('statut_activite')
    .limit(1)
  
  if (testErr2) {
    console.log('Column statut_activite does NOT exist in utilisateurs.')
    console.log('Please run: ALTER TABLE utilisateurs ADD COLUMN statut_activite TEXT;')
    console.log('Also run: ALTER TABLE utilisateurs ADD COLUMN date_anniversaire DATE;')
  } else {
    console.log('Column exists in utilisateurs!')
  }

  // Now test RLS - try inserting as anon
  console.log('\n=== Testing RLS for anonymous insert ===')
  const supabaseAnon = createClient(
    'https://qzqphzfbkdtglghloplo.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cXBoemZia2R0Z2xnaGxvcGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNzI1MjQsImV4cCI6MjA4OTY0ODUyNH0.rAPY__od2mdHrvP_6O5RKclw8U52SUdbscht60DjFCI'
  )
  
  const { error: rlsErr } = await supabaseAnon
    .from('demandes')
    .insert({ nom: 'RLS_TEST', whatsapp: '0', statut: 'en_attente' })
    .select()
  
  if (rlsErr) {
    console.log('RLS blocks anonymous insert:', rlsErr.message)
    console.log('Will need to use service_role key for inserts from Nouveau page')
  } else {
    console.log('Anonymous insert works!')
    await supabaseAdmin.from('demandes').delete().eq('nom', 'RLS_TEST')
  }
}

migrate()
