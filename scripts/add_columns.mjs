// Script to add missing columns to the demandes table
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  'https://qzqphzfbkdtglghloplo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cXBoemZia2R0Z2xnaGxvcGxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA3MjUyNCwiZXhwIjoyMDg5NjQ4NTI0fQ.8NSCK72hcwTz_pcxn4yWVXvY8E3kbV_2qZR1OjCzeDo'
)

async function addColumns() {
  console.log('Adding columns to demandes table...')
  
  const { data, error } = await supabaseAdmin.rpc('exec_sql', {
    query: `
      ALTER TABLE demandes ADD COLUMN IF NOT EXISTS date_anniversaire DATE;
      ALTER TABLE demandes ADD COLUMN IF NOT EXISTS statut_activite TEXT;
      ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS date_anniversaire DATE;
      ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS statut_activite TEXT;
    `
  })

  if (error) {
    console.log('RPC not available, trying direct approach...')
    // Try inserting a test row with the new columns to see if they exist
    const { error: testError } = await supabaseAdmin
      .from('demandes')
      .select('date_anniversaire, statut_activite')
      .limit(1)
    
    if (testError) {
      console.log('Columns do not exist yet. Please run this SQL in Supabase SQL Editor:')
      console.log(`
ALTER TABLE demandes ADD COLUMN IF NOT EXISTS date_anniversaire DATE;
ALTER TABLE demandes ADD COLUMN IF NOT EXISTS statut_activite TEXT;
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS date_anniversaire DATE;
ALTER TABLE utilisateurs ADD COLUMN IF NOT EXISTS statut_activite TEXT;
      `)
    } else {
      console.log('Columns already exist!')
    }
  } else {
    console.log('Columns added successfully!')
  }
}

addColumns()
