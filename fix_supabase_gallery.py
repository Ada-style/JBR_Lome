"""
Script pour supprimer les requetes Supabase vers evenements_galerie / photos_galerie
dans Nouveau.jsx, tout en verifiant que Membre.jsx garde ses requetes intactes.
"""

def fix_nouveau():
    path = 'src/pages/Nouveau.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    skip = False
    removed_count = 0

    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Detecter le debut de loadEvenements
        if 'const loadEvenements = async' in stripped:
            # Sauter jusqu'a la fermeture de la fonction (ligne avec juste "}")
            brace_count = 0
            while i < len(lines):
                if '{' in lines[i]:
                    brace_count += lines[i].count('{')
                if '}' in lines[i]:
                    brace_count -= lines[i].count('}')
                i += 1
                removed_count += 1
                if brace_count <= 0:
                    break
            continue

        # Supprimer le useEffect qui appelle loadEvenements
        if 'loadEvenements()' in stripped and 'useEffect' in stripped:
            removed_count += 1
            i += 1
            # Supprimer aussi la ligne vide suivante si presente
            if i < len(lines) and lines[i].strip() == '':
                i += 1
            continue

        new_lines.append(line)
        i += 1

    if removed_count > 0:
        with open(path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"[OK] Nouveau.jsx : {removed_count} lignes supprimees (loadEvenements + useEffect)")
    else:
        print("[!] Aucune modification dans Nouveau.jsx")

    # Verification finale
    content = ''.join(new_lines)
    if "from('evenements_galerie')" in content or "from('photos_galerie')" in content:
        print("[ERREUR] Il reste des requetes Supabase vers ces tables !")
    else:
        print("[OK] Plus aucune requete Supabase vers evenements_galerie / photos_galerie")

    if 'photos_galerie' in content:
        print("[INFO] 'photos_galerie' existe dans les donnees locales EVENEMENTS_LOCAUX (pas une requete Supabase)")


def verify_membre():
    path = 'src/pages/Membre.jsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    print("\n--- Verification Membre.jsx ---")
    checks = [
        ("from('evenements_galerie')", "Requete evenements_galerie"),
        ("photos_galerie(*)", "Join photos_galerie"),
    ]

    all_ok = True
    for pattern, label in checks:
        found = pattern in content
        status = "[OK]" if found else "[MANQUANT]"
        print(f"  {status} {label}")
        if not found:
            all_ok = False

    if all_ok:
        print("[OK] Membre.jsx : galerie connectee aux tables Supabase")
    else:
        print("[ERREUR] Membre.jsx : requetes galerie manquantes !")


if __name__ == '__main__':
    print("=== Nettoyage des requetes galerie Supabase ===\n")
    fix_nouveau()
    verify_membre()
    print("\n=== Termine ===")
