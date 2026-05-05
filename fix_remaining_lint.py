import os
import re

# Fix Nouveau.jsx
with open('src/pages/Nouveau.jsx', 'r', encoding='utf-8') as f:
    nouveau = f.read()

nouveau = nouveau.replace("          )}}", "          )}")
with open('src/pages/Nouveau.jsx', 'w', encoding='utf-8') as f:
    f.write(nouveau)

# Fix Membre.jsx
with open('src/pages/Membre.jsx', 'r', encoding='utf-8') as f:
    membre = f.read()

membre = membre.replace(
    "const [tab, setTab] = useState(initialTab)",
    "const [tab, setTab] = useState(initialTab)\n  const [bio, setBio] = useState(profile?.bio || '')\n  const [editing, setEditing] = useState(false)"
)
membre = membre.replace(
    "const [uploading, setUploading] = useState(false)\n\n  const loadCotisations",
    "const [uploading, setUploading] = useState(false)\n\n  const saveBio = async () => {\n    await supabase.from('utilisateurs').update({ bio }).eq('id', profile.id)\n    setEditing(false)\n    setMsg('Profil mis à jour !')\n  }\n\n  const loadCotisations"
)
membre = membre.replace("const today = new Date().toISOString().split('T')[0]\n", "")

with open('src/pages/Membre.jsx', 'w', encoding='utf-8') as f:
    f.write(membre)

# Fix Admin.jsx
with open('src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    admin = f.read()

admin = admin.replace(
    "  useEffect(() => {\n    loadDefis()\n  }, [])\n\n  async function loadDefis() {\n    const { data } = await supabase.from('defis_lecture').select('*').order('date_debut', { ascending: false })\n    if (data) setDefis(data)\n  }",
    "  const loadDefis = async () => {\n    const { data } = await supabase.from('defis_lecture').select('*').order('date_debut', { ascending: false })\n    if (data) setDefis(data)\n  }\n\n  useEffect(() => {\n    loadDefis()\n  }, [])"
)

with open('src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(admin)

# Fix Login.jsx
with open('src/pages/Login.jsx', 'r', encoding='utf-8') as f:
    login = f.read()

login = login.replace("  const [magicLink, setMagicLink] = useState(false)\n", "")

with open('src/pages/Login.jsx', 'w', encoding='utf-8') as f:
    f.write(login)

print("All remaining lint errors should be fixed")
