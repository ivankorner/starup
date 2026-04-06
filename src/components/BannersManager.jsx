import { useState, useEffect } from 'react';

export default function BannersManager({ token }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const bannerNames = {
    intro: 'Introducción',
    1: 'Paso 1: La Idea',
    2: 'Paso 2: El Dolor',
    3: 'Paso 3: Madurez',
    4: 'Paso 4: La Visión',
    5: 'Paso 5: Viabilidad',
  };

  const bannerColors = {
    intro: '#5B5BD6',
    1: '#1E88E5',
    2: '#E65100',
    3: '#2E7D32',
    4: '#00695C',
    5: '#283593',
  };

  // Cargar banners al montar
  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = () => {
    fetch('/api/banners.php')
      .then(res => res.json())
      .then(data => setBanners(data))
      .catch(err => setError('Error al cargar banners: ' + err.message));
  };

  const handleFileChange = (e, step) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(prev => ({ ...prev, [step]: true }));
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('step', step);
    formData.append('image', file);

    fetch('/api/banners.php', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    })
      .then(res => {
        if (!res.ok) return res.json().then(d => Promise.reject(d.error || 'Error desconocido'));
        return res.json();
      })
      .then(data => {
        setSuccess(`Banner "${bannerNames[step]}" actualizado correctamente`);
        loadBanners();
      })
      .catch(err => {
        setError(typeof err === 'string' ? err : 'Error al subir imagen');
      })
      .finally(() => {
        setLoading(prev => ({ ...prev, [step]: false }));
      });
  };

  return (
    <div className="banners-manager">
      <div className="banners-header">
        <h2>Administrar Banners</h2>
        <p>Sube una imagen para cada paso del formulario</p>
      </div>

      {error && <div className="banners-error">{error}</div>}
      {success && <div className="banners-success">{success}</div>}

      <div className="banners-grid">
        {banners.map((banner) => (
          <div key={banner.step} className="banner-card">
            <div
              className="banner-preview"
              style={{
                backgroundColor: bannerColors[banner.step],
                backgroundImage: banner.image_url ? `url(${banner.image_url})` : 'none',
              }}
            >
              {!banner.image_url && (
                <div className="banner-placeholder">
                  <span className="banner-placeholder-icon">📸</span>
                </div>
              )}
            </div>
            <div className="banner-info">
              <h3>{bannerNames[banner.step]}</h3>
              <p className="banner-step">Step {banner.step}</p>
              {banner.image_url && <p className="banner-has-image">✓ Imagen cargada</p>}
            </div>
            <div className="banner-actions">
              <label className="banner-upload-btn">
                {loading[banner.step] ? 'Cargando...' : 'Cambiar imagen'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, banner.step)}
                  disabled={loading[banner.step]}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
