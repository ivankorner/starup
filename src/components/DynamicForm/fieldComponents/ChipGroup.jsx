import { normalizeOptions } from '../../../utils/fieldOptions';

export default function ChipGroup({ field, value, onChange, error, multiple }) {
  const handleClick = (option) => {
    if (multiple) {
      // Multi-select: toggle opción
      const currentArray = Array.isArray(value) ? value : [];
      if (currentArray.includes(option)) {
        onChange(currentArray.filter((o) => o !== option));
      } else {
        // Validar max_seleccion
        if (field.max_seleccion && currentArray.length >= field.max_seleccion) {
          return; // No agregar si ya alcanzó máximo
        }
        onChange([...currentArray, option]);
      }
    } else {
      // Single-select: reemplazar
      onChange(value === option ? '' : option);
    }
  };

  const options = normalizeOptions(field.opciones).map((o) => o.texto);
  const currentValue = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <div className="form-group">
      <label className="form-label">
        {field.label}
        {!!field.obligatorio && <span style={{ color: '#d32f2f' }}>*</span>}
      </label>
      {field.descripcion && (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          {field.descripcion}
        </p>
      )}

      <div className="chip-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`chip ${currentValue.includes(option) ? 'active' : ''}`}
            onClick={() => handleClick(option)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: currentValue.includes(option) ? '2px solid var(--primary)' : '1px solid var(--border)',
              backgroundColor: currentValue.includes(option) ? 'var(--primary-light)' : 'var(--bg-white)',
              color: currentValue.includes(option) ? 'var(--primary)' : 'var(--text-body)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: currentValue.includes(option) ? '500' : '400',
              transition: 'all 0.2s ease',
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {multiple && field.max_seleccion && (
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Seleccionadas: {currentValue.length}/{field.max_seleccion}
        </p>
      )}

      {error && (
        <div className="error-message" style={{ color: '#d32f2f', fontSize: '13px' }}>
          {error}
        </div>
      )}
    </div>
  );
}
