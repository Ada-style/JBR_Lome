import os
import re

# Nouveau.jsx
with open('src/pages/Nouveau.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
# Fix loadEvenements order
c = re.sub(
    r"useEffect\(\(\) => \{ loadEvenements\(\) \}, \[\]\)\n\n  async function loadEvenements\(\) \{([\s\S]*?)\}",
    r"const loadEvenements = async () => {\1}\n\n  useEffect(() => { loadEvenements() }, [])",
    c
)
with open('src/pages/Nouveau.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

# Admin.jsx
with open('src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
# Fix loadDevotions and loadDefis
c = re.sub(
    r"useEffect\(\(\) => \{\n    loadDevotions\(\)\n    loadDefis\(\)\n  \}, \[\]\)\n\n  async function loadDevotions\(\) \{([\s\S]*?)\}\n\n  async function loadDefis\(\) \{([\s\S]*?)\}",
    r"const loadDevotions = async () => {\1}\n\n  const loadDefis = async () => {\2}\n\n  useEffect(() => {\n    loadDevotions()\n    loadDefis()\n  }, [])",
    c
)
with open('src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

# Login.jsx
with open('src/pages/Login.jsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = re.sub(r"\s*const \[magicLink, setMagicLink\] = useState\(false\)", "", c)
with open('src/pages/Login.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
