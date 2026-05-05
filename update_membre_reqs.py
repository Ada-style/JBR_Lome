import os

with open('src/pages/Membre.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Devotion card clickable
devotion_card = """      {/* Verset */}
      <div style={{ background: 'linear-gradient(135deg,#FC1713,#8b0000)', borderRadius: '18px', padding: '28px 24px', color: 'white', marginBottom: '16px', position: 'relative', overflow: 'hidden', boxShadow: !dark ? '0 4px 12px rgba(200,16,46,0.2)' : 'none' }}>"""
new_devotion_card = """      {/* Verset */}
      <div onClick={() => setTab('devotion')} style={{ background: 'linear-gradient(135deg,#FC1713,#8b0000)', borderRadius: '18px', padding: '28px 24px', color: 'white', marginBottom: '16px', position: 'relative', overflow: 'hidden', boxShadow: !dark ? '0 4px 12px rgba(200,16,46,0.2)' : 'none', cursor: 'pointer' }}>"""
c = c.replace(devotion_card, new_devotion_card)

# 2. Add 'Evènements à venir' in Evenements
ev_header = """function Evenements({ theme, supabase, profile }) {
  const [evenements, setEvenements] = useState([])"""
new_ev_header = """function Evenements({ theme, supabase, profile }) {
  const [evenements, setEvenements] = useState([])"""
ev_return = """  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>"""
new_ev_return = """  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Founders Grotesk,sans-serif', margin: 0 }}>Événements à venir</h2>
      </div>"""
c = c.replace(ev_return, new_ev_return)

# 3. Add Domain filter in Communion
comm_header = """function Communion({ theme, supabase }) {
  const [membres, setMembres] = useState([])
  const [search, setSearch] = useState('')"""
new_comm_header = """function Communion({ theme, supabase }) {
  const [membres, setMembres] = useState([])
  const [search, setSearch] = useState('')
  const [filtreDomaine, setFiltreDomaine] = useState('')"""
c = c.replace(comm_header, new_comm_header)

comm_search = """      <div style={{ marginBottom: '20px' }}>
        <input placeholder="Rechercher un membre (nom, prénom...)" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '12px 14px', color: theme.text, fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
      </div>"""
new_comm_search = """      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
        <input placeholder="Rechercher un membre (nom, prénom...)" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '12px 14px', color: theme.text, fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        <select value={filtreDomaine} onChange={e => setFiltreDomaine(e.target.value)} style={{ width: '100%', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '12px 14px', color: theme.text, fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', appearance: 'auto' }}>
          <option value="">Tous les domaines professionnels</option>
          <option value="Étudiant">Étudiants</option>
          <option value="Élève">Élèves</option>
          <option value="Apprenti">Apprentis</option>
          <option value="Professionnel">Professionnels</option>
        </select>
      </div>"""
c = c.replace(comm_search, new_comm_search)

comm_filter = """  const filtered = membres.filter(m => (m.nom + ' ' + m.prenom + ' ' + (m.domaine || '')).toLowerCase().includes(search.toLowerCase()))"""
new_comm_filter = """  const filtered = membres.filter(m => {
    const matchSearch = (m.nom + ' ' + m.prenom + ' ' + (m.domaine || '')).toLowerCase().includes(search.toLowerCase())
    const matchDomaine = filtreDomaine ? (m.domaine || '').toLowerCase().includes(filtreDomaine.toLowerCase()) : true
    return matchSearch && matchDomaine
  })"""
c = c.replace(comm_filter, new_comm_filter)


with open('src/pages/Membre.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Membre.jsx updated with requirements.")
