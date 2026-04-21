import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import md5 from 'md5'

// SVG Icon Components
const Ic = (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={p.style}>{p.children}</svg>
const IconBell = ({size}) => <Ic size={size}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Ic>
const IconX = ({size}) => <Ic size={size}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Ic>
const IconPray = ({size}) => <Ic size={size||32}><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" stroke="none" fill="rgba(255,255,255,0.15)"/><path d="M12 6v4l2 2" strokeWidth="1.5"/><path d="M9 14c0 0 1.5 2 3 2s3-2 3-2" strokeWidth="1.5"/><path d="M8 18l2-2 2 2 2-2 2 2" strokeWidth="1.5"/></Ic>
const IconHeart = ({size}) => <Ic size={size||32}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></Ic>
const IconCamera = ({size}) => <Ic size={size||32}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></Ic>
const IconCake = ({size}) => <Ic size={size}><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v3"/><path d="M12 8v3"/><path d="M17 8v3"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></Ic>
const IconBriefcase = ({size}) => <Ic size={size}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></Ic>
const IconStar = ({size, filled}) => <svg width={size||28} height={size||28} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
const IconCheck = ({size}) => <Ic size={size||11}><polyline points="20 6 9 17 4 12"/></Ic>
const IconHome = () => <Ic size={14}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Ic>
const IconBookOpen = () => <Ic size={14}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></Ic>
const IconCalendarMembre = () => <Ic size={14}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Ic>
const IconUsers = () => <Ic size={14}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Ic>
const IconSun = () => <Ic size={14}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></Ic>
const IconMoon = () => <Ic size={14}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Ic>

export default function Membre() {
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()
  const [tab, setTab] = useState('accueil')
  const [dark, setDark] = useState(true)
  const [notifs, setNotifs] = useState([])
  const [showNotifPanel, setShowNotifPanel] = useState(false)
  const [showProfil, setShowProfil] = useState(false)
  const [luesAnnonces, setLuesAnnonces] = useState([])

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
  ]

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
      <div style={{ background: dark ? '#1a1a1a' : '#ffffff', borderBottom: '2px solid #C8102E', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', position: 'sticky', top: 0, zIndex: 50 }}>
        <img src="/logo.png" alt="Logo" loading="lazy" style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '6px' }} />
        <div style={{ flex: 1 }}>
          <div style={{ color: theme.text, fontSize: '13px', fontWeight: '600' }}>EB Le Rocher</div>
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
            <div style={{ position: 'absolute', top: '0px', right: '0px', background: '#C8102E', color: 'white', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' }}>
              {notifs.filter(n => !luesAnnonces.includes(n.id)).length}
            </div>
          )}
        </div>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: profile?.avatar_url ? 'transparent' : '#C8102E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: '700', cursor: 'pointer', overflow: 'hidden', transition: 'transform 0.2s' }} onClick={() => setShowProfil(true)} title="Profil">
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
                <button onClick={marquerToutLu} style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '6px', padding: '4px 8px', color: '#C8102E', fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Tout marquer comme lu
                </button>
              )}
            </div>
            {notifs.length === 0 ? (
              <div style={{ color: theme.muted, fontSize: '13px', padding: '10px 0' }}>Aucune notification</div>
            ) : (
              notifs.map(n => (
                <div key={n.id} onClick={() => marquerLu(n.id)} style={{ background: theme.card, border: `1px solid ${n.urgent ? '#C8102E' : theme.border}`, borderRadius: '8px', padding: '10px 12px', marginBottom: '8px', cursor: 'pointer', opacity: luesAnnonces.includes(n.id) ? 0.6 : 1, borderLeft: n.urgent ? '3px solid #C8102E' : '3px solid transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ color: theme.text, fontSize: '12px', fontWeight: '600' }}>{n.titre}</div>
                    {n.urgent && <span style={{ background: 'rgba(200,16,46,0.15)', color: '#C8102E', fontSize: '9px', fontWeight: '700', padding: '2px 6px', borderRadius: '8px' }}>URGENT</span>}
                    {luesAnnonces.includes(n.id) && <span style={{ color: theme.muted, fontSize: '9px' }}>✓ Lu</span>}
                  </div>
                  {n.contenu && <div style={{ color: theme.muted, fontSize: '11px', marginTop: '4px' }}>{n.contenu}</div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <AdminAccess navigate={navigate} theme={theme} />

      {/* Bottom nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: dark ? '#1a1a1a' : '#ffffff', borderTop: `1px solid ${theme.border}`, display: 'flex', zIndex: 50 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: '10px 4px 8px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontFamily: 'inherit', color: tab === t.id ? '#C8102E' : theme.muted }}>
            {t.icon}
            <span style={{ fontSize: '9px', fontWeight: tab === t.id ? '600' : '400' }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div style={{ paddingBottom: '70px' }}>
        {tab === 'accueil' && <Accueil theme={theme} supabase={supabase} dark={dark} profile={profile} />}
        {tab === 'devotion' && <Devotion theme={theme} supabase={supabase} dark={dark} />}
        {tab === 'evenements' && <Evenements theme={theme} supabase={supabase} profile={profile} />}
        {tab === 'communion' && <Communion theme={theme} supabase={supabase} />}
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
              <Profil theme={theme} supabase={supabase} profile={profile} handleSignOut={handleSignOut} navigate={navigate} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}


function Accueil({ theme, supabase, dark, profile }) {
  const [devotion, setDevotion] = useState(null)
  const [annonces, setAnnonces] = useState([])
  const [evenements, setEvenements] = useState([])
  const [activeEv, setActiveEv] = useState(null)
  const [lightbox, setLightbox] = useState(null)
  const [expandPrayer, setExpandPrayer] = useState(false)
  const [derniereCotisation, setDerniereCotisation] = useState(null)

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
    }
    load()
  }, [])

  const evActif = evenements.find(e => e.id === activeEv)

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>

      {/* Verset */}
      <div style={{ background: 'linear-gradient(135deg,#C8102E,#8b0000)', borderRadius: '18px', padding: '28px 24px', color: 'white', marginBottom: '16px', position: 'relative', overflow: 'hidden', boxShadow: !dark ? '0 4px 12px rgba(200,16,46,0.2)' : 'none' }}>
        <div style={{ position: 'absolute', top: '-20px', left: '10px', fontFamily: 'Georgia,serif', fontSize: '100px', color: 'rgba(255,255,255,0.06)', lineHeight: 1 }}>"</div>
        <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.7, marginBottom: '12px' }}>Dévotion du jour</div>
        {devotion ? (
          <>
            {devotion.titre && <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', opacity: 0.9 }}>{devotion.titre}</div>}
            <div style={{ fontFamily: 'Georgia,serif', fontSize: '18px', fontStyle: 'italic', lineHeight: '1.7', marginBottom: '8px' }}>« {devotion.verset} »</div>
            <div style={{ fontSize: '12px', fontWeight: '700', opacity: 0.8 }}>— {devotion.reference}</div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: '18px', fontStyle: 'italic', lineHeight: '1.7', marginBottom: '8px' }}>« Je puis tout par Christ qui me fortifie. »</div>
            <div style={{ fontSize: '12px', fontWeight: '700', opacity: 0.8 }}>— Philippiens 4:13</div>
          </>
        )}
      </div>

      {/* Prière du matin */}
      {devotion?.priere && (
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px', marginBottom: '16px', boxShadow: !dark ? '0 2px 8px rgba(0,0,0,0.07)' : 'none' }}>
          <div style={{ color: '#C8102E', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Prière du matin</div>
          <p style={{ color: theme.muted, fontSize: '13px', lineHeight: '1.8', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: expandPrayer ? 'unset' : '2', WebkitBoxOrient: 'vertical', overflow: expandPrayer ? 'unset' : 'hidden', maxHeight: expandPrayer ? 'unset' : '80px', transition: 'all 0.3s ease-in-out' }}>{devotion.priere}</p>
          {devotion.priere.length > 100 && (
            <button onClick={() => setExpandPrayer(!expandPrayer)} style={{ background: 'none', border: 'none', color: '#C8102E', fontSize: '11px', fontWeight: '600', cursor: 'pointer', marginTop: '8px', fontFamily: 'inherit', padding: 0 }}>
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
            <div key={a.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderLeft: `3px solid ${a.urgent ? '#C8102E' : '#999'}`, borderRadius: '10px', padding: '12px 14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: !dark ? '0 2px 8px rgba(0,0,0,0.07)' : 'none' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.urgent ? '#C8102E' : '#555', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: theme.text, fontSize: '13px', fontWeight: '600' }}>{a.titre}</div>
                {a.contenu && <div style={{ color: theme.muted, fontSize: '12px', marginTop: '2px' }}>{a.contenu}</div>}
              </div>
              {a.urgent && <span style={{ background: 'rgba(200,16,46,0.15)', color: '#C8102E', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '8px', flexShrink: 0 }}>!</span>}
            </div>
          ))}
        </>
      )}

      {/* Statut Cotisation */}
      {derniereCotisation && (
        <div style={{
          background: derniereCotisation.statut === 'paye' ? 'rgba(37,211,102,0.05)' : derniereCotisation.statut === 'en_retard' ? 'rgba(200,16,46,0.05)' : 'rgba(245,158,11,0.05)',
          border: `1px solid ${derniereCotisation.statut === 'paye' ? 'rgba(37,211,102,0.2)' : derniereCotisation.statut === 'en_retard' ? 'rgba(200,16,46,0.2)' : 'rgba(245,158,11,0.2)'}`,
          borderRadius: '12px',
          padding: '12px 14px',
          marginBottom: '16px',
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: derniereCotisation.statut === 'paye' ? '#25d366' : derniereCotisation.statut === 'en_retard' ? '#C8102E' : '#f59e0b',
            flexShrink: 0
          }} />
          <div style={{ flex: 1 }}>
            <div style={{
              color: derniereCotisation.statut === 'paye' ? '#25d366' : derniereCotisation.statut === 'en_retard' ? '#C8102E' : '#f59e0b',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {derniereCotisation.statut === 'paye' && 'Cotisation du mois en ordre'}
              {derniereCotisation.statut === 'en_retard' && 'Cotisation en retard - pense à régulariser'}
              {derniereCotisation.statut === 'en_attente' && 'Cotisation en attente de confirmation'}
            </div>
            <div style={{ color: theme.muted, fontSize: '11px', marginTop: '2px' }}>
              {new Date(derniereCotisation.created_at).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
      )}
      {!derniereCotisation && (
        <div style={{
          background: 'rgba(155,155,155,0.05)',
          border: '1px solid rgba(155,155,155,0.2)',
          borderRadius: '12px',
          padding: '12px 14px',
          marginBottom: '16px',
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#999',
            flexShrink: 0
          }} />
          <div style={{ flex: 1 }}>
            <div style={{
              color: '#999',
              fontSize: '13px',
              fontWeight: '600'
            }}
            >
              Aucune cotisation enregistrée ce mois
            </div>
          </div>
        </div>
      )}

      {/* Galerie */}
      {evenements.length > 0 && (
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '16px', marginBottom: '16px', marginTop: '16px', boxShadow: !dark ? '0 2px 8px rgba(0,0,0,0.07)' : 'none' }}>
          <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: theme.muted, marginBottom: '12px' }}>Nos moments</div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '14px', paddingBottom: '4px', scrollbarWidth: 'none' }}>
            {evenements.map(ev => (
              <button key={ev.id} onClick={() => setActiveEv(ev.id)} style={{ background: activeEv === ev.id ? '#C8102E' : theme.bg, border: `1px solid ${activeEv === ev.id ? '#C8102E' : theme.border}`, borderRadius: '20px', padding: '6px 14px', color: activeEv === ev.id ? 'white' : theme.muted, fontSize: '11px', fontWeight: activeEv === ev.id ? '600' : '400', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', flexShrink: 0 }}>
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

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <img src={lightbox} alt="" loading="lazy" style={{ maxWidth: '95%', maxHeight: '90vh', borderRadius: '10px' }} />
        </div>
      )}
    </div>
  )
}

function Devotion({ theme, supabase, dark }) {
  const [devotion, setDevotion] = useState(null)
  const [defi, setDefi] = useState(null)
  const [checked, setChecked] = useState([])
  const [expandPrayer, setExpandPrayer] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: devData } = await supabase.from('devotions').select('*').order('date_devotion', { ascending: false }).limit(1)
      const dev = devData?.[0] || null
      setDevotion(dev)
      const { data: defiData } = await supabase
        .from('defis_lecture')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
      const d = defiData?.[0] || null
      setDefi(d)
    }
    load()
  }, [])

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg,#C8102E,#8b0000)', borderRadius: '18px', padding: '28px 24px', color: 'white', marginBottom: '16px', textAlign: 'center', boxShadow: !dark ? '0 4px 12px rgba(200,16,46,0.2)' : 'none' }}>
        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}><IconHeart size={36} /></div>
        <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', opacity: 0.7, marginBottom: '12px' }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
        {devotion ? (
          <>
            {devotion.titre && <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', opacity: 0.9 }}>{devotion.titre}</div>}
            <div style={{ fontFamily: 'Georgia,serif', fontSize: '18px', fontStyle: 'italic', lineHeight: '1.7', marginBottom: '8px' }}>« {devotion.verset} »</div>
            <div style={{ fontSize: '13px', fontWeight: '700', opacity: 0.85 }}>— {devotion.reference}</div>
          </>
        ) : (
          <>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: '18px', fontStyle: 'italic', lineHeight: '1.7', marginBottom: '8px' }}>« Je puis tout par Christ qui me fortifie. »</div>
            <div style={{ fontSize: '13px', fontWeight: '700', opacity: 0.85 }}>— Philippiens 4:13</div>
          </>
        )}
      </div>

      {devotion?.priere && (
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '20px', marginBottom: '16px', boxShadow: !dark ? '0 2px 8px rgba(0,0,0,0.07)' : 'none' }}>
          <div style={{ color: '#C8102E', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Prière du matin</div>
          <p style={{ color: theme.muted, fontSize: '14px', lineHeight: '1.9', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: expandPrayer ? 'unset' : '3', WebkitBoxOrient: 'vertical', overflow: expandPrayer ? 'unset' : 'hidden', maxHeight: expandPrayer ? 'unset' : '120px', transition: 'all 0.3s ease-in-out' }}>{devotion.priere}</p>
          <button onClick={() => setExpandPrayer(!expandPrayer)} style={{ background: 'none', border: 'none', color: '#C8102E', fontSize: '12px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', fontFamily: 'inherit', padding: 0 }}>
            {expandPrayer ? '← Réduire' : 'Lire plus →'}
          </button>
        </div>
      )}

      {defi && (
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '20px', boxShadow: !dark ? '0 2px 8px rgba(0,0,0,0.07)' : 'none' }}>
          <div style={{ color: '#C8102E', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Défi lecture cette semaine</div>
          {defi.lectures?.map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div
                onClick={() => setChecked(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                style={{ width: '22px', height: '22px', borderRadius: '50%', background: checked.includes(i) ? '#C8102E' : 'none', border: checked.includes(i) ? 'none' : '2px solid #555', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', cursor: 'pointer', flexShrink: 0 }}
              >
                {checked.includes(i) && <IconCheck />}
              </div>
              <div style={{ color: checked.includes(i) ? theme.muted : theme.text, fontSize: '13px', textDecoration: checked.includes(i) ? 'line-through' : 'none' }}>
                {l.jour} — {l.ref}
              </div>
            </div>
          ))}
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
      {evenements.length === 0 && (
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '24px', textAlign: 'center', color: theme.muted, fontSize: '13px' }}>
          Aucun événement à venir pour le moment
        </div>
      )}
      {evenements.map(ev => (
        <div key={ev.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', overflow: 'hidden', marginBottom: '12px' }}>
          <div style={{ background: ev.urgent ? '#C8102E' : '#16a34a', padding: '6px 14px' }}>
            <span style={{ color: 'white', fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{ev.urgent ? 'URGENT' : 'ÉVÉNEMENT'}</span>
          </div>
          <div style={{ padding: '14px' }}>
            <div style={{ color: theme.text, fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{ev.titre}</div>
            <div style={{ color: theme.muted, fontSize: '12px', marginBottom: '8px' }}>{new Date(ev.date_evenement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            {ev.description && <p style={{ color: theme.muted, fontSize: '13px', lineHeight: '1.7', marginBottom: '12px' }}>{ev.description}</p>}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ flex: 1, background: '#C8102E', color: 'white', border: 'none', borderRadius: '8px', padding: '9px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600' }}>
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
            {msg && <div style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '8px', padding: '8px 12px', color: '#C8102E', fontSize: '12px', marginBottom: '12px' }}>{msg}</div>}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setNote(n)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: n <= note ? '#f59e0b' : '#444', display: 'flex' }}><IconStar filled={n <= note} /></button>
              ))}
            </div>
            <textarea placeholder="Votre commentaire..." value={contenu} onChange={e => setContenu(e.target.value)} rows={4} style={{ width: '100%', background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '10px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '12px', fontFamily: 'inherit', resize: 'none' }} />
            <button onClick={envoyerFeedback} style={{ width: '100%', background: '#C8102E', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
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
      <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', marginBottom: '6px' }}>Communion</h2>
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
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #C8102E, #a00d24)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px', fontWeight: '700', flexShrink: 0 }}>
                  {`${m.prenom?.[0] || ''}${m.nom?.[0] || ''}`.toUpperCase()}
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: theme.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.prenom} {m.nom}</div>
                <div style={{ fontSize: '11px', color: theme.muted, marginTop: '3px' }}>{m.domaine || 'Membre'}</div>
              </div>
            </div>
            {m.date_anniversaire && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: theme.muted }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-3-3.87" /><path d="M4 21v-2a4 4 0 0 1 3-3.87" /><circle cx="12" cy="7" r="4" />
                </svg>
                Anniversaire : {formatBirthday(m.date_anniversaire)}
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
              <img src={selected.avatar_url} alt="" loading="lazy" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 18px', display: 'block', border: '3px solid #C8102E' }} />
            ) : (
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #C8102E, #a00d24)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '28px', fontWeight: '700', margin: '0 auto 18px' }}>
                {`${selected.prenom?.[0] || ''}${selected.nom?.[0] || ''}`.toUpperCase()}
              </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: theme.text, fontFamily: 'Outfit,sans-serif' }}>{selected.prenom} {selected.nom}</div>
              {selected.domaine && <div style={{ fontSize: '12px', color: theme.muted, marginTop: '6px' }}>{selected.domaine}</div>}
            </div>

            {/* Info Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              {selected.date_anniversaire && (
                <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '4px' }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <div style={{ fontSize: '11px', color: theme.muted }}>Anniversaire</div>
                  <div style={{ fontSize: '13px', color: theme.text, fontWeight: '600', marginTop: '2px' }}>{formatBirthday(selected.date_anniversaire)}</div>
                </div>
              )}
              {selected.statut_activite && (
                <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '4px' }}>
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <div style={{ fontSize: '11px', color: theme.muted }}>Statut</div>
                  <div style={{ fontSize: '13px', color: theme.text, fontWeight: '600', marginTop: '2px' }}>{getStatutLabel(selected.statut_activite)}</div>
                </div>
              )}
            </div>

            <div style={{ color: theme.muted, fontSize: '13px', lineHeight: '1.8', marginBottom: '20px' }}>{selected.bio || 'Aucune bio renseignée.'}</div>
            {selected.whatsapp && (
              <a href={`https://wa.me/${selected.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}?text=${encodeURIComponent(`Bonjour ${selected.prenom}, je t'ai trouvé dans la communion de la Jeunesse EB Le Rocher !`)}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#25d366', color: 'white', borderRadius: '12px', padding: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>
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

function Profil({ theme, supabase, profile, handleSignOut, navigate }) {
  const [bio, setBio] = useState(profile?.bio || '')
  const [editing, setEditing] = useState(false)
  const [cotisations, setCotisations] = useState([])
  const [tab, setTab] = useState('info')
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
  const statutColor = { paye: '#25d366', en_retard: '#C8102E', en_attente: '#f59e0b' }
  const statutLabel = { paye: 'Payé', en_retard: 'En retard', en_attente: 'En attente' }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg,#C8102E,#8b0000)', padding: '32px 20px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '700' }}>
          {profile?.prenom?.[0]}{profile?.nom?.[0]}
        </div>
        <div style={{ fontSize: '17px', fontWeight: '700', fontFamily: 'Outfit,sans-serif' }}>{profile?.prenom} {profile?.nom}</div>
        <div style={{ fontSize: '12px', opacity: 0.75, marginTop: '4px' }}>{profile?.role} · {profile?.domaine}</div>
      </div>

      <div style={{ display: 'flex', background: theme.card, borderBottom: `1px solid ${theme.border}`, overflowX: 'auto' }}>
        {['info', 'cotisations', 'parametres'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '12px 4px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? '#C8102E' : 'transparent'}`, color: tab === t ? '#C8102E' : theme.muted, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: tab === t ? '600' : '400', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
            {t === 'info' ? 'Infos' : t === 'cotisations' ? 'Cotisations' : 'Paramètres'}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        {msg && <div style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '8px', padding: '8px 12px', color: '#C8102E', fontSize: '12px', marginBottom: '12px' }}>{msg}</div>}

        {tab === 'info' && (
          <div>
            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              {profile?.date_anniversaire && (
                <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center', color: '#C8102E' }}><IconCake size={20} /></div>
                  <div style={{ fontSize: '11px', color: theme.muted }}>Anniversaire</div>
                  <div style={{ fontSize: '13px', color: theme.text, fontWeight: '600', marginTop: '2px' }}>
                    {new Date(profile.date_anniversaire).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                  </div>
                </div>
              )}
              {profile?.statut_activite && (
                <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                  <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center', color: '#C8102E' }}><IconBriefcase size={20} /></div>
                  <div style={{ fontSize: '11px', color: theme.muted }}>Statut</div>
                  <div style={{ fontSize: '13px', color: theme.text, fontWeight: '600', marginTop: '2px', textTransform: 'capitalize' }}>
                    {profile.statut_activite}
                  </div>
                </div>
              )}
            </div>

            {!editing ? (
              <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
                <div style={{ color: '#C8102E', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Bio</div>
                <p style={{ color: theme.muted, fontSize: '13px', lineHeight: '1.9' }}>{bio || 'Aucune bio renseignée.'}</p>
                <button onClick={() => setEditing(true)} style={{ marginTop: '10px', background: 'none', border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '6px 14px', color: theme.muted, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Modifier
                </button>
              </div>
            ) : (
              <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '10px', fontFamily: 'inherit', resize: 'none' }} />
                <button onClick={saveBio} style={{ background: '#C8102E', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600' }}>
                  Sauvegarder
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'cotisations' && (
          <div>
            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px', marginBottom: '14px' }}>
              <div style={{ color: '#C8102E', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>Statut 2026</div>
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
                <span style={{ color: statutColor[c.statut], fontSize: '12px', fontWeight: '600' }}>{statutLabel[c.statut]} — {c.montant?.toLocaleString()} F</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'parametres' && (
          <div>
            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
              <div style={{ color: '#C8102E', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Photo de profil</div>
              <label style={{ display: 'block', background: theme.bg, border: `2px dashed ${theme.border}`, borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', marginBottom: '10px' }}>
                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center', color: theme.muted }}><IconCamera size={32} /></div>
                <div style={{ color: theme.muted, fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>{uploading ? 'Upload en cours...' : 'Cliquer pour changer'}</div>
                <div style={{ color: theme.muted, fontSize: '11px' }}>JPG ou PNG</div>
                <input type="file" accept="image/jpeg,image/png" onChange={uploadAvatar} disabled={uploading} style={{ display: 'none' }} />
              </label>
            </div>

            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px' }}>
              <div style={{ color: '#C8102E', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Changer mot de passe</div>
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
                <input type="checkbox" checked={showPassword} onChange={e => setShowPassword(e.target.checked)} style={{ accentColor: '#C8102E' }} />
                <span style={{ color: theme.muted, fontSize: '12px' }}>Afficher le mot de passe</span>
              </label>
              <button onClick={changerMotDePasse} style={{ width: '100%', background: '#C8102E', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                Mettre à jour
              </button>
            </div>

            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px', marginTop: '16px' }}>
              <button onClick={handleSignOut} style={{ width: '100%', background: 'rgba(200,16,46,0.1)', color: '#C8102E', border: `1px solid rgba(200,16,46,0.3)`, borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
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
              <a href={preview.url} target="_blank" rel="noreferrer" style={{ background: '#C8102E', border: 'none', borderRadius: '8px', padding: '8px 16px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Ouvrir</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminAccess({ navigate, theme }) {
  const [clicks, setClicks] = useState(0)
  const [showPin, setShowPin] = useState(false)
  const [pin, setPin] = useState('')

  function handleClick() {
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
            <button onClick={handlePin} style={{ width: '100%', background: '#C8102E', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Confirmer</button>
          </div>
        </div>
      )}
    </>
  )
} 
