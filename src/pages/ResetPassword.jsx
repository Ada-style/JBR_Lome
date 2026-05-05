import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState('')

  async function updatePassword() {
    if (password !== confirm) { setMsg('Les mots de passe ne correspondent pas'); return }
    if (password.length < 6) { setMsg('Minimum 6 caractères'); return }
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setMsg('Erreur : ' + error.message); return }
    setMsg('Mot de passe créé avec succès !')
    setTimeout(() => navigate('/membre'), 2000)
  }

  return (
    <div style={{minHeight:'100vh',background:'#0f0f0f',display:'flex',alignItems:'center',justifyContent:'center',padding:'24px'}}>
      <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'16px',padding:'32px',width:'100%',maxWidth:'400px'}}>
        <div style={{textAlign:'center',marginBottom:'24px'}}>
          <img src="/logo.png" alt="Logo" style={{width:'60px',marginBottom:'12px'}} />
          <h2 style={{color:'white',fontFamily:'Founders Grotesk,sans-serif',fontSize:'20px',fontWeight:'700'}}>Crée ton mot de passe</h2>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:'13px',marginTop:'6px'}}>Bienvenue dans la Jeunesse EB Le Rocher !</p>
        </div>
        {msg && <div style={{background:'rgba(200,16,46,0.1)',border:'1px solid rgba(200,16,46,0.3)',borderRadius:'8px',padding:'10px',color:'#FC1713',fontSize:'12px',marginBottom:'16px',textAlign:'center'}}>{msg}</div>}
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'10px 12px',color:'white',fontSize:'13px',outline:'none',marginBottom:'10px',fontFamily:'inherit'}}
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirm}
          onChange={e=>setConfirm(e.target.value)}
          style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'10px 12px',color:'white',fontSize:'13px',outline:'none',marginBottom:'16px',fontFamily:'inherit'}}
        />
        <button
          onClick={updatePassword}
          style={{width:'100%',background:'#FC1713',color:'white',border:'none',borderRadius:'8px',padding:'12px',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'inherit'}}
        >
          Confirmer
        </button>
      </div>
    </div>
  )
}