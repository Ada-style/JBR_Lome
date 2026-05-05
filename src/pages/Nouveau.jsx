import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

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


// SVG Icons
const IconBackpack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z" />
    <path d="M9 6V4a3 3 0 0 1 6 0v2" />
    <path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5" />
    <line x1="12" y1="11" x2="12" y2="13" />
  </svg>
)

const IconGradCap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
  </svg>
)

const IconWrench = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

const IconBriefcase = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

export default function Nouveau() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const [dark, setDark] = useState(false)
  const [evenements, setEvenements] = useState(EVENEMENTS_LOCAUX)
  const [activeEv, setActiveEv] = useState('local-detente')
  const [lightbox, setLightbox] = useState(null)
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [tel, setTel] = useState('')
  const [telephone, setTelephone] = useState('')
  const [quartier, setQuartier] = useState('')
  const [niveauEtude, setNiveauEtude] = useState('')
  const [domaine, setDomaine] = useState('')
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('error') // 'error' | 'success'
  const [email, setEmail] = useState('')
  const [dateAnniversaire, setDateAnniversaire] = useState('')
  const [statutActivite, setStatutActivite] = useState('')
  const [classeEleve, setClasseEleve] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (session) {
      navigate('/membre')
    }
  }, [session, navigate])



  const theme = {
    bg: dark ? '#0f0f0f' : '#f7f5f2',
    card: dark ? 'rgba(255,255,255,0.06)' : '#ffffff',
    border: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    text: dark ? '#ffffff' : '#111111',
    muted: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
    inputBg: dark ? 'rgba(255,255,255,0.04)' : '#fafaf9',
  }

  const loadEvenements = async () => {
    const { data } = await supabase
      .from('evenements_galerie')
      .select('*, photos_galerie(*)')
      .order('date_evenement', { ascending: false })
    if (data && data.length > 0) {
      setEvenements([...data, ...EVENEMENTS_LOCAUX])
      setActiveEv(data[0].id)
    }
  }

  useEffect(() => { loadEvenements() }, [])

  // Calculer le domaine final en fonction du statut d'activité
  function getDomaineFinal() {
    if (statutActivite === 'eleve') {
      return classeEleve ? `Élève - ${classeEleve}` : 'Élève'
    }
    if (statutActivite === 'etudiant') {
      return domaine ? `Étudiant - ${domaine}` : 'Étudiant'
    }
    if (statutActivite === 'apprenti') {
      return domaine ? `Apprenti - ${domaine}` : 'Apprenti'
    }
    if (statutActivite === 'professionnel') {
      return domaine ? `Professionnel - ${domaine}` : 'Professionnel'
    }
    return domaine || ''
  }

  function showMsg(text, type = 'error') {
    setMsg(text)
    setMsgType(type)
  }

  async function envoyerDemande() {
    if (!prenom || !nom || !tel) {
      showMsg('Veuillez renseigner prénoms, nom et numéro WhatsApp');
      return;
    }

    if (!email || !email.trim()) {
      showMsg('Veuillez renseigner votre adresse email (nécessaire pour créer ton compte)');
      return;
    }

    if (!statutActivite) {
      showMsg('Veuillez sélectionner votre statut');
      return;
    }

    if (statutActivite === 'eleve' && !classeEleve) {
      showMsg('Veuillez sélectionner votre classe');
      return;
    }

    if ((statutActivite === 'etudiant' || statutActivite === 'apprenti' || statutActivite === 'professionnel') && !domaine) {
      showMsg('Veuillez renseigner votre domaine');
      return;
    }

    if (!dateAnniversaire) {
      showMsg('Veuillez renseigner votre date d\'anniversaire');
      return;
    }

    setSending(true)
    const domaineComplet = getDomaineFinal()

    // Build payload - try with new columns first, fallback without them
    const basePayload = {
      nom: nom.trim(),
      prenom: prenom.trim(),
      whatsapp: tel.trim(),
      telephone: telephone.trim() || null,
      quartier: quartier.trim() || null,
      niveau_etude: niveauEtude || null,
      email: email ? email.trim() : null,
      domaine: domaineComplet,
      statut: 'en_attente'
    };

    // Try with new columns first
    let payload = {
      ...basePayload,
      statut_activite: statutActivite,
      date_naissance: dateAnniversaire,
    };

    console.log('🚀 Payload envoyé à Supabase :', payload);

    let { data, error } = await supabase
      .from('demandes')
      .insert(payload)
      .select();

    // If error mentions missing columns, retry without them
    if (error && error.message && (error.message.includes('date_naissance') || error.message.includes('statut_activite'))) {
      console.log('⚠️ Colonnes manquantes, envoi sans les nouveaux champs...');
      const { data: data2, error: error2 } = await supabase
        .from('demandes')
        .insert(basePayload)
        .select();
      data = data2;
      error = error2;
    }

    setSending(false)

    if (error) {
      console.error('❌ Erreur complète :', error);
      showMsg('Erreur : ' + (error.message || 'Vérifie la console'));
      return;
    }

    console.log('✅ Insertion réussie !', data);
    showMsg('Demande envoyée avec succès ! Le bureau vous contactera bientôt.', 'success');

    setPrenom('');
    setNom('');
    setTel('');
    setTelephone('');
    setQuartier('');
    setNiveauEtude('');
    setEmail('');
    setDomaine('');
    setDateAnniversaire('');
    setStatutActivite('');
    setClasseEleve('');
  }

  const evActif = evenements.find(e => e.id === activeEv)

  const inputStyle = {
    width: '100%',
    background: theme.inputBg,
    border: `1.5px solid ${theme.border}`,
    borderRadius: '12px',
    padding: '12px 14px',
    color: theme.text,
    fontSize: '14px',
    outline: 'none',
    marginBottom: '12px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
    appearance: 'auto',
    colorScheme: dark ? 'dark' : 'light',
  }

  const optionStyle = {
    background: '#ffffff',
    color: '#111111',
  }

  const labelStyle = {
    display: 'block',
    color: theme.muted,
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '6px',
    letterSpacing: '0.3px'
  }

  const statutBtnStyle = (isActive) => ({
    flex: 1,
    background: isActive ? 'linear-gradient(135deg, #FC1713, #a00d24)' : theme.inputBg,
    border: `1.5px solid ${isActive ? '#FC1713' : theme.border}`,
    borderRadius: '12px',
    padding: '14px 8px',
    color: isActive ? 'white' : theme.muted,
    fontSize: '12px',
    fontWeight: isActive ? '700' : '500',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.25s ease',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    boxShadow: isActive ? '0 4px 12px rgba(200,16,46,0.25)' : 'none',
  })

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, transition: 'background 0.3s' }}>
      <style>{`
        @media (max-width: 768px) {
          .nouveau-bureau-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .nouveau-bureau-grid .bureau-card { padding: 12px !important; }
          .nouveau-bureau-grid .bureau-avatar { width: 52px !important; height: 52px !important; font-size: 16px !important; }
          .nouveau-form { padding: 16px !important; }
          .nouveau-statut-grid { grid-template-columns: 1fr 1fr !important; }
          .nouveau-photo-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* Boutons fixes */}
      <button onClick={() => navigate('/')} style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 100, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '6px 14px', color: theme.text, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <IconArrowLeft /> Retour
      </button>
      <button onClick={() => setDark(!dark)} style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 100, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '6px 14px', color: theme.text, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(10px)' }}>
        {dark ? 'Mode clair' : 'Mode sombre'}
      </button>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#FC1713,#8b0000)', padding: '80px 24px 48px', textAlign: 'center', color: 'white' }}>
        <div style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '6px 12px', display: 'inline-block', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '20px' }}>🚀 L'APPLICATION COMPLÈTE ARRIVE BIENTÔT</div>
        <br />
        <img src="/logo.png" alt="Logo" loading="lazy" style={{ width: '70px', height: '70px', objectFit: 'contain', borderRadius: '12px', marginBottom: '16px', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))' }} />
        <h1 style={{ fontFamily: 'Founders Grotesk,sans-serif', fontSize: '28px', fontWeight: '700', margin: '0 0 8px' }}>
          Bienvenue parmi nous
        </h1>
        <p style={{ fontSize: '14px', opacity: 0.8, maxWidth: '320px', margin: '0 auto', lineHeight: '1.7' }}>
          Comme les premiers chrétiens, on se retrouve, on apprend, on prie et on partage la vie ensemble. Actes 2:42
        </p>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px' }}>

        {/* Mot du président */}
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Mot du Président</div>
          <p style={{ color: theme.text, fontSize: '15px', lineHeight: '1.9', fontStyle: 'italic', marginBottom: '12px', fontFamily: 'Georgia,serif' }}>
            « Si tu cherches une famille où grandir dans la foi, l'amitié et la joie; tu es au bon endroit. On t'attendait ! »
          </p>
          <div style={{ color: theme.muted, fontSize: '12px', fontWeight: '600' }}>EZIAN-GNAMAVO Yao Benjamin : Président de la Groupe des jeunes du Rocher</div>
        </div>

        {/* Ce que tu trouveras */}
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Ce que tu trouveras ici</div>
          {[
            'Des dévotions hebdomadaires et des défis de lecture biblique',
            'Des événements récréatifs et culturels tout au long de l\'année',
            'Un réseau de jeunes talentueux avec qui collaborer',
            'Un espace sûr pour grandir dans la foi et dans la vie',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FC1713', marginTop: '7px', flexShrink: 0 }} />
              <div style={{ color: theme.muted, fontSize: '13px', lineHeight: '1.7' }}>{item}</div>
            </div>
          ))}
        </div>

        {/* Galerie */}
        {evenements.length > 0 && (
          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
            <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Nos moments</div>

            {/* Tabs événements */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px', scrollbarWidth: 'none' }}>
              {evenements.map(ev => (
                <button
                  key={ev.id}
                  onClick={() => setActiveEv(ev.id)}
                  style={{
                    background: activeEv === ev.id ? '#FC1713' : theme.bg,
                    border: `1px solid ${activeEv === ev.id ? '#FC1713' : theme.border}`,
                    borderRadius: '20px',
                    padding: '7px 16px',
                    color: activeEv === ev.id ? 'white' : theme.muted,
                    fontSize: '12px',
                    fontWeight: activeEv === ev.id ? '600' : '400',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                >
                  {ev.nom} · {new Date(ev.date_evenement).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                </button>
              ))}
            </div>

            {/* Photos de l'événement actif */}
            {evActif && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {evActif.photos_galerie?.map((p, i) => (
                  <img
                    key={p.id}
                    src={p.url}
                    alt=""
                    loading="lazy"
                    onClick={() => setLightbox(p.url)}
                    style={{
                      width: '100%',
                      height: i === 0 ? '220px' : '150px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      gridColumn: i === 0 ? 'span 2' : 'span 1',
                      transition: 'transform 0.2s',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Formulaire rejoindre */}
        <div className="nouveau-form" style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '20px', padding: '28px', marginBottom: '32px', boxShadow: dark ? 'none' : '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '4px', height: '28px', background: '#FC1713', borderRadius: '2px' }} />
            <div>
              <div style={{ color: theme.text, fontSize: '17px', fontWeight: '700', fontFamily: 'Founders Grotesk,sans-serif' }}>Rejoindre la jeunesse</div>
              <div style={{ color: theme.muted, fontSize: '11px', marginTop: '2px' }}>Remplis ce formulaire et le bureau te contactera</div>
            </div>
          </div>

          {msg && (
            <div style={{
              background: msgType === 'success' ? 'rgba(37,211,102,0.08)' : 'rgba(200,16,46,0.08)',
              border: `1px solid ${msgType === 'success' ? 'rgba(37,211,102,0.25)' : 'rgba(200,16,46,0.25)'}`,
              borderRadius: '12px',
              padding: '12px 16px',
              color: msgType === 'success' ? '#25d366' : '#FC1713',
              fontSize: '13px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {msgType === 'success' && <IconCheck />}
              {msg}
            </div>
          )}

          {/* Informations personnelles */}
          <div style={{ marginBottom: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Prénoms *</label>
                <input placeholder="Ex: Kodjo Jean" value={prenom} onChange={e => setPrenom(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nom *</label>
                <input placeholder="Ex: KOKOU" value={nom} onChange={e => setNom(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <label style={labelStyle}>Adresse email *</label>
            <input placeholder="jean.kokou@email.com" type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />

            <label style={labelStyle}>Numéro WhatsApp *</label>
            <input placeholder="+228 90 12 34 56" value={tel} onChange={e => setTel(e.target.value)} style={inputStyle} />
          </div>

          {/* Séparateur */}
          <div style={{ height: '1px', background: theme.border, margin: '8px 0 20px' }} />

          {/* Date d'anniversaire */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconCalendar /> Date d'anniversaire *
            </label>
            <input
              type="date"
              value={dateAnniversaire}
              onChange={e => setDateAnniversaire(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Statut d'activité */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Tu es *</label>
            <div className="nouveau-statut-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button type="button" onClick={() => { setStatutActivite('eleve'); setDomaine(''); }} style={statutBtnStyle(statutActivite === 'eleve')}>
                <IconBackpack />
                <span>Élève</span>
              </button>
              <button type="button" onClick={() => { setStatutActivite('etudiant'); setClasseEleve(''); }} style={statutBtnStyle(statutActivite === 'etudiant')}>
                <IconGradCap />
                <span>Étudiant(e)</span>
              </button>
              <button type="button" onClick={() => { setStatutActivite('apprenti'); setClasseEleve(''); }} style={statutBtnStyle(statutActivite === 'apprenti')}>
                <IconWrench />
                <span>Apprenti(e)</span>
              </button>
              <button type="button" onClick={() => { setStatutActivite('professionnel'); setClasseEleve(''); }} style={statutBtnStyle(statutActivite === 'professionnel')}>
                <IconBriefcase />
                <span>Professionnel(le)</span>
              </button>
            </div>
          </div>

          {/* Champs conditionnels */}
          {statutActivite === 'eleve' && (
            <div style={{ marginBottom: '12px', animation: 'fadeIn 0.3s ease' }}>
              <label style={labelStyle}>Classe *</label>
              <input
                placeholder="Ex: 3ème, Terminale C, CM2..."
                value={classeEleve}
                onChange={e => setClasseEleve(e.target.value)}
                style={inputStyle}
              />
            </div>
          )}

          {statutActivite === 'etudiant' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Niveau d'étude *</label>
                <select value={niveauEtude} onChange={e => setNiveauEtude(e.target.value)} style={selectStyle}>
                  <option value="">Sélectionner</option>
                  {['Licence 1', 'Licence 2', 'Licence 3', 'BTS 1', 'BTS 2', 'Master 1', 'Master 2', 'Doctorat 1', 'Doctorat 2 ', 'Autre'].map(n =>
                    <option key={n} value={n} style={optionStyle}>{n}</option>
                  )}
                </select>
              </div>
              <label style={labelStyle}>Domaine d'études *</label>
              <input placeholder="Ex: Informatique, Droit..." value={domaine} onChange={e => setDomaine(e.target.value)} style={inputStyle} />
            </div>
          )}

          {statutActivite === 'apprenti' && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={labelStyle}>Niveau d'étude *</label>
                <select value={niveauEtude} onChange={e => setNiveauEtude(e.target.value)} style={selectStyle}>
                  <option value="">Sélectionner</option>
                  {['AUCUN', 'CEPD', 'BEPC', 'BAC1', 'BAC2', 'CAP', 'BT', 'BTS', 'LICENCE', 'MASTER', 'DOCTORAT', 'Autre'].map(n =>
                    <option key={n} value={n} style={optionStyle}>{n}</option>
                  )}
                </select>
              </div>
              <label style={labelStyle}>Domaine d'apprentissage *</label>
              <input placeholder="Ex: Couture, Menuiserie..." value={domaine} onChange={e => setDomaine(e.target.value)} style={inputStyle} />
            </div>
          )}

          {statutActivite === 'professionnel' && (
            <div style={{ marginBottom: '12px', animation: 'fadeIn 0.3s ease' }}>
              <label style={labelStyle}>Domaine d'activité *</label>
              <input placeholder="Ex: Comptabilité, Enseignement, Commerce..." value={domaine} onChange={e => setDomaine(e.target.value)} style={inputStyle} />
            </div>
          )}

          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

          <button
            onClick={envoyerDemande}
            disabled={sending}
            style={{
              width: '100%',
              background: sending ? '#999' : 'linear-gradient(135deg, #FC1713, #a00d24)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: sending ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: sending ? 'none' : '0 4px 16px rgba(200,16,46,0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            {sending ? (
              <>Envoi en cours...</>
            ) : (
              <><IconSend /> Envoyer ma demande</>
            )}
          </button>
        </div>

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