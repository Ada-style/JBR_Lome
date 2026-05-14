
import re

path = 'src/pages/Nouveau.jsx'
with open(path, 'r', encoding='utf-8') as f:
    src = f.read()

patches = []

# ─── 1. Ajouter l'état submitted + niveauEtudeAutre apres sending ───
patches.append((
    "  const [sending, setSending] = useState(false)",
    "  const [sending, setSending] = useState(false)\n"
    "  const [submitted, setSubmitted] = useState(false)\n"
    "  const [niveauEtudeAutre, setNiveauEtudeAutre] = useState('')"
))

# ─── 2. Apres succes: setSubmitted(true) et ne pas reset le msg ───
patches.append((
    "    console.log('✅ Insertion réussie !', data);\n"
    "    showMsg('Demande envoyée avec succès ! Le bureau vous contactera bientôt.', 'success');\n"
    "\n"
    "    setPrenom('');\n"
    "    setNom('');\n"
    "    setTel('');\n"
    "    setQuartier('');\n"
    "    setNiveauEtude('');\n"
    "    setEmail('');\n"
    "    setDomaine('');\n"
    "    setDateAnniversaire('');\n"
    "    setStatutActivite('');\n"
    "    setClasseEleve('');",

    "    setSubmitted(true);"
))

# ─── 3. Nouveau hero (remplace l'ancien) ───
patches.append((
    "      {/* Hero */}\n"
    "      <div style={{ background: 'linear-gradient(135deg,#0965BA,#064a8a)', padding: '80px 24px 48px', textAlign: 'center', color: 'white' }}>\n"
    "        <div style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', padding: '6px 12px', display: 'inline-block', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '20px' }}>🚀 L'APPLICATION COMPLÈTE ARRIVE BIENTÔT</div>\n"
    "        <br />\n"
    "        <img src=\"/logo.png\" alt=\"Logo\" loading=\"lazy\" style={{ width: '70px', height: '70px', objectFit: 'contain', borderRadius: '12px', marginBottom: '16px', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))' }} />\n"
    "        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '28px', fontWeight: '700', margin: '0 0 8px' }}>\n"
    "          Bienvenue parmi nous\n"
    "        </h1>\n"
    "        <p style={{ fontSize: '14px', opacity: 0.8, maxWidth: '320px', margin: '0 auto', lineHeight: '1.7' }}>\n"
    "          Comme les premiers chrétiens, on se retrouve, on apprend, on prie et on partage la vie ensemble. Actes 2:42\n"
    "        </p>\n"
    "      </div>",

    "      {/* Hero */}\n"
    "      <div style={{ background: 'linear-gradient(135deg,#0965BA,#064a8a)', padding: '70px 24px 0', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden' }}>\n"
    "        <div style={{ position: 'relative', zIndex: 2 }}>\n"
    "          <img src=\"/logo.png\" alt=\"Logo\" loading=\"lazy\" style={{ width: '64px', height: '64px', objectFit: 'contain', borderRadius: '12px', marginBottom: '12px', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))' }} />\n"
    "          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '22px', fontWeight: '800', margin: '0 0 24px', letterSpacing: '1px' }}>\n"
    "            GROUPE DES JEUNES\n"
    "          </h1>\n"
    "        </div>\n"
    "        <img\n"
    "          src=\"/detente1.jpg\"\n"
    "          alt=\"Nos moments\"\n"
    "          style={{ width: '100%', maxWidth: '680px', height: '200px', objectFit: 'cover', objectPosition: 'center', display: 'block', margin: '0 auto', borderRadius: '16px 16px 0 0', opacity: 0.85 }}\n"
    "        />\n"
    "      </div>"
))

# ─── 4. Remplacer "Mot du président" + "Ce que tu trouveras" par texte chaud ───
old_intro = (
    "        {/* Mot du président */}\n"
    "        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>\n"
    "          <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Mot du Président</div>\n"
    "          <p style={{ color: theme.text, fontSize: '15px', lineHeight: '1.9', fontStyle: 'italic', marginBottom: '12px', fontFamily: 'Space Grotesk' }}>\n"
    "            « Si tu cherches une famille où grandir dans la foi, l'amitié et la joie; tu es au bon endroit. On t'attendait ! »\n"
    "          </p>\n"
    "          <div style={{ color: theme.muted, fontSize: '12px', fontWeight: '600' }}>EZIAN-GNAMAVO Yao Benjamin : Président de la Groupe des jeunes du Rocher</div>\n"
    "        </div>\n"
    "\n"
    "        {/* Ce que tu trouveras */}\n"
    "        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>\n"
    "          <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Ce que tu trouveras ici</div>\n"
    "          {[\n"
    "            'Des dévotions hebdomadaires et des défis de lecture biblique',\n"
    "            'Des événements récréatifs et culturels tout au long de l\\'année',\n"
    "            'Un réseau de jeunes talentueux avec qui collaborer',\n"
    "            'Un espace sûr pour grandir dans la foi et dans la vie',\n"
    "          ].map((item, i) => (\n"
    "            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' }}>\n"
    "              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FC1713', marginTop: '7px', flexShrink: 0 }} />\n"
    "              <div style={{ color: theme.muted, fontSize: '13px', lineHeight: '1.7' }}>{item}</div>\n"
    "            </div>\n"
    "          ))}\n"
    "        </div>"
)
new_intro = (
    "        {/* Intro chaleureuse */}\n"
    "        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>\n"
    "          <p style={{ color: theme.text, fontSize: '15px', lineHeight: '1.9', margin: 0, fontFamily: 'Space Grotesk' }}>\n"
    "            Tu fais partie de la famille ! Pour mieux te connaître et mieux t'organiser, prends 1 minute pour remplir ce formulaire.\n"
    "            Nom, prénoms, profession... quelques infos simples qui nous aident à être un vrai groupe soudé.\n"
    "            <span style={{ color: '#FC1713', fontWeight: '700' }}> Dieu te bénisse pour ta collaboration !</span>\n"
    "          </p>\n"
    "        </div>"
)
patches.append((old_intro, new_intro))

# ─── 5. Supprimer le bloc Galerie entier ───
old_gallery = (
    "        {/* Galerie */}\n"
    "        {evenements.length > 0 && (\n"
    "          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>\n"
    "            <div style={{ color: '#FC1713', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>Nos moments</div>\n"
    "\n"
    "            {/* Tabs événements */}\n"
    "            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px', scrollbarWidth: 'none' }}>\n"
    "              {evenements.map(ev => (\n"
    "                <button\n"
    "                  key={ev.id}\n"
    "                  onClick={() => setActiveEv(ev.id)}\n"
    "                  style={{\n"
    "                    background: activeEv === ev.id ? '#FC1713' : theme.bg,\n"
    "                    border: `1px solid ${activeEv === ev.id ? '#FC1713' : theme.border}`,\n"
    "                    borderRadius: '20px',\n"
    "                    padding: '7px 16px',\n"
    "                    color: activeEv === ev.id ? 'white' : theme.muted,\n"
    "                    fontSize: '12px',\n"
    "                    fontWeight: activeEv === ev.id ? '600' : '400',\n"
    "                    cursor: 'pointer',\n"
    "                    whiteSpace: 'nowrap',\n"
    "                    fontFamily: 'inherit',\n"
    "                    transition: 'all 0.2s',\n"
    "                    flexShrink: 0,\n"
    "                  }}\n"
    "                >\n"
    "                  {ev.nom} · {new Date(ev.date_evenement).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}\n"
    "                </button>\n"
    "              ))}\n"
    "            </div>\n"
    "\n"
    "            {/* Photos de l'événement actif */}\n"
    "            {evActif && (\n"
    "              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>\n"
    "                {evActif.photos_galerie?.map((p, i) => (\n"
    "                  <img\n"
    "                    key={p.id}\n"
    "                    src={p.url}\n"
    "                    alt=\"\"\n"
    "                    loading=\"lazy\"\n"
    "                    onClick={() => setLightbox(p.url)}\n"
    "                    style={{\n"
    "                      width: '100%',\n"
    "                      height: i === 0 ? '220px' : '150px',\n"
    "                      objectFit: 'cover',\n"
    "                      borderRadius: '12px',\n"
    "                      cursor: 'pointer',\n"
    "                      gridColumn: i === 0 ? 'span 2' : 'span 1',\n"
    "                      transition: 'transform 0.2s',\n"
    "                    }}\n"
    "                  />\n"
    "                ))}\n"
    "              </div>\n"
    "            )}\n"
    "          </div>\n"
    "        )}\n"
)
patches.append((old_gallery, ""))

# ─── 6. Entourer le formulaire avec submitted guard + confirmation ───
old_form_open = "        {/* Formulaire rejoindre */}\n        <div className=\"nouveau-form\""
new_form_open = (
    "        {/* Formulaire rejoindre */}\n"
    "        {submitted ? (\n"
    "          <div style={{ background: theme.card, border: '1px solid rgba(37,211,102,0.3)', borderRadius: '20px', padding: '40px 28px', marginBottom: '32px', textAlign: 'center' }}>\n"
    "            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>\n"
    "            <div style={{ color: '#25d366', fontSize: '20px', fontWeight: '700', fontFamily: 'Space Grotesk', marginBottom: '12px' }}>Demande envoyée !</div>\n"
    "            <p style={{ color: theme.muted, fontSize: '14px', lineHeight: '1.8', marginBottom: '20px' }}>\n"
    "              Merci ! Le bureau a bien reçu ta demande et te contactera très bientôt sur WhatsApp. Dieu te bénisse !\n"
    "            </p>\n"
    "            <button onClick={() => navigate('/')} style={{ background: '#0965BA', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>\n"
    "              Retour à l'accueil\n"
    "            </button>\n"
    "          </div>\n"
    "        ) : (\n"
    "        <div className=\"nouveau-form\""
)
patches.append((old_form_open, new_form_open))

# Fermer le else du guard apres la fermeture du formulaire
old_form_close = "        </div>\n\n      </div>\n\n      {/* Lightbox */"
new_form_close = "        </div>\n        )}\n\n      </div>\n\n      {/* Lightbox */"
patches.append((old_form_close, new_form_close))

# ─── 7. Champ Niveau d'étude global (avant statut d'activite) ───
old_sep = (
    "          {/* Séparateur */}\n"
    "          <div style={{ height: '1px', background: theme.border, margin: '8px 0 20px' }} />\n"
    "\n"
    "          {/* Date d'anniversaire */}"
)
new_sep = (
    "          {/* Séparateur */}\n"
    "          <div style={{ height: '1px', background: theme.border, margin: '8px 0 20px' }} />\n"
    "\n"
    "          {/* Niveau d'étude global */}\n"
    "          <div style={{ marginBottom: '16px' }}>\n"
    "            <label style={labelStyle}>Niveau d'étude *</label>\n"
    "            <select value={niveauEtude} onChange={e => { setNiveauEtude(e.target.value); if (e.target.value !== 'Autre') setNiveauEtudeAutre(''); }} style={selectStyle}>\n"
    "              <option value=''>Sélectionner</option>\n"
    "              {['CEPD', 'BEPC', 'BAC', 'BT', 'CAP', 'BTS 1', 'BTS 2', 'Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2', 'Doctorat', 'Autre'].map(n =>\n"
    "                <option key={n} value={n} style={optionStyle}>{n}</option>\n"
    "              )}\n"
    "            </select>\n"
    "            {niveauEtude === 'Autre' && (\n"
    "              <input placeholder=\"Précisez votre niveau...\" value={niveauEtudeAutre} onChange={e => setNiveauEtudeAutre(e.target.value)} style={inputStyle} />\n"
    "            )}\n"
    "          </div>\n"
    "\n"
    "          {/* Date d'anniversaire */}"
)
patches.append((old_sep, new_sep))

# ─── 8. Supprimer les blocs niveau d'étude conditionnel dans etudiant/apprenti ───
# Bloc etudiant: supprimer le sous-bloc "Niveau d'étude" (garder "Domaine d'études")
old_etudiant_niveau = (
    "          {statutActivite === 'etudiant' && (\n"
    "            <div style={{ animation: 'fadeIn 0.3s ease' }}>\n"
    "              <div style={{ marginBottom: '12px' }}>\n"
    "                <label style={labelStyle}>Niveau d'étude *</label>\n"
    "                <select value={niveauEtude} onChange={e => setNiveauEtude(e.target.value)} style={selectStyle}>\n"
    "                  <option value=\"\">Sélectionner</option>\n"
    "                  {['Licence 1', 'Licence 2', 'Licence 3', 'BTS 1', 'BTS 2', 'Master 1', 'Master 2', 'Doctorat 1', 'Doctorat 2 ', 'Autre'].map(n =>\n"
    "                    <option key={n} value={n} style={optionStyle}>{n}</option>\n"
    "                  )}\n"
    "                </select>\n"
    "              </div>\n"
    "              <label style={labelStyle}>Domaine d'études *</label>\n"
    "              <input placeholder=\"Ex: Informatique, Droit...\" value={domaine} onChange={e => setDomaine(e.target.value)} style={inputStyle} />\n"
    "            </div>\n"
    "          )}"
)
new_etudiant_niveau = (
    "          {statutActivite === 'etudiant' && (\n"
    "            <div style={{ marginBottom: '12px', animation: 'fadeIn 0.3s ease' }}>\n"
    "              <label style={labelStyle}>Domaine d'études *</label>\n"
    "              <input placeholder=\"Ex: Informatique, Droit...\" value={domaine} onChange={e => setDomaine(e.target.value)} style={inputStyle} />\n"
    "            </div>\n"
    "          )}"
)
patches.append((old_etudiant_niveau, new_etudiant_niveau))

old_apprenti_niveau = (
    "          {statutActivite === 'apprenti' && (\n"
    "            <div style={{ animation: 'fadeIn 0.3s ease' }}>\n"
    "              <div style={{ marginBottom: '12px' }}>\n"
    "                <label style={labelStyle}>Niveau d'étude *</label>\n"
    "                <select value={niveauEtude} onChange={e => setNiveauEtude(e.target.value)} style={selectStyle}>\n"
    "                  <option value=\"\">Sélectionner</option>\n"
    "                  {['AUCUN', 'CEPD', 'BEPC', 'BAC1', 'BAC2', 'CAP', 'BT', 'BTS', 'LICENCE', 'MASTER', 'DOCTORAT', 'Autre'].map(n =>\n"
    "                    <option key={n} value={n} style={optionStyle}>{n}</option>\n"
    "                  )}\n"
    "                </select>\n"
    "              </div>\n"
    "              <label style={labelStyle}>Domaine d'apprentissage *</label>\n"
    "              <input placeholder=\"Ex: Couture, Menuiserie...\" value={domaine} onChange={e => setDomaine(e.target.value)} style={inputStyle} />\n"
    "            </div>\n"
    "          )}"
)
new_apprenti_niveau = (
    "          {statutActivite === 'apprenti' && (\n"
    "            <div style={{ marginBottom: '12px', animation: 'fadeIn 0.3s ease' }}>\n"
    "              <label style={labelStyle}>Domaine d'apprentissage *</label>\n"
    "              <input placeholder=\"Ex: Couture, Menuiserie...\" value={domaine} onChange={e => setDomaine(e.target.value)} style={inputStyle} />\n"
    "            </div>\n"
    "          )}"
)
patches.append((old_apprenti_niveau, new_apprenti_niveau))

# ─── Appliquer les patches ───
errors = []
for i, (old, new) in enumerate(patches):
    if old in src:
        src = src.replace(old, new, 1)
        print(f"[OK] Patch {i+1} applique")
    else:
        errors.append(i+1)
        print(f"[SKIP] Patch {i+1} non trouve (peut-etre deja applique)")

with open(path, 'w', encoding='utf-8') as f:
    f.write(src)

if errors:
    print(f"\nPatches non appliques : {errors} (verifier si deja appliques)")
else:
    print("\nTous les patches appliques avec succes !")
