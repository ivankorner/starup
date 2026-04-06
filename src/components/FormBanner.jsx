import { useState, useEffect } from 'react';

export default function FormBanner({ step }) {
  const [imageUrl, setImageUrl] = useState(null);

  const banners = {
    intro: {
      title: 'Contanos tu proyecto',
      sub: 'Todo gran proyecto empieza con una idea. Completá los 5 pasos y descubrí tu score.',
      icon: '🚀',
      color: 'purple',
    },
    1: {
      title: 'La Idea',
      sub: 'Describí tu propuesta, el sector al que apunta y el problema que resuelve.',
      icon: '💡',
      color: 'blue',
    },
    2: {
      title: 'El Dolor',
      sub: 'Explicá cómo resolvés el problema y qué tan urgente es para tus clientes.',
      icon: '⚡',
      color: 'orange',
    },
    3: {
      title: 'Madurez del Proyecto',
      sub: 'Indicá en qué etapa se encuentra hoy tu iniciativa.',
      icon: '📈',
      color: 'green',
    },
    4: {
      title: 'La Visión',
      sub: 'Contanos cómo y dónde se va a usar tu solución.',
      icon: '🎯',
      color: 'teal',
    },
    5: {
      title: 'Viabilidad',
      sub: 'Presupuesto, equipo y cronograma para hacer realidad tu proyecto.',
      icon: '📊',
      color: 'indigo',
    },
  };

  // Cargar imagen del banner
  useEffect(() => {
    fetch('/api/banners.php')
      .then(res => res.json())
      .then(data => {
        const found = data.find(b => b.step === String(step));
        if (found?.image_url) {
          setImageUrl(found.image_url);
        }
      })
      .catch(err => console.error('Error cargando banner image:', err));
  }, [step]);

  const banner = banners[step];
  if (!banner) return null;

  // Layout hero si hay imagen
  if (imageUrl) {
    return (
      <div className={`step-banner step-banner--${banner.color} step-banner-hero`}>
        <div className="step-banner-content">
          <div className="step-banner-text">
            <h2 className="step-banner-title">{banner.title}</h2>
            <p className="step-banner-sub">{banner.sub}</p>
          </div>
          <div className="step-banner-image">
            <img src={imageUrl} alt={banner.title} />
          </div>
        </div>
      </div>
    );
  }

  // Layout original sin imagen
  return (
    <div className={`step-banner step-banner--${banner.color}`}>
      <div className="step-banner-content">
        <div className="step-banner-icon">{banner.icon}</div>
        <div className="step-banner-text">
          <h2 className="step-banner-title">{banner.title}</h2>
          <p className="step-banner-sub">{banner.sub}</p>
        </div>
      </div>
    </div>
  );
}
