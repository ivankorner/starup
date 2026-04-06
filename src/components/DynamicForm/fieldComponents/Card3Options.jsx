export default function Card3Options({ field, value, onChange, error }) {
  const handleSelect = (option) => {
    onChange(value === option ? '' : option);
  };

  const options = field.opciones || [];

  return (
    <div className="form-group">
      <label className="form-label">
        {field.label}
        {field.obligatorio && <span style={{ color: '#d32f2f' }}>*</span>}
      </label>
      {field.descripcion && (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          {field.descripcion}
        </p>
      )}

      <div
        className="card-3-group"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        {options.map((option) => (
          <label
            key={option}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '1.25rem',
              borderRadius: '8px',
              border: value === option ? '2px solid var(--primary)' : '1px solid var(--border)',
              backgroundColor: value === option ? 'var(--primary-light)' : 'var(--bg-white)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minHeight: '120px',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <input
              type="radio"
              name={field.id}
              value={option}
              checked={value === option}
              onChange={() => handleSelect(option)}
              style={{
                marginBottom: '0.5rem',
                cursor: 'pointer',
                accentColor: 'var(--primary)',
              }}
            />
            <div
              style={{
                fontWeight: '500',
                fontSize: '14px',
                color: value === option ? 'var(--primary)' : 'var(--text-body)',
              }}
            >
              {option}
            </div>
          </label>
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
