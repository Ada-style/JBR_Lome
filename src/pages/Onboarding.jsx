import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const slides = [
  {
    bg: 'linear-gradient(135deg, #FC1713 0%, #a00d24 100%)',
    color: '#ffffff',
    accent: '#ffffff',
    emoji: '🙌',
    titre: 'Bienvenue dans la famille JBR',
    desc: 'Le Groupe des jeunes du Rocher est plus qu\'un groupe, c\'est ta communauté pour grandir, s\'épanouir et vivre ta foi pleinement.',
  },
  {
    bg: 'linear-gradient(135deg, #0965BA 0%, #053a6b 100%)',
    color: '#ffffff',
    accent: '#ffffff',
    emoji: '🔔',
    titre: 'Reste toujours connecté',
    desc: 'Annonces, événements, défis... Reçois toutes les actus du bureau en temps réel. Tu ne manqueras plus rien d\'important.',
  },
  {
    bg: 'linear-gradient(135deg, #111111 0%, #333333 100%)',
    color: '#ffffff',
    accent: '#FC1713',
    emoji: '📖',
    titre: 'Nourris ton esprit',
    desc: 'Accède chaque jour à des dévotions inspirantes et des plans de lecture biblique pour fortifier ta relation avec Dieu.',
  },
  {
    bg: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
    color: '#111111',
    accent: '#FC1713',
    emoji: '🤝',
    titre: 'Ton impact, ton réseau',
    desc: 'Découvre l\'annuaire des membres, partage tes compétences et crée des liens forts avec tes frères et sœurs.',
  }
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)

  function next() {
    if (current < slides.length - 1) {
      setCurrent(current + 1)
    } else {
      finish()
    }
  }

  function finish() {
    localStorage.setItem('onboarding_v2_done', 'true')
    navigate('/')
  }

  const slide = slides[current]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: slide.bg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 40px 40px',
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        fontFamily: 'Founders Grotesk, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        color: slide.color
      }}
      onTouchStart={e => setTouchStartX(e.touches[0].clientX)}
      onTouchEnd={e => {
        const diff = touchStartX - e.changedTouches[0].clientX
        if (diff > 50) next()
        else if (diff < -50 && current > 0) setCurrent(current - 1)
      }}
    >
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bgRotate {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .animate-up { animation: slideUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .float { animation: float 4s ease-in-out infinite; }
        .bg-blob {
          position: absolute;
          width: 500px;
          height: 500px;
          background: ${slide.accent};
          filter: blur(120px);
          opacity: 0.15;
          border-radius: 50%;
          top: -100px;
          right: -100px;
          z-index: 0;
          animation: bgRotate 20s linear infinite;
          pointer-events: none;
        }
      `}</style>

      <div className="bg-blob" />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
        <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '1px' }}>JBR</div>
        <button
          onClick={finish}
          style={{
            background: 'none',
            border: 'none',
            color: slide.color,
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            opacity: 0.6,
            fontFamily: 'inherit'
          }}
        >
          Passer
        </button>
      </div>

      {/* Illustration */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
        <div key={current} className="float" style={{ fontSize: '120px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))' }}>
          {slide.emoji}
        </div>
      </div>

      {/* Content */}
      <div key={`content-${current}`} className="animate-up" style={{ zIndex: 1 }}>
        <div style={{
          height: '4px',
          width: '40px',
          background: slide.accent,
          marginBottom: '24px',
          borderRadius: '2px'
        }} />
        
        <h1 style={{
          fontSize: '40px',
          fontWeight: '700',
          lineHeight: '1.1',
          marginBottom: '20px',
          maxWidth: '300px'
        }}>
          {slide.titre}
        </h1>
        
        <p style={{
          fontSize: '18px',
          lineHeight: '1.6',
          opacity: 0.8,
          marginBottom: '40px',
          maxWidth: '320px'
        }}>
          {slide.desc}
        </p>

        {/* Footer Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ flex: 1, height: '60px', position: 'relative' }}>
             <button
              onClick={next}
              style={{
                width: '100%',
                height: '100%',
                background: current === slides.length - 1 ? (slide.color === '#ffffff' ? '#ffffff' : slide.accent) : 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                color: current === slides.length - 1 ? (slide.color === '#ffffff' ? '#111' : '#fff') : slide.color,
                border: current === slides.length - 1 ? 'none' : `1px solid ${slide.color}33`,
                borderRadius: '18px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease'
              }}
            >
              {current === slides.length - 1 ? 'Commencer' : 'Suivant'}
            </button>
          </div>
          
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {slides.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === current ? '24px' : '8px',
                  height: '8px',
                  background: slide.color,
                  opacity: i === current ? 1 : 0.2,
                  borderRadius: '4px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}