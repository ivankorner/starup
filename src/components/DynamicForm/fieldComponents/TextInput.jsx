export default function TextInput({ field, value, onChange, error }) {
  const handleChange = (e) => {
    let newValue = e.target.value;

    // Respetar max_length
    if (field.max_length && newValue.length > field.max_length) {
      newValue = newValue.slice(0, field.max_length);
    }

    onChange(newValue);
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {field.label}
        {!!field.obligatorio && <span style={{ color: '#d32f2f' }}>*</span>}
      </label>
      <input
        type={field.slug === 'email' ? 'email' : 'text'}
        value={value || ''}
        onChange={handleChange}
        placeholder={field.descripcion || field.label}
        maxLength={field.max_length || 255}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: error ? '2px solid #d32f2f' : '1px solid var(--border)',
          borderRadius: '4px',
          fontFamily: 'inherit',
          fontSize: '14px',
        }}
      />
      {error && (
        <div className="error-message" style={{ color: '#d32f2f', fontSize: '13px', marginTop: '0.5rem' }}>
          {error}
        </div>
      )}
    </div>
  );
}
