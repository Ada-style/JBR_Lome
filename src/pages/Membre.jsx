import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import md5 from 'md5'

// SVG Icon Components
const Ic = (p) => <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={p.style}>{p.children}</svg>
const IconBell = ({ size }) => <Ic size={size}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></Ic>
const IconX = ({ size }) => <Ic size={size}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Ic>
const IconPray = ({ size }) => <Ic size={size || 32}><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" stroke="none" fill="rgba(255,255,255,0.15)" /><path d="M12 6v4l2 2" strokeWidth="1.5" /><path d="M9 14c0 0 1.5 2 3 2s3-2 3-2" strokeWidth="1.5" /><path d="M8 18l2-2 2 2 2-2 2 2" strokeWidth="1.5" /></Ic>
const IconHeart = ({ size }) => <Ic size={size || 32}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></Ic>
const IconCamera = ({ size }) => <Ic size={size || 32}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></Ic>
const IconCake = ({ size }) => <Ic size={size}><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" /><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" /><path d="M2 21h20" /><path d="M7 8v3" /><path d="M12 8v3" /><path d="M17 8v3" /><path d="M7 4h.01" /><path d="M12 4h.01" /><path d="M17 4h.01" /></Ic>
const IconBriefcase = ({ size }) => <Ic size={size}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></Ic>
const IconStar = ({ size, filled }) => <svg width={size || 28} height={size || 28} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
const IconCheck = ({ size }) => <Ic size={size || 11}><polyline points="20 6 9 17 4 12" /></Ic>
const IconHome = () => <Ic size={14}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></Ic>
const IconBookOpen = () => <Ic size={14}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></Ic>
const IconCalendarMembre = () => <Ic size={14}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Ic>
const IconUsers = () => <Ic size={14}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Ic>
const IconSun = () => <Ic size={14}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></Ic>
const IconMoon = () => <Ic size={14}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></Ic>
const IconPhone = () => <Ic size={14}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.86.36 1.87.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.94.34 1.95.57 2.81.7A2 2 0 0 1 22 16.92z" /></Ic>
const IconSend2 = ({ size }) => <Ic size={size || 20}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></Ic>
const IconGift = ({ size }) => <Ic size={size || 20}><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></Ic>


export default function Membre() {
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()
  const [tab, setTab] = useState('accueil')
  const [dark, setDark] = useState(true)
  const [notifs, setNotifs] = useState([])
  const [showNotifPanel, setShowNotifPanel] = useState(false)
  const [showProfil, setShowProfil] = useState(false)
  const [luesAnnonces, setLuesAnnonces] = useState([])
  const [touchStart, setTouchStart] = useState(null)
  const [profilTab, setProfilTab] = useState('info')

  const theme = {
    bg: dark ? '#0f0f0f' : '#f4f4f5',
    card: dark ? 'rgba(255,255,255,0.06)' : '#ffffff',
    border: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    text: dark ? '#ffffff' : '#111111',
    muted: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
  }

  const gravatarUrl = (email) =>
    `https://www.gravatar.com/avatar/${md5(email?.toLowerCase().trim() || '')}?d=identicon&s=200`

  useEffect(() => {
    async function loadNotifs() {
      const { data } = await supabase
        .from('annonces')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      setNotifs(data || [])
    }
    loadNotifs()

    // Charger les annonces lues depuis localStorage
    const lues = JSON.parse(localStorage.getItem('lues_annonces') || '[]')
    setLuesAnnonces(lues)
  }, [])

  const tabs = [
    { id: 'accueil', label: 'Accueil', icon: <IconHome /> },
    { id: 'devotion', label: 'Dévotion', icon: <IconBookOpen /> },
    { id: 'evenements', label: 'Événements', icon: <IconCalendarMembre /> },
    { id: 'communion', label: 'Communion', icon: <IconUsers /> },
    { id: 'contact', label: 'Contact', icon: <IconPhone /> },
  ]

  function handleSwipe(dir) {
    const ids = tabs.map(t => t.id)
    const idx = ids.indexOf(tab)
    if (dir === 'left' && idx < ids.length - 1) setTab(ids[idx + 1])
    if (dir === 'right' && idx > 0) setTab(ids[idx - 1])
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  function marquerLu(id) {
    const nouvellesLues = [...luesAnnonces, id]
    setLuesAnnonces(nouvellesLues)
    localStorage.setItem('lues_annonces', JSON.stringify(nouvellesLues))
  }

  function marquerToutLu() {
    const toutesIds = notifs.map(n => n.id)
    setLuesAnnonces(toutesIds)
    localStorage.setItem('lues_annonces', JSON.stringify(toutesIds))
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, transition: 'background 0.3s' }}>

      {/* Topbar */}
      <div style={{ background: dark ? '#1a1a1a' : '#ffffff', borderBottom: '2px solid #FC1713', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', position: 'sticky', top: 0, zIndex: 50 }}>
        <img src="/logo.png" alt="Logo" loading="lazy" style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '6px' }} />
        <div style={{ flex: 1 }}>
          <div style={{ color: theme.text, fontSize: '13px', fontWeight: '600' }}>Groupe des jeunes du Rocher</div>
          <div style={{ color: theme.muted, fontSize: '10px' }}>Espace membre</div>
        </div>
        <button onClick={() => setDark(!dark)} style={{ background: 'none', border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '5px 12px', color: theme.muted, fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center' }}>
          {dark ? <IconSun /> : <IconMoon />}
        </button>
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowNotifPanel(!showNotifPanel)}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', position: 'relative', color: theme.muted, display: 'flex' }}>
            <IconBell size={18} />
          </button>
          {notifs.filter(n => !luesAnnonces.includes(n.id)).length > 0 && (
            <div style={{ position: 'absolute', top: '0px', right: '0px', background: '#FC1713', color: 'white', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' }}>
              {notifs.filter(n => !luesAnnonces.includes(n.id)).length}
            </div>
          )}
        </div>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: profile?.avatar_url ? 'transparent' : '#FC1713', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: '700', cursor: 'pointer', overflow: 'hidden', transition: 'transform 0.2s' }} onClick={() => setShowProfil(true)} title="Profil">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
          ) : (
            <img src={gravatarUrl(profile?.email)} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} alt="Avatar" />
          )}
        </div>
      </div>

      {/* Panel notifications - avec backdrop pour click-outside */}
      {showNotifPanel && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 35 }} onClick={() => setShowNotifPanel(false)} />
      )}
      {showNotifPanel && (
        <div style={{ position: 'absolute', top: '55px', left: 0, right: 0, background: dark ? '#1a1a1a' : '#ffffff', borderBottom: `1px solid ${theme.border}`, zIndex: 40, animation: 'slideDown 0.3s ease-in-out' }}>
          <style>{`@keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
          <div style={{ padding: '12px 16px', maxWidth: '600px', margin: '0 auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: theme.muted }}>Notifications récentes</div>
              {notifs.filter(n => !luesAnnonces.includes(n.id)).length > 0 && (
                <button onClick={marquerToutLu} style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '6px', padding: '4px 8px', color: '#FC1713', fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Tout marquer comme lu
                </button>
              )}
            </div>
            {notifs.length === 0 ? (
              <div style={{ color: theme.muted, fontSize: '13px', padding: '10px 0' }}>Aucune notification</div>
            ) : (
              notifs.map(n => (
                <div key={n.id} onClick={() => marquerLu(n.id)} style={{ background: theme.card, border: `1px solid ${n.urgent ? '#FC1713' : theme.border}`, borderRadius: '8px', padding: '10px 12px', marginBottom: '8px', cursor: 'pointer', opacity: luesAnnonces.includes(n.id) ? 0.6 : 1, borderLeft: n.urgent ? '3px solid #FC1713' : '3px solid transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ color: theme.text, fontSize: '12px', fontWeight: '600' }}>{n.titre}</div>
                    {n.urgent && <span style={{ background: 'rgba(200,16,46,0.15)', color: '#FC1713', fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '8px' }}>URGENT</span>}
                    {luesAnnonces.includes(n.id) && <span style={{ color: theme.muted, fontSize: '9px' }}>✓ Lu</span>}
                  </div>
                  {n.contenu && <div style={{ color: theme.muted, fontSize: '11px', marginTop: '4px' }}>{n.contenu}</div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <AdminAccess navigate={navigate} theme={theme} profile={profile} />

      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: dark ? '#1a1a1a' : '#ffffff', borderTop: `1px solid ${theme.border}`, display: 'flex', zIndex: 50 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: '10px 4px 8px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontFamily: 'inherit', color: tab === t.id ? '#FC1713' : theme.muted }}>
            {t.icon}
            <span style={{ fontSize: '9px', fontWeight: tab === t.id ? '600' : '400' }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div style={{ paddingBottom: '70px' }}
        onTouchStart={e => setTouchStart(e.touches[0].clientX)}
        onTouchEnd={e => { if (touchStart === null) return; const diff = touchStart - e.changedTouches[0].clientX; if (Math.abs(diff) > 60) handleSwipe(diff > 0 ? 'left' : 'right'); setTouchStart(null); }}
      >
        {tab === 'accueil' && <Accueil theme={theme} supabase={supabase} dark={dark} profile={profile} setTab={setTab} />}
        {tab === 'devotion' && <Devotion theme={theme} supabase={supabase} dark={dark} profile={profile} />}
        {tab === 'evenements' && <Evenements theme={theme} supabase={supabase} profile={profile} />}
        {tab === 'communion' && <Communion theme={theme} supabase={supabase} />}
        {tab === 'contact' && <Contact theme={theme} supabase={supabase} />}
        {tab === 'accueil' && <Accueil theme={theme} supabase={supabase} dark={dark} profile={profile} setTab={setTab} setShowProfil={setShowProfil} setProfilTab={setProfilTab} />}
      </div>

      {/* Panel Profil - side modal */}
      {showProfil && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} onClick={() => setShowProfil(false)} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '600px', background: theme.bg, zIndex: 101, display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 16px rgba(0,0,0,0.2)', animation: 'slideInRight 0.3s ease-in-out' }} onClick={e => e.stopPropagation()}>
            <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${theme.border}` }}>
              <h2 style={{ color: theme.text, fontSize: '16px', fontWeight: '700', margin: 0 }}>Mon Profil</h2>
              <button onClick={() => setShowProfil(false)} style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', padding: 0, display: 'flex' }}><IconX size={20} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <Profil theme={theme} supabase={supabase} profile={profile} handleSignOut={handleSignOut} navigate={navigate} initialTab={profilTab} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}


function Accueil({ theme, supabase, dark, profile, setTab, setShowProfil, setProfilTab }) {
  const [devotion, setDevotion] = useState(null)
  const [annonces, setAnnonces] = useState([])
  const [evenements, setEvenements] = useState([])
  const [activeEv, setActiveEv] = useState(null)
  const [lightbox, setLightbox] = useState(null)
  const [expandPrayer, setExpandPrayer] = useState(false)
  const [derniereCotisation, setDerniereCotisation] = useState(null)
  const [showRequeteModal, setShowRequeteModal] = useState(null)
  const [requeteTexte, setRequeteTexte] = useState('')
  const [requeteMsg, setRequeteMsg] = useState('')

  const [anniversairesDuMois, setAnniversairesDuMois] = useState([])
  const [anniversairesDuJour, setAnniversairesDuJour] = useState([])

  const EVENEMENTS_LOCAUX = [
    {
      id: 'local-cine',
      nom: 'Soirée Cinéma',
      date_evenement: '2023-05-01',
      photos_galerie: [
        { id: 'c1', url: '/cine1.jpeg' },
        { id: 'c2', url: '/cine2.jpeg' },
        { id: 'c3', url: '/cine3.jpeg' },
        { id: 'c4', url: '/cine4.jpeg' },
        { id: 'c5', url: '/cine5.jpeg' },
        { id: 'c6', url: '/cine6.jpeg' },
      ]
    },
    {
      id: 'local-detente',
      nom: 'Sortie Détente',
      date_evenement: '2023-08-01',
      photos_galerie: [
        { id: 'd1', url: '/detente1.jpg' },
        { id: 'd2', url: '/detente2.jpg' },
        { id: 'd3', url: '/detente3.jpg' },
        { id: 'd4', url: '/detente4.jpg' },
        { id: 'd5', url: '/detente5.jpg' },
      ]
    },
  ]

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().split('T')[0]
      const { data: devData } = await supabase.from('devotions').select('*').order('date_devotion', { ascending: false }).limit(1)
      const dev = devData?.[0] || null
      setDevotion(dev)
      const { data: ann } = await supabase.from('annonces').select('*').order('created_at', { ascending: false }).limit(5)
      if (ann) setAnnonces(ann)
      const { data: ev } = await supabase.from('evenements_galerie').select('*, photos_galerie(*)').order('date_evenement', { ascending: false })
      if (ev && ev.length > 0) {
        setEvenements([...ev, ...EVENEMENTS_LOCAUX])
        setActiveEv(ev[0].id)
      } else {
        setEvenements(EVENEMENTS_LOCAUX)
        setActiveEv('local-detente')
      }
      const { data: cotisations } = await supabase
        .from('cotisations')
        .select('*')
        .eq('utilisateur_id', profile?.id)
        .order('created_at', { ascending: false })
        .limit(1)
      if (cotisations && cotisations.length > 0) setDerniereCotisation(cotisations[0])

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

    }
    load()
  }, [])

  const evActif = evenements.find(e => e.id === activeEv)

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>

      {/* Anniversaire du jour */}
      {anniversairesDuJour.map(a => (
        <div key={a.id}
          onClick={() => a.whatsapp && window.open(`https://wa.me/${a.whatsapp.replace(/[^0-9]/g, '')}?text=Joyeux%20anniversaire%20${a.prenom}%20!`, '_blank')}
          style={{ background: 'linear-gradient(135deg,rgba(252,23,19,0.1),rgba(252,23,19,0.05))', border: '1px solid rgba(252,23,19,0.3)', borderRadius: '16px', padding: '14px 16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div style={{ fontSize: '28px' }}>🎂</div>
          <div>
            <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '700' }}>Joyeux anniversaire !</div>
            <div style={{ color: theme.text, fontSize: '15px', fontWeight: '700' }}>{a.prenom} {a.nom}</div>
            <div style={{ color: theme.muted, fontSize: '11px' }}>Appuie pour lui envoyer un message</div>
          </div>
        </div>
      ))}

      {/* Membres nés ce mois (confettis) */}
      {anniversairesDuMois.length > 0 && anniversairesDuJour.length === 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
          {anniversairesDuMois.slice(0, 5).map((a, i) => (
            <div key={a.id} style={{ position: 'relative', flexShrink: 0, animation: `bounce ${1 + i * 0.15}s ease-in-out infinite` }}>
              {a.avatar_url ? (
                <img src={a.avatar_url} alt="" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FC1713' }} />
              ) : (
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#FC1713', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700' }}>
                  {a.prenom?.[0]}{a.nom?.[0]}
                </div>
              )}
              <div style={{ position: 'absolute', top: '-4px', right: '-2px', fontSize: '10px' }}>🎂</div>
            </div>
          ))}
          <span style={{ color: theme.muted, fontSize: '11px', flexShrink: 0 }}>
            {anniversairesDuMois.length} anniversaire{anniversairesDuMois.length > 1 ? 's' : ''} ce mois
          </span>
        </div>
      )}
      {/* Verset */}
      <div onClick={() => setTab('devotion')} style={{ background: 'linear-gradient(135deg,#FC1713,#8b0000)', borderRadius: '18px', padding: '28px 24px', color: 'white', marginBottom: '16px', position: 'relative', overflow: 'hidden', boxShadow: !dark ? '0 4px 12px rgba(200,16,46,0.2)' : 'none', cursor: 'pointer' }}>
        <div style={{ position: 'absolute', top: '-20px', left: '10px', fontFamily: 'Georgia,serif', fontSize: '100px', color: 'rgba(255,255,255,0.06)', lineHeight: 1 }}>"</div>
        <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.7, marginBottom: '12px' }}>Dévotion du jour</div>
        {devotion ? (
          <>
            {devotion.titre && <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', opacity: 0.9 }}>{devotion.titre}</div>}
            <div style={{ fontFamily: 'Georgia,serif', fontSize: '18px', fontStyle: 'italic', lineHeight: '1.7', marginBottom: '8px' }}>« {devotion.verset} »</div>
            <div style={{ fontSize: '12px', fontWeight: '700', opacity: 0.8 }}>• {devotion.reference}</div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: '18px', fontStyle: 'italic', lineHeight: '1.7', marginBottom: '8px' }}>« Je puis tout par Christ qui me fortifie. »</div>
            <div style={{ fontSize: '12px', fontWeight: '700', opacity: 0.8 }}>• Philippiens 4:13</div>
          </>
        )}
      </div>

      {/* Ma prière */}
      {devotion?.priere && (
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px', marginBottom: '16px', boxShadow: !dark ? '0 2px 8px rgba(0,0,0,0.07)' : 'none' }}>
          <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Ma prière</div>
          <p style={{ color: theme.muted, fontSize: '13px', lineHeight: '1.8', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: expandPrayer ? 'unset' : '2', WebkitBoxOrient: 'vertical', overflow: expandPrayer ? 'unset' : 'hidden', maxHeight: expandPrayer ? 'unset' : '80px', transition: 'all 0.3s ease-in-out' }}>{devotion.priere}</p>
          {devotion.priere.length > 100 && (
            <button onClick={() => setExpandPrayer(!expandPrayer)} style={{ background: 'none', border: 'none', color: '#FC1713', fontSize: '11px', fontWeight: '600', cursor: 'pointer', marginTop: '8px', fontFamily: 'inherit', padding: 0 }}>
              {expandPrayer ? '← Réduire' : 'Lire plus →'}
            </button>
          )}
        </div>
      )}

      {/* Annonces */}
      {annonces.length > 0 && (
        <>
          <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: theme.muted, marginBottom: '10px' }}>Annonces</div>
          {annonces.map(a => (
            <div key={a.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderLeft: `3px solid ${a.urgent ? '#FC1713' : '#999'}`, borderRadius: '10px', padding: '12px 14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: !dark ? '0 2px 8px rgba(0,0,0,0.07)' : 'none' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.urgent ? '#FC1713' : '#555', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: theme.text, fontSize: '13px', fontWeight: '600' }}>{a.titre}</div>
                {a.contenu && <div style={{ color: theme.muted, fontSize: '12px', marginTop: '2px' }}>{a.contenu}</div>}
              </div>
              {a.urgent && <span style={{ background: 'rgba(200,16,46,0.15)', color: '#FC1713', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '8px', flexShrink: 0 }}>!</span>}
            </div>
          ))}
        </>
      )}

      {/* Bandeau cotisation */}
      {derniereCotisation?.statut !== 'paye' && (
        <div
          onClick={() => { setShowProfil(true); setProfilTab('cotisations') }}
          style={{
            background: 'rgba(200,16,46,0.05)',
            border: '1px solid rgba(200,16,46,0.2)',
            borderRadius: '12px', padding: '12px 14px',
            marginBottom: '16px', marginTop: '8px',
            display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'
          }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FC1713', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: '#FC1713', fontSize: '13px', fontWeight: '600' }}>
              {!derniereCotisation ? 'Aucune cotisation ce mois' : 'Cotisation en retard'}
            </div>
            <div style={{ color: theme.muted, fontSize: '11px', marginTop: '2px' }}>Appuie pour régulariser</div>
          </div>
          <div style={{ background: '#FC1713', color: 'white', borderRadius: '8px', padding: '6px 12px', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>
            Je régularise
          </div>
        </div>
      )}
      {derniereCotisation?.statut === 'paye' && (
        <div style={{
          background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.2)',
          borderRadius: '12px', padding: '12px 14px', marginBottom: '16px', marginTop: '8px',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#25d366', flexShrink: 0 }} />
          <div style={{ color: '#25d366', fontSize: '13px', fontWeight: '600' }}>Cotisation du mois en ordre</div>
        </div>
      )}

      {/* Galerie */}
      {evenements.length > 0 && (
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '16px', marginBottom: '16px', marginTop: '16px', boxShadow: !dark ? '0 2px 8px rgba(0,0,0,0.07)' : 'none' }}>
          <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: theme.muted, marginBottom: '12px' }}>Nos moments</div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '14px', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            {evenements.map(ev => (
              <button key={ev.id} onClick={() => setActiveEv(ev.id)} style={{ background: activeEv === ev.id ? '#FC1713' : theme.bg, border: `1px solid ${activeEv === ev.id ? '#FC1713' : theme.border}`, borderRadius: '20px', padding: '6px 14px', color: activeEv === ev.id ? 'white' : theme.muted, fontSize: '11px', fontWeight: activeEv === ev.id ? '600' : '400', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', flexShrink: 0 }}>
                {ev.nom}
              </button>
            ))}
          </div>
          {evActif && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {evActif.photos_galerie?.map((p, i) => (
                <img key={p.id} src={p.url} alt="" loading="lazy" onClick={() => setLightbox(p.url)} style={{ width: '100%', height: i === 0 ? '200px' : '130px', objectFit: 'cover', borderRadius: '10px', cursor: 'pointer', gridColumn: i === 0 ? 'span 2' : 'span 1', boxShadow: !dark ? '0 2px 8px rgba(0,0,0,0.1)' : 'none' }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Requête / Témoignage / Soutenir */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
        <button onClick={() => setShowRequeteModal('requete')} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', fontFamily: 'inherit', color: theme.text }}>
          <IconPray size={24} />
          <span style={{ fontSize: '12px', fontWeight: '600' }}>Déposer ma requête</span>
        </button>
        <button onClick={() => setShowRequeteModal('temoignage')} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', fontFamily: 'inherit', color: theme.text }}>
          <IconHeart size={24} />
          <span style={{ fontSize: '12px', fontWeight: '600' }}>Rendre témoignage</span>
        </button>
      </div>

      {/* Modal Requête / Témoignage */}
      {showRequeteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => { setShowRequeteModal(null); setRequeteTexte(''); setRequeteMsg(''); }}>
          <div style={{ background: dark ? '#1a1a1a' : '#fff', borderRadius: '20px 20px 0 0', padding: '28px 20px', width: '100%', maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '40px', height: '4px', background: theme.border, borderRadius: '2px', margin: '0 auto 20px' }} />
            <div style={{ color: theme.text, fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
              {showRequeteModal === 'requete' ? 'Je veux qu\'on prie pour moi...' : 'Je veux témoigner...'}
            </div>
            <div style={{ color: theme.muted, fontSize: '12px', marginBottom: '16px' }}>
              {showRequeteModal === 'requete' ? 'Partagez votre sujet de prière avec le bureau.' : 'Partagez ce que Dieu a fait pour vous.'}
            </div>
            {requeteMsg && <div style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '8px', padding: '8px 12px', color: '#25d366', fontSize: '12px', marginBottom: '12px' }}>{requeteMsg}</div>}
            <textarea placeholder={showRequeteModal === 'requete' ? 'Écrivez votre requête ici...' : 'Écrivez votre témoignage ici...'} value={requeteTexte} onChange={e => setRequeteTexte(e.target.value)} rows={4} style={{ width: '100%', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '10px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '12px', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }} />
            <button onClick={async () => { if (!requeteTexte) return; await supabase.from('requetes_priere').insert({ membre_id: profile?.id, contenu: requeteTexte, type: showRequeteModal }); setRequeteMsg('Envoyé avec succès !'); setRequeteTexte(''); setTimeout(() => { setShowRequeteModal(null); setRequeteMsg(''); }, 1500); }} style={{ width: '100%', background: '#FC1713', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
              Envoyer
            </button>
          </div>
        </div>
      )}
      <button onClick={() => window.open('https://wa.me/22890000000?text=Je souhaite soutenir l oeuvre', '_blank')} style={{ width: '100%', marginTop: '12px', background: 'linear-gradient(135deg, #0965BA, #064a8a)', color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <IconGift size={18} />
        Soutenir l'oeuvre
      </button>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <img src={lightbox} alt="" loading="lazy" style={{ maxWidth: '95%', maxHeight: '90vh', borderRadius: '10px' }} />
        </div>
      )}
    </div>
  )
}

function Devotion({ theme, supabase, dark, profile }) {
  const [devotion, setDevotion] = useState(null)
  const [expandPrayer, setExpandPrayer] = useState(false)
  const [commentaires, setCommentaires] = useState([])
  const [nouveauComm, setNouveauComm] = useState('')

  useEffect(() => {
    async function load() {
      const { data: devData } = await supabase.from('devotions').select('*').order('date_devotion', { ascending: false }).limit(1)
      const dev = devData?.[0] || null
      setDevotion(dev)
      if (dev) {
        const { data: commData } = await supabase.from('commentaires_devotion').select('*, utilisateurs(prenom, nom, avatar_url)').eq('devotion_id', dev.id).order('created_at', { ascending: true })
        if (commData) setCommentaires(commData)
      }
    }
    load()
  }, [])

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg,#FC1713,#8b0000)', borderRadius: '18px', padding: '28px 24px', color: 'white', marginBottom: '16px', textAlign: 'center', boxShadow: !dark ? '0 4px 12px rgba(200,16,46,0.2)' : 'none' }}>
        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}><IconHeart size={36} /></div>
        <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.7, marginBottom: '12px' }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
        {devotion ? (
          <>
            {devotion.titre && <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', opacity: 0.9 }}>{devotion.titre}</div>}
            <div style={{ fontFamily: 'Georgia,serif', fontSize: '18px', fontStyle: 'italic', lineHeight: '1.7', marginBottom: '8px' }}>« {devotion.verset} »</div>
            <div style={{ fontSize: '13px', fontWeight: '700', opacity: 0.85 }}>• {devotion.reference}</div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: '18px', fontStyle: 'italic', lineHeight: '1.7', marginBottom: '8px' }}>« Je puis tout par Christ qui me fortifie. »</div>
            <div style={{ fontSize: '13px', fontWeight: '700', opacity: 0.85 }}>• Philippiens 4:13</div>
          </>
        )}
      </div>

      {devotion?.priere && (
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '20px', marginBottom: '16px', boxShadow: !dark ? '0 2px 8px rgba(0,0,0,0.07)' : 'none' }}>
          <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Ma prière</div>
          <p style={{ color: theme.muted, fontSize: '14px', lineHeight: '1.9', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: expandPrayer ? 'unset' : '3', WebkitBoxOrient: 'vertical', overflow: expandPrayer ? 'unset' : 'hidden', maxHeight: expandPrayer ? 'unset' : '120px', transition: 'all 0.3s ease-in-out' }}>{devotion.priere}</p>
          <button onClick={() => setExpandPrayer(!expandPrayer)} style={{ background: 'none', border: 'none', color: '#FC1713', fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', fontFamily: 'inherit', padding: 0 }}>
            {expandPrayer ? '← Réduire' : 'Lire plus →'}
          </button>
        </div>
      )}

      {/* Commentaires / Édification */}
      {devotion && (
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '20px', boxShadow: !dark ? '0 2px 8px rgba(0,0,0,0.07)' : 'none' }}>
          <div style={{ color: theme.text, fontSize: '14px', fontWeight: 'bold', marginBottom: '16px' }}>Édification ({commentaires.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
            {commentaires.map(cm => (
              <div key={cm.id} style={{ display: 'flex', gap: '10px' }}>
                {cm.utilisateurs?.avatar_url ? (
                  <img src={cm.utilisateurs.avatar_url} loading="lazy" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#FC1713', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 'bold', flexShrink: 0 }}>
                    {cm.utilisateurs?.prenom?.[0]}{cm.utilisateurs?.nom?.[0]}
                  </div>
                )}
                <div style={{ background: theme.bg, borderRadius: '12px', padding: '10px 12px', flex: 1, border: `1px solid ${theme.border}` }}>
                  <div style={{ color: theme.text, fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>{cm.utilisateurs?.prenom} {cm.utilisateurs?.nom}</div>
                  <div style={{ color: theme.text, fontSize: '12px', lineHeight: '1.4' }}>{cm.contenu}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input placeholder="Ajouter un commentaire..." value={nouveauComm} onChange={e => setNouveauComm(e.target.value)} style={{ flex: 1, background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '10px 14px', color: theme.text, fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
            <button onClick={async () => { if (!nouveauComm || !devotion || !profile) return; await supabase.from('commentaires_devotion').insert({ devotion_id: devotion.id, membre_id: profile.id, contenu: nouveauComm }); setNouveauComm(''); const { data } = await supabase.from('commentaires_devotion').select('*, utilisateurs(prenom, nom, avatar_url)').eq('devotion_id', devotion.id).order('created_at', { ascending: true }); if (data) setCommentaires(data); }} style={{ background: '#FC1713', color: 'white', border: 'none', borderRadius: '20px', padding: '0 16px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit' }}>Envoyer</button>
          </div>
        </div>
      )}
    </div>
  )
}


function Evenements({ theme, supabase, profile }) {
  const [evenements, setEvenements] = useState([])
  const [feedbackEv, setFeedbackEv] = useState(null)
  const [note, setNote] = useState(5)
  const [contenu, setContenu] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('evenements').select('*').order('date_evenement', { ascending: true })
      if (error) {
        console.log('❌ Erreur chargement événements:', error)
        return
      }
      if (data) setEvenements(data)
    }
    load()
  }, [])

  async function envoyerFeedback() {
    if (!contenu) { setMsg('Rédigez votre feedback'); return }
    await supabase.from('feedbacks').insert({
      utilisateur_id: profile?.id,
      contenu,
      note
    })
    setMsg('Feedback envoyé, merci !')
    setFeedbackEv(null)
    setContenu('')
    setNote(5)
  }

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Founders Grotesk,sans-serif', margin: 0 }}>Événements à venir</h2>
      </div>
      {evenements.length === 0 && (
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '24px', textAlign: 'center', color: theme.muted, fontSize: '13px' }}>
          Aucun événement à venir pour le moment
        </div>
      )}
      {evenements.map(ev => (
        <div key={ev.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', overflow: 'hidden', marginBottom: '12px' }}>
          <div style={{ background: ev.urgent ? '#FC1713' : '#16a34a', padding: '6px 14px' }}>
            <span style={{ color: 'white', fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{ev.urgent ? 'URGENT' : 'ÉVÉNEMENT'}</span>
          </div>
          <div style={{ padding: '14px' }}>
            <div style={{ color: theme.text, fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{ev.titre}</div>
            <div style={{ color: theme.muted, fontSize: '12px', marginBottom: '8px' }}>{new Date(ev.date_evenement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            {ev.description && <p style={{ color: theme.muted, fontSize: '13px', lineHeight: '1.7', marginBottom: '12px' }}>{ev.description}</p>}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ flex: 1, background: '#FC1713', color: 'white', border: 'none', borderRadius: '8px', padding: '9px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600' }}>
                Je participe
              </button>
              <button onClick={() => setFeedbackEv(ev)} style={{ flex: 1, background: theme.bg, color: theme.muted, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                Feedback
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Modal feedback */}
      {feedbackEv && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setFeedbackEv(null)}>
          <div style={{ background: theme.bg, borderRadius: '20px 20px 0 0', padding: '28px 20px', width: '100%', maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '40px', height: '4px', background: theme.border, borderRadius: '2px', margin: '0 auto 20px' }} />
            <div style={{ color: theme.text, fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{feedbackEv.titre}</div>
            <div style={{ color: theme.muted, fontSize: '12px', marginBottom: '16px' }}>Donnez votre avis sur cet événement</div>
            {msg && <div style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '8px', padding: '8px 12px', color: '#FC1713', fontSize: '12px', marginBottom: '12px' }}>{msg}</div>}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setNote(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: n <= note ? '#f59e0b' : '#444', display: 'flex' }}><IconStar filled={n <= note} /></button>
              ))}
            </div>
            <textarea placeholder="Votre commentaire..." value={contenu} onChange={e => setContenu(e.target.value)} rows={4} style={{ width: '100%', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '10px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '12px', fontFamily: 'inherit', resize: 'none' }} />
            <button onClick={envoyerFeedback} style={{ width: '100%', background: '#FC1713', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
              Envoyer mon feedback
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Communion({ theme, supabase }) {
  const [membres, setMembres] = useState([])
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('utilisateurs').select('*').order('nom', { ascending: true })
      if (data) setMembres(data)
    }
    load()
  }, [supabase])

  const filteredMembres = membres.filter(m => {
    if (!search) return true
    const s = search.toLowerCase()
    return (m.prenom?.toLowerCase().includes(s) || m.nom?.toLowerCase().includes(s) || m.domaine?.toLowerCase().includes(s))
  })
  {/* Filtre domaine */ }
  {
    (() => {
      const domaines = [...new Set(membres.map(m => {
        if (!m.domaine) return null
        const d = m.domaine.split(' - ')
        return d[0]
      }).filter(Boolean))]
      return domaines.length > 0 ? (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          <button
            onClick={() => setSearch('')}
            style={{
              background: !search ? '#FC1713' : theme.card,
              border: `1px solid ${!search ? '#FC1713' : theme.border}`,
              borderRadius: '20px', padding: '6px 14px',
              color: !search ? 'white' : theme.muted,
              fontSize: '11px', fontWeight: !search ? '600' : '400',
              cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', flexShrink: 0
            }}
          >
            Tous
          </button>
          {domaines.map(d => (
            <button
              key={d}
              onClick={() => setSearch(d)}
              style={{
                background: search === d ? '#FC1713' : theme.card,
                border: `1px solid ${search === d ? '#FC1713' : theme.border}`,
                borderRadius: '20px', padding: '6px 14px',
                color: search === d ? 'white' : theme.muted,
                fontSize: '11px', fontWeight: search === d ? '600' : '400',
                cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', flexShrink: 0
              }}
            >
              {d}
            </button>
          ))}
        </div>
      ) : null
    })()
  }

  function formatBirthday(dateStr) {
    if (!dateStr) return null
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
    } catch { return null }
  }

  function getStatutLabel(statut) {
    const labels = { 'eleve': 'Élève', 'etudiant': 'Étudiant', 'apprenti': 'Apprenti', 'professionnel': 'Professionnel' }
    return labels[statut] || ''
  }

  return (
    <div style={{ padding: '16px', maxWidth: '960px', margin: '0 auto' }}>
      <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Founders Grotesk,sans-serif', marginBottom: '6px' }}>Communion</h2>
      <p style={{ color: theme.muted, fontSize: '12px', marginBottom: '16px' }}>Annuaire des membres de la jeunesse</p>

      {/* Barre de recherche */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          placeholder="Chercher un membre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '10px 12px 10px 36px', color: theme.text, fontSize: '13px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '14px' }}>
        {filteredMembres.map(m => (
          <button key={m.id} onClick={() => setSelected(m)} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '18px', textAlign: 'left', cursor: 'pointer', color: 'inherit', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden', transition: 'border-color 0.2s, transform 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {m.avatar_url ? (
                <img src={m.avatar_url} alt="" loading="lazy" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #FC1713, #a00d24)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px', fontWeight: '700', flexShrink: 0 }}>
                  {`${m.prenom?.[0] || ''}${m.nom?.[0] || ''}`.toUpperCase()}
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: theme.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.prenom} {m.nom}</div>
                <div style={{ fontSize: '11px', color: theme.muted, marginTop: '3px' }}>{m.domaine || 'Membre'}</div>
              </div>
            </div>
            {m.date_naissance && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: theme.muted }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-3-3.87" /><path d="M4 21v-2a4 4 0 0 1 3-3.87" /><circle cx="12" cy="7" r="4" />
                </svg>
                Anniversaire : {formatBirthday(m.date_naissance)}
              </div>
            )}
            {m.bio && <div style={{ fontSize: '11px', color: theme.muted, lineHeight: '1.5' }}>{m.bio.length > 60 ? `${m.bio.slice(0, 60)}...` : m.bio}</div>}
          </button>
        ))}
      </div>

      {filteredMembres.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px', color: theme.muted, fontSize: '13px' }}>Aucun membre trouvé</div>
      )}

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelected(null)}>
          <div style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '20px', width: '100%', maxWidth: '520px', padding: '28px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: theme.muted, fontSize: '22px', cursor: 'pointer' }}>✕</button>

            {selected.avatar_url ? (
              <img src={selected.avatar_url} alt="" loading="lazy" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 18px', display: 'block', border: '3px solid #FC1713' }} />
            ) : (
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #FC1713, #a00d24)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '28px', fontWeight: '700', margin: '0 auto 18px' }}>
                {`${selected.prenom?.[0] || ''}${selected.nom?.[0] || ''}`.toUpperCase()}
              </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: theme.text, fontFamily: 'Founders Grotesk,sans-serif' }}>{selected.prenom} {selected.nom}</div>
              {selected.domaine && <div style={{ fontSize: '12px', color: theme.muted, marginTop: '6px' }}>{selected.domaine}</div>}
            </div>

            {/* Info Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              {selected.date_naissance && (
                <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FC1713" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '4px' }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <div style={{ fontSize: '11px', color: theme.muted }}>Date de naissance</div>
                  <div style={{ fontSize: '13px', color: theme.text, fontWeight: '600', marginTop: '2px' }}>{formatBirthday(selected.date_naissance)}</div>
                </div>
              )}
              {selected.statut_activite && (
                <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FC1713" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '4px' }}>
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <div style={{ fontSize: '11px', color: theme.muted }}>Statut</div>
                  <div style={{ fontSize: '13px', color: theme.text, fontWeight: '600', marginTop: '2px' }}>{getStatutLabel(selected.statut_activite)}</div>
                </div>
              )}
            </div>

            <div style={{ color: theme.muted, fontSize: '13px', lineHeight: '1.8', marginBottom: '20px' }}>{selected.bio || 'Aucune bio renseignée.'}</div>
            {selected.whatsapp && (
              <a href={`https://wa.me/${selected.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}?text=${encodeURIComponent(`Bonjour ${selected.prenom}, je t'ai trouvé dans la communion de la Jeunesse Groupe des jeunes du Rocher !`)}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#25d366', color: 'white', borderRadius: '12px', padding: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.632-1.467A11.932 11.932 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818c-2.168 0-4.207-.579-5.961-1.591l-.427-.254-2.748.871.879-2.682-.277-.44A9.774 9.774 0 0 1 2.182 12c0-5.423 4.395-9.818 9.818-9.818S21.818 6.577 21.818 12 17.423 21.818 12 21.818z" /></svg>
                Contacter sur WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Profil({ theme, supabase, profile, handleSignOut, navigate, initialTab = 'info' }) {
  const [tab, setTab] = useState(initialTab)
  const [bio, setBio] = useState(profile?.bio || '')
  const [editing, setEditing] = useState(false)
  const [cotisations, setCotisations] = useState([])
  const [msg, setMsg] = useState('')
  const [nouveauMdp, setNouveauMdp] = useState('')
  const [confirmerMdp, setConfirmerMdp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (profile?.id) {
      loadCotisations()
    }
  }, [profile])

  async function loadCotisations() {
    const { data } = await supabase.from('cotisations').select('*').eq('utilisateur_id', profile.id).order('created_at', { ascending: false })
    if (data) setCotisations(data)
  }

  async function saveBio() {
    await supabase.from('utilisateurs').update({ bio }).eq('id', profile.id)
    setEditing(false)
    setMsg('Profil mis à jour !')
  }

  async function changerMotDePasse() {
    if (nouveauMdp !== confirmerMdp) { setMsg('Les mots de passe ne correspondent pas'); return }
    if (nouveauMdp.length < 6) { setMsg('Minimum 6 caractères'); return }
    const { error } = await supabase.auth.updateUser({ password: nouveauMdp })
    if (error) { setMsg('Erreur : ' + error.message); return }
    setMsg('Mot de passe mis à jour !')
    setNouveauMdp('')
    setConfirmerMdp('')
  }

  async function uploadAvatar(e) {
    const file = e.target.files[0]
    if (!file || !profile?.id) return
    setUploading(true)
    const fileName = `${profile.id}-${Date.now()}.${file.name.split('.').pop()}`
    const { error: uploadError } = await supabase.storage
      .from('fichiers_membres')
      .upload(`avatars/${fileName}`, file, { upsert: true })
    if (uploadError) { setMsg('Erreur upload : ' + uploadError.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage
      .from('fichiers_membres')
      .getPublicUrl(`avatars/${fileName}`)
    await supabase.from('utilisateurs').update({ avatar_url: publicUrl }).eq('id', profile.id)
    setMsg('Photo mise à jour !')
    setUploading(false)
    window.location.reload()
  }

  const cotisOk = cotisations.filter(c => c.statut === 'paye').length
  const statutColor = { paye: '#25d366', en_retard: '#FC1713', en_attente: '#f59e0b' }
  const statutLabel = { paye: 'Payé', en_retard: 'En retard', en_attente: 'En attente' }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg,#FC1713,#8b0000)', padding: '32px 20px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700' }}>
          {profile?.prenom?.[0]}{profile?.nom?.[0]}
        </div>
        <div style={{ fontSize: '17px', fontWeight: '700', fontFamily: 'Founders Grotesk,sans-serif' }}>{profile?.prenom} {profile?.nom}</div>
        <div style={{ fontSize: '12px', opacity: 0.75, marginTop: '4px' }}>{profile?.role} · {profile?.domaine}</div>
      </div>

      <div style={{ display: 'flex', background: theme.card, borderBottom: `1px solid ${theme.border}`, overflowX: 'auto' }}>
        {['info', 'cotisations', 'parametres'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '12px 4px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? '#FC1713' : 'transparent'}`, color: tab === t ? '#FC1713' : theme.muted, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: tab === t ? '600' : '400', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
            {t === 'info' ? 'Infos' : t === 'cotisations' ? 'Cotisations' : 'Paramètres'}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        {msg && <div style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '8px', padding: '8px 12px', color: '#FC1713', fontSize: '12px', marginBottom: '12px' }}>{msg}</div>}
        {tab === 'info' && (
          <div>
            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
              <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>
                Mes informations
              </div>
              <InfoEdit theme={theme} supabase={supabase} profile={profile} setMsg={setMsg} />
            </div>
          </div>
        )}

        {tab === 'cotisations' && (
          <div>
            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px', marginBottom: '14px' }}>
              <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Statut 2026</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: theme.muted, fontSize: '13px' }}>{cotisOk} mois réglés</span>
                <span style={{ color: '#25d366', fontSize: '13px', fontWeight: '600' }}>{cotisOk > 0 ? 'À jour' : 'En attente'}</span>
              </div>
              <div style={{ background: theme.bg, borderRadius: '8px', height: '6px', overflow: 'hidden' }}>
                <div style={{ background: '#25d366', height: '6px', borderRadius: '8px', width: `${Math.min((cotisOk / 12) * 100, 100)}%` }} />
              </div>
            </div>
            {cotisations.map(c => (
              <div key={c.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '12px 14px', marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: theme.text, fontSize: '13px' }}>{c.mois}</span>
                <span style={{ color: statutColor[c.statut], fontSize: '12px', fontWeight: '600' }}>{statutLabel[c.statut]} • {c.montant?.toLocaleString()} F</span>
              </div>
            ))}

            {/* Paiement Mobile Money */}
            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px', marginTop: '14px' }}>
              <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
                Paiement Mobile Money
              </div>
              <p style={{ color: theme.muted, fontSize: '12px', lineHeight: '1.7', marginBottom: '14px' }}>
                Saisis un montant puis lance le paiement Mixx by Yas (T-Money) ou Moov Money. Ensuite, clique sur "J'ai payé" pour confirmer sur WhatsApp.
              </p>

              <MobileMoney theme={theme} profile={profile} />
            </div>
          </div>
        )}

        {tab === 'parametres' && (
          <div>
            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
              <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Photo de profil</div>
              <label style={{ display: 'block', background: theme.bg, border: `2px dashed ${theme.border}`, borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', marginBottom: '10px' }}>
                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center', color: theme.muted }}><IconCamera size={32} /></div>
                <div style={{ color: theme.muted, fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>{uploading ? 'Upload en cours...' : 'Cliquer pour changer'}</div>
                <div style={{ color: theme.muted, fontSize: '11px' }}>JPG ou PNG</div>
                <input type="file" accept="image/jpeg,image/png" onChange={uploadAvatar} disabled={uploading} style={{ display: 'none' }} />
              </label>
            </div>

            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px' }}>
              <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Changer mot de passe</div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nouveau mot de passe"
                value={nouveauMdp}
                onChange={e => setNouveauMdp(e.target.value)}
                style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '10px', fontFamily: 'inherit' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirmer mot de passe"
                value={confirmerMdp}
                onChange={e => setConfirmerMdp(e.target.value)}
                style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '10px', fontFamily: 'inherit' }}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '12px' }}>
                <input type="checkbox" checked={showPassword} onChange={e => setShowPassword(e.target.checked)} style={{ accentColor: '#FC1713' }} />
                <span style={{ color: theme.muted, fontSize: '12px' }}>Afficher le mot de passe</span>
              </label>
              <button onClick={changerMotDePasse} style={{ width: '100%', background: '#FC1713', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                Mettre à jour
              </button>
            </div>

            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px', marginTop: '16px' }}>
              <button onClick={handleSignOut} style={{ width: '100%', background: 'rgba(200,16,46,0.1)', color: '#FC1713', border: `1px solid rgba(200,16,46,0.3)`, borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal aperçu fichier */}
      {preview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setPreview(null)}>
          <div style={{ background: theme.bg, borderRadius: '14px', padding: '20px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: theme.text, fontSize: '16px', fontWeight: '700' }}>{preview.nom_fichier}</h3>
              <button onClick={() => setPreview(null)} style={{ background: 'none', border: 'none', fontSize: '24px', color: theme.muted, cursor: 'pointer' }}>✕</button>
            </div>
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(preview.url)}&embedded=true`}
              style={{ width: '100%', height: '500px', border: `1px solid ${theme.border}`, borderRadius: '10px', marginBottom: '16px' }}
              title="Aperçu"
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setPreview(null)} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '8px 16px', color: theme.text, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>Fermer</button>
              <a href={preview.url} target="_blank" rel="noreferrer" style={{ background: '#FC1713', border: 'none', borderRadius: '8px', padding: '8px 16px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Ouvrir</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
function InfoEdit({ theme, supabase, profile, setMsg }) {
  const [prenom, setPrenom] = useState(profile?.prenom || '')
  const [nom, setNom] = useState(profile?.nom || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp || '')
  const [quartier, setQuartier] = useState(profile?.quartier || '')
  const [telephone, setTelephone] = useState(profile?.telephone || '')
  const [domaine, setDomaine] = useState(profile?.domaine || '')
  const [dateNaissance, setDateNaissance] = useState(profile?.date_naissance || '')
  const [saving, setSaving] = useState(false)

  const input = {
    width: '100%', background: theme.bg, border: `1px solid ${theme.border}`,
    borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px',
    outline: 'none', marginBottom: '10px', fontFamily: 'inherit', boxSizing: 'border-box'
  }
  const label = { display: 'block', color: theme.muted, fontSize: '11px', fontWeight: '600', marginBottom: '4px' }

  async function save() {
    setSaving(true)
    const { error } = await supabase.from('utilisateurs').update({
      prenom, nom, bio, whatsapp, quartier, telephone, domaine,
      date_naissance: dateNaissance || null
    }).eq('id', profile.id)
    setSaving(false)
    if (error) { setMsg('Erreur : ' + error.message); return }
    setMsg('Profil mis à jour !')
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <label style={label}>Prénoms</label>
          <input value={prenom} onChange={e => setPrenom(e.target.value)} style={input} placeholder="Prénoms" />
        </div>
        <div>
          <label style={label}>Nom</label>
          <input value={nom} onChange={e => setNom(e.target.value)} style={input} placeholder="Nom" />
        </div>
      </div>
      <label style={label}>WhatsApp</label>
      <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} style={input} placeholder="+228 90..." />
      <label style={label}>Téléphone</label>
      <input value={telephone} onChange={e => setTelephone(e.target.value)} style={input} placeholder="+228..." />
      <label style={label}>Quartier</label>
      <input value={quartier} onChange={e => setQuartier(e.target.value)} style={input} placeholder="Ex: Adidogomé" />
      <label style={label}>Domaine</label>
      <input value={domaine} onChange={e => setDomaine(e.target.value)} style={input} placeholder="Ex: Informatique" />
      <label style={label}>Date de naissance</label>
      <input type="date" value={dateNaissance} onChange={e => setDateNaissance(e.target.value)} style={{ ...input, cursor: 'pointer' }} />
      <label style={label}>Bio</label>
      <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
        style={{ ...input, resize: 'none', marginBottom: '14px' }} placeholder="Dis-nous qui tu es..." />
      <button onClick={save} disabled={saving}
        style={{ background: '#FC1713', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.6 : 1 }}>
        {saving ? 'Enregistrement...' : 'Sauvegarder'}
      </button>
    </div>
  )
}
function MobileMoney({ theme, profile }) {
  const [montant, setMontant] = useState('200')

  // À remplacer par les vrais numéros du bureau
  const NUMERO_MIXX = '22892894954'   // ← numéro T-Money du bureau
  const NUMERO_MOOV = '22897440627'   // ← numéro Moov Money du bureau
  const BUREAU_WA = '22892894954'   // ← WhatsApp du bureau

  const ussdMixx = `*145*1*${NUMERO_MIXX}*${montant}#`
  const ussdMoov = `*155*1*${NUMERO_MOOV}*${montant}#`

  const msgWA = encodeURIComponent(
    `Bonjour, j'ai effectué un paiement de ${montant} FCFA pour ma cotisation.\n\nNom : ${profile?.prenom} ${profile?.nom}\nMontant : ${montant} FCFA\n\nMerci de confirmer.`
  )

  return (
    <div>
      <input
        type="number"
        value={montant}
        onChange={e => setMontant(e.target.value)}
        style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '10px 12px', color: theme.text, fontSize: '15px', fontWeight: '600', outline: 'none', marginBottom: '12px', fontFamily: 'inherit', boxSizing: 'border-box', textAlign: 'center' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <a href={`tel:${ussdMixx}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#0965BA', color: 'white', borderRadius: '12px', padding: '12px 8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700', fontFamily: 'inherit' }}>
          <img src="/logo-mixx-by-yas.png" alt="" style={{ width: '24px', height: '24px', objectFit: 'contain', borderRadius: '4px' }} />
          Mixx / T-Money
        </a>
        <a href={`tel:${ussdMoov}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#f59e0b', color: 'white', borderRadius: '12px', padding: '12px 8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700', fontFamily: 'inherit' }}>
          <img src="/logo-moov-money.png" alt="" style={{ width: '24px', height: '24px', objectFit: 'contain', borderRadius: '4px' }} />
          Moov Money
        </a>
      </div>

      <a href={`https://wa.me/${BUREAU_WA}?text=${msgWA}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#25d366', color: 'white', borderRadius: '12px', padding: '13px', textDecoration: 'none', fontSize: '13px', fontWeight: '700', fontFamily: 'inherit' }}>
        J'ai payé (WhatsApp)
      </a>
    </div>
  )
}

function Contact({ theme, supabase }) {
  const [bureau, setBureau] = useState([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('utilisateurs').select('*').eq('role', 'bureau')
      if (data) setBureau(data)
    }
    load()
  }, [supabase])

  function formatBirthday(dateStr) {
    if (!dateStr) return null
    try { return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) }
    catch { return null }
  }

  return (
    <div style={{ padding: '16px', maxWidth: '960px', margin: '0 auto' }}>
      <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Founders Grotesk,sans-serif', marginBottom: '6px' }}>Contact</h2>
      <p style={{ color: theme.muted, fontSize: '12px', marginBottom: '20px' }}>Le bureau de la jeunesse et nos réseaux sociaux</p>

      {/* R\u00e9seaux sociaux */}
      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '16px', marginBottom: '24px' }}>
        <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Nos Réseaux</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <a href="#" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '14px 8px', background: 'rgba(9,101,186,0.1)', color: '#0965BA', borderRadius: '12px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            Facebook
          </a>
          <a href="#" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '14px 8px', background: 'rgba(252,23,19,0.08)', color: '#FC1713', borderRadius: '12px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            Instagram
          </a>
          <a href="#" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '14px 8px', background: theme.card, color: theme.text, borderRadius: '12px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold', border: `1px solid ${theme.border}` }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
            TikTok
          </a>
        </div>
      </div>

      {/* Membres du Bureau */}
      <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Le Bureau</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '14px' }}>
        {bureau.map(m => (
          <div key={m.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {m.avatar_url ? (
                <img src={m.avatar_url} alt="" loading="lazy" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #FC1713, #a00d24)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px', fontWeight: '700', flexShrink: 0 }}>
                  {`${m.prenom?.[0] || ''}${m.nom?.[0] || ''}`.toUpperCase()}
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: theme.text }}>{m.prenom} {m.nom}</div>
                <div style={{ fontSize: '11px', color: theme.muted, marginTop: '3px' }}>{m.domaine || 'Membre du Bureau'}</div>
              </div>
            </div>
            {m.date_naissance && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: theme.muted }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                {formatBirthday(m.date_naissance)}
              </div>
            )}
            {m.whatsapp && (
              <a href={`https://wa.me/${m.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#25d366', textDecoration: 'none', fontWeight: '600' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.632-1.467A11.932 11.932 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" /></svg>
                Contacter
              </a>
            )}
          </div>
        ))}
        {bureau.length === 0 && <div style={{ textAlign: 'center', color: theme.muted, fontSize: '13px', padding: '20px', gridColumn: '1 / -1' }}>Aucun membre du bureau trouvé.</div>}
      </div>
    </div>
  )
}

function AdminAccess({ navigate, theme, profile }) {
  const [clicks, setClicks] = useState(0)
  const [showPin, setShowPin] = useState(false)
  const [pin, setPin] = useState('')

  function handleClick() {
    if (profile?.role === 'bureau') { navigate('/admin'); return }
    const n = clicks + 1
    setClicks(n)
    if (n >= 3) { setShowPin(true); setClicks(0) }
    setTimeout(() => setClicks(0), 1800)
  }

  function handlePin() {
    if (['ROCHER', 'rocher', '2610'].includes(pin)) {
      setShowPin(false)
      navigate('/admin')
    }
  }

  return (
    <>
      <div onClick={handleClick} style={{ position: 'fixed', bottom: '75px', right: '12px', zIndex: 999, width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(200,16,46,0.3)', cursor: 'pointer' }} />
      {showPin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowPin(false)}>
          <div style={{ background: '#1a1a1a', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '16px', padding: '28px 24px', width: '100%', maxWidth: '320px' }} onClick={e => e.stopPropagation()}>
            <div style={{ color: 'rgba(200,16,46,0.7)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>Accès restreint</div>
            <input type="password" value={pin} onChange={e => setPin(e.target.value)} onKeyDown={e => e.key === 'Enter' && handlePin()} placeholder="Code confidentiel" autoFocus style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 12px', color: 'white', fontSize: '13px', outline: 'none', marginBottom: '12px', fontFamily: 'inherit', textAlign: 'center', letterSpacing: '4px' }} />
            <button onClick={handlePin} style={{ width: '100%', background: '#FC1713', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Confirmer</button>
          </div>
        </div>
      )}
    </>
  )
} 
