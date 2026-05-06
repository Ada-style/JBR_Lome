import { useEffect, useRef } from 'react'

export function useBackModal(isOpen, onClose) {
  const isOpenRef = useRef(isOpen)

  useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    // On pousse un état pour pouvoir intercepter le bouton "Retour"
    window.history.pushState({ modal: true }, '')

    const handlePopState = (e) => {
      if (isOpenRef.current) {
        onClose()
      }
    }

    window.addEventListener('popstate', handlePopState)
    
    return () => {
      window.removeEventListener('popstate', handlePopState)
      // Si on démonte le composant ou qu'on ferme manuellement, 
      // on vérifie si on doit "reculer" pour nettoyer l'historique
      if (window.history.state?.modal) {
        window.history.back()
      }
    }
  }, [isOpen, onClose])
}
