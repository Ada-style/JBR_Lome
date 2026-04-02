import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Visiteur() {
  const navigate = useNavigate()
  const [dark, setDark] = useState(false)
  const [membres, setMembres] = useState([])
  const [search, setSearch] = useState('')
  const [filtre, setFiltre] = useState('Tous')
  const [domaines, setDomaines] = useState(['Tous'])
  const [selected, setSelected] = useState(null)
  const [fichiers, setFichiers] = useState([])

  const theme = {
    bg: dark ? '#0f0f0f' : '#f7f5f2',
    card: dark ? 'rgba(255,255,255,0.06)' : '#ffffff',
    border: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    text: dark ? '#ffffff' : '#111111',
    muted: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
  }

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('utilisateurs').select('*').order('nom')
      console.log('membres:', data, 'error:', error)
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
    const matchSearch = m.nom?.toLowerCase().includes(search.toLowerCase()) ||
      m.prenom?.toLowerCase().includes(search.toLowerCase()) ||
      m.domaine?.toLowerCase().includes(search.toLowerCase())
    const matchFiltre = filtre === 'Tous' || m.domaine === filtre
    return matchSearch && matchFiltre
  })

  return (
    <div style={{minHeight:'100vh',background:theme.bg,transition:'background 0.3s'}}>

      {/* Boutons fixes */}
      <button onClick={() => navigate('/')} style={{position:'fixed',top:'16px',left:'16px',zIndex:100,background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'20px',padding:'6px 14px',color:theme.text,fontSize:'12px',cursor:'pointer',fontFamily:'inherit'}}>
        ← Retour
      </button>
      <button onClick={() => setDark(!dark)} style={{position:'fixed',top:'16px',right:'16px',zIndex:100,background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'20px',padding:'6px 14px',color:theme.text,fontSize:'12px',cursor:'pointer',fontFamily:'inherit'}}>
        {dark ? 'Mode clair' : 'Mode sombre'}
      </button>

      {/* Header */}
      <div style={{background:dark?'#1a1a1a':'#111',padding:'60px 24px 32px',textAlign:'center'}}>
        <img src="/logo.png" alt="Logo" style={{width:'48px',height:'48px',objectFit:'contain',borderRadius:'10px',marginBottom:'12px',filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'}} />
        <h1 style={{color:'white',fontFamily:'Outfit,sans-serif',fontSize:'22px',fontWeight:'700',margin:'0 0 6px'}}>
          Annuaire des talents
        </h1>
        <p style={{color:'rgba(255,255,255,0.4)',fontSize:'11px',letterSpacing:'1.5px',textTransform:'uppercase',margin:0}}>
          Jeunesse EB Le Rocher
        </p>
      </div>

      <div style={{maxWidth:'600px',margin:'0 auto',padding:'20px 16px'}}>

        {/* Recherche */}
        <input
          placeholder="Chercher par nom, domaine..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{width:'100%',background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'10px',padding:'11px 14px',color:theme.text,fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}}
        />

        {/* Filtres */}
        <div style={{display:'flex',gap:'6px',overflowX:'auto',marginBottom:'16px',paddingBottom:'4px',scrollbarWidth:'none'}}>
          {domaines.map(d => (
            <button
              key={d}
              onClick={() => setFiltre(d)}
              style={{background:filtre===d?'#C8102E':theme.card,border:`1px solid ${filtre===d?'#C8102E':theme.border}`,borderRadius:'18px',padding:'6px 14px',color:filtre===d?'white':theme.muted,fontSize:'11px',cursor:'pointer',whiteSpace:'nowrap',fontFamily:'inherit',fontWeight:filtre===d?'600':'400',flexShrink:0}}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Liste membres */}
        {filtered.length === 0 && (
          <div style={{textAlign:'center',color:theme.muted,fontSize:'13px',padding:'32px 0'}}>
            Aucun résultat
          </div>
        )}
        {filtered.map(m => (
          <div
            key={m.id}
            onClick={() => openProfil(m)}
            style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'12px',padding:'12px 14px',marginBottom:'8px',display:'flex',alignItems:'center',gap:'12px',cursor:'pointer',transition:'border-color 0.2s'}}
          >
            <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'#C8102E',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'14px',fontWeight:'700',flexShrink:0}}>
              {m.prenom?.[0]}{m.nom?.[0]}
            </div>
            <div style={{flex:1}}>
              <div style={{color:theme.text,fontSize:'13px',fontWeight:'600'}}>{m.prenom} {m.nom}</div>
              <div style={{color:theme.muted,fontSize:'11px',marginTop:'2px'}}>{m.domaine}</div>
            </div>
            <div style={{color:theme.muted,fontSize:'18px'}}>›</div>
          </div>
        ))}
      </div>

      {/* Fiche membre */}
      {selected && (
        <div
          style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}}
          onClick={() => setSelected(null)}
        >
          <div
            style={{background:theme.bg,borderRadius:'20px 20px 0 0',width:'100%',maxWidth:'600px',maxHeight:'85vh',overflowY:'auto'}}
            onClick={e => e.stopPropagation()}
          >
            <div style={{background:'linear-gradient(135deg,#C8102E,#8b0000)',padding:'28px 20px',textAlign:'center',color:'white',borderRadius:'20px 20px 0 0'}}>
              <div style={{width:'64px',height:'64px',borderRadius:'50%',background:'rgba(255,255,255,0.2)',border:'3px solid rgba(255,255,255,0.4)',margin:'0 auto 10px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',fontWeight:'700'}}>
                {selected.prenom?.[0]}{selected.nom?.[0]}
              </div>
              <div style={{fontSize:'17px',fontWeight:'700',fontFamily:'Outfit,sans-serif'}}>{selected.prenom} {selected.nom}</div>
              <div style={{fontSize:'12px',opacity:0.75,marginTop:'4px'}}>{selected.domaine}</div>
            </div>

            <div style={{padding:'20px'}}>

              {selected.bio && (
                <div style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'12px',padding:'14px',marginBottom:'12px'}}>
                  <div style={{color:'#C8102E',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'}}>Bio</div>
                  <p style={{color:theme.muted,fontSize:'13px',lineHeight:'1.9'}}>{selected.bio}</p>
                </div>
              )}

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

              {selected.whatsapp && (
                <a
                  href={`https://wa.me/${selected.whatsapp.replace(/\+/g,'').replace(/\s/g,'')}?text=${encodeURIComponent(`Bonjour ${selected.prenom}, je t'ai trouvé sur la plateforme de la Jeunesse EB Le Rocher !`)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{display:'block',background:'rgba(37,211,102,0.1)',border:'1px solid rgba(37,211,102,0.3)',borderRadius:'12px',padding:'14px',color:'#25d366',fontSize:'14px',fontWeight:'700',textDecoration:'none',textAlign:'center',marginBottom:'12px'}}
                >
                  Contacter sur WhatsApp
                </a>
              )}

              <button
                onClick={() => setSelected(null)}
                style={{width:'100%',background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'12px',padding:'12px',color:theme.muted,fontSize:'13px',cursor:'pointer',fontFamily:'inherit'}}
              >
                Fermer
              </button>
            </div> 
          </div>
        </div>
      )}
    </div>
  )
}