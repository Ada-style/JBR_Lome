import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState('')
  const [isResetting, setIsResetting] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Vérifier si on est dans un flux de réinitialisation (arrivé via email)
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsResetting(true)
      }
    })
    
    // Si l'utilisateur est déjà connecté (via lien magique ou recovery)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsResetting(true)
    })
  }, [])

  async function requestReset() {
    if (!email) { setMsg('Entrez votre email'); return }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    setLoading(false)
    if (error) { setMsg('Erreur : ' + error.message); return }
    setMsg('Lien envoyé ! Consultez votre boîte mail.')
  }

  async function updatePassword() {
    if (password !== confirm) { setMsg('Les mots de passe ne correspondent pas'); return }
    if (password.length < 6) { setMsg('Minimum 6 caractères'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(true)
    if (error) { setMsg('Erreur : ' + error.message); return }
    setMsg('Mot de passe mis à jour !')
    setTimeout(() => navigate('/'), 2000)
  }

  return (
    <div style={{minHeight:'100vh',background:'#111',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px', fontFamily: 'Founders Grotesk, sans-serif'}}>
      <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'24px',padding:'32px',width:'100%',maxWidth:'400px'}}>
        <div style={{textAlign:'center',marginBottom:'24px'}}>
          <img src="/logo.png" alt="Logo" style={{width:'80px', height:'80px', objectFit:'contain', marginBottom:'16px', borderRadius:'16px'}} />
          <h2 style={{color:'white',fontSize:'22px',fontWeight:'700'}}>{isResetting ? 'Nouveau mot de passe' : 'Récupération'}</h2>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginTop:'8px'}}>
            {isResetting ? 'Saisissez votre nouveau mot de passe' : 'Entrez votre email pour recevoir un lien'}
          </p>
        </div>

        {msg && (
          <div style={{
            background: msg.includes('succès') || msg.includes('envoyé') ? 'rgba(37,211,102,0.1)' : 'rgba(200,16,46,0.1)',
            border: `1px solid ${msg.includes('succès') || msg.includes('envoyé') ? 'rgba(37,211,102,0.3)' : 'rgba(200,16,46,0.3)'}`,
            borderRadius: '10px', padding: '12px', color: msg.includes('succès') || msg.includes('envoyé') ? '#25d366' : '#FC1713',
            fontSize: '13px', marginBottom: '20px', textAlign: 'center'
          }}>
            {msg}
          </div>
        )}

        {!isResetting ? (
          <>
            <label style={{color:'rgba(255,255,255,0.4)',fontSize:'10px',letterSpacing:'1.5px',textTransform:'uppercase',display:'block',marginBottom:'6px'}}>Email</label>
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'12px',color:'white',fontSize:'14px',outline:'none',marginBottom:'20px',fontFamily:'inherit', boxSizing:'border-box'}}
            />
            <button onClick={requestReset} disabled={loading} style={{width:'100%',background:'#0965BA',color:'white',border:'none',borderRadius:'12px',padding:'14px',fontSize:'14px',fontWeight:'700',cursor:'pointer',fontFamily:'inherit', opacity: loading ? 0.6 : 1}}>
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
          </>
        ) : (
          <>
            <label style={{color:'rgba(255,255,255,0.4)',fontSize:'10px',letterSpacing:'1.5px',textTransform:'uppercase',display:'block',marginBottom:'6px'}}>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'12px',color:'white',fontSize:'14px',outline:'none',marginBottom:'12px',fontFamily:'inherit', boxSizing:'border-box'}}
            />
            <label style={{color:'rgba(255,255,255,0.4)',fontSize:'10px',letterSpacing:'1.5px',textTransform:'uppercase',display:'block',marginBottom:'6px'}}>Confirmer</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={e=>setConfirm(e.target.value)}
              style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'12px',color:'white',fontSize:'14px',outline:'none',marginBottom:'24px',fontFamily:'inherit', boxSizing:'border-box'}}
            />
            <button onClick={updatePassword} disabled={loading} style={{width:'100%',background:'#FC1713',color:'white',border:'none',borderRadius:'12px',padding:'14px',fontSize:'14px',fontWeight:'700',cursor:'pointer',fontFamily:'inherit', opacity: loading ? 0.6 : 1}}>
              {loading ? 'Mise à jour...' : 'Réinitialiser'}
            </button>
          </>
        )}

        <button onClick={() => navigate('/')} style={{width:'100%',background:'transparent',color:'rgba(255,255,255,0.4)',border:'none',borderRadius:'12px',padding:'12px',fontSize:'12px',fontWeight:'500',cursor:'pointer',fontFamily:'inherit',marginTop:'12px',textDecoration:'underline'}}>
          Retour à la connexion
        </button>
      </div>
    </div>
  )
}