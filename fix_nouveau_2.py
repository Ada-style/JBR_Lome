import os

with open('src/pages/Nouveau.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix loadEvenements declaration order
content = content.replace(
    "useEffect(() => { loadEvenements() }, [])\n\n  async function loadEvenements() {",
    "const loadEvenements = async () => {\n    const { data } = await supabase\n      .from('evenements_galerie')\n      .select('*, photos_galerie(*)')\n      .order('date_evenement', { ascending: false })\n    if (data && data.length > 0) {\n      setEvenements([...data, ...EVENEMENTS_LOCAUX])\n      setActiveEv(data[0].id)\n    }\n  }\n\n  useEffect(() => { loadEvenements() }, [])"
)

# In case the exact match fails due to function body, let's just do:
import re
content = re.sub(
    r"useEffect\(\(\) => \{ loadEvenements\(\) \}, \[\]\)\s+async function loadEvenements\(\) \{[\s\S]*?\}\s+ \/\/ Calculer le domaine final",
    r"""const loadEvenements = async () => {
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

  // Calculer le domaine final""",
    content
)

# Remove BUREAU section
content = re.sub(
    r"\{\/\* L'équipe - Bureau 2026-2028 \*\/\}[\s\S]*?\{\/\* Formulaire rejoindre \*\/\}",
    r"{/* Formulaire rejoindre */}",
    content
)

# Replace CLASSES_ELEVE map with simple input
content = re.sub(
    r"\{\/\* Champs conditionnels \*\/\}[\s\S]*?statutActivite === 'eleve' && \([\s\S]*?\<select value=\{classeEleve\}[\s\S]*?\<\/select\>[\s\S]*?\<\/div\>[\s\S]*?\)",
    r"""{/* Champs conditionnels */}
          {statutActivite === 'eleve' && (
            <div style={{ marginBottom: '12px', animation: 'fadeIn 0.3s ease' }}>
              <label style={labelStyle}>Classe *</label>
              <input placeholder="Ex: Terminale D" value={classeEleve} onChange={e => setClasseEleve(e.target.value)} style={inputStyle} />
            </div>
          )}""",
    content
)

# Also fix "Prénom" to "Prénoms"
content = content.replace("labelStyle}>Prénom *</label>", "labelStyle}>Prénoms *</label>")

# Add Niveau Etude correctly
# We already replaced etudiant and apprenti with simple inputs earlier? Actually no, looking at lines 560-571, they are still input texts.
content = re.sub(
    r"\{statutActivite === 'etudiant' && \([\s\S]*?\<\/div\>[\s\S]*?\)\}",
    r"""{statutActivite === 'etudiant' && (
            <div style={{ marginBottom: '12px', animation: 'fadeIn 0.3s ease' }}>
              <label style={labelStyle}>Niveau d'étude *</label>
              <select value={niveauEtude} onChange={e => setNiveauEtude(e.target.value)} style={selectStyle}>
                <option value="" disabled style={optionStyle}>Sélectionne ton niveau</option>
                {['AUCUN', 'CEPD', 'BEPC', 'BAC1', 'BAC2', 'CAP', 'BT', 'BTS', 'LICENCE', 'MASTER', 'DOCTORAT', 'Autre'].map(n => <option key={n} value={n} style={optionStyle}>{n}</option>)}
              </select>
              {niveauEtude === 'Autre' && (
                <div style={{ marginTop: '8px' }}>
                  <label style={labelStyle}>Précisez</label>
                  <input placeholder="Précisez votre niveau" onChange={e => setNiveauEtude(e.target.value)} style={inputStyle} />
                </div>
              )}
              <label style={{...labelStyle, marginTop:'12px'}}>Domaine d'études *</label>
              <input placeholder="Ex: Informatique, Droit, Médecine..." value={domaine} onChange={e => setDomaine(e.target.value)} style={inputStyle} />
            </div>
          )}""",
    content
)

content = re.sub(
    r"\{statutActivite === 'apprenti' && \([\s\S]*?\<\/div\>[\s\S]*?\)\}",
    r"""{statutActivite === 'apprenti' && (
            <div style={{ marginBottom: '12px', animation: 'fadeIn 0.3s ease' }}>
              <label style={labelStyle}>Niveau d'étude *</label>
              <select value={niveauEtude} onChange={e => setNiveauEtude(e.target.value)} style={selectStyle}>
                <option value="" disabled style={optionStyle}>Sélectionne ton niveau</option>
                {['AUCUN', 'CEPD', 'BEPC', 'BAC1', 'BAC2', 'CAP', 'BT', 'BTS', 'LICENCE', 'MASTER', 'DOCTORAT', 'Autre'].map(n => <option key={n} value={n} style={optionStyle}>{n}</option>)}
              </select>
              {niveauEtude === 'Autre' && (
                <div style={{ marginTop: '8px' }}>
                  <label style={labelStyle}>Précisez</label>
                  <input placeholder="Précisez votre niveau" onChange={e => setNiveauEtude(e.target.value)} style={inputStyle} />
                </div>
              )}
              <label style={{...labelStyle, marginTop:'12px'}}>Domaine d'apprentissage *</label>
              <input placeholder="Ex: Couture, Menuiserie, Coiffure..." value={domaine} onChange={e => setDomaine(e.target.value)} style={inputStyle} />
            </div>
          )}""",
    content
)

# And add `niveauEtude` to state if missing
if "const [niveauEtude" not in content:
    content = content.replace(
        "const [classeEleve, setClasseEleve] = useState('')",
        "const [classeEleve, setClasseEleve] = useState('')\n  const [niveauEtude, setNiveauEtude] = useState('')"
    )

# Make sure `quartier` and `telephone` states are added correctly
if "const [telephone" not in content:
    content = content.replace(
        "const [tel, setTel] = useState('')",
        "const [tel, setTel] = useState('')\n  const [telephone, setTelephone] = useState('')\n  const [quartier, setQuartier] = useState('')"
    )

# Make sure payload building includes new fields
if "quartier: quartier" not in content:
    content = content.replace(
        "whatsapp: tel.trim(),",
        "whatsapp: tel.trim(),\n      telephone: telephone.trim() || null,\n      quartier: quartier.trim() || null,\n      niveau_etude: niveauEtude || null,"
    )

# Clear new fields on success
content = content.replace(
    "setTel('');\n    setEmail('');",
    "setTel('');\n    setTelephone('');\n    setQuartier('');\n    setNiveauEtude('');\n    setEmail('');"
)

# Add Quartier and Telephone inputs
contact_old = """            <label style={labelStyle}>Numéro WhatsApp *</label>
            <input placeholder="+228 90 12 34 56" value={tel} onChange={e => setTel(e.target.value)} style={inputStyle} />
          </div>"""
contact_new = """            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Numéro WhatsApp *</label>
                <input type="tel" placeholder="+228..." value={tel} onChange={e => setTel(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Numéro d'appel</label>
                <input type="tel" placeholder="+228..." value={telephone} onChange={e => setTelephone(e.target.value)} style={inputStyle} />
              </div>
            </div>
            <label style={labelStyle}>Quartier *</label>
            <input placeholder="Ex: Hountigomé" value={quartier} onChange={e => setQuartier(e.target.value)} style={inputStyle} />
          </div>"""
if "Numéro d'appel" not in content:
    content = content.replace(contact_old, contact_new)

# Add warning text
warning_old = """          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '4px', height: '28px', background: '#FC1713', borderRadius: '2px' }} />
            <div>
              <div style={{ color: theme.text, fontSize: '17px', fontWeight: '700', fontFamily: 'Founders Grotesk,sans-serif' }}>Rejoindre la jeunesse</div>
              <div style={{ color: theme.muted, fontSize: '11px', marginTop: '2px' }}>Remplis ce formulaire et le bureau te contactera</div>
            </div>
          </div>"""
warning_new = warning_old + """
          <div style={{background:'rgba(252,23,19,0.08)',border:'1px solid rgba(252,23,19,0.3)',borderRadius:'8px',padding:'12px',color:'#FC1713',fontSize:'12px',marginBottom:'20px',fontWeight:'600'}}>
            Merci de renseigner vos vraies informations. Elles sont utilisées uniquement par le bureau.
          </div>"""
if "vraies informations" not in content:
    content = content.replace(warning_old, warning_new)

# Add teaser
teaser_old = """      <div style={{background:'linear-gradient(135deg,#FC1713,#8b0000)',padding:'80px 24px 48px',textAlign:'center',color:'white'}}>
        <img src="/logo.png" alt="Logo" loading="lazy" style={{width:'70px',height:'70px',objectFit:'contain',borderRadius:'12px',marginBottom:'16px',filter:'drop-shadow(0 4px 20px rgba(0,0,0,0.4))'}} />"""
teaser_new = """      <div style={{background:'linear-gradient(135deg,#FC1713,#8b0000)',padding:'80px 24px 48px',textAlign:'center',color:'white'}}>
        <div style={{background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',borderRadius:'20px',padding:'6px 12px',display:'inline-block',fontSize:'11px',fontWeight:'bold',letterSpacing:'1px',marginBottom:'20px'}}>🚀 L'APPLICATION COMPLÈTE ARRIVE BIENTÔT</div>
        <br/>
        <img src="/logo.png" alt="Logo" loading="lazy" style={{width:'70px',height:'70px',objectFit:'contain',borderRadius:'12px',marginBottom:'16px',filter:'drop-shadow(0 4px 20px rgba(0,0,0,0.4))'}} />"""
if "L'APPLICATION COMPLÈTE" not in content:
    content = content.replace(teaser_old, teaser_new)

with open('src/pages/Nouveau.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Nouveau.jsx rules applied successfully")
