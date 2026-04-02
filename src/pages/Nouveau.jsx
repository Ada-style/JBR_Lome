import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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

export default function Nouveau() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const [evenements, setEvenements] = useState(EVENEMENTS_LOCAUX)
  const [activeEv, setActiveEv] = useState('local-detente')
  const [lightbox, setLightbox] = useState(null)
  const [nom, setNom] = useState('')
  const [tel, setTel] = useState('')
  const [domaine, setDomaine] = useState('')
  const [msg, setMsg] = useState('')
  const [email, setEmail] = useState('')

  const theme = {
    bg: dark ? '#0f0f0f' : '#f7f5f2',
    card: dark ? 'rgba(255,255,255,0.06)' : '#ffffff',
    border: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    text: dark ? '#ffffff' : '#111111',
    muted: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
  }

  useEffect(() => { loadEvenements() }, [])

  async function loadEvenements() {
    const { data } = await supabase
      .from('evenements_galerie')
      .select('*, photos_galerie(*)')
      .order('date_evenement', { ascending: false })
    if (data && data.length > 0) {
      setEvenements([...data, ...EVENEMENTS_LOCAUX])
      setActiveEv(data[0].id)
    }
  }

  async function envoyerDemande() {
    if (!nom || !tel) { setMsg('Renseignez votre nom et numéro WhatsApp'); return }
    await supabase.from('demandes').insert({ nom, whatsapp: tel, domaine, email })
    setMsg('Demande envoyée ! Le bureau vous contactera bientôt.')
    setNom(''); setTel(''); setDomaine('')
  }

  const evActif = evenements.find(e => e.id === activeEv)

  return (
    <div style={{minHeight:'100vh',background:theme.bg,transition:'background 0.3s'}}>

      {/* Boutons fixes */}
      <button onClick={() => navigate('/')} style={{position:'fixed',top:'16px',left:'16px',zIndex:100,background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'20px',padding:'6px 14px',color:theme.text,fontSize:'12px',cursor:'pointer',fontFamily:'inherit',backdropFilter:'blur(10px)'}}>
        ← Retour
      </button>
      <button onClick={() => setDark(!dark)} style={{position:'fixed',top:'16px',right:'16px',zIndex:100,background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'20px',padding:'6px 14px',color:theme.text,fontSize:'12px',cursor:'pointer',fontFamily:'inherit',backdropFilter:'blur(10px)'}}>
        {dark ? 'Mode clair' : 'Mode sombre'}
      </button>

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#C8102E,#8b0000)',padding:'80px 24px 48px',textAlign:'center',color:'white'}}>
        <img src="/logo.png" alt="Logo" style={{width:'70px',height:'70px',objectFit:'contain',borderRadius:'12px',marginBottom:'16px',filter:'drop-shadow(0 4px 20px rgba(0,0,0,0.4))'}} />
        <h1 style={{fontFamily:'Outfit,sans-serif',fontSize:'28px',fontWeight:'700',margin:'0 0 8px'}}>
          Bienvenue parmi nous
        </h1>
        <p style={{fontSize:'14px',opacity:0.8,maxWidth:'320px',margin:'0 auto',lineHeight:'1.7'}}>
          La Jeunesse EB Le Rocher est un espace de foi, de croissance et de fraternité.
        </p>
      </div>

      <div style={{maxWidth:'680px',margin:'0 auto',padding:'24px'}}>

        {/* Mot du président */}
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'16px',padding:'24px',marginBottom:'16px'}}>
          <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'12px'}}>Mot du Président</div>
          <p style={{color:theme.text,fontSize:'15px',lineHeight:'1.9',fontStyle:'italic',marginBottom:'12px',fontFamily:'Georgia,serif'}}>
            « Si tu cherches une famille où grandir dans la foi, l'amitié et la joie; tu es au bon endroit. On t'attendait ! »
          </p>
          <div style={{color:theme.muted,fontSize:'12px',fontWeight:'600'}}>EZIAN-GNAMAVO Yao Benjamin : Président de la Jeunesse EB Le Rocher</div>
        </div>

        {/* Ce que tu trouveras */}
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'16px',padding:'24px',marginBottom:'16px'}}>
          <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>Ce que tu trouveras ici</div>
          {[
            'Des dévotions hebdomadaires et des défis de lecture biblique',
            'Des événements récréatifs et culturels tout au long de l\'année',
            'Un réseau de jeunes talentueux avec qui collaborer',
            'Un espace sûr pour grandir dans la foi et dans la vie',
          ].map((item, i) => (
            <div key={i} style={{display:'flex',gap:'10px',alignItems:'flex-start',marginBottom:'10px'}}>
              <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#C8102E',marginTop:'7px',flexShrink:0}} />
              <div style={{color:theme.muted,fontSize:'13px',lineHeight:'1.7'}}>{item}</div>
            </div>
          ))}
        </div>

        {/* Galerie */}
        {evenements.length > 0 && (
          <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'16px',padding:'20px',marginBottom:'16px'}}>
            <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'16px'}}>Nos moments</div>

            {/* Tabs événements */}
            <div style={{display:'flex',gap:'8px',overflowX:'auto',marginBottom:'16px',paddingBottom:'4px',scrollbarWidth:'none'}}>
              {evenements.map(ev => (
                <button
                  key={ev.id}
                  onClick={() => setActiveEv(ev.id)}
                  style={{
                    background: activeEv===ev.id ? '#C8102E' : theme.bg,
                    border: `1px solid ${activeEv===ev.id ? '#C8102E' : theme.border}`,
                    borderRadius:'20px',
                    padding:'7px 16px',
                    color: activeEv===ev.id ? 'white' : theme.muted,
                    fontSize:'12px',
                    fontWeight: activeEv===ev.id ? '600' : '400',
                    cursor:'pointer',
                    whiteSpace:'nowrap',
                    fontFamily:'inherit',
                    transition:'all 0.2s',
                    flexShrink:0,
                  }}
                >
                  {ev.nom} · {new Date(ev.date_evenement).toLocaleDateString('fr-FR',{month:'short',year:'numeric'})}
                </button>
              ))}
            </div>

            {/* Photos de l'événement actif */}
            {evActif && (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                {evActif.photos_galerie?.map((p, i) => (
                  <img
                    key={p.id}
                    src={p.url}
                    alt=""
                    onClick={() => setLightbox(p.url)}
                    style={{
                      width:'100%',
                      height: i===0 ? '220px' : '150px',
                      objectFit:'cover',
                      borderRadius:'12px',
                      cursor:'pointer',
                      gridColumn: i===0 ? 'span 2' : 'span 1',
                      transition:'transform 0.2s',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Formulaire rejoindre */}
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'16px',padding:'24px',marginBottom:'32px'}}>
          <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>Rejoindre la jeunesse</div>
          {msg && (
            <div style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'8px 12px',color:'#C8102E',fontSize:'12px',marginBottom:'12px'}}>
              {msg}
            </div>
          )}
          <input placeholder="Nom complet *" value={nom} onChange={e=>setNom(e.target.value)} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}} />
          <input placeholder="Adresse email *" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}} />
          <input placeholder="Numéro WhatsApp *" value={tel} onChange={e=>setTel(e.target.value)} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}} />
          <input placeholder="Domaine d'études ou d'activité" value={domaine} onChange={e=>setDomaine(e.target.value)} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'14px',fontFamily:'inherit'}} />
          <button onClick={envoyerDemande} style={{width:'100%',background:'#C8102E',color:'white',border:'none',borderRadius:'8px',padding:'12px',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit'}}>
            Envoyer ma demande
          </button>
        </div>

      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <img src={lightbox} alt="" style={{maxWidth:'95%',maxHeight:'90vh',borderRadius:'10px'}} />
        </div>
      )}

    </div>
  )
}