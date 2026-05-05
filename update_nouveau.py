import os
import re

with open('src/pages/Nouveau.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Delete BUREAU array and the corresponding UI
content = re.sub(r'const BUREAU = \[.*?\]', '', content, flags=re.DOTALL)
content = re.sub(r'\{\/\* Le Bureau \*\/\}.*?(?=\{\/\* Formulaire)', '', content, flags=re.DOTALL)

# 2. Add Quartier, Telephone, NiveauEtude states
content = content.replace(
    "const [tel, setTel] = useState('')",
    "const [tel, setTel] = useState('')\n  const [telephone, setTelephone] = useState('')\n  const [quartier, setQuartier] = useState('')\n  const [niveauEtude, setNiveauEtude] = useState('')"
)

# 3. Add to validation
content = content.replace(
    """    if (!prenom || !nom || !tel) {
      showMsg('Veuillez renseigner prénom, nom et numéro WhatsApp');
      return;
    }""",
    """    if (!prenom || !nom || !tel) {
      showMsg('Veuillez renseigner prénoms, nom et numéro WhatsApp');
      return;
    }"""
)

# 4. Update payload building to include new fields
content = content.replace(
    """    const basePayload = {
      nom: nom.trim(),
      prenom: prenom.trim(),
      whatsapp: tel.trim(),
      email: email ? email.trim() : null,
      domaine: domaineComplet,
      statut: 'en_attente'
    };""",
    """    const basePayload = {
      nom: nom.trim(),
      prenom: prenom.trim(),
      whatsapp: tel.trim(),
      telephone: telephone.trim() || null,
      quartier: quartier.trim() || null,
      niveau_etude: niveauEtude || null,
      email: email ? email.trim() : null,
      domaine: domaineComplet,
      statut: 'en_attente'
    };"""
)

# 5. Clear new fields on success
content = content.replace(
    "setTel('');",
    "setTel('');\n    setTelephone('');\n    setQuartier('');\n    setNiveauEtude('');"
)

# 6. Add teaser and change labels
content = content.replace(
    """      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#FC1713,#8b0000)',padding:'80px 24px 48px',textAlign:'center',color:'white'}}>
        <img src="/logo.png" alt="Logo" loading="lazy" style={{width:'70px',height:'70px',objectFit:'contain',borderRadius:'12px',marginBottom:'16px',filter:'drop-shadow(0 4px 20px rgba(0,0,0,0.4))'}} />
        <h1 style={{fontFamily:'Founders Grotesk,sans-serif',fontSize:'28px',fontWeight:'700',margin:'0 0 8px'}}>
          Bienvenue parmi nous
        </h1>
        <p style={{fontSize:'14px',opacity:0.8,maxWidth:'320px',margin:'0 auto',lineHeight:'1.7'}}>
          Comme les premiers chrétiens, on se retrouve, on apprend, on prie et on partage la vie ensemble. Actes 2:42
        </p>
      </div>""",
    """      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#FC1713,#8b0000)',padding:'80px 24px 48px',textAlign:'center',color:'white'}}>
        <div style={{background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',borderRadius:'20px',padding:'6px 12px',display:'inline-block',fontSize:'11px',fontWeight:'bold',letterSpacing:'1px',marginBottom:'20px'}}>🚀 L'APPLICATION COMPLÈTE ARRIVE BIENTÔT</div>
        <br/>
        <img src="/logo.png" alt="Logo" loading="lazy" style={{width:'70px',height:'70px',objectFit:'contain',borderRadius:'12px',marginBottom:'16px',filter:'drop-shadow(0 4px 20px rgba(0,0,0,0.4))'}} />
        <h1 style={{fontFamily:'Founders Grotesk,sans-serif',fontSize:'28px',fontWeight:'700',margin:'0 0 8px'}}>
          Bienvenue parmi nous
        </h1>
        <p style={{fontSize:'14px',opacity:0.8,maxWidth:'320px',margin:'0 auto',lineHeight:'1.7'}}>
          Comme les premiers chrétiens, on se retrouve, on apprend, on prie et on partage la vie ensemble. Actes 2:42
        </p>
      </div>"""
)

# Fix President title
content = content.replace("Jeunesse Groupe des jeunes du Rocher", "Groupe des jeunes du Rocher")

# 7. Form edits: Rename Prénom to Prénoms, add Quartier, Telephone
# Find the start of the form
form_str = """        {/* Formulaire d'adhésion */}
        <div id="rejoindre" style={{background:theme.card,border:`1px solid ${theme.border}`,borderRadius:'16px',padding:'24px'}}>
          <div style={{color:'#FC1713',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'6px'}}>Formulaire d'adhésion</div>
          <h2 style={{fontSize:'22px',fontWeight:'700',color:theme.text,margin:'0 0 20px',fontFamily:'Founders Grotesk,sans-serif'}}>
            Rejoins le groupe
          </h2>"""
          
new_form_str = form_str + """
          <div style={{background:'rgba(252,23,19,0.08)',border:'1px solid rgba(252,23,19,0.3)',borderRadius:'8px',padding:'12px',color:'#FC1713',fontSize:'12px',marginBottom:'20px',fontWeight:'600'}}>
            Merci de renseigner vos vraies informations. Elles sont utilisées uniquement par le bureau.
          </div>"""
content = content.replace(form_str, new_form_str)

# Replace "Prénom" label with "Prénoms"
content = content.replace(
    """              <div>
                <label style={labelStyle}>Prénom</label>
                <input placeholder="Ex: Jean" value={prenom} onChange={e => setPrenom(e.target.value)} style={inputStyle} />
              </div>""",
    """              <div>
                <label style={labelStyle}>Prénoms</label>
                <input placeholder="Ex: Jean" value={prenom} onChange={e => setPrenom(e.target.value)} style={inputStyle} />
              </div>"""
)

# Replace Whatsapp block and add telephone and quartier
whatsapp_block = """          <div>
            <label style={labelStyle}>Numéro WhatsApp</label>
            <input type="tel" placeholder="+228..." value={tel} onChange={e => setTel(e.target.value)} style={inputStyle} />
          </div>"""

new_contacts_block = """          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
            <div>
              <label style={labelStyle}>Numéro WhatsApp</label>
              <input type="tel" placeholder="+228..." value={tel} onChange={e => setTel(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Numéro d'appel (Optionnel)</label>
              <input type="tel" placeholder="+228..." value={telephone} onChange={e => setTelephone(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Quartier</label>
            <input placeholder="Ex: Hountigomé" value={quartier} onChange={e => setQuartier(e.target.value)} style={inputStyle} />
          </div>"""

content = content.replace(whatsapp_block, new_contacts_block)

# Replace classes/etudiant inputs
eleve_block = """            {statutActivite === 'eleve' && (
              <div style={{marginTop:'12px',animation:'fadeIn 0.3s ease'}}>
                <label style={labelStyle}>Classe</label>
                <select value={classeEleve} onChange={e => setClasseEleve(e.target.value)} style={selectStyle}>
                  <option value="" disabled style={optionStyle}>Sélectionne ta classe</option>
                  {CLASSES_ELEVE.map(c => <option key={c} value={c} style={optionStyle}>{c}</option>)}
                </select>
              </div>
            )}"""

new_eleve_block = """            {statutActivite === 'eleve' && (
              <div style={{marginTop:'12px',animation:'fadeIn 0.3s ease'}}>
                <label style={labelStyle}>Classe</label>
                <input placeholder="Ex: Terminale D" value={classeEleve} onChange={e => setClasseEleve(e.target.value)} style={inputStyle} />
              </div>
            )}"""

content = content.replace(eleve_block, new_eleve_block)

etudiant_block = """            {statutActivite === 'etudiant' && (
              <div style={{marginTop:'12px',animation:'fadeIn 0.3s ease'}}>
                <label style={labelStyle}>Domaine d'étude</label>
                <input placeholder="Ex: Droit, Médecine, Informatique..." value={domaine} onChange={e => setDomaine(e.target.value)} style={inputStyle} />
              </div>
            )}"""

niveaux_etude = ['AUCUN', 'CEPD', 'BEPC', 'BAC1', 'BAC2', 'CAP', 'BT', 'BTS', 'LICENCE', 'MASTER', 'DOCTORAT', 'Autre']
options_html = "".join([f"<option key='{n}' value='{n}' style={{optionStyle}}>{n}</option>" for n in niveaux_etude])

new_etudiant_block = f"""            {{statutActivite === 'etudiant' && (
              <div style={{{{marginTop:'12px',animation:'fadeIn 0.3s ease'}}}}>
                <label style={{labelStyle}}>Niveau d'étude</label>
                <select value={{niveauEtude}} onChange={{e => setNiveauEtude(e.target.value)}} style={{selectStyle}}>
                  <option value="" disabled style={{optionStyle}}>Sélectionne ton niveau</option>
                  {options_html}
                </select>
                {{niveauEtude === 'Autre' && (
                  <div style={{{{marginTop:'8px'}}}}>
                    <label style={{labelStyle}}>Précisez</label>
                    <input placeholder="Précisez votre niveau" onChange={{e => setNiveauEtude(e.target.value)}} style={{inputStyle}} />
                  </div>
                )}}
                <label style={{labelStyle}}>Domaine d'étude</label>
                <input placeholder="Ex: Droit, Médecine, Informatique..." value={{domaine}} onChange={{e => setDomaine(e.target.value)}} style={{inputStyle}} />
              </div>
            )}}"""

content = content.replace(etudiant_block, new_etudiant_block)

apprenti_block = """            {statutActivite === 'apprenti' && (
              <div style={{marginTop:'12px',animation:'fadeIn 0.3s ease'}}>
                <label style={labelStyle}>Métier d'apprentissage</label>
                <input placeholder="Ex: Menuiserie, Couture, Mécanique..." value={domaine} onChange={e => setDomaine(e.target.value)} style={inputStyle} />
              </div>
            )}"""

new_apprenti_block = f"""            {{statutActivite === 'apprenti' && (
              <div style={{{{marginTop:'12px',animation:'fadeIn 0.3s ease'}}}}>
                <label style={{labelStyle}}>Niveau d'étude</label>
                <select value={{niveauEtude}} onChange={{e => setNiveauEtude(e.target.value)}} style={{selectStyle}}>
                  <option value="" disabled style={{optionStyle}}>Sélectionne ton niveau</option>
                  {options_html}
                </select>
                {{niveauEtude === 'Autre' && (
                  <div style={{{{marginTop:'8px'}}}}>
                    <label style={{labelStyle}}>Précisez</label>
                    <input placeholder="Précisez votre niveau" onChange={{e => setNiveauEtude(e.target.value)}} style={{inputStyle}} />
                  </div>
                )}}
                <label style={{labelStyle}}>Métier d'apprentissage</label>
                <input placeholder="Ex: Menuiserie, Couture, Mécanique..." value={{domaine}} onChange={{e => setDomaine(e.target.value)}} style={{inputStyle}} />
              </div>
            )}}"""

content = content.replace(apprenti_block, new_apprenti_block)

# Clean up CLASSES_ELEVE array at the top
content = re.sub(r'const CLASSES_ELEVE = \[.*?\]\n', '', content, flags=re.DOTALL)

with open('src/pages/Nouveau.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Nouveau.jsx successfully.")
