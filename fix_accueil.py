import os
import datetime

with open('src/pages/Membre.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix the incorrect 'Événements à venir' header in Accueil
c = c.replace(
    """  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Founders Grotesk,sans-serif', margin: 0 }}>Événements à venir</h2>
      </div>

      {/* Verset */}""",
    """  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>

      {/* Verset */}"""
)

# Put 'Événements à venir' in the correct Evenements component
c = c.replace(
    """function Evenements({ theme, supabase, profile }) {
  const [evenements, setEvenements] = useState([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('evenements_galerie').select('*, photos_galerie(*)').order('date_evenement', { ascending: false })
      if (data) setEvenements(data)
    }
    load()
  }, [])

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      {evenements.map(ev => (""",
    """function Evenements({ theme, supabase, profile }) {
  const [evenements, setEvenements] = useState([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('evenements_galerie').select('*, photos_galerie(*)').order('date_evenement', { ascending: false })
      if (data) setEvenements(data)
    }
    load()
  }, [])

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Founders Grotesk,sans-serif', marginBottom: '20px' }}>Événements à venir</h2>
      {evenements.map(ev => ("""
)

# Add confetti and birthday logic to Accueil
accueil_state_additions = """
  const [anniversairesDuMois, setAnniversairesDuMois] = useState([])
  const [anniversairesDuJour, setAnniversairesDuJour] = useState([])
"""

c = c.replace(
    "  const [requeteMsg, setRequeteMsg] = useState('')\n",
    "  const [requeteMsg, setRequeteMsg] = useState('')\n" + accueil_state_additions
)

accueil_load_additions = """
      // Anniversaires
      const moisActuel = new Date().getMonth() + 1
      const jourActuel = new Date().getDate()
      const { data: usersData } = await supabase.from('utilisateurs').select('*')
      if (usersData) {
        const duMois = usersData.filter(u => {
          if (!u.date_naissance) return false
          const d = new Date(u.date_naissance)
          return d.getMonth() + 1 === moisActuel
        })
        setAnniversairesDuMois(duMois)
        setAnniversairesDuJour(duMois.filter(u => new Date(u.date_naissance).getDate() === jourActuel))
      }
"""

c = c.replace(
    "if (cotisations && cotisations.length > 0) setDerniereCotisation(cotisations[0])",
    "if (cotisations && cotisations.length > 0) setDerniereCotisation(cotisations[0])\n" + accueil_load_additions
)

# Replace the beginning of Accueil return with Birthday block
accueil_return_start = """  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>

      {/* Verset */}"""

birthday_block = """  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>

      {/* Anniversaire du jour */}
      {anniversairesDuJour.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          {anniversairesDuJour.map(a => (
            <div key={a.id} onClick={() => { if (a.whatsapp) window.open(`https://wa.me/${a.whatsapp.replace(/[^0-9]/g, '')}?text=Joyeux%20anniversaire%20${a.prenom}%20!`, '_blank') }} style={{ background: 'linear-gradient(135deg, rgba(252,23,19,0.1), rgba(252,23,19,0.05))', border: '1px solid rgba(252,23,19,0.3)', borderRadius: '18px', padding: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', background: 'url("data:image/svg+xml,%3Csvg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M20 5L22 15L32 17L22 19L20 29L18 19L8 17L18 15L20 5Z\\' fill=\\'%23FC1713\\' fill-opacity=\\'0.1\\'/%3E%3C/svg%3E")', backgroundSize: '40px 40px', animation: 'slideBg 10s linear infinite' }} />
              <style>{`@keyframes slideBg { from { background-position: 0 0; } to { background-position: 40px 40px; } }`}</style>
              {a.avatar_url ? (
                <img src={a.avatar_url} alt="" loading="lazy" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #FC1713' }} />
              ) : (
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #FC1713, #a00d24)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: '700', flexShrink: 0, boxShadow: '0 4px 10px rgba(252,23,19,0.3)' }}>
                  {`${a.prenom?.[0] || ''}${a.nom?.[0] || ''}`.toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 'bold' }}>Joyeux Anniversaire !</div>
                <div style={{ color: theme.text, fontSize: '15px', fontWeight: '700' }}>{a.prenom} {a.nom}</div>
                <div style={{ color: theme.muted, fontSize: '12px' }}>Souhaite-lui un joyeux anniversaire 🎂</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verset */}"""

c = c.replace(accueil_return_start, birthday_block)


# Add small confetti dots to Communion list for members born this month
# Replace communion render item
communion_item = """                {m.avatar_url ? (
                  <img src={m.avatar_url} alt="" loading="lazy" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #FC1713, #a00d24)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>
                    {`${m.prenom?.[0] || ''}${m.nom?.[0] || ''}`.toUpperCase()}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>"""

communion_item_new = """                <div style={{ position: 'relative' }}>
                  {m.date_naissance && (new Date(m.date_naissance).getMonth() === new Date().getMonth()) && (
                    <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#FC1713', borderRadius: '50%', width: '12px', height: '12px', border: `2px solid ${theme.card}`, zIndex: 2 }} />
                  )}
                  {m.avatar_url ? (
                    <img src={m.avatar_url} alt="" loading="lazy" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #FC1713, #a00d24)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>
                      {`${m.prenom?.[0] || ''}${m.nom?.[0] || ''}`.toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>"""

c = c.replace(communion_item, communion_item_new)

with open('src/pages/Membre.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Accueil and Evenement fixes applied.")
