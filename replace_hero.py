path = 'src/pages/Nouveau.jsx'
with open(path, 'r', encoding='utf-8') as f:
    src = f.read()

# Trouver le hero par marqueurs uniques
start_marker = '{/* Hero */'
end_marker = '      </div>\n\n      <div style={{ maxWidth: '

start = src.find(start_marker)
end = src.find(end_marker, start)

if start == -1 or end == -1:
    print('Marqueurs non trouves')
    # Debug
    idx = src.find('GROUPE DES JEUNES')
    print('GROUPE DES JEUNES trouve a index:', idx)
    print('Contexte:', src[idx-200:idx+200])
else:
    # Remplacer le bloc hero complet
    new_hero = '''      {/* Hero - split banner */}
      <div style={{ marginTop: '56px', display: 'flex', alignItems: 'stretch', minHeight: '180px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}>
        <div style={{ background: '#ffffff', padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '170px', width: '170px', flexShrink: 0, borderRight: '1px solid #e5e5e5' }}>
          <img src="/logo.png" alt="Logo" loading="lazy" style={{ width: '60px', height: '60px', objectFit: 'contain', marginBottom: '12px' }} />
          <div style={{ color: '#0965BA', fontSize: '13px', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', textAlign: 'center', lineHeight: '1.4' }}>
            GROUPE<br/>DES JEUNES
          </div>
        </div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <img src="/detente1.jpg" alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', minHeight: '180px' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(175,10,10,0.55)' }} />
        </div>
      </div>
'''

    # end pointe sur le debut de "      <div style={{ maxWidth..."
    # On prend tout ce qui est avant le start_marker (- 6 pour les espaces)
    prefix_end = src.rfind('\n', 0, start)  # debut de la ligne du hero
    new_src = src[:prefix_end+1] + new_hero + src[end:]

    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_src)
    print('OK - hero remplace avec succes')
    print('Nouvelles lignes hero:')
    for i, l in enumerate(new_hero.splitlines()[:5]):
        print(' ', l[:80])
