import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [pin, setPin] = useState('')
  const [clicks, setClicks] = useState(0)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.from('utilisateurs').select('role').eq('id', session.user.id).single().then(({ data }) => {
          if (data?.role === 'bureau') navigate('/admin')
          else navigate('/membre')
        })
      }
    })
  }, [])

  function handleLogoClick() {
    const n = clicks + 1
    setClicks(n)
    if (n >= 3) { setShowPin(true); setClicks(0) }
    setTimeout(() => setClicks(0), 1800)
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
    } else {
      const { data } = await supabase.from('utilisateurs').select('role').eq('email', email).single()
      if (data?.role === 'bureau') navigate('/admin')
      else navigate('/membre')
    }
  }

  async function handleSignUp(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError('Erreur : ' + error.message)
      setLoading(false)
    } else {
      setError('Compte créé ! Vérifiez votre email pour confirmer.')
      setLoading(false)
    }
  }

  function handlePin() {
    if (['ROCHER', 'rocher', '2610'].includes(pin)) {
      setShowPin(false)
      navigate('/admin')
    } else {
      setError('Code incorrect')
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#111',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{width:'100%',maxWidth:'360px'}}>

        {/* Logo */}
        <div style={{textAlign:'center',marginBottom:'32px',cursor:'pointer'}} onClick={handleLogoClick}>
          <img src="/logo.png" alt="Logo" style={{width:'80px',height:'80px',objectFit:'contain',marginBottom:'12px',borderRadius:'16px',filter:'drop-shadow(0 4px 20px rgba(0,0,0,0.4))'}} />
          <h1 style={{color:'white',fontSize:'22px',fontFamily:'Outfit,sans-serif',fontWeight:'700',margin:'0'}}>
            Jeunesse EB Le Rocher
          </h1>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:'11px',marginTop:'4px',letterSpacing:'2px',textTransform:'uppercase'}}>
            Lomé, Togo · Hountigomé
          </p>
        </div>

        {/* Accès sans compte */}
        <p style={{color:'rgba(255,255,255,0.4)',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'10px'}}>
          Accès sans compte
        </p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'20px'}}>
          <button onClick={() => navigate('/nouveau')} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'14px',padding:'16px',cursor:'pointer',textAlign:'left'}}>
            <div style={{color:'white',fontWeight:'600',fontSize:'13px',marginBottom:'4px'}}>Nouveau</div>
            <div style={{color:'rgba(255,255,255,0.4)',fontSize:'11px'}}>Découvrir la jeunesse</div>
          </button>
          <button onClick={() => navigate('/visiteur')} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'14px',padding:'16px',cursor:'pointer',textAlign:'left'}}>
            <div style={{color:'white',fontWeight:'600',fontSize:'13px',marginBottom:'4px'}}>Visiteur</div>
            <div style={{color:'rgba(255,255,255,0.4)',fontSize:'11px'}}>Annuaire des talents</div>
          </button>
        </div>

        {/* Tabs login/signup */}
        <div style={{display:'flex',background:'rgba(255,255,255,0.06)',borderRadius:'12px',padding:'4px',marginBottom:'16px'}}>
          <button onClick={() => setMode('login')} style={{flex:1,background:mode==='login'?'#C8102E':'none',border:'none',borderRadius:'9px',padding:'9px',color:'white',fontSize:'13px',fontWeight:mode==='login'?'600':'400',cursor:'pointer',fontFamily:'inherit',transition:'all 0.2s'}}>
            Connexion
          </button>
          <button onClick={() => setMode('signup')} style={{flex:1,background:mode==='signup'?'#C8102E':'none',border:'none',borderRadius:'9px',padding:'9px',color:'white',fontSize:'13px',fontWeight:mode==='signup'?'600':'400',cursor:'pointer',fontFamily:'inherit',transition:'all 0.2s'}}>
            Créer mon compte
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={mode==='login'?handleLogin:handleSignUp} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'20px'}}>
          {error && (
            <div style={{background:'rgba(200,16,46,0.2)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'10px',padding:'10px 12px',marginBottom:'12px',color:'rgba(255,255,255,0.8)',fontSize:'13px'}}>
              {error}
            </div>
          )}
          <label style={{color:'rgba(255,255,255,0.4)',fontSize:'10px',letterSpacing:'1.5px',textTransform:'uppercase',display:'block',marginBottom:'5px'}}>
            Adresse e-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="prenom.nom@email.com"
            style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'10px 12px',color:'white',fontSize:'13px',outline:'none',marginBottom:'12px',fontFamily:'inherit'}}
          />
          <label style={{color:'rgba(255,255,255,0.4)',fontSize:'10px',letterSpacing:'1.5px',textTransform:'uppercase',display:'block',marginBottom:'5px'}}>
            Mot de passe
          </label>
          <div style={{position:'relative',marginBottom:'14px'}}>
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'10px 40px 10px 12px',color:'white',fontSize:'13px',outline:'none',fontFamily:'inherit'}}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              style={{position:'absolute',right:'10px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:'16px',padding:'0'}}
            >
              {showPwd ? '🙈' : '👁'}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{width:'100%',background:'#C8102E',color:'white',border:'none',borderRadius:'10px',padding:'12px',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit',opacity:loading?0.6:1}}
          >
            {loading ? 'Chargement...' : mode==='login' ? 'Se connecter' : 'Créer mon compte'}
          </button>
        </form>

        {/* Pin admin secret */}
        {showPin && (
          <div style={{marginTop:'14px',background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'16px',padding:'20px'}}>
            <p style={{color:'rgba(200,16,46,0.7)',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'12px'}}>
              Accès restreint · Bureau
            </p>
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              onKeyDown={e => e.key==='Enter' && handlePin()}
              placeholder="Code confidentiel"
              style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'10px 12px',color:'white',fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}}
            />
            <button
              onClick={handlePin}
              style={{width:'100%',background:'#C8102E',color:'white',border:'none',borderRadius:'10px',padding:'12px',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit'}}
            >
              Confirmer
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
