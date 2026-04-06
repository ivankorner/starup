export default function TextAreaInput({ field, value, onChange, error }) {
  const handleChange = (e) => {
    let newValue = e.target.value;

    // Respetar max_length
    if (field.max_length && newValue.length > field.max_length) {
      newValue = newValue.slice(0, field.max_length);
    }

    onChange(newValue);
  };

  const currentLength = (value || '').length;
  const maxLength = field.max_length || 1000;

  return (
    <div className="form-group">
      <label className="form-label">
        {field.label}
        {field.obligatorio && <span style={{ color: '#d32f2f' }}>*</span>}
      </label>
      <textarea
        value={value || ''}
        onChange={handleChange}
        placeholder={field.descripcion || field.label}
        maxLength={maxLength}
        rows="4"
        style={{
          width: '100%',
          padding: '0.75rem',
          border: error ? '2px solid #d32f2f' : '1px solid var(--border)',
          borderRadius: '4px',
          fontFamily: 'inherit',
          fontSize: '14px',
          resize: 'vertical',
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '0.5rem',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}
      >
        {error && <span style={{ color: '#d32f2f' }}>{error}</span>}
        {maxLength && (
          <span style={{ marginLeft: 'auto' }}>
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
