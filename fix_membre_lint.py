import os

with open('src/pages/Membre.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. loadCotisations accessed before declaration
content = content.replace(
    "  useEffect(() => {\n    if (profile?.id) {\n      loadCotisations()\n    }\n  }, [profile])\n\n  async function loadCotisations() {\n    const { data } = await supabase.from('cotisations').select('*').eq('utilisateur_id', profile.id).order('created_at', { ascending: false })\n    if (data) setCotisations(data)\n  }",
    "  const loadCotisations = async () => {\n    const { data } = await supabase.from('cotisations').select('*').eq('utilisateur_id', profile.id).order('created_at', { ascending: false })\n    if (data) setCotisations(data)\n  }\n\n  useEffect(() => {\n    if (profile?.id) {\n      loadCotisations()\n    }\n  }, [profile])"
)

# 2. navigate unused in Profil
content = content.replace(
    "function Profil({ theme, supabase, profile, handleSignOut, navigate, initialTab = 'info' }) {",
    "function Profil({ theme, supabase, profile, handleSignOut, initialTab = 'info' }) {"
)
content = content.replace(
    "<Profil theme={theme} supabase={supabase} profile={profile} handleSignOut={handleSignOut} navigate={navigate} />",
    "<Profil theme={theme} supabase={supabase} profile={profile} handleSignOut={handleSignOut} />"
)

# 3. setBio, editing, saveBio unused -> remove them
content = content.replace(
    "  const [bio, setBio] = useState(profile?.bio || '')\n",
    ""
)
content = content.replace(
    "  const [editing, setEditing] = useState(false)\n",
    ""
)
content = content.replace(
    "  async function saveBio() {\n    await supabase.from('utilisateurs').update({ bio }).eq('id', profile.id)\n    setEditing(false)\n    setMsg('Profil mis à jour !')\n  }\n\n",
    ""
)

# 4. theme unused in AdminAccess
content = content.replace(
    "function AdminAccess({ navigate, theme, profile }) {",
    "function AdminAccess({ navigate, profile }) {"
)
# Make sure we don't pass theme when calling AdminAccess
content = content.replace(
    "<AdminAccess navigate={navigate} theme={theme} profile={profile} />",
    "<AdminAccess navigate={navigate} profile={profile} />"
)

with open('src/pages/Membre.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Membre.jsx lint errors fixed")
