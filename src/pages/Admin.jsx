import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

const supabaseAdmin = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`
      }
    }
  }
)

export default function Admin() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [tab, setTab] = useState('dashboard')
  const [refreshCount, setRefreshCount] = useState(0)
  const [dark, setDark] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  const theme = {
    bg: dark ? '#0f0f0f' : '#f4f4f5',
    card: dark ? 'rgba(255,255,255,0.06)' : '#ffffff',
    border: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    text: dark ? '#ffffff' : '#111111',
    muted: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    sidebar: dark ? '#1a1a1a' : '#ffffff',
  }

  // SVG Icon components
  const I = (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>{p.children}</svg>
  const IconDashboard = () => <I><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></I>
  const IconUsers = () => <I><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></I>
  const IconInbox = () => <I><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></I>
  const IconWallet = () => <I><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></I>
  const IconFolder = () => <I><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></I>
  const IconImage = () => <I><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></I>
  const IconCalendar = () => <I><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></I>
  const IconBook = () => <I><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></I>
  const IconMessage = () => <I><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></I>
  const IconMegaphone = () => <I><path d="M3 11l18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></I>
  const IconMenu = () => <I width="22" height="22"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></I>
  const IconX = () => <I width="22" height="22"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></I>
  const IconSun = () => <I width="14" height="14"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></I>
  const IconMoon = () => <I width="14" height="14"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></I>
  const IconPray = () => <I><path d="M9 12h6" /><path d="M12 9v6" /><circle cx="12" cy="12" r="10" /></I>
  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <IconDashboard /> },
    { id: 'membres', label: 'Membres', icon: <IconUsers /> },
    { id: 'demandes', label: 'Demandes', icon: <IconInbox /> },
    { id: 'cotisations', label: 'Cotisations', icon: <IconWallet /> },
    { id: 'priere', label: 'Prière', icon: <IconPray /> },
    { id: 'galerie', label: 'Galerie', icon: <IconImage /> },
    { id: 'evenements', label: 'Événements', icon: <IconCalendar /> },
    { id: 'devotions', label: 'Dévotions', icon: <IconBook /> },
    { id: 'feedbacks', label: 'Feedbacks', icon: <IconMessage /> },
    { id: 'annonces', label: 'Annonces', icon: <IconMegaphone /> },
  ]

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  function selectTab(id) {
    setTab(id)
    setMenuOpen(false)
  }

  const currentTab = tabs.find(t => t.id === tab)

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, transition: 'background 0.3s' }}>
      <style>{`
        @media (min-width: 769px) {
          .admin-sidebar { display: flex !important; }
          .admin-mobile-header { display: none !important; }
          .admin-backdrop { display: none !important; }
          .admin-content { margin-left: 220px !important; }
        }
        @media (max-width: 768px) {
          .admin-sidebar { 
            transform: ${menuOpen ? 'translateX(0)' : 'translateX(-100%)'};
            transition: transform 0.3s ease;
            width: 260px !important;
          }
          .admin-content { margin-left: 0 !important; padding: 16px !important; padding-top: 70px !important; }
        }
      `}</style>

      {/* Mobile header */}
      <div className="admin-mobile-header" style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 45,
        background: theme.sidebar, borderBottom: `1px solid ${theme.border}`,
        padding: '12px 16px',
      }}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          background: 'none', border: 'none', color: theme.text, fontSize: '22px', cursor: 'pointer', padding: '4px'
        }}>
          {menuOpen ? <IconX /> : <IconMenu />}
        </button>
        <img src="/logo.png" alt="Logo" loading="lazy" style={{ width: '24px', height: '24px', objectFit: 'contain', borderRadius: '4px' }} />
        <div style={{ flex: 1 }}>
          <div style={{ color: theme.text, fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ display: 'inline-flex' }}>{currentTab?.icon}</span> {currentTab?.label}</div>
        </div>
        <button onClick={() => setDark(!dark)} style={{ background: 'none', border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '4px 10px', color: theme.muted, fontSize: '10px', cursor: 'pointer', fontFamily: 'inherit' }}>
          {dark ? <IconSun /> : <IconMoon />}
        </button>
      </div>

      {/* Backdrop mobile */}
      {menuOpen && (
        <div className="admin-backdrop" onClick={() => setMenuOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 48
        }} />
      )}

      {/* Sidebar */}
      <div className="admin-sidebar" style={{
        width: '220px', background: theme.sidebar, borderRight: `1px solid ${theme.border}`,
        display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 50, overflowY: 'auto'
      }}>
        <div style={{ padding: '20px 16px', borderBottom: `1px solid ${theme.border}` }}>
          <img src="/logo.png" alt="Logo" loading="lazy" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '8px', marginBottom: '8px' }} />
          <div style={{ color: theme.text, fontSize: '13px', fontWeight: '700' }}>Bureau · Admin</div>
          <div style={{ color: theme.muted, fontSize: '11px', marginTop: '2px' }}>Accès restreint</div>
        </div>
        <div style={{ padding: '12px 8px', flex: 1 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => selectTab(t.id)} style={{ width: '100%', background: tab === t.id ? 'rgba(200,16,46,0.15)' : 'none', border: 'none', borderRadius: '10px', padding: '10px 12px', color: tab === t.id ? '#FC1713' : theme.muted, fontSize: '13px', fontWeight: tab === t.id ? '600' : '400', cursor: 'pointer', textAlign: 'left', marginBottom: '2px', fontFamily: 'inherit', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-flex', flexShrink: 0 }}>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
        <div style={{ padding: '12px', borderTop: `1px solid ${theme.border}`, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button onClick={() => navigate('/membre')} style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '8px', padding: '8px', color: '#FC1713', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600' }}>
            Espace membre
          </button>
          <button onClick={() => setDark(!dark)} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '8px', color: theme.text, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
            {dark ? 'Mode clair' : 'Mode sombre'}
          </button>
          <button onClick={handleSignOut} style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '8px', padding: '8px', color: '#FC1713', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="admin-content" style={{ marginLeft: '220px', flex: 1, padding: '24px', maxWidth: '1000px' }}>
        {tab === 'dashboard' && <Dashboard theme={theme} supabase={supabase} supabaseAdmin={supabaseAdmin} refreshCount={refreshCount} />}
        {tab === 'membres' && <Membres key={tab} theme={theme} supabase={supabase} refreshCount={refreshCount} />}
        {tab === 'demandes' && <Demandes key={tab} theme={theme} supabase={supabase} onRefresh={() => setRefreshCount(r => r + 1)} />}
        {tab === 'cotisations' && <Cotisations theme={theme} supabase={supabase} supabaseAdmin={supabaseAdmin} />}
        {tab === 'priere' && <Priere theme={theme} supabase={supabase} />}
        {tab === 'galerie' && <Galerie theme={theme} supabase={supabase} supabaseAdmin={supabaseAdmin} />}
        {tab === 'evenements' && <Evenements theme={theme} supabase={supabase} supabaseAdmin={supabaseAdmin} />}
        {tab === 'devotions' && <Devotions theme={theme} supabase={supabase} supabaseAdmin={supabaseAdmin} />}
        {tab === 'feedbacks' && <Feedbacks theme={theme} supabase={supabase} />}
        {tab === 'annonces' && <Annonces theme={theme} supabase={supabase} supabaseAdmin={supabaseAdmin} />}
      </div>
    </div>
  )
}

function Dashboard({ theme, supabase, supabaseAdmin, refreshCount }) {
  const [stats, setStats] = useState({ membres: 0, cotisOk: 0, demandes: 0 })

  useEffect(() => {
    async function load() {
      const { count: membres } = await supabaseAdmin.from('utilisateurs').select('*', { count: 'exact', head: true })
      const { count: cotisOk } = await supabaseAdmin.from('cotisations').select('*', { count: 'exact', head: true }).eq('statut', 'paye')
      const { count: demandes } = await supabaseAdmin.from('demandes').select('*', { count: 'exact', head: true }).eq('statut', 'en_attente')
      setStats({ membres: membres || 0, cotisOk: cotisOk || 0, demandes: demandes || 0 })
    }
    load()
  }, [refreshCount])

  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Founders Grotesk', marginBottom: '20px' }}>Tableau de bord</h2>
      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
        {[
          { label: 'Membres', val: stats.membres },
          { label: 'Cotisations payées', val: stats.cotisOk },
          { label: 'Demandes en attente', val: stats.demandes },
        ].map(s => (
          <div key={s.label} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
            <div style={{ color: '#FC1713', fontSize: '32px', fontWeight: '700', fontFamily: 'Founders Grotesk' }}>{s.val}</div>
            <div style={{ color: theme.muted, fontSize: '11px', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Demandes({ theme, supabase, onRefresh }) {
  const [demandes, setDemandes] = useState([])
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('error')

  useEffect(() => { loadDemandes() }, [])

  function showMsg(text, type = 'error') {
    setMsg(text)
    setMsgType(type)
    setTimeout(() => setMsg(''), 8000)
  }

  async function loadDemandes() {
    const { data, error } = await supabaseAdmin
      .from('demandes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur chargement demandes:', error);
      return;
    }

    setDemandes(data || []);
  }

  async function updateStatut(id, statut) {
    try {
      const demande = demandes.find(d => d.id === id)
      if (!demande) {
        showMsg('Demande non trouvée')
        return
      }

      if (statut === 'accepte') {
        // Vérifier que l'email est renseigné
        if (!demande.email || !demande.email.trim()) {
          showMsg('Impossible d\'accepter : pas d\'email. Un email est nécessaire pour créer le compte.')
          return
        }

        // Mettre à jour le statut de la demande
        const { error: updateError } = await supabaseAdmin.from('demandes').update({ statut }).eq('id', id)
        if (updateError) {
          showMsg('Erreur mise à jour : ' + updateError.message)
          return
        }

        // Créer le compte utilisateur
        let userId = null
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: demande.email.trim(),
          password: 'rocher2026',
          email_confirm: true
        })

        if (authError) {
          console.log('⚠️ createUser error:', authError.message)
          // Si l'utilisateur existe déjà, on le cherche
          const { data: usersData } = await supabaseAdmin.auth.admin.listUsers()
          const existingUser = usersData?.users?.find(u => u.email === demande.email.trim())
          if (existingUser) {
            userId = existingUser.id
            console.log('✅ Utilisateur auth existant trouvé:', userId)
          } else {
            showMsg('Erreur création compte : ' + authError.message)
            await supabaseAdmin.from('demandes').update({ statut: 'en_attente' }).eq('id', id)
            return
          }
        } else {
          userId = authData.user.id
        }

        // Vérifier si l'utilisateur existe déjà dans la table utilisateurs
        const { data: existingProfile } = await supabaseAdmin.from('utilisateurs').select('id').eq('id', userId).single()

        if (existingProfile) {
          // Mettre à jour le profil existant avec les données de la demande
          const { error: updateErr } = await supabaseAdmin.from('utilisateurs').update({
            nom: demande.nom,
            prenom: demande.prenom,
            whatsapp: demande.whatsapp,
            domaine: demande.domaine || '',
            date_naissance: demande.date_naissance || null,
            statut_activite: demande.statut_activite || null,
            quartier: demande.quartier || null
          }).eq('id', userId)
          if (updateErr) {
            showMsg('Erreur mise à jour profil : ' + updateErr.message)
            await supabaseAdmin.from('demandes').update({ statut: 'en_attente' }).eq('id', id)
            return
          }
        } else {
          // Créer le profil
          const { error: insertError } = await supabaseAdmin.from('utilisateurs').insert({
            id: userId,
            email: demande.email.trim(),
            nom: demande.nom,
            prenom: demande.prenom,
            whatsapp: demande.whatsapp,
            domaine: demande.domaine || '',
            date_naissance: demande.date_naissance || null,
            statut_activite: demande.statut_activite || null,
            quartier: demande.quartier || null,
            role: 'membre'
          })

          if (insertError) {
            console.log('❌ Erreur insertion utilisateur:', insertError)
            showMsg('Erreur insertion membre : ' + insertError.message)
            if (!authError) await supabaseAdmin.auth.admin.deleteUser(userId)
            await supabaseAdmin.from('demandes').update({ statut: 'en_attente' }).eq('id', id)
            return
          }
        }

        showMsg(`✅ ${demande.prenom} ${demande.nom} accepté(e) ! Compte créé avec succès.`, 'success')
      } else {
        // Refuser
        const { error: updateError } = await supabaseAdmin.from('demandes').update({ statut }).eq('id', id)
        if (updateError) {
          showMsg('Erreur : ' + updateError.message)
          return
        }
        showMsg(`${demande.prenom} ${demande.nom} — demande refusée.`, 'info')
      }

      // Recharger les données et rafraîchir l'interface
      await loadDemandes()
      onRefresh()

    } catch (error) {
      console.log('❌ Erreur générale:', error)
      showMsg('Erreur inattendue : ' + error.message)
    }
  }

  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Founders Grotesk', marginBottom: '20px' }}>Demandes d'adhésion</h2>

      {msg && (
        <div style={{
          background: msgType === 'success' ? 'rgba(37,211,102,0.1)' : msgType === 'info' ? 'rgba(100,100,100,0.1)' : 'rgba(200,16,46,0.1)',
          border: `1px solid ${msgType === 'success' ? 'rgba(37,211,102,0.3)' : msgType === 'info' ? 'rgba(100,100,100,0.3)' : 'rgba(200,16,46,0.3)'}`,
          borderRadius: '10px', padding: '12px 16px', marginBottom: '16px',
          color: msgType === 'success' ? '#25d366' : msgType === 'info' ? theme.muted : '#FC1713',
          fontSize: '13px', fontWeight: '500'
        }}>
          {msg}
        </div>
      )}

      {demandes.length === 0 && (
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '24px', textAlign: 'center', color: theme.muted, fontSize: '13px' }}>
          Aucune demande pour le moment
        </div>
      )}
      {demandes.map(d => (
        <div key={d.id} style={{ background: theme.card, border: `1px solid ${d.statut === 'en_attente' ? '#FC1713' : theme.border}`, borderRadius: '12px', padding: '16px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            {d.avatar_url ? (
              <img src={d.avatar_url} loading="lazy" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} alt="Avatar" />
            ) : (
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FC1713', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>
                {d.prenom?.[0]}{d.nom?.[0]}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ color: theme.text, fontSize: '14px', fontWeight: '700' }}>{d.prenom} {d.nom}</div>
              <div style={{ color: theme.muted, fontSize: '12px', marginTop: '2px' }}>
                {d.statut_activite || ''} {d.niveau_etude ? `(${d.niveau_etude})` : ''} {d.domaine ? `· ${d.domaine}` : ''} {d.quartier ? `· ${d.quartier}` : ''}
              </div>
              {d.date_naissance && <div style={{ color: theme.muted, fontSize: '12px', marginTop: '2px' }}>🎂 {new Date(d.date_naissance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</div>}
              <div style={{ color: theme.muted, fontSize: '12px', marginTop: '2px' }}>{d.whatsapp}</div>
              {d.email && <div style={{ color: theme.muted, fontSize: '12px', marginTop: '2px' }}>{d.email}</div>}
              {!d.email && <div style={{ color: '#FC1713', fontSize: '11px', marginTop: '2px', fontWeight: '600' }}>⚠️ Pas d'email</div>}
              <div style={{ color: theme.muted, fontSize: '11px', marginTop: '4px' }}>{new Date(d.created_at).toLocaleDateString('fr-FR')}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
              {d.statut === 'en_attente' && (
                <>
                  <button onClick={() => updateStatut(d.id, 'accepte')} style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '8px', padding: '6px 12px', color: '#25d366', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600' }}>
                    Accepter
                  </button>
                  <button onClick={() => updateStatut(d.id, 'refuse')} style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '8px', padding: '6px 12px', color: '#FC1713', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Refuser
                  </button>
                </>
              )}
              {d.statut !== 'en_attente' && (
                <span style={{ background: d.statut === 'accepte' ? 'rgba(37,211,102,0.1)' : 'rgba(200,16,46,0.1)', border: `1px solid ${d.statut === 'accepte' ? 'rgba(37,211,102,0.3)' : 'rgba(200,16,46,0.3)'}`, borderRadius: '8px', padding: '6px 12px', color: d.statut === 'accepte' ? '#25d366' : '#FC1713', fontSize: '12px', fontWeight: '600' }}>
                  {d.statut === 'accepte' ? 'Acceptée' : 'Refusée'}
                </span>
              )}
              {d.whatsapp && (
                <a
                  href={`https://wa.me/${d.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}?text=${encodeURIComponent(
                    d.statut === 'accepte'
                      ? `Bonjour ${d.prenom} !

Ta demande d'adhésion au groupe des jeunes du Rocher a été acceptée.

Voici tes accès pour te connecter :
Email : ${d.email}
Mot de passe temporaire : rocher2026

Lien : https://jbr-h.vercel.app/

N'oublie pas de changer ton mot de passe dès ta première connexion depuis Profil > Paramètres.

A très bientôt !
Le Bureau de la Jeunesse EB Le Rocher`
                      : `Bonjour ${d.nom}, votre demande d'adhésion au groupe des jeunes du Rocher a été refusée. Merci de votre intérêt.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '8px', padding: '6px 12px', color: '#25d366', fontSize: '12px', textDecoration: 'none', textAlign: 'center', fontWeight: '600' }}
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

function Membres({ theme, supabase, refreshCount }) {

  const [membres, setMembres] = useState([])
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [domaine, setDomaine] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [quartier, setQuartier] = useState('')
  const [dateNaissance, setDateNaissance] = useState('')
  const [msg, setMsg] = useState('')
  const [lastMembre, setLastMembre] = useState(null)
  const [editingMembre, setEditingMembre] = useState(null)

  useEffect(() => { loadMembres() }, [refreshCount])

  async function loadMembres() {
    const { data } = await supabase.from('utilisateurs').select('*').order('created_at', { ascending: false })
    if (data) setMembres(data)
  }

  async function addMembre() {
    if (!nom || !prenom || !email) { setMsg('Remplissez tous les champs obligatoires'); return }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: 'rocher2026',
      email_confirm: true
    })

    if (authError) { setMsg('Erreur : ' + authError.message); return }

    const { error: dbError } = await supabaseAdmin.from('utilisateurs').insert({
      id: authData.user.id,
      email,
      nom,
      prenom,
      domaine,
      whatsapp,
      role: 'membre'
    })

    if (dbError) { setMsg('Erreur : ' + dbError.message); return }

    setLastMembre({ prenom, nom, email, whatsapp })
    setMsg('Compte créé !')
    setNom(''); setPrenom(''); setEmail(''); setDomaine(''); setWhatsapp('')
    loadMembres()
  }

  function modifierMembre(membre) {
    setEditingMembre(membre)
    setNom(membre.nom || '')
    setPrenom(membre.prenom || '')
    setEmail(membre.email || '')
    setDomaine(membre.domaine || '')
    setWhatsapp(membre.whatsapp || '')
    setQuartier(membre.quartier || '')
    setDateNaissance(membre.date_naissance || '')
  }

  async function saveMembreModifie() {
    if (!editingMembre) return
    const { error } = await supabaseAdmin.from('utilisateurs').update({
      nom,
      prenom,
      domaine,
      whatsapp,
      quartier,
      date_naissance: dateNaissance
    }).eq('id', editingMembre.id)

    if (error) { setMsg('Erreur : ' + error.message); return }

    setMsg('Membre modifié !')
    setEditingMembre(null)
    setNom(''); setPrenom(''); setEmail(''); setDomaine(''); setWhatsapp(''); setQuartier(''); setDateNaissance('')
    loadMembres()
  }

  async function retirerMembre(id) {
    await supabaseAdmin.from('utilisateurs').delete().eq('id', id)
    loadMembres()
  }

  function envoyerAcces(m) {
    const message = encodeURIComponent(
      `Bonjour ${m.prenom},

La Jeunesse EB Le Rocher dispose désormais d'une plateforme numérique dédiée à ses membres.

Sur cet espace tu trouveras les dévotions et défis de lecture biblique, les annonces et événements du bureau, l'annuaire des membres avec leurs talents et compétences, le suivi de tes cotisations, et un espace personnel pour partager ton profil et tes documents.

Nous t'encourageons à la consulter régulièrement pour rester connecté à la vie de la jeunesse.

Tes accès :
Email : ${m.email}
Mot de passe : rocher2026
Lien : https://jbr-l.netlify.app/

Pense à changer ton mot de passe dès ta première connexion dans Profil > Paramètres.

A bientôt.
- Le Bureau de la Jeunesse EB Le Rocher`
    )
    const lien = `https://wa.me/${m.whatsapp?.replace(/\+/g, '').replace(/\s/g, '')}?text=${message}`
    window.open(lien, '_blank')
  }

  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Founders Grotesk', marginBottom: '20px' }}>Membres</h2>
      <div>
        {membres.length === 0 && (
          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '24px', textAlign: 'center', color: theme.muted, fontSize: '13px' }}>
            Aucun membre pour le moment
          </div>
        )}
        {membres.map(m => (
          <div key={m.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '14px', marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            {m.avatar_url ? (
              <img src={m.avatar_url} loading="lazy" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} alt="Avatar" />
            ) : (
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FC1713', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: '700', flexShrink: 0 }}>
                {m.prenom?.[0]}{m.nom?.[0]}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ color: theme.text, fontSize: '14px', fontWeight: '700' }}>{m.prenom && m.nom ? `${m.prenom} ${m.nom}` : m.email}</div>
              {m.prenom && m.nom && <div style={{ color: theme.muted, fontSize: '12px', marginTop: '2px' }}>{m.email}</div>}
              {m.whatsapp && <div style={{ color: theme.muted, fontSize: '12px', marginTop: '2px' }}>{m.whatsapp}</div>}
              <div style={{ color: theme.muted, fontSize: '11px', marginTop: '4px' }}>
                {m.domaine} · {m.role} {m.quartier ? `· ${m.quartier}` : ''}
                {m.date_naissance && (
                  <span style={{ marginLeft: '8px', color: '#FC1713', fontWeight: '600' }}>
                    🎂 {new Date(m.date_naissance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexDirection: 'column', flexShrink: 0 }}>
              <button onClick={() => modifierMembre(m)} style={{ background: 'rgba(0,123,255,0.1)', border: '1px solid rgba(0,123,255,0.3)', borderRadius: '8px', padding: '8px 12px', color: '#007bff', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                Modifier
              </button>
              {m.whatsapp && (
                <button onClick={() => envoyerAcces(m)} style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '8px', padding: '8px 12px', color: '#25d366', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                  Envoyer les accès
                </button>
              )}
              <button onClick={() => retirerMembre(m.id)} style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '8px', padding: '8px 12px', color: '#FC1713', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                Retirer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal modification membre */}
      {editingMembre && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px', maxWidth: '400px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: theme.text, fontSize: '18px', fontWeight: '700' }}>Modifier le membre</h3>
              <button onClick={() => setEditingMembre(null)} style={{ background: 'none', border: 'none', fontSize: '24px', color: theme.muted, cursor: 'pointer' }}>✕</button>
            </div>
            {msg && (
              <div style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '8px', padding: '8px 12px', color: '#25d366', fontSize: '13px', marginBottom: '16px' }}>
                {msg}
              </div>
            )}
            <input placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '10px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '12px', fontFamily: 'inherit' }} />
            <input placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '10px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '12px', fontFamily: 'inherit' }} />
            <input placeholder="Domaine" value={domaine} onChange={e => setDomaine(e.target.value)} style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '10px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '12px', fontFamily: 'inherit' }} />
            <input placeholder="WhatsApp / Téléphone" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '10px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '12px', fontFamily: 'inherit' }} />
            <input placeholder="Quartier" value={quartier} onChange={e => setQuartier(e.target.value)} style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '10px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '12px', fontFamily: 'inherit' }} />

            <label style={{ display: 'block', color: theme.muted, fontSize: '11px', fontWeight: '600', marginBottom: '5px' }}>Date de naissance</label>
            <input type="date" value={dateNaissance} onChange={e => setDateNaissance(e.target.value)} style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '10px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '16px', fontFamily: 'inherit', cursor: 'pointer' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={saveMembreModifie} style={{ flex: 1, background: '#FC1713', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                Sauvegarder
              </button>
              <button onClick={() => setEditingMembre(null)} style={{ flex: 1, background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '12px', color: theme.text, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Cotisations({ theme, supabase, supabaseAdmin }) {
  const [membres, setMembres] = useState([])
  const [selected, setSelected] = useState(null)
  const [montant, setMontant] = useState('200')
  const [dernierMontant, setDernierMontant] = useState('200')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('success')
  const MONTANT_BASE = 200

  useEffect(() => { loadMembres() }, [])

  async function loadMembres() {
    const { data } = await supabase
      .from('utilisateurs')
      .select('*, cotisations(*)')
      .order('nom')
    if (data) setMembres(data)
  }

  async function nouveauPaiement() {
    if (!selected) return
    const total = parseInt(montant) || 0
    if (total <= 0) { showMsg('Montant invalide', 'error'); return }

    // Récupérer reliquat existant
    const reliquat = selected.reliquat_cotisation || 0
    const totalAvecReliquat = total + reliquat

    // Calculer mois couverts
    const moisCouverts = Math.floor(totalAvecReliquat / MONTANT_BASE)
    const nouveauReliquat = totalAvecReliquat % MONTANT_BASE

    if (moisCouverts === 0) {
      showMsg(`Montant insuffisant. Il faut au moins ${MONTANT_BASE - reliquat} FCFA de plus.`, 'error')
      return
    }

    // Déterminer les mois à couvrir dynamiquement
    const moisPayes = (selected.cotisations || [])
      .filter(c => c.statut === 'paye')
      .map(c => c.mois)

    function getNextMonths(count, alreadyPaid) {
      const res = []
      let d = new Date()
      d.setDate(1)
      let iterations = 0
      while (res.length < count && iterations < 48) {
        const label = d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
        const formatted = label.charAt(0).toUpperCase() + label.slice(1)
        if (!alreadyPaid.includes(formatted)) {
          res.push(formatted)
        }
        d.setMonth(d.getMonth() + 1)
        iterations++
      }
      return res
    }

    const moisACouvrir = getNextMonths(moisCouverts, moisPayes)

    if (moisACouvrir.length === 0) {
      showMsg('Tous les mois sont déjà payés !', 'error')
      return
    }

    setSaving(true)
    // Insérer les cotisations
    for (const mois of moisACouvrir) {
      const existing = (selected.cotisations || []).find(c => c.mois === mois)
      if (existing) {
        await supabaseAdmin.from('cotisations').update({ statut: 'paye', montant: MONTANT_BASE }).eq('id', existing.id)
      } else {
        await supabaseAdmin.from('cotisations').insert({
          utilisateur_id: selected.id, mois, montant: MONTANT_BASE, statut: 'paye'
        })
      }
    }

    // Mettre à jour reliquat
    await supabaseAdmin.from('utilisateurs').update({
      reliquat_cotisation: nouveauReliquat
    }).eq('id', selected.id)

    setSaving(false)

    // Historique
    await supabaseAdmin.from('cotisations_historique').insert({
      membre_id: selected.id,
      montant_verse: total,
      reliquat: nouveauReliquat,
      date_paiement: new Date().toISOString().split('T')[0]
    })

    const msg = moisACouvrir.length === 1
      ? `${moisACouvrir[0]} couvert !`
      : `${moisACouvrir.length} mois couverts : ${moisACouvrir.join(', ')}.`
    const reliqMsg = nouveauReliquat > 0 ? ` Reliquat : ${nouveauReliquat} FCFA.` : ''
    showMsg(msg + reliqMsg, 'success')

    setDernierMontant(montant)
    setMontant('200')
    await loadMembres()
    // Rafraîchir le membre sélectionné
    const updated = membres.find(m => m.id === selected.id)
    if (updated) setSelected(updated)
  }

  async function relancer(m) {
    if (!m.whatsapp) return
    const moisPayes = (m.cotisations || []).filter(c => c.statut === 'paye').length
    const msg = encodeURIComponent(
      `Bonjour ${m.prenom} !\n\nRappel : ta cotisation du mois n'est pas encore réglée.\nMontant : ${MONTANT_BASE} FCFA/mois · ${moisPayes} mois réglés sur 12.\n\nMerci de régulariser dès que possible.\n\n• Le Bureau`
    )
    window.open(`https://wa.me/${m.whatsapp.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank')
  }

  function showMsg(text, type) {
    setMsg(text); setMsgType(type)
    setTimeout(() => setMsg(''), 6000)
  }

  const moisPayesCount = (m) => (m.cotisations || []).filter(c => c.statut === 'paye').length

  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Founders Grotesk', marginBottom: '20px' }}>
        Cotisations
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Liste membres */}
        <div>
          <div style={{ color: theme.muted, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Membres
          </div>
          {membres.map(m => {
            const ok = moisPayesCount(m)
            const retard = ok < new Date().getMonth() + 1
            return (
              <div key={m.id} onClick={() => { setSelected(m); setMsg('') }}
                style={{
                  background: selected?.id === m.id ? 'rgba(200,16,46,0.15)' : theme.card,
                  border: `1px solid ${selected?.id === m.id ? '#FC1713' : theme.border}`,
                  borderRadius: '10px', padding: '12px', marginBottom: '6px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#FC1713', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>
                  {m.prenom?.[0]}{m.nom?.[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: theme.text, fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.prenom} {m.nom}
                  </div>
                  <div style={{ color: retard ? '#FC1713' : '#25d366', fontSize: '11px' }}>
                    {ok} / 12 mois
                    {(m.reliquat_cotisation || 0) > 0 && <span style={{ color: '#f59e0b' }}> · +{m.reliquat_cotisation} F reliquat</span>}
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); relancer(m) }}
                  style={{ background: 'none', border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '4px 8px', color: theme.muted, fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
                >
                  Relance
                </button>
              </div>
            )
          })}
        </div>

        {/* Panneau paiement */}
        <div>
          <div style={{ color: theme.muted, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
            {selected ? `Paiement · ${selected.prenom}` : 'Sélectionne un membre'}
          </div>

          {selected && (
            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '20px' }}>
              {msg && (
                <div style={{
                  background: msgType === 'success' ? 'rgba(37,211,102,0.1)' : 'rgba(200,16,46,0.1)',
                  border: `1px solid ${msgType === 'success' ? 'rgba(37,211,102,0.3)' : 'rgba(200,16,46,0.3)'}`,
                  borderRadius: '8px', padding: '10px 12px', color: msgType === 'success' ? '#25d366' : '#FC1713',
                  fontSize: '12px', marginBottom: '14px'
                }}>
                  {msg}
                </div>
              )}

              {/* Résumé */}
              <div style={{ background: theme.bg, borderRadius: '10px', padding: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: theme.muted, fontSize: '12px' }}>Mois réglés</span>
                  <span style={{ color: theme.text, fontSize: '12px', fontWeight: '600' }}>{moisPayesCount(selected)} / 12</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: theme.muted, fontSize: '12px' }}>Reliquat</span>
                  <span style={{ color: '#f59e0b', fontSize: '12px', fontWeight: '600' }}>{selected.reliquat_cotisation || 0} FCFA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: theme.muted, fontSize: '12px' }}>Tarif</span>
                  <span style={{ color: theme.text, fontSize: '12px', fontWeight: '600' }}>{MONTANT_BASE} FCFA / mois</span>
                </div>
              </div>

              {/* Saisie montant */}
              <label style={{ color: theme.muted, fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                Montant reçu (FCFA)
              </label>
              <input
                type="number"
                value={montant}
                onChange={e => setMontant(e.target.value)}
                style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '10px 12px', color: theme.text, fontSize: '14px', fontWeight: '600', outline: 'none', marginBottom: '8px', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />

              {/* Calcul prévisuel */}
              {parseInt(montant) > 0 && (
                <div style={{ background: 'rgba(9,101,186,0.08)', border: '1px solid rgba(9,101,186,0.2)', borderRadius: '8px', padding: '8px 12px', marginBottom: '12px', fontSize: '12px', color: '#0965BA' }}>
                  {(() => {
                    const total = parseInt(montant) + (selected.reliquat_cotisation || 0)
                    const mois = Math.floor(total / MONTANT_BASE)
                    const rest = total % MONTANT_BASE
                    return `${mois} mois couverts${rest > 0 ? ` · ${rest} FCFA reliquat` : ''}`
                  })()}
                </div>
              )}

              <button onClick={nouveauPaiement} disabled={saving}
                style={{ width: '100%', background: '#FC1713', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '8px', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Enregistrement...' : 'Enregistrer le paiement'}
              </button>

              {selected.whatsapp && (
                <a href={`https://wa.me/${selected.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${selected.prenom} ! Paiement de ${dernierMontant} FCFA reçu. Merci !`)}`}
                  target="_blank" rel="noreferrer"
                  style={{ display: 'block', textAlign: 'center', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '8px', padding: '10px', color: '#25d366', fontSize: '12px', fontWeight: '600', textDecoration: 'none', marginBottom: '14px' }}>
                  Notifier sur WhatsApp
                </a>
              )}

              {/* Historique */}
              {selected.cotisations?.length > 0 && (
                <div>
                  <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Historique
                  </div>
                  {[...selected.cotisations].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${theme.border}` }}>
                      <span style={{ color: theme.text, fontSize: '12px' }}>{c.mois}</span>
                      <span style={{ color: c.statut === 'paye' ? '#25d366' : '#FC1713', fontSize: '11px', fontWeight: '600' }}>
                        {c.statut === 'paye' ? 'Payé' : 'En attente'} · {(c.montant || MONTANT_BASE).toLocaleString()} F
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

function Priere({ theme, supabase }) {
  const [requetes, setRequetes] = useState([])
  const [temoignages, setTemoignages] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    const { data: r } = await supabase
      .from('requetes_priere')
      .select('*, utilisateurs(prenom, nom, avatar_url)')
      .eq('type', 'requete')
      .order('created_at', { ascending: false })
    const { data: t } = await supabase
      .from('requetes_priere')
      .select('*, utilisateurs(prenom, nom, avatar_url)')
      .eq('type', 'temoignage')
      .order('created_at', { ascending: false })
    if (r) setRequetes(r)
    if (t) setTemoignages(t)
  }

  function Card({ item }) {
    return (
      <div onClick={() => setSelected(item)} style={{
        background: theme.card, border: `1px solid ${theme.border}`,
        borderRadius: '12px', padding: '14px', marginBottom: '8px', cursor: 'pointer'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          {item.utilisateurs?.avatar_url ? (
            <img src={item.utilisateurs.avatar_url} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} alt="" />
          ) : (
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FC1713', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: '700' }}>
              {item.utilisateurs?.prenom?.[0]}{item.utilisateurs?.nom?.[0]}
            </div>
          )}
          <div>
            <div style={{ color: theme.text, fontSize: '13px', fontWeight: '600' }}>
              {item.utilisateurs?.prenom} {item.utilisateurs?.nom}
            </div>
            <div style={{ color: theme.muted, fontSize: '11px' }}>
              {new Date(item.created_at).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
        <div style={{
          color: theme.muted, fontSize: '12px', lineHeight: '1.6',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {item.contenu}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Founders Grotesk', marginBottom: '20px' }}>
        Prière
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
            Requêtes ({requetes.length})
          </div>
          {requetes.length === 0 && (
            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px', textAlign: 'center', color: theme.muted, fontSize: '13px' }}>
              Aucune requête
            </div>
          )}
          {requetes.map(r => <Card key={r.id} item={r} />)}
        </div>

        <div>
          <div style={{ color: '#0965BA', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
            Témoignages ({temoignages.length})
          </div>
          {temoignages.length === 0 && (
            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '20px', textAlign: 'center', color: theme.muted, fontSize: '13px' }}>
              Aucun témoignage
            </div>
          )}
          {temoignages.map(t => <Card key={t.id} item={t} />)}
        </div>
      </div>

      {/* Modal détail */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setSelected(null)}>
          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px', maxWidth: '480px', width: '100%' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FC1713', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700' }}>
                  {selected.utilisateurs?.prenom?.[0]}{selected.utilisateurs?.nom?.[0]}
                </div>
                <div>
                  <div style={{ color: theme.text, fontSize: '14px', fontWeight: '700' }}>
                    {selected.utilisateurs?.prenom} {selected.utilisateurs?.nom}
                  </div>
                  <div style={{ color: selected.type === 'requete' ? '#FC1713' : '#0965BA', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {selected.type === 'requete' ? 'Requête de prière' : 'Témoignage'}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: theme.muted, fontSize: '22px', cursor: 'pointer' }}>✕</button>
            </div>
            <p style={{ color: theme.text, fontSize: '14px', lineHeight: '1.8' }}>{selected.contenu}</p>
            <div style={{ color: theme.muted, fontSize: '11px', marginTop: '12px' }}>
              {new Date(selected.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Galerie({ theme, supabase, supabaseAdmin }) {
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
    const { data } = await supabaseAdmin.from('evenements_galerie').select('*, photos_galerie(*)').order('date_evenement', { ascending: false })
    if (data) setEvenements(data)
  }

  function handlePhotos(e) {
    const files = Array.from(e.target.files).slice(0, 5)
    setPhotos(files)
    const urls = files.map(f => URL.createObjectURL(f))
    setPreviews(urls)
  }

  async function publier() {
    if (!nom || !date) { setMsg('Renseignez le nom et la date'); return }
    if (photos.length === 0) { setMsg('Ajoutez au moins une photo'); return }
    setUploading(true)
    const { data: ev, error } = await supabaseAdmin.from('evenements_galerie').insert({ nom, date_evenement: date }).select().limit(1)
    if (error || !ev || ev.length === 0) { setMsg('Erreur création événement'); setUploading(false); return }
    for (const photo of photos) {
      const fileName = `${Date.now()}-${photo.name}`
      const { error: uploadError } = await supabase.storage.from('fichiers_membres').upload(`galerie/${fileName}`, photo)
      if (uploadError) { setMsg('Erreur upload photo'); setUploading(false); return }
      const { data: { publicUrl } } = supabase.storage.from('fichiers_membres').getPublicUrl(`galerie/${fileName}`)
      const { error: photoError } = await supabaseAdmin.from('photos_galerie').insert({ evenement_id: ev[0].id, url: publicUrl })
      if (photoError) { setMsg('Erreur enregistrement photo'); setUploading(false); return }
    }
    setMsg('Événement publié !')
    setNom(''); setDate(''); setPhotos([]); setPreviews([])
    previews.forEach(url => URL.revokeObjectURL(url))
    loadEvenements()
    setUploading(false)
  }

  async function supprimerEv(id) {
    const { error } = await supabaseAdmin.from('evenements_galerie').delete().eq('id', id)
    if (error) console.log('❌ Erreur suppression événement galerie:', error)
    else console.log('✅ Événement galerie supprimé')
    loadEvenements()
  }

  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Founders Grotesk', marginBottom: '20px' }}>Galerie</h2>
      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Publier un événement</div>
        {msg && <div style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '8px', padding: '8px 12px', color: '#FC1713', fontSize: '12px', marginBottom: '12px' }}>{msg}</div>}
        <input placeholder="Nom de l'événement" value={nom} onChange={e => setNom(e.target.value)} style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '10px', fontFamily: 'inherit' }} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '10px', fontFamily: 'inherit', cursor: 'pointer' }} />
        <label style={{ display: 'block', background: theme.bg, border: `2px dashed ${theme.border}`, borderRadius: '10px', padding: '16px', textAlign: 'center', cursor: 'pointer', marginBottom: '10px' }}>
          <div style={{ color: theme.muted, fontSize: '13px' }}>{photos.length > 0 ? `${photos.length} photo(s) sélectionnée(s)` : "Choisir jusqu'à 5 photos"}</div>
          <input type="file" accept="image/*" multiple onChange={handlePhotos} style={{ display: 'none' }} />
        </label>
        {previews.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: theme.muted, fontSize: '11px', marginBottom: '8px' }}>Aperçu :</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px' }}>
              {previews.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  loading="lazy"
                  onClick={() => setLightbox(url)}
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: `1px solid ${theme.border}` }}
                />
              ))}
            </div>
          </div>
        )}
        <button onClick={publier} disabled={uploading} style={{ background: '#FC1713', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', opacity: uploading ? 0.6 : 1 }}>
          {uploading ? 'Publication...' : 'Publier'}
        </button>
      </div>
      <div>
        {evenements.map(ev => (
          <div key={ev.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ color: theme.text, fontSize: '14px', fontWeight: '700' }}>{ev.nom}</div>
                <div style={{ color: theme.muted, fontSize: '11px' }}>{new Date(ev.date_evenement).toLocaleDateString('fr-FR')} · {ev.photos_galerie?.length} photo(s)</div>
              </div>
              <button onClick={() => supprimerEv(ev.id)} style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '8px', padding: '6px 12px', color: '#FC1713', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                Supprimer
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '6px', cursor: 'pointer' }}>
              {ev.photos_galerie?.map(p => (
                <img key={p.id} src={p.url} alt="" loading="lazy" onClick={() => setLightbox(p.url)} style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', transition: 'transform 0.2s' }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <img src={lightbox} alt="" loading="lazy" style={{ maxWidth: '95%', maxHeight: '90vh', borderRadius: '10px' }} />
        </div>
      )}
    </div>
  )
}

function Feedbacks({ theme, supabase }) {
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => { loadFeedbacks() }, [])

  async function loadFeedbacks() {
    const { data } = await supabase.from('feedbacks').select('*, utilisateurs(prenom, nom)').order('created_at', { ascending: false })
    if (data) setFeedbacks(data)
  }

  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Founders Grotesk', marginBottom: '20px' }}>Feedbacks</h2>
      {feedbacks.length === 0 && (
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '24px', textAlign: 'center', color: theme.muted, fontSize: '13px' }}>
          Aucun feedback pour le moment
        </div>
      )}
      {feedbacks.map(f => (
        <div key={f.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '14px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <div style={{ color: theme.text, fontSize: '13px', fontWeight: '600' }}>{f.utilisateurs?.prenom} {f.utilisateurs?.nom}</div>
              <div style={{ color: theme.muted, fontSize: '11px' }}>{f.evenements?.titre}</div>
            </div>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <span key={n} style={{ color: n <= f.note ? '#f59e0b' : '#444', fontSize: '14px' }}>★</span>
              ))}
            </div>
          </div>
          <div style={{ color: theme.muted, fontSize: '13px', lineHeight: '1.6' }}>{f.contenu}</div>
          <div style={{ color: theme.muted, fontSize: '11px', marginTop: '6px' }}>{new Date(f.created_at).toLocaleDateString('fr-FR')}</div>
        </div>
      ))}
    </div>
  )
}

function Evenements({ theme, supabase, supabaseAdmin }) {
  const [titre, setTitre] = useState('')
  const [date, setDate] = useState('')
  const [lieu, setLieu] = useState('')
  const [description, setDescription] = useState('')
  const [evenements, setEvenements] = useState([])
  const [poster, setPoster] = useState(null)
  const [posterPreview, setPosterPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { loadEvenements() }, [])

  async function loadEvenements() {
    const { data } = await supabaseAdmin.from('evenements').select('*').order('date_evenement', { ascending: true })
    if (data) setEvenements(data)
  }

  function handlePoster(e) {
    const file = e.target.files[0]
    if (file) {
      setPoster(file)
      setPosterPreview(URL.createObjectURL(file))
    }
  }

  async function publier() {
    if (!titre || !date) { setMsg('Renseignez le titre et la date'); return }
    setUploading(true)

    let poster_url = null
    if (poster) {
      const cleanName = poster.name.replace(/[^a-zA-Z0-9.]/g, '_')
      const fileName = `poster-${Date.now()}-${cleanName}`
      const { error: uploadError } = await supabase.storage.from('fichiers_membres').upload(`evenements/${fileName}`, poster)
      if (uploadError) {
        console.error('❌ Erreur upload affiche:', uploadError)
        setMsg('Erreur upload affiche: ' + uploadError.message)
        setUploading(false)
        return
      }
      const { data: { publicUrl } } = supabase.storage.from('fichiers_membres').getPublicUrl(`evenements/${fileName}`)
      poster_url = publicUrl
    }

    const { error } = await supabaseAdmin.from('evenements').insert({ titre, date_evenement: date, lieu, description, poster_url })
    setUploading(false)
    if (error) { setMsg('Erreur : ' + error.message); return }

    setMsg('Événement publié !')
    setTitre(''); setDate(''); setLieu(''); setDescription(''); setPoster(null); setPosterPreview(null)
    loadEvenements()
  }

  async function supprimer(id) {
    const { error } = await supabaseAdmin.from('evenements').delete().eq('id', id)
    if (error) { console.log('❌ Erreur suppression événement:', error); return }
    console.log('✅ Événement supprimé')
    loadEvenements()
  }

  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Founders Grotesk', marginBottom: '20px' }}>Événements</h2>
      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Nouvel événement</div>
        {msg && <div style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '8px', padding: '8px 12px', color: '#FC1713', fontSize: '12px', marginBottom: '12px' }}>{msg}</div>}
        <input placeholder="Titre *" value={titre} onChange={e => setTitre(e.target.value)} style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '10px', fontFamily: 'inherit' }} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '10px', fontFamily: 'inherit', cursor: 'pointer' }} />
        <input placeholder="Lieu" value={lieu} onChange={e => setLieu(e.target.value)} style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '10px', fontFamily: 'inherit' }} />
        <textarea placeholder="Description (optionnel)" value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '10px', fontFamily: 'inherit', resize: 'none' }} />

        <label style={{ display: 'block', background: theme.bg, border: `2px dashed ${theme.border}`, borderRadius: '10px', padding: '16px', textAlign: 'center', cursor: 'pointer', marginBottom: '10px' }}>
          <div style={{ color: theme.muted, fontSize: '13px' }}>{poster ? "Changer l'affiche (Carré conseillé)" : "Ajouter une affiche (Affiche Instagram)"}</div>
          <input type="file" accept="image/*" onChange={handlePoster} style={{ display: 'none' }} />
        </label>

        {posterPreview && (
          <div style={{ marginBottom: '12px', textAlign: 'center' }}>
            <img src={posterPreview} alt="Aperçu" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '12px', border: `1px solid ${theme.border}` }} />
          </div>
        )}

        <button onClick={publier} disabled={uploading} style={{ background: '#FC1713', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', opacity: uploading ? 0.6 : 1 }}>
          {uploading ? 'Publication...' : 'Publier'}
        </button>
      </div>
      <div>
        {evenements.length === 0 && (
          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '24px', textAlign: 'center', color: theme.muted, fontSize: '13px' }}>
            Aucun événement pour le moment
          </div>
        )}
        {evenements.map(ev => (
          <div key={ev.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '14px', marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            {ev.poster_url && (
              <img src={ev.poster_url} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ color: theme.text, fontSize: '14px', fontWeight: '700' }}>{ev.titre}</div>
              <div style={{ color: theme.muted, fontSize: '12px', marginTop: '2px' }}>{new Date(ev.date_evenement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} {ev.lieu ? `· ${ev.lieu}` : ''}</div>
              {ev.description && <div style={{ color: theme.muted, fontSize: '12px', marginTop: '4px' }}>{ev.description}</div>}
            </div>
            <button onClick={() => supprimer(ev.id)} style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '8px', padding: '6px 12px', color: '#FC1713', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Annonces({ theme, supabase, supabaseAdmin }) {
  const [titre, setTitre] = useState('')
  const [contenu, setContenu] = useState('')
  const [urgent, setUrgent] = useState(false)
  const [annonces, setAnnonces] = useState([])
  const [msg, setMsg] = useState('')

  useEffect(() => { loadAnnonces() }, [])

  async function loadAnnonces() {
    const { data } = await supabase.from('annonces').select('*').order('created_at', { ascending: false })
    if (data) setAnnonces(data)
  }

  async function publier() {
    if (!titre) { setMsg('Renseignez un titre'); return }
    const { error } = await supabaseAdmin.from('annonces').insert({ titre, contenu, urgent })
    if (error) { console.log('❌ Erreur création annonce:', error); setMsg('Erreur : ' + error.message); return }
    console.log('✅ Annonce créée')
    setMsg('Annonce publiée !')
    setTitre(''); setContenu(''); setUrgent(false)
    loadAnnonces()
  }

  async function supprimer(id) {
    const { error } = await supabaseAdmin.from('annonces').delete().eq('id', id)
    if (error) { console.log('❌ Erreur suppression annonce:', error); return }
    console.log('✅ Annonce supprimée')
    loadAnnonces()
  }

  function copierMessage(a) {
    navigator.clipboard.writeText(
      `📢 *${a.titre}*\n\n${a.contenu || ''}\n\n${a.urgent ? '⚠️ URGENT' : ''}\n\n— Jeunesse EB Le Rocher`
    )
    alert('Message copié !')
  }

  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Founders Grotesk', marginBottom: '20px' }}>Annonces</h2>
      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Nouvelle annonce</div>
        {msg && <div style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '8px', padding: '8px 12px', color: '#FC1713', fontSize: '12px', marginBottom: '12px' }}>{msg}</div>}
        <input placeholder="Titre" value={titre} onChange={e => setTitre(e.target.value)} style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '10px', fontFamily: 'inherit' }} />
        <textarea placeholder="Contenu (optionnel)" value={contenu} onChange={e => setContenu(e.target.value)} rows={3} style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '10px', fontFamily: 'inherit', resize: 'none' }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '14px' }}>
          <input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} style={{ accentColor: '#FC1713' }} />
          <span style={{ color: theme.muted, fontSize: '13px' }}>Marquer comme urgente</span>
        </label>
        <button onClick={publier} style={{ background: '#FC1713', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
          Publier
        </button>
      </div>
      <div>
        {annonces.map(a => (
          <div key={a.id} style={{ background: theme.card, border: `1px solid ${a.urgent ? '#FC1713' : theme.border}`, borderRadius: '12px', padding: '14px', marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ color: theme.text, fontSize: '13px', fontWeight: '600' }}>{a.titre}</div>
                {a.urgent && <span style={{ background: 'rgba(200,16,46,0.15)', color: '#FC1713', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px' }}>URGENT</span>}
              </div>
              {a.contenu && <div style={{ color: theme.muted, fontSize: '12px', lineHeight: '1.6' }}>{a.contenu}</div>}
              <div style={{ color: theme.muted, fontSize: '11px', marginTop: '6px' }}>{new Date(a.created_at).toLocaleDateString('fr-FR')}</div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  onClick={() => copierMessage(a)}
                  style={{
                    background: 'rgba(37,211,102,0.1)',
                    border: '1px solid rgba(37,211,102,0.3)',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    color: '#25d366',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Copier le message
                </button>
                <a
                  href="https://chat.whatsapp.com/FLeruqQMOJ7AuqPsOWVwiD"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'rgba(37,211,102,0.1)',
                    border: '1px solid rgba(37,211,102,0.3)',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    color: '#25d366',
                    fontSize: '12px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  Ouvrir le groupe
                </a>
              </div>
            </div>
            <button onClick={() => supprimer(a.id)} style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '8px', padding: '6px 12px', color: '#FC1713', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Devotions({ theme, supabase, supabaseAdmin }) {
  const [titre, setTitre] = useState('')
  const [verset, setVerset] = useState('')
  const [reference, setReference] = useState('')
  const [priere, setPriere] = useState('')
  const [contenu, setContenu] = useState('')
  const [dateDevotion, setDateDevotion] = useState('')
  const [devotions, setDevotions] = useState([])
  const [commentairesOpen, setCommentairesOpen] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { loadDevotions() }, [])

  async function loadDevotions() {
    const { data } = await supabaseAdmin
      .from('devotions')
      .select('*')
      .order('date_devotion', { ascending: false })
    if (data) setDevotions(data)
  }

  async function publier() {
    if (!verset || !reference || !dateDevotion) {
      setMsg('Verset, référence et date sont obligatoires')
      return
    }
    setSaving(true)
    const { error } = await supabaseAdmin.from('devotions').upsert({
      titre: titre || reference,
      verset,
      reference,
      priere,
      contenu,
      date_devotion: dateDevotion
    }, { onConflict: 'date_devotion' })

    setSaving(false)
    if (error) {
      if (error.code === '23505') setMsg('Une dévotion existe déjà pour cette date')
      else setMsg('Erreur : ' + error.message)
      return
    }

    setMsg('Dévotion publiée/mise à jour !')
    setTitre(''); setVerset(''); setReference(''); setPriere(''); setContenu(''); setDateDevotion('')
    loadDevotions()
    setTimeout(() => setMsg(''), 4000)
  }

  async function supprimer(id) {
    await supabaseAdmin.from('devotions').delete().eq('id', id)
    loadDevotions()
  }

  return (
    <div>
      <h2 style={{ color: theme.text, fontSize: '22px', fontWeight: '700', fontFamily: 'Founders Grotesk', marginBottom: '20px' }}>
        Dévotions
      </h2>

      {/* Formulaire */}
      <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '20px', marginBottom: '28px' }}>
        <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
          Programmer une dévotion
        </div>

        {msg && (
          <div style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '8px', padding: '10px 12px', color: '#25d366', fontSize: '12px', marginBottom: '14px' }}>
            {msg}
          </div>
        )}

        {/* Date en premier */}
        <label style={{ display: 'block', color: theme.muted, fontSize: '11px', fontWeight: '600', marginBottom: '5px' }}>
          Date programmée *
        </label>
        <input
          type="date"
          value={dateDevotion}
          onChange={e => setDateDevotion(e.target.value)}
          style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '12px', fontFamily: 'inherit', boxSizing: 'border-box', cursor: 'pointer' }}
        />

        <label style={{ display: 'block', color: theme.muted, fontSize: '11px', fontWeight: '600', marginBottom: '5px' }}>
          Référence biblique * (ex : Philippiens 4:13)
        </label>
        <input
          placeholder="Philippiens 4:13"
          value={reference}
          onChange={e => setReference(e.target.value)}
          style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '12px', fontFamily: 'inherit', boxSizing: 'border-box' }}
        />

        <label style={{ display: 'block', color: theme.muted, fontSize: '11px', fontWeight: '600', marginBottom: '5px' }}>
          Verset *
        </label>
        <textarea
          placeholder="Je puis tout par Christ qui me fortifie."
          value={verset}
          onChange={e => setVerset(e.target.value)}
          rows={3}
          style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '12px', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }}
        />

        <label style={{ display: 'block', color: theme.muted, fontSize: '11px', fontWeight: '600', marginBottom: '5px' }}>
          Titre (optionnel)
        </label>
        <input
          placeholder="La force en Christ"
          value={titre}
          onChange={e => setTitre(e.target.value)}
          style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '12px', fontFamily: 'inherit', boxSizing: 'border-box' }}
        />

        <label style={{ display: 'block', color: theme.muted, fontSize: '11px', fontWeight: '600', marginBottom: '5px' }}>
          Texte de la dévotion *
        </label>
        <textarea
          placeholder="Écrivez ici le message de la dévotion..."
          value={contenu}
          onChange={e => setContenu(e.target.value)}
          rows={6}
          style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '12px', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }}
        />

        <label style={{ display: 'block', color: '#0965BA', fontSize: '11px', fontWeight: '600', marginBottom: '5px' }}>
          Ma prière (optionnel)
        </label>
        <textarea
          placeholder="Seigneur, aide-moi à puiser ma force en toi aujourd'hui..."
          value={priere}
          onChange={e => setPriere(e.target.value)}
          rows={4}
          style={{ width: '100%', background: theme.bg, border: `1px solid rgba(9,101,186,0.3)`, borderRadius: '8px', padding: '9px 12px', color: theme.text, fontSize: '13px', outline: 'none', marginBottom: '16px', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }}
        />

        <button
          onClick={publier}
          disabled={saving}
          style={{ background: '#FC1713', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'Publication...' : 'Publier'}
        </button>
      </div>

      {/* Liste dévotions */}
      <div style={{ color: theme.text, fontSize: '15px', fontWeight: '700', marginBottom: '14px' }}>
        Dévotions programmées ({devotions.length})
      </div>

      {devotions.length === 0 && (
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '24px', textAlign: 'center', color: theme.muted, fontSize: '13px' }}>
          Aucune dévotion programmée
        </div>
      )}

      {devotions.map(d => (
        <div key={d.id} style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '14px', padding: '16px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              {/* Date */}
              <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
                {new Date(d.date_devotion).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              {/* Titre */}
              <div style={{ color: theme.text, fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>
                {d.titre || d.reference}
              </div>
              {/* Verset */}
              <div style={{ background: '#0965BA', borderRadius: '10px', padding: '10px 14px', marginBottom: '8px' }}>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {d.reference}
                </div>
                <div style={{ color: 'white', fontSize: '13px', fontStyle: 'italic', lineHeight: '1.6' }}>
                  « {d.verset} »
                </div>
              </div>
              {/* Ma prière */}
              {d.priere && (
                <div style={{ color: theme.muted, fontSize: '12px', lineHeight: '1.6', fontStyle: 'italic', borderLeft: '3px solid #0965BA', paddingLeft: '10px' }}>
                  {d.priere}
                </div>
              )}
              {/* Commentaires */}
              <CommentairesAdmin
                devotionId={d.id}
                theme={theme}
                supabaseAdmin={supabaseAdmin}
                open={commentairesOpen === d.id}
                setOpen={(v) => setCommentairesOpen(v ? d.id : null)}
              />
            </div>
            <button
              onClick={() => supprimer(d.id)}
              style={{ background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '8px', padding: '6px 12px', color: '#FC1713', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
            >
              Suppr.
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function CommentairesAdmin({ devotionId, theme, supabaseAdmin }) {
  const [comms, setComms] = useState([])
  const [open, setOpen] = useState(false)
  const longPressTimer = useRef(null)

  useEffect(() => {
    if (open) load()
  }, [open])

  async function load() {
    const { data } = await supabaseAdmin
      .from('commentaires_devotion')
      .select('*, utilisateurs(prenom, nom)')
      .eq('devotion_id', devotionId)
      .order('created_at', { ascending: true })
    if (data) setComms(data)
  }

  async function supprimer(id) {
    await supabaseAdmin.from('commentaires_devotion').delete().eq('id', id)
    setComms(c => c.filter(x => x.id !== id))
  }

  return (
    <div style={{ marginTop: '8px' }}>
      <button onClick={() => setOpen(!open)}
        style={{ background: 'none', border: 'none', color: theme.muted, fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
        {open ? 'Masquer commentaires' : `Voir commentaires`}
      </button>
      {open && (
        <div style={{ marginTop: '8px' }}>
          {comms.length === 0 && <div style={{ color: theme.muted, fontSize: '11px' }}>Aucun commentaire</div>}
          {comms.map(c => (
            <div key={c.id}
              onContextMenu={e => { e.preventDefault(); supprimer(c.id) }}
              onTouchStart={() => { longPressTimer.current = setTimeout(() => supprimer(c.id), 600) }}
              onTouchEnd={() => clearTimeout(longPressTimer.current)}
              style={{ background: theme.bg, borderRadius: '8px', padding: '8px 10px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer', border: `1px solid ${theme.border}` }}>
              <div>
                <span style={{ color: '#FC1713', fontSize: '11px', fontWeight: '600', marginRight: '6px' }}>
                  {c.utilisateurs?.prenom} {c.utilisateurs?.nom}
                </span>
                <span style={{ color: theme.muted, fontSize: '12px' }}>{c.contenu}</span>
              </div>
              <button onClick={() => supprimer(c.id)}
                style={{ background: 'none', border: 'none', color: theme.muted, fontSize: '14px', cursor: 'pointer', padding: '0 4px', flexShrink: 0 }}>
                ✕
              </button>
            </div>
          ))}
          <div style={{ color: theme.muted, fontSize: '10px', marginTop: '4px' }}>Appui long ou ✕ pour supprimer</div>
        </div>
      )}
    </div>
  )
}