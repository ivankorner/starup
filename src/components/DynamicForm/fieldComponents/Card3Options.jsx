import { parseCardOption, renderIcon } from '../../../utils/cardIcons';

export default function Card3Options({ field, value, onChange, error }) {
  const handleSelect = (optionText) => {
    onChange(value === optionText ? '' : optionText);
  };

  const options = (field.opciones || []).map(parseCardOption);

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
        className="card-3-group"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        {options.map(({ text, icon }) => {
          const isSelected = value === text;
          return (
            <div
              key={text}
              onClick={() => handleSelect(text)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1.25rem',
                borderRadius: '12px',
                border: isSelected ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--bg-white)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minHeight: '120px',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '0.5rem',
              }}
            >
              {icon ? (
                <div style={{
                  color: isSelected ? 'var(--primary)' : '#8b95a5',
                  marginBottom: '0.25rem',
                  transition: 'color 0.2s ease',
                }}>
                  {renderIcon(icon, 32)}
                </div>
              ) : (
                <input
                  type="radio"
                  name={field.id}
                  value={text}
                  checked={isSelected}
                  readOnly
                  style={{
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                    accentColor: 'var(--primary)',
                  }}
                />
              )}
              <div
                style={{
                  fontWeight: '500',
                  fontSize: '14px',
                  color: isSelected ? 'var(--primary)' : 'var(--text-body)',
                }}
              >
                {text}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="error-message" style={{ color: '#d32f2f', fontSize: '13px' }}>
          {error}
        </div>
      )}
    </div>
  );
}
