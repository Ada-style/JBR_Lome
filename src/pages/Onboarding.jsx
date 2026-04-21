import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const slides = [
  {
    image: '/onboarding1.jpg',
    titre: 'Content de te voir ici !',
    description: 'La Jeunesse EB Le Rocher c\'est ta famille. On grandit ensemble, on s\'encourage, on vit notre relation avec Dieu.',
    color: '#C8102E'
  },
  {
    image: '/onboarding2.jpg',
    titre: 'Rien ne te passe plus',
    description: 'Les annonces, les événements, tout ce qui se passe dans la jeunesse ; tu es toujours dans la boucle.',
    color: '#8b0000'
  },
  {
    image: '/onboarding3.jpg',
    titre: 'Commence bien ta journée',
    description: 'Un verset, une prière, un défi de lecture. Chaque jour on se retrouve dans la Parole.',
    color: '#C8102E'
  },
  {
    image: '/onboarding4.jpg',
    titre: 'C\'est ton espace',
    description: 'Ton profil, tes cotisations, tout ce qui te concerne ; accessible en un clic.',
    color: '#8b0000'
  }
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)

  function next() { setCurrent(prev => Math.min(prev + 1, slides.length - 1)) }
  function prev() { setCurrent(prev => Math.max(prev - 1, 0)) }

  const skipOnboarding = () => {
    localStorage.setItem('onboarding_done', 'true')
    navigate('/')
  }

  const finishOnboarding = () => {
    localStorage.setItem('onboarding_done', 'true')
    navigate('/')
  }

  const slide = slides[current]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev < slides.length - 1 ? prev + 1 : 0))
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '40px 24px',
      textAlign: 'center',
      overflow: 'hidden',
      color: 'white',
      zIndex: 1000
    }}
    onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
    onTouchEnd={(e) => {
      const touchEndX = e.changedTouches[0].clientX
      const diff = touchStartX - touchEndX
      if (diff > 50) next()
      else if (diff < -50) prev()
    }}
    >
      {/* Bouton Passer en haut à droite */}
      <div style={{
        position: 'absolute',
        top: '40px',
        right: '24px',
        zIndex: 3
      }}>
        <button
          onClick={skipOnboarding}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '20px',
            padding: '8px 16px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.3s ease'
          }}
        >
          Passer
        </button>
      </div>

      {/* Background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${slide.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(3px)',
        transform: 'scale(1.05)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 1
      }} />

      {/* Contenu principal centré */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '20px',
          fontFamily: 'Outfit, sans-serif',
          lineHeight: '1.2'
        }}>
          {slide.titre}
        </h1>
        <p style={{
          fontSize: '18px',
          lineHeight: '1.6',
          opacity: 0.9,
          fontFamily: 'Inter, sans-serif'
        }}>
          {slide.description}
        </p>
      </div>

      {/* Navigation en bas */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        paddingBottom: '40px'
      }}>
        {/* Bouton Précédent à gauche */}
        <div>
          {current > 0 && (
            <button
              onClick={prev}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '25px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.3s ease'
              }}
            >
              Précédent
            </button>
          )}
        </div>

        {/* Points de navigation au centre */}
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          {slides.map((_, index) => (
            <div
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: current === index ? 'white' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Bouton Suivant/Commencer à droite */}
        <div>
          {current < slides.length - 1 ? (
            <button
              onClick={next}
              style={{
                background: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 24px',
                color: slide.color,
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.3s ease'
              }}
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={finishOnboarding}
              style={{
                background: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 32px',
                color: slide.color,
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.3s ease'
              }}
            >
              Commencer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}