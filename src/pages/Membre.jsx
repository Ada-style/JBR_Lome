import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Membre() {
  const navigate = useNavigate()
  const { supabase, profile, signOut } = useAuth()
  const [tab, setTab] = useState('accueil')
  const [dark, setDark] = useState(true)

  const theme = {
    bg: dark ? '#0f0f0f' : '#f4f4f5',
    card: dark ? 'rgba(255,255,255,0.06)' : '#ffffff',
    border: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    text: dark ? '#ffffff' : '#111111',
    muted: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
  }

  const tabs = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'devotion', label: 'Dévotion' },
    { id: 'annuaire', label: 'Annuaire' },
    { id: 'evenements', label: 'Événements' },
    { id: 'profil', label: 'Profil' },
  ]

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div style={{minHeight:'100vh',background:theme.bg,transition:'background 0.3s'}}>

      {/* Topbar */}
      <div style={{background:dark?'#1a1a1a':'#ffffff',borderBottom:'2px solid #C8102E',padding:'12px 16px',display:'flex',alignItems:'center',gap:'10px',position:'sticky',top:0,zIndex:50}}>
        <img src="/logo.png" alt="Logo" style={{width:'28px',height:'28px',objectFit:'contain',borderRadius:'6px'}} />
        <div style={{flex:1}}>
          <div style={{color:theme.text,fontSize:'13px',fontWeight:'600'}}>EB Le Rocher</div>
          <div style={{color:theme.muted,fontSize:'10px'}}>Espace membre</div>
        </div>
        <button onClick={() => setDark(!dark)} style={{background:'none',border:`1px solid ${theme.border}`,borderRadius:'16px',padding:'5px 12px',color:theme.muted,fontSize:'11px',cursor:'pointer',fontFamily:'inherit'}}>
          {dark ? 'Clair' : 'Sombre'}
        </button>
        <div style={{width:'32px',height:'32px',borderRadius:'50%',background:'#C8102E',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'11px',fontWeight:'700',cursor:'pointer'}} onClick={handleSignOut}>
          {profile?.prenom?.[0]}{profile?.nom?.[0]}
        </div>
      </div>

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
        {tab==='accueil' && <Accueil theme={theme} supabase={supabase} />}
        {tab==='devotion' && <Devotion theme={theme} supabase={supabase} />}
        {tab==='annuaire' && <Annuaire theme={theme} supabase={supabase} />}
        {tab==='evenements' && <Evenements theme={theme} supabase={supabase} profile={profile} />}
        {tab==='profil' && <Profil theme={theme} supabase={supabase} profile={profile} />}
      </div>
    </div>
  )
}


function Accueil({ theme, supabase }) {
  const [devotion, setDevotion] = useState(null)
  const [annonces, setAnnonces] = useState([])
  const [evenements, setEvenements] = useState([])
  const [activeEv, setActiveEv] = useState(null)
  const [lightbox, setLightbox] = useState(null)

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
      const { data: dev } = await supabase.from('devotions').select('*').eq('date_devotion', today).single()
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
    }
    load()
  }, [])

  const evActif = evenements.find(e => e.id === activeEv)

  return (
    <div style={{padding:'16px',maxWidth:'600px',margin:'0 auto'}}>

      {/* Verset */}
      <div style={{background:'linear-gradient(135deg,#C8102E,#8b0000)',borderRadius:'18px',padding:'28px 24px',color:'white',marginBottom:'16px',position:'relative',overflow:'hidden'}}>
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

      {/* Annonces */}
      {annonces.length > 0 && (
        <>
          <div style={{fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',color:theme.muted,marginBottom:'10px'}}>Annonces</div>
          {annonces.map(a => (
            <div key={a.id} style={{background:theme.card,border:`1px solid ${a.urgent?'#C8102E':theme.border}`,borderRadius:'10px',padding:'12px 14px',marginBottom:'8px',display:'flex',alignItems:'center',gap:'12px'}}>
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

      {/* Galerie */}
      {evenements.length > 0 && (
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'16px',padding:'16px',marginBottom:'16px',marginTop:'16px'}}>
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
                <img key={p.id} src={p.url} alt="" onClick={() => setLightbox(p.url)} style={{width:'100%',height:i===0?'200px':'130px',objectFit:'cover',borderRadius:'10px',cursor:'pointer',gridColumn:i===0?'span 2':'span 1'}} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <img src={lightbox} alt="" style={{maxWidth:'95%',maxHeight:'90vh',borderRadius:'10px'}} />
        </div>
      )}
    </div>
  )
}

function Devotion({ theme, supabase }) {
  const [devotion, setDevotion] = useState(null)
  const [defi, setDefi] = useState(null)
  const [checked, setChecked] = useState([])

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().split('T')[0]
      const { data: dev } = await supabase.from('devotions').select('*').eq('date_devotion', today).single()
      setDevotion(dev)
      const weekNum = Math.ceil(new Date().getDate() / 7)
      const { data: d } = await supabase.from('defis_lecture').select('*').eq('semaine', weekNum).eq('annee', 2026).single()
      setDefi(d)
    }
    load()
  }, [])

  return (
    <div style={{padding:'16px',maxWidth:'600px',margin:'0 auto'}}>
      <div style={{background:'linear-gradient(135deg,#C8102E,#8b0000)',borderRadius:'18px',padding:'28px 24px',color:'white',marginBottom:'16px',textAlign:'center'}}>
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
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'20px',marginBottom:'16px'}}>
          <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'10px'}}>Prière du matin</div>
          <p style={{color:theme.muted,fontSize:'14px',lineHeight:'1.9',fontStyle:'italic'}}>{devotion.priere}</p>
        </div>
      )}

      {defi && (
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'20px'}}>
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


function Annuaire({ theme, supabase }) {
  const [membres, setMembres] = useState([])
  const [search, setSearch] = useState('')
  const [filtre, setFiltre] = useState('Tous')
  const [domaines, setDomaines] = useState(['Tous'])
  const [selected, setSelected] = useState(null)
  const [fichiers, setFichiers] = useState([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('utilisateurs').select('*').order('nom')
      if (data) {
        setMembres(data)
        const ds = ['Tous', ...new Set(data.map(m => m.domaine).filter(Boolean))]
        setDomaines(ds)
      }
    }
    load()
  }, [])

  async function openProfil(m) {
    setSelected(m)
    const { data } = await supabase.from('fichiers').select('*').eq('utilisateur_id', m.id).eq('statut', 'approuve')
    setFichiers(data || [])
  }

  const filtered = membres.filter(m => {
    const matchSearch = m.nom?.toLowerCase().includes(search.toLowerCase()) || m.prenom?.toLowerCase().includes(search.toLowerCase()) || m.domaine?.toLowerCase().includes(search.toLowerCase())
    const matchFiltre = filtre === 'Tous' || m.domaine === filtre
    return matchSearch && matchFiltre
  })

  return (
    <div style={{padding:'16px',maxWidth:'600px',margin:'0 auto'}}>
      <input placeholder="Chercher par nom, domaine..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:'100%',background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'10px',padding:'11px 14px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}} />
      <div style={{display:'flex',gap:'6px',overflowX:'auto',marginBottom:'14px',paddingBottom:'4px',scrollbarWidth:'none'}}>
        {domaines.map(d => (
          <button key={d} onClick={() => setFiltre(d)} style={{background:filtre===d?'#C8102E':theme.card,border:`1px solid ${filtre===d?'#C8102E':theme.border}`,borderRadius:'18px',padding:'6px 14px',color:filtre===d?'white':theme.muted,fontSize:'11px',cursor:'pointer',whiteSpace:'nowrap',fontFamily:'inherit',fontWeight:filtre===d?'600':'400',flexShrink:0}}>
            {d}
          </button>
        ))}
      </div>
      {filtered.map(m => (
        <div key={m.id} onClick={() => openProfil(m)} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'12px',padding:'12px 14px',marginBottom:'8px',display:'flex',alignItems:'center',gap:'12px',cursor:'pointer'}}>
          <div style={{width:'42px',height:'42px',borderRadius:'50%',background:'#C8102E',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'13px',fontWeight:'700',flexShrink:0}}>
            {m.prenom?.[0]}{m.nom?.[0]}
          </div>
          <div style={{flex:1}}>
            <div style={{color:theme.text,fontSize:'13px',fontWeight:'600'}}>{m.prenom} {m.nom}</div>
            <div style={{color:theme.muted,fontSize:'11px',marginTop:'2px'}}>{m.domaine}</div>
          </div>
          <div style={{color:theme.muted,fontSize:'18px'}}>›</div>
        </div>
      ))}

      {/* Fiche membre */}
      {selected && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}} onClick={() => setSelected(null)}>
          <div style={{background:theme.bg,borderRadius:'20px 20px 0 0',width:'100%',maxWidth:'600px',maxHeight:'85vh',overflowY:'auto'}} onClick={e=>e.stopPropagation()}>

            {/* Header */}
            <div style={{background:'linear-gradient(135deg,#C8102E,#8b0000)',padding:'28px 20px',textAlign:'center',color:'white',borderRadius:'20px 20px 0 0'}}>
              <div style={{width:'64px',height:'64px',borderRadius:'50%',background:'rgba(255,255,255,0.2)',border:'3px solid rgba(255,255,255,0.4)',margin:'0 auto 10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',fontWeight:'700'}}>
                {selected.prenom?.[0]}{selected.nom?.[0]}
              </div>
              <div style={{fontSize:'17px',fontWeight:'700',fontFamily:'Outfit,sans-serif'}}>{selected.prenom} {selected.nom}</div>
              <div style={{fontSize:'12px',opacity:0.75,marginTop:'4px'}}>{selected.domaine}</div>
            </div>

            <div style={{padding:'20px'}}>

              {/* Bio */}
              {selected.bio && (
                <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'12px',padding:'14px',marginBottom:'12px'}}>
                  <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>Bio</div>
                  <p style={{color:theme.muted,fontSize:'13px',lineHeight:'1.9'}}>{selected.bio}</p>
                </div>
              )}

              {/* Fichiers approuvés */}
              {fichiers.length > 0 && (
                <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'12px',padding:'14px',marginBottom:'12px'}}>
                  <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'10px'}}>Documents</div>
                  {fichiers.map(f => (
                    <div key={f.id} style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                      <div style={{fontSize:'18px'}}>📄</div>
                      <div style={{flex:1}}>
                        <div style={{color:theme.text,fontSize:'13px',fontWeight:'600'}}>{f.nom_fichier}</div>
                        <div style={{color:theme.muted,fontSize:'11px'}}>{f.type_fichier}</div>
                      </div>
                      <a href={f.url} target="_blank" rel="noreferrer" style={{color:'#C8102E',fontSize:'12px',textDecoration:'none',fontWeight:'600'}}>Voir</a>
                    </div>
                  ))}
                </div>
              )}

              {/* Contacter */}
              {selected.whatsapp && (
                <a href={`https://wa.me/${selected.whatsapp.replace(/\+/g,'').replace(/\s/g,'')}?text=${encodeURIComponent(`Bonjour ${selected.prenom}, je t'ai trouvé sur la plateforme de la Jeunesse EB Le Rocher !`)}`} target="_blank" rel="noreferrer" style={{display:'block',background:'rgba(37,211,102,0.1)',border:'1px solid rgba(37,211,102,0.3)',borderRadius:'12px',padding:'14px',color:'#25d366',fontSize:'14px',fontWeight:'700',textDecoration:'none',textAlign:'center',marginBottom:'12px'}}>
                  Contacter sur WhatsApp
                </a>
              )}

              <button onClick={() => setSelected(null)} style={{width:'100%',background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'12px',padding:'12px',color:theme.muted,fontSize:'13px',cursor:'pointer',fontFamily:'inherit'}}>
                Fermer
              </button>
            </div>
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
      const { data } = await supabase.from('annonces').select('*').order('created_at', { ascending: false })
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
          <div style={{background:ev.type==='spirituel'?'#C8102E':ev.type==='formation'?'#2563eb':'#16a34a',padding:'6px 14px'}}>
            <span style={{color:'white',fontSize:'10px',fontWeight:'700',letterSpacing:'1.5px',textTransform:'uppercase'}}>{ev.type}</span>
          </div>
          <div style={{padding:'14px'}}>
            <div style={{color:theme.text,fontSize:'15px',fontWeight:'700',marginBottom:'4px'}}>{ev.titre}</div>
            <div style={{color:theme.muted,fontSize:'12px',marginBottom:'8px'}}>{new Date(ev.created_at).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</div>
            {ev.contenu && <p style={{color:theme.muted,fontSize:'13px',lineHeight:'1.7',marginBottom:'12px'}}>{ev.contenu}</p>}
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

function Profil({ theme, supabase, profile }) {
  const [bio, setBio] = useState(profile?.bio || '')
  const [editing, setEditing] = useState(false)
  const [fichiers, setFichiers] = useState([])
  const [cotisations, setCotisations] = useState([])
  const [tab, setTab] = useState('info')
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (profile?.id) {
      loadFichiers()
      loadCotisations()
    }
  }, [profile])

  async function loadFichiers() {
    const { data } = await supabase.from('fichiers').select('*').eq('utilisateur_id', profile.id).order('created_at', { ascending: false })
    if (data) setFichiers(data)
  }

  async function loadCotisations() {
    const { data } = await supabase.from('cotisations').select('*').eq('utilisateur_id', profile.id).order('created_at', { ascending: false })
    if (data) setCotisations(data)
  }

  async function saveBio() {
    await supabase.from('utilisateurs').update({ bio }).eq('id', profile.id)
    setEditing(false)
    setMsg('Profil mis à jour !')
  }

  async function uploadFichier(e, type) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const fileName = `${profile.id}-${Date.now()}-${file.name}`
    await supabase.storage.from('fichiers-membres').upload(`membres/${fileName}`, file)
    const { data: { publicUrl } } = supabase.storage.from('fichiers-membres').getPublicUrl(`membres/${fileName}`)
    await supabase.from('fichiers').insert({
      utilisateur_id: profile.id,
      nom_fichier: file.name,
      type_fichier: type,
      url: publicUrl,
      statut: 'en_attente'
    })
    setMsg('Fichier envoyé — en attente de validation')
    loadFichiers()
    setUploading(false)
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

      <div style={{display:'flex',background:theme.card,borderBottom:`1px solid ${theme.border}`}}>
        {['info','fichiers','cotisations'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{flex:1,padding:'12px 4px',background:'none',border:'none',borderBottom:`2px solid ${tab===t?'#C8102E':'transparent'}`,color:tab===t?'#C8102E':theme.muted,fontSize:'12px',cursor:'pointer',fontFamily:'inherit',fontWeight:tab===t?'600':'400',textTransform:'capitalize'}}>
            {t==='info'?'Infos':t==='fichiers'?'Fichiers':'Cotisations'}
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

        {tab==='fichiers' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'14px'}}>
              <label style={{display:'block',background:theme.card,border:`2px dashed ${theme.border}`,borderRadius:'12px',padding:'16px',textAlign:'center',cursor:'pointer'}}>
                <div style={{color:theme.muted,fontSize:'12px',fontWeight:'600',marginBottom:'4px'}}>CV</div>
                <div style={{color:theme.muted,fontSize:'11px'}}>{uploading?'Upload...':'Ajouter'}</div>
                <input type="file" accept=".pdf,.docx" onChange={e=>uploadFichier(e,'cv')} style={{display:'none'}} />
              </label>
              <label style={{display:'block',background:theme.card,border:`2px dashed ${theme.border}`,borderRadius:'12px',padding:'16px',textAlign:'center',cursor:'pointer'}}>
                <div style={{color:theme.muted,fontSize:'12px',fontWeight:'600',marginBottom:'4px'}}>Portfolio</div>
                <div style={{color:theme.muted,fontSize:'11px'}}>{uploading?'Upload...':'Ajouter'}</div>
                <input type="file" accept=".pdf,.docx" onChange={e=>uploadFichier(e,'portfolio')} style={{display:'none'}} />
              </label>
            </div>
            {fichiers.map(f => (
              <div key={f.id} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'10px',padding:'12px',marginBottom:'6px',display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{fontSize:'20px'}}>📄</div>
                <div style={{flex:1}}>
                  <div style={{color:theme.text,fontSize:'13px',fontWeight:'600'}}>{f.nom_fichier}</div>
                  <div style={{color:statutColor[f.statut],fontSize:'11px',marginTop:'2px'}}>{statutLabel[f.statut]}</div>
                </div>
                <a href={f.url} target="_blank" rel="noreferrer" style={{color:'#C8102E',fontSize:'12px',textDecoration:'none',fontWeight:'600'}}>Voir</a>
              </div>
            ))}
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
      </div>
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