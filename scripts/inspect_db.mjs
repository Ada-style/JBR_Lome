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

async function inspectTable() {
  // Try to get one row to see the schema
  console.log('=== Inspecting demandes table ===')
  const { data: demandes, error: e1 } = await supabaseAdmin.from('demandes').select('*').limit(1)
  if (e1) console.log('Error:', e1)
  else {
    console.log('Demandes columns:', demandes.length > 0 ? Object.keys(demandes[0]) : 'empty table')
    if (demandes.length > 0) console.log('Sample row:', JSON.stringify(demandes[0], null, 2))
  }

  console.log('\n=== Inspecting utilisateurs table ===')
  const { data: users, error: e2 } = await supabaseAdmin.from('utilisateurs').select('*').limit(1)
  if (e2) console.log('Error:', e2)
  else {
    console.log('Utilisateurs columns:', users.length > 0 ? Object.keys(users[0]) : 'empty table')  
    if (users.length > 0) console.log('Sample row:', JSON.stringify(users[0], null, 2))
  }

  // Try inserting a test row to demandes with minimal fields
  console.log('\n=== Testing insert to demandes ===')
  const { data: testInsert, error: e3 } = await supabaseAdmin
    .from('demandes')
    .insert({
      nom: 'TEST_INSPECTION',
      whatsapp: '+22800000000',
      statut: 'en_attente'
    })
    .select()
  if (e3) {
    console.log('Insert error:', JSON.stringify(e3))
  } else {
    console.log('Insert success! Columns:', Object.keys(testInsert[0]))
    console.log('Row:', JSON.stringify(testInsert[0], null, 2))
    // Clean up test row
    await supabaseAdmin.from('demandes').delete().eq('nom', 'TEST_INSPECTION')
    console.log('Test row cleaned up')
  }
}

inspectTable()
