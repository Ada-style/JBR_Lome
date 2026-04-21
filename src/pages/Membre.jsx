import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import md5 from 'md5'

export default function Membre() {
  const navigate = useNavigate()
  const { supabase, profile, signOut, fetchProfile } = useAuth()
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
    { id: 'accueil', label: 'Accueil' },
    { id: 'devotion', label: 'Dévotion' },
    { id: 'evenements', label: 'Événements' },
    { id: 'communion', label: 'Communion' },
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
    <div style={{minHeight:'100vh',background:theme.bg,transition:'background 0.3s'}}>

      {/* Topbar */}
      <div style={{background:dark?'#1a1a1a':'#ffffff',borderBottom:'2px solid #C8102E',padding:'12px 16px',display:'flex',alignItems:'center',gap:'10px',position:'sticky',top:0,zIndex:50}}>
        <img src="/logo.png" alt="Logo" loading="lazy" style={{width:'28px',height:'28px',objectFit:'contain',borderRadius:'6px'}} />
        <div style={{flex:1}}>
          <div style={{color:theme.text,fontSize:'13px',fontWeight:'600'}}>EB Le Rocher</div>
          <div style={{color:theme.muted,fontSize:'10px'}}>Espace membre</div>
        </div>
        <button onClick={() => setDark(!dark)} style={{background:'none',border:`1px solid ${theme.border}`,borderRadius:'16px',padding:'5px 12px',color:theme.muted,fontSize:'11px',cursor:'pointer',fontFamily:'inherit'}}>
          {dark ? 'Clair' : 'Sombre'}
        </button>
        <div style={{position:'relative',cursor:'pointer'}} onClick={() => setShowNotifPanel(!showNotifPanel)}>
          <button style={{background:'none',border:'none',fontSize:'18px',cursor:'pointer',padding:'4px',position:'relative'}}>
            🔔
          </button>
          {notifs.filter(n => !luesAnnonces.includes(n.id)).length > 0 && (
            <div style={{position:'absolute',top:'0px',right:'0px',background:'#C8102E',color:'white',width:'20px',height:'20px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:'700'}}>
              {notifs.filter(n => !luesAnnonces.includes(n.id)).length}
            </div>
          )}
        </div>
        <div style={{width:'32px',height:'32px',borderRadius:'50%',background:profile?.avatar_url?'transparent':'#C8102E',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'11px',fontWeight:'700',cursor:'pointer',overflow:'hidden',transition:'transform 0.2s'}} onClick={() => setShowProfil(true)} title="Profil">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} loading="lazy" style={{width:'100%',height:'100%',objectFit:'cover'}} alt="Avatar" />
          ) : (
            <img src={gravatarUrl(profile?.email)} loading="lazy" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} alt="Avatar" />
          )}
        </div>
      </div>

      {/* Panel notifications - avec backdrop pour click-outside */}
      {showNotifPanel && (
        <div style={{position:'fixed',inset:0,zIndex:35}} onClick={() => setShowNotifPanel(false)} />
      )}
      {showNotifPanel && (
        <div style={{position:'absolute',top:'55px',left:0,right:0,background:dark?'#1a1a1a':'#ffffff',borderBottom:`1px solid ${theme.border}`,zIndex:40,animation:'slideDown 0.3s ease-in-out'}}>
          <style>{`@keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
          <div style={{padding:'12px 16px',maxWidth:'600px',margin:'0 auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
              <div style={{fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',color:theme.muted}}>Notifications récentes</div>
              {notifs.filter(n => !luesAnnonces.includes(n.id)).length > 0 && (
                <button onClick={marquerToutLu} style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'6px',padding:'4px 8px',color:'#C8102E',fontSize:'10px',cursor:'pointer',fontFamily:'inherit'}}>
                  Tout marquer comme lu
                </button>
              )}
            </div>
            {notifs.length === 0 ? (
              <div style={{color:theme.muted,fontSize:'13px',padding:'10px 0'}}>Aucune notification</div>
            ) : (
              notifs.map(n => (
                <div key={n.id} onClick={() => marquerLu(n.id)} style={{background:theme.card,border:`1px solid ${n.urgent ? '#C8102E' : theme.border}`,borderRadius:'8px',padding:'10px 12px',marginBottom:'8px',cursor:'pointer',opacity: luesAnnonces.includes(n.id) ? 0.6 : 1, borderLeft: n.urgent ? '3px solid #C8102E' : '3px solid transparent'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                    <div style={{color:theme.text,fontSize:'12px',fontWeight:'600'}}>{n.titre}</div>
                    {n.urgent && <span style={{background:'rgba(200,16,46,0.15)',color:'#C8102E',fontSize:'9px',fontWeight:'700',padding:'2px 6px',borderRadius:'8px'}}>URGENT</span>}
                    {luesAnnonces.includes(n.id) && <span style={{color:theme.muted,fontSize:'9px'}}>✓ Lu</span>}
                  </div>
                  {n.contenu && <div style={{color:theme.muted,fontSize:'11px',marginTop:'4px'}}>{n.contenu}</div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <AdminAccess navigate={navigate} theme={theme} />

      {/* Bottom nav */}
      <div style={{position:'fixed',bottom:0,left:0,right:0,background:dark?'#1a1a1a':'#ffffff',borderTop:`1px solid ${theme.border}`,display:'flex',zIndex:50}}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{flex:1,padding:'10px 4px 8px',background:'none',border:'none',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px',fontFamily:'inherit'}}>
            <div style={{width:'16px',height:'2px',background:tab===t.id?'#C8102E':'transparent',borderRadius:'2px',marginBottom:'2px'}} />
            <span style={{fontSize:'9px',color:tab===t.id?'#C8102E':theme.muted,fontWeight:tab===t.id?'600':'400'}}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div style={{paddingBottom:'70px'}}>
        {tab==='accueil' && <Accueil theme={theme} supabase={supabase} dark={dark} />}
        {tab==='devotion' && <Devotion theme={theme} supabase={supabase} dark={dark} />}
        {tab==='evenements' && <Evenements theme={theme} supabase={supabase} profile={profile} />}
        {tab==='communion' && <Communion theme={theme} supabase={supabase} />}
      </div>

      {/* Panel Profil - side modal */}
      {showProfil && (
        <>
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:100}} onClick={() => setShowProfil(false)} />
          <div style={{position:'fixed',top:0,right:0,bottom:0,width:'100%',maxWidth:'600px',background:theme.bg,zIndex:101,display:'flex',flexDirection:'column',boxShadow:'-4px 0 16px rgba(0,0,0,0.2)',animation:'slideInRight 0.3s ease-in-out'}} onClick={e=>e.stopPropagation()}>
            <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px 20px',borderBottom:`1px solid ${theme.border}`}}>
              <h2 style={{color:theme.text,fontSize:'16px',fontWeight:'700',margin:0}}>Mon Profil</h2>
              <button onClick={() => setShowProfil(false)} style={{background:'none',border:'none',fontSize:'24px',color:theme.muted,cursor:'pointer',padding:0}}>✕</button>
            </div>
            <div style={{flex:1,overflowY:'auto'}}>
              <Profil theme={theme} supabase={supabase} profile={profile} handleSignOut={handleSignOut} navigate={navigate} fetchProfile={fetchProfile} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}


function Accueil({ theme, supabase, dark }) {
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
      const { data: devData } = await supabase.from('devotions').select('*').order('date_devotion', {ascending: false}).limit(1)
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
    <div style={{padding:'16px',maxWidth:'600px',margin:'0 auto'}}>

      {/* Verset */}
      <div style={{background:'linear-gradient(135deg,#C8102E,#8b0000)',borderRadius:'18px',padding:'28px 24px',color:'white',marginBottom:'16px',position:'relative',overflow:'hidden',boxShadow:!dark?'0 4px 12px rgba(200,16,46,0.2)':'none'}}>
        <div style={{position:'absolute',top:'-20px',left:'10px',fontFamily:'Georgia,serif',fontSize:'100px',color:'rgba(255,255,255,0.06)',lineHeight:1}}>"</div>
        <div style={{fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',opacity:0.7,marginBottom:'12px'}}>Dévotion du jour</div>
        {devotion ? (
          <>
            <div style={{fontFamily:'Georgia,serif',fontSize:'18px',fontStyle:'italic',lineHeight:'1.7',marginBottom:'8px'}}>« {devotion.verset} »</div>
            <div style={{fontSize:'12px',fontWeight:'700',opacity:0.8}}>— {devotion.reference}</div>
          </>
        ) : (
          <>
            <div style={{fontFamily:'Georgia,serif',fontSize:'18px',fontStyle:'italic',lineHeight:'1.7',marginBottom:'8px'}}>« Je puis tout par Christ qui me fortifie. »</div>
            <div style={{fontSize:'12px',fontWeight:'700',opacity:0.8}}>— Philippiens 4:13</div>
          </>
        )}
      </div>

      {/* Prière du matin */}
      {devotion?.priere && (
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'16px',marginBottom:'16px',boxShadow:!dark?'0 2px 8px rgba(0,0,0,0.07)':'none'}}>
          <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'10px'}}>Prière du matin</div>
          <p style={{color:theme.muted,fontSize:'13px',lineHeight:'1.8',fontStyle:'italic',display:'-webkit-box',WebkitLineClamp:expandPrayer?'unset':'2',WebkitBoxOrient:'vertical',overflow:expandPrayer?'unset':'hidden',maxHeight:expandPrayer?'unset':'80px',transition:'all 0.3s ease-in-out'}}>{devotion.priere}</p>
          {devotion.priere.length > 100 && (
            <button onClick={() => setExpandPrayer(!expandPrayer)} style={{background:'none',border:'none',color:'#C8102E',fontSize:'11px',fontWeight:'600',cursor:'pointer',marginTop:'8px',fontFamily:'inherit',padding:0}}>
              {expandPrayer ? '← Réduire' : 'Lire plus →'}
            </button>
          )}
        </div>
      )}

      {/* Annonces */}
      {annonces.length > 0 && (
        <>
          <div style={{fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',color:theme.muted,marginBottom:'10px'}}>Annonces</div>
          {annonces.map(a => (
            <div key={a.id} style={{background:theme.card,border:`1px solid ${theme.border}`,borderLeft:`3px solid ${a.urgent?'#C8102E':'#999'}`,borderRadius:'10px',padding:'12px 14px',marginBottom:'8px',display:'flex',alignItems:'center',gap:'12px',boxShadow:!dark?'0 2px 8px rgba(0,0,0,0.07)':'none'}}>
              <div style={{width:'8px',height:'8px',borderRadius:'50%',background:a.urgent?'#C8102E':'#555',flexShrink:0}} />
              <div style={{flex:1}}>
                <div style={{color:theme.text,fontSize:'13px',fontWeight:'600'}}>{a.titre}</div>
                {a.contenu && <div style={{color:theme.muted,fontSize:'12px',marginTop:'2px'}}>{a.contenu}</div>}
              </div>
              {a.urgent && <span style={{background:'rgba(200,16,46,0.15)',color:'#C8102E',fontSize:'10px',fontWeight:'700',padding:'2px 8px',borderRadius:'8px',flexShrink:0}}>!</span>}
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
          <div style={{flex: 1}}>
            <div style={{
              color: derniereCotisation.statut === 'paye' ? '#25d366' : derniereCotisation.statut === 'en_retard' ? '#C8102E' : '#f59e0b',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              {derniereCotisation.statut === 'paye' && 'Cotisation du mois en ordre'}
              {derniereCotisation.statut === 'en_retard' && 'Cotisation en retard - pense à régulariser'}
              {derniereCotisation.statut === 'en_attente' && 'Cotisation en attente de confirmation'}
            </div>
            <div style={{color: theme.muted, fontSize: '11px', marginTop: '2px'}}>
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
          <div style={{flex: 1}}>
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
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'16px',padding:'16px',marginBottom:'16px',marginTop:'16px',boxShadow:!dark?'0 2px 8px rgba(0,0,0,0.07)':'none'}}>
          <div style={{fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',color:theme.muted,marginBottom:'12px'}}>Nos moments</div>
          <div style={{display:'flex',gap:'8px',overflowX:'auto',marginBottom:'14px',paddingBottom:'4px',scrollbarWidth:'none'}}>
            {evenements.map(ev => (
              <button key={ev.id} onClick={() => setActiveEv(ev.id)} style={{background:activeEv===ev.id?'#C8102E':theme.bg,border:`1px solid ${activeEv===ev.id?'#C8102E':theme.border}`,borderRadius:'20px',padding:'6px 14px',color:activeEv===ev.id?'white':theme.muted,fontSize:'11px',fontWeight:activeEv===ev.id?'600':'400',cursor:'pointer',whiteSpace:'nowrap',fontFamily:'inherit',flexShrink:0}}>
                {ev.nom}
              </button>
            ))}
          </div>
          {evActif && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>
              {evActif.photos_galerie?.map((p, i) => (
                <img key={p.id} src={p.url} alt="" loading="lazy" onClick={() => setLightbox(p.url)} style={{width:'100%',height:i===0?'200px':'130px',objectFit:'cover',borderRadius:'10px',cursor:'pointer',gridColumn:i===0?'span 2':'span 1',boxShadow:!dark?'0 2px 8px rgba(0,0,0,0.1)':'none'}} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <img src={lightbox} alt="" loading="lazy" style={{maxWidth:'95%',maxHeight:'90vh',borderRadius:'10px'}} />
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
    <div style={{padding:'16px',maxWidth:'600px',margin:'0 auto'}}>
      <div style={{background:'linear-gradient(135deg,#C8102E,#8b0000)',borderRadius:'18px',padding:'28px 24px',color:'white',marginBottom:'16px',textAlign:'center',boxShadow:!dark?'0 4px 12px rgba(200,16,46,0.2)':'none'}}>
        <div style={{fontSize:'32px',marginBottom:'8px'}}>🙏</div>
        <div style={{fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',opacity:0.7,marginBottom:'12px'}}>{new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
        {devotion ? (
          <>
            <div style={{fontFamily:'Georgia,serif',fontSize:'18px',fontStyle:'italic',lineHeight:'1.7',marginBottom:'8px'}}>« {devotion.verset} »</div>
            <div style={{fontSize:'13px',fontWeight:'700',opacity:0.85}}>— {devotion.reference}</div>
          </>
        ) : (
          <>
            <div style={{fontFamily:'Georgia,serif',fontSize:'18px',fontStyle:'italic',lineHeight:'1.7',marginBottom:'8px'}}>« Je puis tout par Christ qui me fortifie. »</div>
            <div style={{fontSize:'13px',fontWeight:'700',opacity:0.85}}>— Philippiens 4:13</div>
          </>
        )}
      </div>

      {devotion?.priere && (
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'20px',marginBottom:'16px',boxShadow:!dark?'0 2px 8px rgba(0,0,0,0.07)':'none'}}>
          <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'10px'}}>Prière du matin</div>
          <p style={{color:theme.muted,fontSize:'14px',lineHeight:'1.9',fontStyle:'italic',display:'-webkit-box',WebkitLineClamp:expandPrayer?'unset':'3',WebkitBoxOrient:'vertical',overflow:expandPrayer?'unset':'hidden',maxHeight:expandPrayer?'unset':'120px',transition:'all 0.3s ease-in-out'}}>{devotion.priere}</p>
          <button onClick={() => setExpandPrayer(!expandPrayer)} style={{background:'none',border:'none',color:'#C8102E',fontSize:'12px',fontWeight:'600',cursor:'pointer',marginTop:'10px',fontFamily:'inherit',padding:0}}>
            {expandPrayer ? '← Réduire' : 'Lire plus →'}
          </button>
        </div>
      )}

      {defi && (
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'20px',boxShadow:!dark?'0 2px 8px rgba(0,0,0,0.07)':'none'}}>
          <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>Défi lecture cette semaine</div>
          {defi.lectures?.map((l, i) => (
            <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
              <div
                onClick={() => setChecked(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev,i])}
                style={{width:'22px',height:'22px',borderRadius:'50%',background:checked.includes(i)?'#C8102E':'none',border:checked.includes(i)?'none':'2px solid #555',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'11px',cursor:'pointer',flexShrink:0}}
              >
                {checked.includes(i) && '✓'}
              </div>
              <div style={{color:checked.includes(i)?theme.muted:theme.text,fontSize:'13px',textDecoration:checked.includes(i)?'line-through':'none'}}>
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
    <div style={{padding:'16px',maxWidth:'600px',margin:'0 auto'}}>
      {evenements.length === 0 && (
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'24px',textAlign:'center',color:theme.muted,fontSize:'13px'}}>
          Aucun événement à venir pour le moment
        </div>
      )}
      {evenements.map(ev => (
        <div key={ev.id} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',overflow:'hidden',marginBottom:'12px'}}>
          <div style={{background:ev.urgent ? '#C8102E' : '#16a34a',padding:'6px 14px'}}>
            <span style={{color:'white',fontSize:'10px',fontWeight:'700',letterSpacing:'1.5px',textTransform:'uppercase'}}>{ev.urgent ? 'URGENT' : 'ÉVÉNEMENT'}</span>
          </div>
          <div style={{padding:'14px'}}>
            <div style={{color:theme.text,fontSize:'15px',fontWeight:'700',marginBottom:'4px'}}>{ev.titre}</div>
            <div style={{color:theme.muted,fontSize:'12px',marginBottom:'8px'}}>{new Date(ev.date_evenement).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</div>
            {ev.description && <p style={{color:theme.muted,fontSize:'13px',lineHeight:'1.7',marginBottom:'12px'}}>{ev.description}</p>}
            <div style={{display:'flex',gap:'8px'}}>
              <button style={{flex:1,background:'#C8102E',color:'white',border:'none',borderRadius:'8px',padding:'9px',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',fontWeight:'600'}}>
                Je participe
              </button>
              <button onClick={() => setFeedbackEv(ev)} style={{flex:1,background:theme.bg,color:theme.muted,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px',fontSize:'12px',cursor:'pointer',fontFamily:'inherit'}}>
                Feedback
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Modal feedback */}
      {feedbackEv && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={() => setFeedbackEv(null)}>
          <div style={{background:theme.bg,borderRadius:'20px 20px 0 0',padding:'28px 20px',width:'100%',maxWidth:'600px'}} onClick={e=>e.stopPropagation()}>
            <div style={{width:'40px',height:'4px',background:theme.border,borderRadius:'2px',margin:'0 auto 20px'}} />
            <div style={{color:theme.text,fontSize:'16px',fontWeight:'700',marginBottom:'4px'}}>{feedbackEv.titre}</div>
            <div style={{color:theme.muted,fontSize:'12px',marginBottom:'16px'}}>Donnez votre avis sur cet événement</div>
            {msg && <div style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'8px 12px',color:'#C8102E',fontSize:'12px',marginBottom:'12px'}}>{msg}</div>}
            <div style={{display:'flex',gap:'8px',marginBottom:'14px',justifyContent:'center'}}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setNote(n)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'28px',color:n<=note?'#f59e0b':'#444'}}>★</button>
              ))}
            </div>
            <textarea placeholder="Votre commentaire..." value={contenu} onChange={e=>setContenu(e.target.value)} rows={4} style={{width:'100%',background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'10px',padding:'10px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'12px',fontFamily:'inherit',resize:'none'}} />
            <button onClick={envoyerFeedback} style={{width:'100%',background:'#C8102E',color:'white',border:'none',borderRadius:'10px',padding:'12px',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit'}}>
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

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('utilisateurs').select('*').order('nom', { ascending: true })
      if (data) setMembres(data)
    }
    load()
  }, [supabase])

  return (
    <div style={{padding:'16px',maxWidth:'960px',margin:'0 auto'}}>
      <h2 style={{color:theme.text,fontSize:'22px',fontWeight:'700',fontFamily:'Outfit,sans-serif',marginBottom:'20px'}}>Communion</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'14px'}}>
        {membres.map(m => (
          <button key={m.id} onClick={() => setSelected(m)} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'16px',padding:'18px',textAlign:'left',cursor:'pointer',color:'inherit',fontFamily:'inherit',display:'flex',flexDirection:'column',gap:'12px',overflow:'hidden'}}>
            <div style={{width:'56px',height:'56px',borderRadius:'50%',background:'#C8102E',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'18px',fontWeight:'700'}}>
              {`${m.prenom?.[0] || ''}${m.nom?.[0] || ''}`.toUpperCase()}
            </div>
            <div>
              <div style={{fontSize:'15px',fontWeight:'700',color:theme.text}}>{m.prenom} {m.nom}</div>
              <div style={{fontSize:'12px',color:theme.muted,marginTop:'4px'}}>{m.domaine || 'Domaine non renseigné'}</div>
            </div>
            <div style={{fontSize:'12px',color:theme.muted,lineHeight:'1.6'}}>{m.bio ? (m.bio.length > 50 ? `${m.bio.slice(0,50)}...` : m.bio) : 'Aucune bio renseignée.'}</div>
          </button>
        ))}
      </div>

      {selected && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}} onClick={() => setSelected(null)}>
          <div style={{background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'20px',width:'100%',maxWidth:'520px',padding:'24px',position:'relative'}} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={{position:'absolute',top:'16px',right:'16px',background:'none',border:'none',color:theme.muted,fontSize:'22px',cursor:'pointer'}}>✕</button>
            <div style={{width:'72px',height:'72px',borderRadius:'50%',background:'#C8102E',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'28px',fontWeight:'700',margin:'0 auto 18px'}}>
              {`${selected.prenom?.[0] || ''}${selected.nom?.[0] || ''}`.toUpperCase()}
            </div>
            <div style={{textAlign:'center',marginBottom:'16px'}}>
              <div style={{fontSize:'18px',fontWeight:'700',color:theme.text}}>{selected.prenom} {selected.nom}</div>
              <div style={{fontSize:'12px',color:theme.muted,marginTop:'6px'}}>{selected.domaine || 'Domaine non renseigné'}</div>
            </div>
            <div style={{color:theme.muted,fontSize:'13px',lineHeight:'1.8',marginBottom:'20px'}}>{selected.bio || 'Aucune bio renseignée.'}</div>
            {selected.whatsapp && (
              <a href={`https://wa.me/${selected.whatsapp.replace(/\+/g,'').replace(/\s/g,'')}?text=${encodeURIComponent(`Bonjour ${selected.prenom}, je t'ai trouvé dans la communion de la Jeunesse EB Le Rocher !`)}`} target="_blank" rel="noreferrer" style={{display:'block',background:'#25d366',color:'white',borderRadius:'12px',padding:'12px',textDecoration:'none',fontSize:'14px',fontWeight:'700',textAlign:'center'}}>
                Contacter sur WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Profil({ theme, supabase, profile, handleSignOut, navigate, fetchProfile }) {
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
    <div style={{maxWidth:'600px',margin:'0 auto'}}>
      <div style={{background:'linear-gradient(135deg,#C8102E,#8b0000)',padding:'32px 20px 24px',textAlign:'center',color:'white'}}>
        <div style={{width:'72px',height:'72px',borderRadius:'50%',background:'rgba(255,255,255,0.2)',border:'3px solid rgba(255,255,255,0.4)',margin:'0 auto 12px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',fontWeight:'700'}}>
          {profile?.prenom?.[0]}{profile?.nom?.[0]}
        </div>
        <div style={{fontSize:'17px',fontWeight:'700',fontFamily:'Outfit,sans-serif'}}>{profile?.prenom} {profile?.nom}</div>
        <div style={{fontSize:'12px',opacity:0.75,marginTop:'4px'}}>{profile?.role} · {profile?.domaine}</div>
      </div>

      <div style={{display:'flex',background:theme.card,borderBottom:`1px solid ${theme.border}`,overflowX:'auto'}}>
        {['info','cotisations','parametres'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{flex:1,padding:'12px 4px',background:'none',border:'none',borderBottom:`2px solid ${tab===t?'#C8102E':'transparent'}`,color:tab===t?'#C8102E':theme.muted,fontSize:'12px',cursor:'pointer',fontFamily:'inherit',fontWeight:tab===t?'600':'400',textTransform:'capitalize',whiteSpace:'nowrap'}}>
            {t==='info'?'Infos':t==='cotisations'?'Cotisations':'Paramètres'}
          </button>
        ))}
      </div>

      <div style={{padding:'16px'}}>
        {msg && <div style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'8px 12px',color:'#C8102E',fontSize:'12px',marginBottom:'12px'}}>{msg}</div>}

        {tab==='info' && (
          <div>
            {!editing ? (
              <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'16px',marginBottom:'12px'}}>
                <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>Bio</div>
                <p style={{color:theme.muted,fontSize:'13px',lineHeight:'1.9'}}>{bio || 'Aucune bio renseignée.'}</p>
                <button onClick={() => setEditing(true)} style={{marginTop:'10px',background:'none',border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'6px 14px',color:theme.muted,fontSize:'12px',cursor:'pointer',fontFamily:'inherit'}}>
                  Modifier
                </button>
              </div>
            ) : (
              <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'16px',marginBottom:'12px'}}>
                <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={4} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit',resize:'none'}} />
                <button onClick={saveBio} style={{background:'#C8102E',color:'white',border:'none',borderRadius:'8px',padding:'8px 16px',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',fontWeight:'600'}}>
                  Sauvegarder
                </button>
              </div>
            )}
          </div>
        )}

        {tab==='cotisations' && (
          <div>
            <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'16px',marginBottom:'14px'}}>
              <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>Statut 2026</div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                <span style={{color:theme.muted,fontSize:'13px'}}>{cotisOk} mois réglés</span>
                <span style={{color:'#25d366',fontSize:'13px',fontWeight:'600'}}>{cotisOk > 0 ? 'À jour' : 'En attente'}</span>
              </div>
              <div style={{background:theme.bg,borderRadius:'8px',height:'6px',overflow:'hidden'}}>
                <div style={{background:'#25d366',height:'6px',borderRadius:'8px',width:`${Math.min((cotisOk/12)*100,100)}%`}} />
              </div>
            </div>
            {cotisations.map(c => (
              <div key={c.id} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'10px',padding:'12px 14px',marginBottom:'6px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{color:theme.text,fontSize:'13px'}}>{c.mois}</span>
                <span style={{color:statutColor[c.statut],fontSize:'12px',fontWeight:'600'}}>{statutLabel[c.statut]} — {c.montant?.toLocaleString()} F</span>
              </div>
            ))}
          </div>
        )}

        {tab==='parametres' && (
          <div>
            <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'16px',marginBottom:'12px'}}>
              <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>Photo de profil</div>
              <label style={{display:'block',background:theme.bg,border:`2px dashed ${theme.border}`,borderRadius:'12px',padding:'20px',textAlign:'center',cursor:'pointer',marginBottom:'10px'}}>
                <div style={{fontSize:'32px',marginBottom:'8px'}}>📸</div>
                <div style={{color:theme.muted,fontSize:'12px',fontWeight:'600',marginBottom:'4px'}}>{uploading?'Upload en cours...':'Cliquer pour changer'}</div>
                <div style={{color:theme.muted,fontSize:'11px'}}>JPG ou PNG</div>
                <input type="file" accept="image/jpeg,image/png" onChange={uploadAvatar} disabled={uploading} style={{display:'none'}} />
              </label>
            </div>

            <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'16px'}}>
              <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>Changer mot de passe</div>
              <input 
                type={showPassword?'text':'password'}
                placeholder="Nouveau mot de passe" 
                value={nouveauMdp} 
                onChange={e=>setNouveauMdp(e.target.value)} 
                style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}} 
              />
              <input 
                type={showPassword?'text':'password'}
                placeholder="Confirmer mot de passe" 
                value={confirmerMdp} 
                onChange={e=>setConfirmerMdp(e.target.value)} 
                style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}} 
              />
              <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',marginBottom:'12px'}}>
                <input type="checkbox" checked={showPassword} onChange={e=>setShowPassword(e.target.checked)} style={{accentColor:'#C8102E'}} />
                <span style={{color:theme.muted,fontSize:'12px'}}>Afficher le mot de passe</span>
              </label>
              <button onClick={changerMotDePasse} style={{width:'100%',background:'#C8102E',color:'white',border:'none',borderRadius:'8px',padding:'10px',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit'}}>
                Mettre à jour
              </button>
            </div>

            <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'16px',marginTop:'16px'}}>
              <button onClick={handleSignOut} style={{width:'100%',background:'rgba(200,16,46,0.1)',color:'#C8102E',border:`1px solid rgba(200,16,46,0.3)`,borderRadius:'8px',padding:'10px',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit'}}>
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal aperçu fichier */}
      {preview && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}} onClick={() => setPreview(null)}>
          <div style={{background:theme.bg,borderRadius:'14px',padding:'20px',maxWidth:'90vw',maxHeight:'90vh',overflowY:'auto',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
              <h3 style={{color:theme.text,fontSize:'16px',fontWeight:'700'}}>{preview.nom_fichier}</h3>
              <button onClick={() => setPreview(null)} style={{background:'none',border:'none',fontSize:'24px',color:theme.muted,cursor:'pointer'}}>✕</button>
            </div>
            <iframe 
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(preview.url)}&embedded=true`}
              style={{width:'100%',height:'500px',border:`1px solid ${theme.border}`,borderRadius:'10px',marginBottom:'16px'}}
              title="Aperçu"
            />
            <div style={{display:'flex',gap:'8px',justifyContent:'flex-end'}}>
              <button onClick={() => setPreview(null)} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'8px 16px',color:theme.text,fontSize:'13px',cursor:'pointer',fontFamily:'inherit'}}>Fermer</button>
              <a href={preview.url} target="_blank" rel="noreferrer" style={{background:'#C8102E',border:'none',borderRadius:'8px',padding:'8px 16px',color:'white',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit',textDecoration:'none',display:'flex',alignItems:'center'}}>Ouvrir</a>
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
    if (['ROCHER','rocher','2610'].includes(pin)) {
      setShowPin(false)
      navigate('/admin')
    }
  }

  return (
    <>
      <div onClick={handleClick} style={{position:'fixed',bottom:'75px',right:'12px',zIndex:999,width:'8px',height:'8px',borderRadius:'50%',background:'rgba(200,16,46,0.3)',cursor:'pointer'}} />
      {showPin && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={() => setShowPin(false)}>
          <div style={{background:'#1a1a1a',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'16px',padding:'28px 24px',width:'100%',maxWidth:'320px'}} onClick={e=>e.stopPropagation()}>
            <div style={{color:'rgba(200,16,46,0.7)',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'16px',textAlign:'center'}}>Accès restreint</div>
            <input type="password" value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handlePin()} placeholder="Code confidentiel" autoFocus style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'10px 12px',color:'white',fontSize:'13px',outline:'none',marginBottom:'12px',fontFamily:'inherit',textAlign:'center',letterSpacing:'4px'}} />
            <button onClick={handlePin} style={{width:'100%',background:'#C8102E',color:'white',border:'none',borderRadius:'10px',padding:'12px',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit'}}>Confirmer</button>
          </div>
        </div>
      )}
    </>
  )
} 
