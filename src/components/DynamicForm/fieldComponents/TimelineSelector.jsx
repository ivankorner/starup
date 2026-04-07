export default function TimelineSelector({ field, value, onChange, error }) {
  // Parsear opciones: formato "Título|||Descripción"
  const parseOption = (opt) => {
    const parts = opt.split('|||');
    return {
      title: parts[0] || opt,
      description: parts[1] || '',
    };
  };

  const options = (field.opciones || []).map(parseOption);

  const handleSelect = (title) => {
    onChange(value === title ? '' : title);
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {field.label}
        {!!field.obligatorio && <span style={{ color: '#d32f2f' }}>*</span>}
      </label>
      {field.descripcion && (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {field.descripcion}
        </p>
      )}

      <div
        className="timeline-list"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        {options.map((option, idx) => (
          <div key={idx}>
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                padding: '1rem',
                borderRadius: '8px',
                border: value === option.title ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: value === option.title ? 'var(--primary-light)' : 'var(--bg-white)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                type="radio"
                name={field.id}
                value={option.title}
                checked={value === option.title}
                onChange={() => handleSelect(option.title)}
                style={{
                  marginRight: '1rem',
                  marginTop: '0.25rem',
                  cursor: 'pointer',
                  accentColor: 'var(--primary)',
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: '500',
                    color: value === option.title ? 'var(--primary)' : 'var(--text-main)',
                    marginBottom: option.description ? '0.25rem' : 0,
                  }}
                >
                  {option.title}
                </div>
                {option.description && (
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {option.description}
                  </div>
                )}
              </div>
            </label>
          </div>
        ))}
      </div>

      {error && (
        <div className="error-message" style={{ color: '#d32f2f', fontSize: '13px' }}>
          {error}
        </div>
      )}
    </div>
  );
}
