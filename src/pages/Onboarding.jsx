import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const slides = [
  {
    bg: '#ffffff',
    color: '#111111',
    accent: '#FC1713',
    shape: 'M60,10 L110,60 L60,110 L10,60 Z',
    titre: 'Content de te voir ici !',
    desc: 'Le Groupe des jeunes du Rocher, c\'est ta famille. On grandit ensemble, on s\'encourage, on vit notre foi.',
  },
  {
    bg: '#FC1713',
    color: '#ffffff',
    accent: '#ffffff',
    shape: 'M50,5 A45,45 0 1,1 49.9,5 Z',
    titre: 'Rien ne te passe plus',
    desc: 'Les annonces, les événements, tout ce qui se passe dans la jeunesse · tu es toujours dans la boucle.',
  },
  {
    bg: '#0965BA',
    color: '#ffffff',
    accent: '#ffffff',
    shape: 'M10,90 L50,10 L90,90 Z',
    titre: 'Commence bien ta journée',
    desc: 'Un verset, une prière. Chaque matin on se retrouve dans la Parole.',
  },
  {
    bg: '#ffffff',
    color: '#111111',
    accent: '#FC1713',
    shape: 'M20,20 L80,20 L80,80 L20,80 Z',
    titre: 'C\'est ton espace',
    desc: 'Ton profil, tes cotisations, tout ce qui te concerne · accessible en un clic.',
  }
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [touchStartX, setTouchStartX] = useState(0)

  const slide = slides[current]

  function goTo(index) {
    if (animating || index === current) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, 250)
  }

  function next() {
    if (current < slides.length - 1) goTo(current + 1)
    else finish()
  }

  function finish() {
    localStorage.setItem('onboarding_done', 'true')
    navigate('/')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: slide.bg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 32px 48px',
        transition: 'background 0.4s ease',
        fontFamily: 'Founders Grotesk, sans-serif',
      }}
      onTouchStart={e => setTouchStartX(e.touches[0].clientX)}
      onTouchEnd={e => {
        const diff = touchStartX - e.changedTouches[0].clientX
        if (diff > 60) next()
        else if (diff < -60 && current > 0) goTo(current - 1)
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-content { animation: fadeUp 0.4s ease; }
      `}</style>

      {/* Bouton Passer */}
      <div style={{ textAlign: 'right' }}>
        <button
          onClick={finish}
          style={{
            background: 'none',
            border: `1px solid ${slide.accent}`,
            borderRadius: '20px',
            padding: '8px 18px',
            color: slide.accent,
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'inherit',
            opacity: 0.7,
          }}
        >
          Passer
        </button>
      </div>

      {/* Illustration géométrique */}
      <div key={`shape-${current}`} className="slide-content" style={{ display: 'flex', justifyContent: 'center', margin: '32px 0' }}>
        <svg width="160" height="160" viewBox="0 0 100 100">
          <path
            d={slide.shape}
            fill={slide.accent}
            opacity="0.15"
          />
          <path
            d={slide.shape}
            fill="none"
            stroke={slide.accent}
            strokeWidth="2"
            opacity="0.6"
          />
          {/* Logo JBR au centre */}
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fill={slide.accent}
            fontSize="14"
            fontWeight="700"
            fontFamily="Founders Grotesk, sans-serif"
          >
            JDR
          </text>
        </svg>
      </div>

      {/* Texte */}
      <div key={`text-${current}`} className="slide-content" style={{ flex: 1 }}>
        {/* Numéro */}
        <div style={{
          display: 'inline-block',
          background: slide.accent,
          color: slide.bg,
          borderRadius: '20px',
          padding: '4px 14px',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '2px',
          marginBottom: '20px',
          opacity: 0.9,
        }}>
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>

        <h1 style={{
          color: slide.color,
          fontSize: '32px',
          fontWeight: '700',
          lineHeight: '1.2',
          marginBottom: '16px',
          margin: '0 0 16px',
        }}>
          {slide.titre}
        </h1>

        <p style={{
          color: slide.color,
          fontSize: '16px',
          lineHeight: '1.8',
          opacity: 0.75,
          margin: 0,
        }}>
          {slide.desc}
        </p>
      </div>

      {/* Navigation */}
      <div style={{ marginTop: '40px' }}>
        {/* Points */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{
                height: '4px',
                borderRadius: '2px',
                background: slide.accent,
                opacity: i === current ? 1 : 0.25,
                flex: i === current ? 2 : 1,
                transition: 'all 0.35s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* Bouton Suivant */}
        <button
          onClick={next}
          style={{
            width: '100%',
            background: slide.accent,
            color: slide.bg,
            border: 'none',
            borderRadius: '14px',
            padding: '16px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.5px',
          }}
        >
          {current < slides.length - 1 ? 'Suivant' : 'Commencer'}
        </button>
      </div>
    </div>
  )
}