import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient('https://qzqphzfbkdtglghloplo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cXBoemZia2R0Z2xnaGxvcGxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA3MjUyNCwiZXhwIjoyMDg5NjQ4NTI0fQ.8NSCK72hcwTz_pcxn4yWVXvY8E3kbV_2qZR1OjCzeDo')

export default function Admin() {
  const navigate = useNavigate()
  const { supabase, signOut } = useAuth() 
  const [tab, setTab] = useState('dashboard') 
  const [dark, setDark] = useState(true)

  const theme = {
    bg: dark ? '#0f0f0f' : '#f4f4f5',
    card: dark ? 'rgba(255,255,255,0.06)' : '#ffffff',
    border: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    text: dark ? '#ffffff' : '#111111',
    muted: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    sidebar: dark ? '#1a1a1a' : '#ffffff',
  }

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord' },
    { id: 'membres', label: 'Membres' },
    { id: 'demandes', label: 'Demandes' },
    { id: 'cotisations', label: 'Cotisations' },
    { id: 'fichiers', label: 'Fichiers' },
    { id: 'galerie', label: 'Galerie' },
    { id: 'evenements', label: 'Événements' },
    { id: 'devotions', label: 'Dévotions' },
    { id: 'feedbacks', label: 'Feedbacks' },
    { id: 'annonces', label: 'Annonces' },
  ]

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div style={{minHeight:'100vh',background:theme.bg,display:'flex',transition:'background 0.3s'}}>
      <div style={{width:'220px',background:theme.sidebar,borderRight:`1px solid ${theme.border}`,display:'flex',flexDirection:'column',position:'fixed',height:'100vh',zIndex:50,overflowY:'auto'}}>
        <div style={{padding:'20px 16px',borderBottom:`1px solid ${theme.border}`}}>
          <img src="/logo.png" alt="Logo" loading="lazy" style={{width:'36px',height:'36px',objectFit:'contain',borderRadius:'8px',marginBottom:'8px'}} />
          <div style={{color:theme.text,fontSize:'13px',fontWeight:'700'}}>Bureau · Admin</div>
          <div style={{color:theme.muted,fontSize:'11px',marginTop:'2px'}}>Accès restreint</div>
        </div>
        <div style={{padding:'12px 8px',flex:1}}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{width:'100%',background:tab===t.id?'rgba(200,16,46,0.15)':'none',border:'none',borderRadius:'10px',padding:'10px 12px',color:tab===t.id?'#C8102E':theme.muted,fontSize:'13px',fontWeight:tab===t.id?'600':'400',cursor:'pointer',textAlign:'left',marginBottom:'2px',fontFamily:'inherit',transition:'all 0.2s'}}>
              {t.label} 
            </button>
          ))}
        </div>
        <div style={{padding:'12px',borderTop:`1px solid ${theme.border}`,display:'flex',flexDirection:'column',gap:'6px'}}>
          <button onClick={() => navigate('/membre')} style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'8px',color:'#C8102E',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',fontWeight:'600'}}>
            Espace membre
          </button>
          <button onClick={() => setDark(!dark)} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'8px',color:theme.text,fontSize:'12px',cursor:'pointer',fontFamily:'inherit'}}>
            {dark ? 'Mode clair' : 'Mode sombre'}
          </button>
          <button onClick={handleSignOut} style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'8px',color:'#C8102E',fontSize:'12px',cursor:'pointer',fontFamily:'inherit'}}>
            Déconnexion
          </button>
        </div>
      </div>
      <div style={{marginLeft:'220px',flex:1,padding:'24px',maxWidth:'1000px'}}>
        {tab==='dashboard' && <Dashboard theme={theme} supabase={supabase} />}
        {tab==='membres' && <Membres theme={theme} supabase={supabase} />}
        {tab==='demandes' && <Demandes theme={theme} supabase={supabase} />}
        {tab==='cotisations' && <Cotisations theme={theme} supabase={supabase} />}
        {tab==='fichiers' && <Fichiers theme={theme} supabase={supabase} />}
        {tab==='galerie' && <Galerie theme={theme} supabase={supabase} />}
        {tab==='evenements' && <Evenements theme={theme} supabase={supabase} />}
        {tab==='devotions' && <Devotions theme={theme} supabase={supabase} />}
        {tab==='feedbacks' && <Feedbacks theme={theme} supabase={supabase} />}
        {tab==='annonces' && <Annonces theme={theme} supabase={supabase} />}
      </div>
    </div>
  )
}

function Dashboard({ theme, supabase }) {
  const [stats, setStats] = useState({membres:0, cotisOk:0, fichiers:0, demandes:0})

  useEffect(() => {
    async function load() {
      const {count:membres} = await supabase.from('utilisateurs').select('*',{count:'exact',head:true})
      const {count:cotisOk} = await supabase.from('cotisations').select('*',{count:'exact',head:true}).eq('statut','paye')
      const {count:fichiers} = await supabase.from('fichiers').select('*',{count:'exact',head:true}).eq('statut','en_attente')
      const {count:demandes} = await supabase.from('demandes').select('*',{count:'exact',head:true}).eq('statut','en_attente')
      setStats({membres:membres||0, cotisOk:cotisOk||0, fichiers:fichiers||0, demandes:demandes||0})
    }
    load()
  }, [])

  return (
    <div>
      <h2 style={{color:theme.text,fontSize:'22px',fontWeight:'700',fontFamily:'Outfit,sans-serif',marginBottom:'20px'}}>Tableau de bord</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
        {[
          {label:'Membres',val:stats.membres},
          {label:'Cotisations payées',val:stats.cotisOk},
          {label:'Fichiers en attente',val:stats.fichiers},
          {label:'Demandes en attente',val:stats.demandes},
        ].map(s => (
          <div key={s.label} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'20px',textAlign:'center'}}>
            <div style={{color:'#C8102E',fontSize:'32px',fontWeight:'700',fontFamily:'Outfit,sans-serif'}}>{s.val}</div>
            <div style={{color:theme.muted,fontSize:'11px',marginTop:'4px'}}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Demandes({ theme, supabase }) {
  const [demandes, setDemandes] = useState([])

  useEffect(() => { loadDemandes() }, [])

  async function loadDemandes() {
    const {data} = await supabase.from('demandes').select('*').order('created_at',{ascending:false})
    if (data) setDemandes(data)
  }

  async function updateStatut(id, statut) {
    await supabase.from('demandes').update({statut}).eq('id', id)
    if (statut === 'accepte') {
      const demande = demandes.find(d => d.id === id)
      if (demande) {
        await supabase.from('utilisateurs').insert({
          nom: demande.nom.split(' ').slice(1).join(' ') || demande.nom,
          prenom: demande.nom.split(' ')[0],
          email: demande.email || null,
          whatsapp: demande.whatsapp,
          domaine: demande.domaine || '',
          role: 'membre'
        })
      }
    }
    loadDemandes()
  }

  return (
    <div>
      <h2 style={{color:theme.text,fontSize:'22px',fontWeight:'700',fontFamily:'Outfit,sans-serif',marginBottom:'20px'}}>Demandes d'adhésion</h2>
      {demandes.length===0 && (
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'24px',textAlign:'center',color:theme.muted,fontSize:'13px'}}>
          Aucune demande pour le moment
        </div>
      )}
      {demandes.map(d => (
        <div key={d.id} style={{background:theme.card,border:`1px solid ${d.statut==='en_attente'?'#C8102E':theme.border}`,borderRadius:'12px',padding:'16px',marginBottom:'8px'}}>
          <div style={{display:'flex',alignItems:'flex-start',gap:'12px'}}>
            {d.avatar_url ? (
              <img src={d.avatar_url} loading="lazy" style={{width:'40px',height:'40px',borderRadius:'50%',objectFit:'cover',flexShrink:0}} alt="Avatar" />
            ) : (
              <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'#C8102E',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'14px',fontWeight:'700',flexShrink:0}}>
                {d.nom[0]}
              </div>
            )}
            <div style={{flex:1}}>
              <div style={{color:theme.text,fontSize:'14px',fontWeight:'700'}}>{d.nom}</div>
              <div style={{color:theme.muted,fontSize:'12px',marginTop:'2px'}}>{d.domaine || 'Domaine non renseigné'}</div>
              <div style={{color:theme.muted,fontSize:'12px',marginTop:'2px'}}>{d.whatsapp}</div>
              {d.email && <div style={{color:theme.muted,fontSize:'12px',marginTop:'2px'}}>{d.email}</div>}
              <div style={{color:theme.muted,fontSize:'11px',marginTop:'4px'}}>{new Date(d.created_at).toLocaleDateString('fr-FR')}</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'6px',flexShrink:0}}>
              {d.statut==='en_attente' && (
                <>
                  <button onClick={() => updateStatut(d.id,'accepte')} style={{background:'rgba(37,211,102,0.1)',border:'1px solid rgba(37,211,102,0.3)',borderRadius:'8px',padding:'6px 12px',color:'#25d366',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',fontWeight:'600'}}>
                    Accepter
                  </button>
                  <button onClick={() => updateStatut(d.id,'refuse')} style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'6px 12px',color:'#C8102E',fontSize:'12px',cursor:'pointer',fontFamily:'inherit'}}>
                    Refuser
                  </button>
                </>
              )}
              {d.statut!=='en_attente' && (
                <span style={{background:d.statut==='accepte'?'rgba(37,211,102,0.1)':'rgba(200,16,46,0.1)',border:`1px solid ${d.statut==='accepte'?'rgba(37,211,102,0.3)':'rgba(200,16,46,0.3)'}`,borderRadius:'8px',padding:'6px 12px',color:d.statut==='accepte'?'#25d366':'#C8102E',fontSize:'12px',fontWeight:'600'}}>
                  {d.statut==='accepte'?'Acceptée':'Refusée'}
                </span>
              )}
              {d.whatsapp && (
                <a
                  href={`https://wa.me/${d.whatsapp.replace(/\+/g,'').replace(/\s/g,'')}?text=${encodeURIComponent(
                    d.statut==='accepte'
                      ? `Bonjour ${d.nom} ! Votre demande a été acceptée ! Bienvenue dans la famille Jeunesse EB Le Rocher 🙏\n\nVoici vos accès :\nEmail : ${d.email||'à définir'}\nMot de passe : rocher2026`
                      : `Bonjour ${d.nom}, votre demande d'adhésion à la Jeunesse EB Le Rocher a été refusée. Merci de votre intérêt.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{background:'rgba(37,211,102,0.1)',border:'1px solid rgba(37,211,102,0.3)',borderRadius:'8px',padding:'6px 12px',color:'#25d366',fontSize:'12px',textDecoration:'none',textAlign:'center',fontWeight:'600'}}
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Membres({ theme, supabase }) {
  const [membres, setMembres] = useState([])
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [domaine, setDomaine] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [msg, setMsg] = useState('')
  const [lastMembre, setLastMembre] = useState(null)

  useEffect(() => { loadMembres() }, [])

  async function loadMembres() {
    const {data} = await supabase.from('utilisateurs').select('*').order('created_at',{ascending:false})
    if (data) setMembres(data)
  }

  async function addMembre() {
    if (!nom||!prenom||!email) { setMsg('Remplissez tous les champs obligatoires'); return }
    const { data, error } = await supabase.rpc('creer_membre', {
      p_email: email,
      p_password: 'rocher2026',
      p_nom: nom,
      p_prenom: prenom,
      p_domaine: domaine,
      p_whatsapp: whatsapp
    })
    if (error) { setMsg('Erreur : ' + error.message); return }
    setLastMembre({prenom, nom, email, whatsapp})
    setMsg('Compte créé !')
    setNom(''); setPrenom(''); setEmail(''); setDomaine(''); setWhatsapp('')
    loadMembres()
  }

  async function retirerMembre(id) {
    await supabase.from('utilisateurs').delete().eq('id',id)
    loadMembres()
  }

  return (
    <div>
      <h2 style={{color:theme.text,fontSize:'22px',fontWeight:'700',fontFamily:'Outfit,sans-serif',marginBottom:'20px'}}>Membres</h2>
      <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'20px',marginBottom:'20px'}}>
        <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>Ajouter un membre</div>
        {msg && (
          <div style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'8px 12px',color:'#C8102E',fontSize:'12px',marginBottom:'12px'}}>
            {msg}
          </div>
        )}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'10px'}}>
          <input placeholder="Prénom *" value={prenom} onChange={e=>setPrenom(e.target.value)} style={{background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',fontFamily:'inherit'}} />
          <input placeholder="Nom *" value={nom} onChange={e=>setNom(e.target.value)} style={{background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',fontFamily:'inherit'}} />
        </div>
        <input placeholder="Email *" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}} />
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'10px'}}>
          <input placeholder="Domaine" value={domaine} onChange={e=>setDomaine(e.target.value)} style={{background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',fontFamily:'inherit'}} />
          <input placeholder="WhatsApp (+228...)" value={whatsapp} onChange={e=>setWhatsapp(e.target.value)} style={{background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',fontFamily:'inherit'}} />
        </div>
        <button onClick={addMembre} style={{background:'#C8102E',color:'white',border:'none',borderRadius:'8px',padding:'10px 20px',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit'}}>
          Créer le compte
        </button>
        {lastMembre && (
          <div style={{marginTop:'14px',background:'rgba(37,211,102,0.05)',border:'1px solid rgba(37,211,102,0.2)',borderRadius:'12px',padding:'14px'}}>
            <div style={{color:'#25d366',fontSize:'11px',fontWeight:'600',marginBottom:'8px'}}>
              Compte créé pour {lastMembre.prenom} {lastMembre.nom}
            </div>
            {lastMembre.whatsapp ? (
              <a
                href={`https://wa.me/${lastMembre.whatsapp.replace(/\+/g,'').replace(/\s/g,'')}?text=${encodeURIComponent(`Bonjour ${lastMembre.prenom} ! 👋\n\nVoici tes accès pour la plateforme Jeunesse EB Le Rocher :\n\nEmail : ${lastMembre.email}\nMot de passe : rocher2026\n\nConnecte-toi et change ton mot de passe depuis ton profil.\nBienvenue dans la famille ! 🙏`)}`}
                target="_blank"
                rel="noreferrer"
                style={{display:'block',background:'rgba(37,211,102,0.1)',border:'1px solid rgba(37,211,102,0.3)',borderRadius:'8px',padding:'10px',color:'#25d366',fontSize:'13px',fontWeight:'600',textDecoration:'none',textAlign:'center'}}
              >
                Envoyer les identifiants par WhatsApp
              </a>
            ) : (
              <div style={{color:'rgba(255,255,255,0.4)',fontSize:'12px'}}>
                Aucun numéro WhatsApp renseigné — partagez les identifiants manuellement.
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        {membres.map(m => (
          <div key={m.id} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'12px',padding:'14px',marginBottom:'8px',display:'flex',alignItems:'center',gap:'12px'}}>
            {m.avatar_url ? (
              <img src={m.avatar_url} loading="lazy" style={{width:'40px',height:'40px',borderRadius:'50%',objectFit:'cover',flexShrink:0}} alt="Avatar" />
            ) : (
              <div style={{width:'40px',height:'40px',borderRadius:'50%',background:'#C8102E',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'12px',fontWeight:'600',flexShrink:0}}>
                {m.prenom?.[0]}{m.nom?.[0]}
              </div>
            )}
            <div style={{flex:1}}>
              <div style={{color:theme.text,fontSize:'13px',fontWeight:'600'}}>{m.prenom} {m.nom}</div>
              <div style={{color:theme.muted,fontSize:'11px'}}>{m.domaine} · {m.role}</div>
            </div>
            <div style={{display:'flex',gap:'8px'}}>
              {m.whatsapp && (
                <a href={`https://wa.me/${m.whatsapp.replace(/\+/g,'').replace(/\s/g,'')}`} target="_blank" rel="noreferrer" style={{background:'rgba(37,211,102,0.1)',border:'1px solid rgba(37,211,102,0.3)',borderRadius:'8px',padding:'6px 12px',color:'#25d366',fontSize:'12px',fontWeight:'600',textDecoration:'none'}}>
                  WA
                </a>
              )}
              <button onClick={() => retirerMembre(m.id)} style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'6px 12px',color:'#C8102E',fontSize:'12px',cursor:'pointer',fontFamily:'inherit'}}>
                Retirer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Cotisations({ theme, supabase }) {
  const [membres, setMembres] = useState([])
  const [selected, setSelected] = useState(null)
  const [montant, setMontant] = useState('2000')
  const [mois, setMois] = useState('')
  const [statut, setStatut] = useState('paye')
  const [msg, setMsg] = useState('')

  useEffect(() => { loadMembres() }, [])

  async function loadMembres() {
    const {data} = await supabase.from('utilisateurs').select('*, cotisations(*)').order('nom')
    if (data) setMembres(data)
  }

  async function saveCotis() {
    if (!selected||!mois) { setMsg('Sélectionnez un membre et un mois'); return }
    const {data:existing} = await supabase.from('cotisations').select('id').eq('utilisateur_id',selected.id).eq('mois',mois).single()
    if (existing) {
      await supabase.from('cotisations').update({statut,montant:parseInt(montant)}).eq('id',existing.id)
    } else {
      await supabase.from('cotisations').insert({utilisateur_id:selected.id,mois,montant:parseInt(montant),statut})
    }
    setMsg('Cotisation enregistrée !')
    loadMembres()
  }

  const moisList = ['Janvier 2026','Février 2026','Mars 2026','Avril 2026','Mai 2026','Juin 2026','Juillet 2026','Août 2026','Septembre 2026','Octobre 2026','Novembre 2026','Décembre 2026']

  return (
    <div>
      <h2 style={{color:theme.text,fontSize:'22px',fontWeight:'700',fontFamily:'Outfit,sans-serif',marginBottom:'20px'}}>Cotisations</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
        <div>
          <div style={{color:theme.muted,fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'10px'}}>Sélectionner un membre</div>
          {membres.map(m => (
            <div key={m.id} onClick={() => setSelected(m)} style={{background:selected?.id===m.id?'rgba(200,16,46,0.15)':theme.card,border:`1px solid ${selected?.id===m.id?'#C8102E':theme.border}`,borderRadius:'10px',padding:'12px',marginBottom:'6px',cursor:'pointer',display:'flex',alignItems:'center',gap:'10px'}}>
              {m.avatar_url ? (
                <img src={m.avatar_url} loading="lazy" style={{width:'34px',height:'34px',borderRadius:'50%',objectFit:'cover',flexShrink:0}} alt="Avatar" />
              ) : (
                <div style={{width:'34px',height:'34px',borderRadius:'50%',background:'#C8102E',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'11px',fontWeight:'600',flexShrink:0}}>
                  {m.prenom?.[0]}{m.nom?.[0]}
                </div>
              )}
              <div>
                <div style={{color:theme.text,fontSize:'13px',fontWeight:'600'}}>{m.prenom} {m.nom}</div>
                <div style={{color:theme.muted,fontSize:'11px'}}>{m.cotisations?.length||0} cotisation(s)</div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{color:theme.muted,fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'10px'}}>
            {selected ? `Enregistrer pour ${selected.prenom}` : 'Sélectionnez un membre'}
          </div>
          {selected && (
            <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'20px'}}>
              {msg && <div style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'8px 12px',color:'#C8102E',fontSize:'12px',marginBottom:'12px'}}>{msg}</div>}
              <select value={mois} onChange={e=>setMois(e.target.value)} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit',cursor:'pointer'}}>
                <option value="">Choisir le mois</option>
                {moisList.map(m => <option key={m}>{m}</option>)}
              </select>
              <div style={{display:'flex',gap:'8px',marginBottom:'10px'}}>
                {['paye','en_retard','en_attente'].map(s => (
                  <button key={s} onClick={() => setStatut(s)} style={{flex:1,background:statut===s?'#C8102E':'none',border:`1px solid ${statut===s?'#C8102E':theme.border}`,borderRadius:'8px',padding:'8px',color:statut===s?'white':theme.muted,fontSize:'11px',cursor:'pointer',fontFamily:'inherit',fontWeight:statut===s?'600':'400'}}>
                    {s==='paye'?'Payé':s==='en_retard'?'En retard':'En attente'}
                  </button>
                ))}
              </div>
              <input placeholder="Montant (FCFA)" value={montant} onChange={e=>setMontant(e.target.value)} type="number" style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}} />
              <button onClick={saveCotis} style={{width:'100%',background:'#C8102E',color:'white',border:'none',borderRadius:'8px',padding:'10px',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit',marginBottom:'8px'}}>
                Enregistrer
              </button>
{selected.whatsapp && mois && (
  
    <a href={'https://wa.me/' + selected.whatsapp.replace(/\+/g,'').replace(/\s/g,'') + '?text=' + encodeURIComponent(statut==='paye' ? 'Bonjour ' + selected.prenom + ' ! Cotisation de ' + mois + ' reçue (' + montant + ' FCFA). Merci !' : statut==='en_retard' ? 'Bonjour ' + selected.prenom + ', cotisation de ' + mois + ' (' + montant + ' FCFA) non reçue. Merci de régulariser.' : 'Bonjour ' + selected.prenom + ', cotisation de ' + mois + ' en attente. Contactez-nous.')}
    target="_blank"
    rel="noreferrer"
    style={{display:'block',textAlign:'center',background:'rgba(37,211,102,0.1)',border:'1px solid rgba(37,211,102,0.3)',borderRadius:'8px',padding:'10px',color:'#25d366',fontSize:'13px',fontWeight:'600',textDecoration:'none',marginBottom:'10px'}}
  >
    Notifier par WhatsApp
  </a>
)}
              {selected.cotisations?.length > 0 && (
                <div style={{marginTop:'10px'}}>
                  <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>Historique</div>
                  {selected.cotisations.map(c => (
                    <div key={c.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:`1px solid ${theme.border}`}}>
                      <span style={{color:theme.text,fontSize:'13px'}}>{c.mois}</span>
                      <span style={{color:c.statut==='paye'?'#25d366':c.statut==='en_retard'?'#C8102E':'#f59e0b',fontSize:'12px',fontWeight:'600'}}>
                        {c.statut==='paye'?'Payé':c.statut==='en_retard'?'En retard':'En attente'} — {c.montant?.toLocaleString()} F
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Fichiers({ theme, supabase }) {
  const [fichiers, setFichiers] = useState([])
  const [preview, setPreview] = useState(null)

  useEffect(() => { loadFichiers() }, [])

  async function loadFichiers() {
    const {data} = await supabase.from('fichiers').select('*, utilisateurs(prenom, nom)').eq('statut','en_attente')
    if (data) setFichiers(data)
  }

  async function approuver(id) {
    await supabase.from('fichiers').update({statut:'approuve'}).eq('id',id)
    setPreview(null)
    loadFichiers()
  }

  async function supprimer(id) {
    await supabase.from('fichiers').update({statut:'supprime'}).eq('id',id)
    setPreview(null)
    loadFichiers()
  }

  return (
    <div>
      <h2 style={{color:theme.text,fontSize:'22px',fontWeight:'700',fontFamily:'Outfit,sans-serif',marginBottom:'20px'}}>Fichiers en attente</h2>
      {fichiers.length===0 && (
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'24px',textAlign:'center',color:theme.muted,fontSize:'13px'}}>
          Aucun fichier en attente de validation
        </div>
      )}
      {fichiers.map(f => (
        <div key={f.id} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'12px',padding:'14px',marginBottom:'8px',display:'flex',alignItems:'center',gap:'12px'}}>
          <div style={{fontSize:'24px',flexShrink:0}}>📄</div>
          <div style={{flex:1}}>
            <div style={{color:theme.text,fontSize:'13px',fontWeight:'600'}}>{f.nom_fichier}</div>
            <div style={{color:theme.muted,fontSize:'11px'}}>{f.utilisateurs?.prenom} {f.utilisateurs?.nom} · {f.type_fichier}</div>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <button onClick={() => setPreview(f)} style={{background:'rgba(255,193,7,0.1)',border:'1px solid rgba(255,193,7,0.3)',borderRadius:'8px',padding:'6px 12px',color:'#ffc107',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',fontWeight:'600'}}>Aperçu</button>
            <button onClick={() => approuver(f.id)} style={{background:'rgba(37,211,102,0.1)',border:'1px solid rgba(37,211,102,0.3)',borderRadius:'8px',padding:'6px 12px',color:'#25d366',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',fontWeight:'600'}}>Approuver</button>
            <button onClick={() => supprimer(f.id)} style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'6px 12px',color:'#C8102E',fontSize:'12px',cursor:'pointer',fontFamily:'inherit'}}>Supprimer</button>
          </div>
        </div>
      ))}

      {/* Modal aperçu */}
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
              <button onClick={() => approuver(preview.id)} style={{background:'#25d366',border:'none',borderRadius:'8px',padding:'8px 16px',color:'white',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit'}}>Approuver</button>
              <button onClick={() => supprimer(preview.id)} style={{background:'#C8102E',border:'none',borderRadius:'8px',padding:'8px 16px',color:'white',fontSize:'13px',cursor:'pointer',fontFamily:'inherit'}}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Galerie({ theme, supabase }) {
  const [nom, setNom] = useState('')
  const [date, setDate] = useState('')
  const [photos, setPhotos] = useState([])
  const [previews, setPreviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const [evenements, setEvenements] = useState([])
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => { loadEvenements() }, [])

  async function loadEvenements() {
    const {data} = await supabase.from('evenements_galerie').select('*, photos_galerie(*)').order('date_evenement',{ascending:false})
    if (data) setEvenements(data)
  }

  function handlePhotos(e) {
    const files = Array.from(e.target.files).slice(0,5)
    setPhotos(files)
    const urls = files.map(f => URL.createObjectURL(f))
    setPreviews(urls)
  }

  async function publier() {
    if (!nom||!date) { setMsg('Renseignez le nom et la date'); return }
    if (photos.length===0) { setMsg('Ajoutez au moins une photo'); return }
    setUploading(true)
    const {data:ev, error} = await supabase.from('evenements_galerie').insert({nom, date_evenement:date}).select().single()
    if (error) { setMsg('Erreur création événement'); setUploading(false); return }
    for (const photo of photos) {
      const fileName = `${Date.now()}-${photo.name}`
      await supabase.storage.from('fichiers_membres').upload(`galerie/${fileName}`, photo)
      const {data:{publicUrl}} = supabase.storage.from('fichiers_membres').getPublicUrl(`galerie/${fileName}`)
      await supabase.from('photos_galerie').insert({evenement_id:ev.id, url:publicUrl})
    }
    setMsg('Événement publié !')
    setNom(''); setDate(''); setPhotos([]); setPreviews([])
    previews.forEach(url => URL.revokeObjectURL(url))
    loadEvenements()
    setUploading(false)
  }

  async function supprimerEv(id) {
    await supabase.from('evenements_galerie').delete().eq('id',id)
    loadEvenements()
  }

  return (
    <div>
      <h2 style={{color:theme.text,fontSize:'22px',fontWeight:'700',fontFamily:'Outfit,sans-serif',marginBottom:'20px'}}>Galerie</h2>
      <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'20px',marginBottom:'24px'}}>
        <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>Publier un événement</div>
        {msg && <div style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'8px 12px',color:'#C8102E',fontSize:'12px',marginBottom:'12px'}}>{msg}</div>}
        <input placeholder="Nom de l'événement" value={nom} onChange={e=>setNom(e.target.value)} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}} />
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit',cursor:'pointer'}} />
        <label style={{display:'block',background:theme.bg,border:`2px dashed ${theme.border}`,borderRadius:'10px',padding:'16px',textAlign:'center',cursor:'pointer',marginBottom:'10px'}}>
          <div style={{color:theme.muted,fontSize:'13px'}}>{photos.length>0?`${photos.length} photo(s) sélectionnée(s)`:"Choisir jusqu'à 5 photos"}</div>
          <input type="file" accept="image/*" multiple onChange={handlePhotos} style={{display:'none'}} />
        </label>
        {previews.length > 0 && (
          <div style={{marginBottom:'12px'}}>
            <div style={{color:theme.muted,fontSize:'11px',marginBottom:'8px'}}>Aperçu :</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'6px'}}>
              {previews.map((url, i) => (
                <img 
                  key={i} 
                  src={url} 
                  alt="" 
                  loading="lazy"
                  onClick={() => setLightbox(url)}
                  style={{width:'100%',height:'120px',objectFit:'cover',borderRadius:'8px',cursor:'pointer',border:`1px solid ${theme.border}`}} 
                />
              ))}
            </div>
          </div>
        )}
        <button onClick={publier} disabled={uploading} style={{background:'#C8102E',color:'white',border:'none',borderRadius:'8px',padding:'10px 20px',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit',opacity:uploading?0.6:1}}>
          {uploading?'Publication...':'Publier'}
        </button>
      </div>
      <div>
        {evenements.map(ev => (
          <div key={ev.id} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'16px',marginBottom:'12px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
              <div>
                <div style={{color:theme.text,fontSize:'14px',fontWeight:'700'}}>{ev.nom}</div>
                <div style={{color:theme.muted,fontSize:'11px'}}>{new Date(ev.date_evenement).toLocaleDateString('fr-FR')} · {ev.photos_galerie?.length} photo(s)</div>
              </div>
              <button onClick={() => supprimerEv(ev.id)} style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'6px 12px',color:'#C8102E',fontSize:'12px',cursor:'pointer',fontFamily:'inherit'}}>
                Supprimer
              </button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'6px',cursor:'pointer'}}>
              {ev.photos_galerie?.map(p => (
                <img key={p.id} src={p.url} alt="" loading="lazy" onClick={() => setLightbox(p.url)} style={{width:'100%',height:'80px',objectFit:'cover',borderRadius:'8px',transition:'transform 0.2s'}} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <img src={lightbox} alt="" loading="lazy" style={{maxWidth:'95%',maxHeight:'90vh',borderRadius:'10px'}} />
        </div>
      )}
    </div>
  )
}

function Devotions({ theme, supabase }) {
  const [verset, setVerset] = useState('')
  const [reference, setReference] = useState('')
  const [priere, setPriere] = useState('')
  const [date, setDate] = useState('')
  const [lectures, setLectures] = useState([{jour:'Lundi',ref:''},{jour:'Mardi',ref:''},{jour:'Mercredi',ref:''},{jour:'Jeudi',ref:''},{jour:'Vendredi',ref:''}])
  const [semaine, setSemaine] = useState('')
  const [msg, setMsg] = useState('')
  const [devotions, setDevotions] = useState([])

  useEffect(() => { loadDevotions() }, [])

  async function loadDevotions() {
    const {data} = await supabase.from('devotions').select('*').order('date_devotion',{ascending:false}).limit(7)
    if (data) setDevotions(data)
  }

  async function saveDevotion() {
    if (!verset||!reference||!date) { setMsg('Renseignez le verset, la référence et la date'); return }
    await supabase.from('devotions').upsert({verset, reference, priere, date_devotion:date})
    setMsg('Dévotion enregistrée !')
    setVerset(''); setReference(''); setPriere(''); setDate('')
    loadDevotions()
  }

  async function deleteDevotion(id) {
    await supabase.from('devotions').delete().eq('id', id)
    loadDevotions()
  }

  async function saveDefi() {
    if (!semaine) { setMsg('Renseignez le numéro de semaine'); return }
    const lecturesFilled = lectures.filter(l => l.ref.trim())
    await supabase.from('defis_lecture').upsert({semaine:parseInt(semaine), annee:2026, lectures:lecturesFilled})
    setMsg('Défi lecture enregistré !')
  }

  return (
    <div>
      <h2 style={{color:theme.text,fontSize:'22px',fontWeight:'700',fontFamily:'Outfit,sans-serif',marginBottom:'20px'}}>Dévotions</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'20px'}}>
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'20px'}}>
          <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>Dévotion du jour</div>
          {msg && <div style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'8px 12px',color:'#C8102E',fontSize:'12px',marginBottom:'12px'}}>{msg}</div>}
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}} />
          <input placeholder="Verset *" value={verset} onChange={e=>setVerset(e.target.value)} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}} />
          <input placeholder="Référence (ex: Jean 3:16)" value={reference} onChange={e=>setReference(e.target.value)} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}} />
          <textarea placeholder="Prière du matin (optionnel)" value={priere} onChange={e=>setPriere(e.target.value)} rows={4} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit',resize:'none'}} />
          <button onClick={saveDevotion} style={{background:'#C8102E',color:'white',border:'none',borderRadius:'8px',padding:'10px 20px',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit'}}>
            Enregistrer
          </button>
        </div>
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'20px'}}>
          <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>Défi lecture</div>
          <input placeholder="Numéro de semaine" value={semaine} onChange={e=>setSemaine(e.target.value)} type="number" style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}} />
          {lectures.map((l,i) => (
            <div key={i} style={{display:'flex',gap:'8px',marginBottom:'8px',alignItems:'center'}}>
              <span style={{color:theme.muted,fontSize:'12px',width:'70px',flexShrink:0}}>{l.jour}</span>
              <input placeholder="Référence biblique" value={l.ref} onChange={e=>{const n=[...lectures];n[i].ref=e.target.value;setLectures(n)}} style={{flex:1,background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'7px 10px',color:theme.text,fontSize:'12px',outline:'none',fontFamily:'inherit'}} />
            </div>
          ))}
          <button onClick={saveDefi} style={{background:'#C8102E',color:'white',border:'none',borderRadius:'8px',padding:'10px 20px',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit',marginTop:'8px'}}>
            Enregistrer le défi
          </button>
        </div>
      </div>
      <div>
        <div style={{color:theme.muted,fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'10px'}}>Dernières dévotions</div>
        {devotions.map(d => (
          <div key={d.id} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'10px',padding:'12px',marginBottom:'6px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{color:theme.text,fontSize:'13px',fontWeight:'600'}}>{d.verset.substring(0,50)}...</div>
              <div style={{color:theme.muted,fontSize:'11px',marginTop:'2px'}}>{d.reference} · {new Date(d.date_devotion).toLocaleDateString('fr-FR')}</div>
            </div>
            <button onClick={() => deleteDevotion(d.id)} style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'6px 12px',color:'#C8102E',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',flexShrink:0}}>
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Feedbacks({ theme, supabase }) {
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => { loadFeedbacks() }, [])

  async function loadFeedbacks() {
    const {data} = await supabase.from('feedbacks').select('*, utilisateurs(prenom, nom)').order('created_at',{ascending:false})
    if (data) setFeedbacks(data)
  }

  return (
    <div>
      <h2 style={{color:theme.text,fontSize:'22px',fontWeight:'700',fontFamily:'Outfit,sans-serif',marginBottom:'20px'}}>Feedbacks</h2>
      {feedbacks.length===0 && (
        <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'24px',textAlign:'center',color:theme.muted,fontSize:'13px'}}>
          Aucun feedback pour le moment
        </div>
      )}
      {feedbacks.map(f => (
        <div key={f.id} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'12px',padding:'14px',marginBottom:'8px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
            <div>
              <div style={{color:theme.text,fontSize:'13px',fontWeight:'600'}}>{f.utilisateurs?.prenom} {f.utilisateurs?.nom}</div>
              <div style={{color:theme.muted,fontSize:'11px'}}>{f.evenements?.titre}</div>
            </div>
            <div style={{display:'flex',gap:'2px'}}>
              {[1,2,3,4,5].map(n => (
                <span key={n} style={{color:n<=f.note?'#f59e0b':'#444',fontSize:'14px'}}>★</span>
              ))}
            </div>
          </div>
          <div style={{color:theme.muted,fontSize:'13px',lineHeight:'1.6'}}>{f.contenu}</div>
          <div style={{color:theme.muted,fontSize:'11px',marginTop:'6px'}}>{new Date(f.created_at).toLocaleDateString('fr-FR')}</div>
        </div>
      ))}
    </div>
  )
}

function Evenements({ theme, supabase }) {
  const [titre, setTitre] = useState('')
  const [date, setDate] = useState('')
  const [lieu, setLieu] = useState('')
  const [description, setDescription] = useState('')
  const [evenements, setEvenements] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => { loadEvenements() }, [])

  async function loadEvenements() {
    const { data } = await supabase.from('evenements').select('*').order('date_evenement', { ascending: true })
    if (data) setEvenements(data)
  }

  async function publier() {
    if (!titre || !date) { setMsg('Renseignez le titre et la date'); return }
    await supabase.from('evenements').insert({ titre, date_evenement: date, lieu, description })
    setMsg('Événement publié !')
    setTitre(''); setDate(''); setLieu(''); setDescription('')
    loadEvenements()
  }

  async function supprimer(id) {
    await supabase.from('evenements').delete().eq('id', id)
    loadEvenements()
  }

  return (
    <div>
      <h2 style={{color:theme.text,fontSize:'22px',fontWeight:'700',fontFamily:'Outfit,sans-serif',marginBottom:'20px'}}>Événements</h2>
      <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'20px',marginBottom:'24px'}}>
        <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>Nouvel événement</div>
        {msg && <div style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'8px 12px',color:'#C8102E',fontSize:'12px',marginBottom:'12px'}}>{msg}</div>}
        <input placeholder="Titre *" value={titre} onChange={e=>setTitre(e.target.value)} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}} />
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit',cursor:'pointer'}} />
        <input placeholder="Lieu" value={lieu} onChange={e=>setLieu(e.target.value)} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}} />
        <textarea placeholder="Description (optionnel)" value={description} onChange={e=>setDescription(e.target.value)} rows={3} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit',resize:'none'}} />
        <button onClick={publier} style={{background:'#C8102E',color:'white',border:'none',borderRadius:'8px',padding:'10px 20px',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit'}}>
          Publier
        </button>
      </div>
      <div>
        {evenements.length === 0 && (
          <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'24px',textAlign:'center',color:theme.muted,fontSize:'13px'}}>
            Aucun événement pour le moment
          </div>
        )}
        {evenements.map(ev => (
          <div key={ev.id} style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'12px',padding:'14px',marginBottom:'8px',display:'flex',alignItems:'flex-start',gap:'12px'}}>
            <div style={{flex:1}}>
              <div style={{color:theme.text,fontSize:'14px',fontWeight:'700'}}>{ev.titre}</div>
              <div style={{color:theme.muted,fontSize:'12px',marginTop:'2px'}}>{new Date(ev.date_evenement).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})} {ev.lieu ? `· ${ev.lieu}` : ''}</div>
              {ev.description && <div style={{color:theme.muted,fontSize:'12px',marginTop:'4px'}}>{ev.description}</div>}
            </div>
            <button onClick={() => supprimer(ev.id)} style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'6px 12px',color:'#C8102E',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',flexShrink:0}}>
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Annonces({ theme, supabase }) {
  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [urgent, setUrgent] = useState(false)
  const [annonces, setAnnonces] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => { loadAnnonces() }, [])

  async function loadAnnonces() {
    const {data} = await supabase.from('annonces').select('*').order('created_at',{ascending:false})
    if (data) setAnnonces(data)
  }

  async function publier() {
    if (!titre) { setMsg('Renseignez un titre'); return }
    await supabase.from('annonces').insert({titre, contenu, urgent})
    setMsg('Annonce publiée !')
    setTitre(''); setContenu(''); setUrgent(false)
    loadAnnonces()
  }

  async function supprimer(id) {
    await supabase.from('annonces').delete().eq('id',id)
    loadAnnonces()
  }

  return (
    <div>
      <h2 style={{color:theme.text,fontSize:'22px',fontWeight:'700',fontFamily:'Outfit,sans-serif',marginBottom:'20px'}}>Annonces</h2>
      <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'14px',padding:'20px',marginBottom:'24px'}}>
        <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'14px'}}>Nouvelle annonce</div>
        {msg && <div style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'8px 12px',color:'#C8102E',fontSize:'12px',marginBottom:'12px'}}>{msg}</div>}
        <input placeholder="Titre" value={titre} onChange={e=>setTitre(e.target.value)} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}} />
        <textarea placeholder="Contenu (optionnel)" value={contenu} onChange={e=>setContenu(e.target.value)} rows={3} style={{width:'100%',background:theme.bg,border:`1px solid ${theme.border}`,borderRadius:'8px',padding:'9px 12px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit',resize:'none'}} />
        <label style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer',marginBottom:'14px'}}>
          <input type="checkbox" checked={urgent} onChange={e=>setUrgent(e.target.checked)} style={{accentColor:'#C8102E'}} />
          <span style={{color:theme.muted,fontSize:'13px'}}>Marquer comme urgente</span>
        </label>
        <button onClick={publier} style={{background:'#C8102E',color:'white',border:'none',borderRadius:'8px',padding:'10px 20px',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit'}}>
          Publier
        </button>
      </div>
      <div>
        {annonces.map(a => (
          <div key={a.id} style={{background:theme.card,border:`1px solid ${a.urgent?'#C8102E':theme.border}`,borderRadius:'12px',padding:'14px',marginBottom:'8px',display:'flex',alignItems:'flex-start',gap:'12px'}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'4px'}}>
                <div style={{color:theme.text,fontSize:'13px',fontWeight:'600'}}>{a.titre}</div>
                {a.urgent && <span style={{background:'rgba(200,16,46,0.15)',color:'#C8102E',fontSize:'10px',fontWeight:'700',padding:'2px 8px',borderRadius:'10px'}}>URGENT</span>}
              </div>
              {a.contenu && <div style={{color:theme.muted,fontSize:'12px',lineHeight:'1.6'}}>{a.contenu}</div>}
              <div style={{color:theme.muted,fontSize:'11px',marginTop:'6px'}}>{new Date(a.created_at).toLocaleDateString('fr-FR')}</div>
            </div>
            <button onClick={() => supprimer(a.id)} style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'6px 12px',color:'#C8102E',fontSize:'12px',cursor:'pointer',fontFamily:'inherit',flexShrink:0}}>
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}