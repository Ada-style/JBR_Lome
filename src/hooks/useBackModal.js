import { useEffect } from 'react'

export function useBackModal(isOpen, onClose) {
  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ modal: true }, '')
    }
    const handlePopState = () => {
      if (isOpen) onClose()
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isOpen, onClose])
} 
