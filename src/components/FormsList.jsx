import { useState, useEffect } from 'react';

const API_URL = '/api';

const FIELD_TYPES = [
  { value: 'texto', label: 'Texto Corto' },
  { value: 'textarea', label: 'Texto Largo' },
  { value: 'chip-single', label: 'Opción Única (Chips)' },
  { value: 'chip-multi', label: 'Opciones Múltiples (Chips)' },
  { value: 'selector-grid', label: 'Selector Grid' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'card-3', label: 'Tarjetas (3 opciones)' },
];

export default function FormsList({ token }) {
  const [view, setView] = useState('list');
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [formInput, setFormInput] = useState({ titulo: '', descripcion: '', estado: 'borrador' });

  const [showFieldModal, setShowFieldModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldInput, setFieldInput] = useState({
    label: '',
    descripcion: '',
    tipo: 'texto',
    obligatorio: 1,
    paso: 1,
    orden: 0,
    opciones: '',
    max_seleccion: 3,
    max_length: 255,
  });

  // Cargar formularios
  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = () => {
    setLoading(true);
    // Cargar solo formularios publicados (endpoint devuelve solo publicados por defecto)
    fetch(`${API_URL}/forms.php?estado=publicado`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Error al cargar formularios');
      })
      .then((data) => {
        setForms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const loadFormDetail = (formId) => {
    fetch(`${API_URL}/forms.php?id=${formId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Error al cargar detalles');
      })
      .then((data) => {
        setSelectedForm(data);
        setView('detail');
      })
      .catch((err) => console.error(err));
  };

  // Form Modal - Save
  const saveForm = async () => {
    try {
      const method = editingForm ? 'PUT' : 'POST';
      const url = editingForm ? `${API_URL}/forms.php?id=${editingForm.id}` : `${API_URL}/forms.php`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formInput),
      });

      if (res.ok) {
        setShowFormModal(false);
        setEditingForm(null);
        setFormInput({ titulo: '', descripcion: '', estado: 'borrador' });
        loadForms();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Field Modal - Save
  const saveField = async () => {
    if (!fieldInput.label.trim()) {
      alert('El label del campo es requerido');
      return;
    }

    try {
      const method = editingField ? 'PUT' : 'POST';
      const url = editingField ? `${API_URL}/form_fields.php?id=${editingField.id}` : `${API_URL}/form_fields.php`;

      const payload = {
        ...fieldInput,
        form_id: selectedForm.id,
        obligatorio: fieldInput.obligatorio ? 1 : 0,
      };

      if (['chip-single', 'chip-multi', 'selector-grid', 'timeline', 'card-3'].includes(fieldInput.tipo)) {
        payload.opciones = fieldInput.opciones
          .split('\n')
          .map((o) => o.trim())
          .filter((o) => o);
      } else {
        payload.opciones = null;
      }

      if (!['texto', 'textarea'].includes(fieldInput.tipo)) {
        payload.max_length = null;
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowFieldModal(false);
        setEditingField(null);
        resetFieldInput();
        loadFormDetail(selectedForm.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteField = (fieldId) => {
    if (!window.confirm('¿Eliminar este campo?')) return;

    fetch(`${API_URL}/form_fields.php?id=${fieldId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          loadFormDetail(selectedForm.id);
        }
      })
      .catch((err) => console.error(err));
  };

  const openFormModal = (form = null) => {
    if (form) {
      setEditingForm(form);
      setFormInput({
        titulo: form.titulo,
        descripcion: form.descripcion || '',
        estado: form.estado,
      });
    } else {
      setEditingForm(null);
      setFormInput({ titulo: '', descripcion: '', estado: 'borrador' });
    }
    setShowFormModal(true);
  };

  const openFieldModal = (field = null) => {
    if (field) {
      setEditingField(field);
      setFieldInput({
        label: field.label,
        descripcion: field.descripcion || '',
        tipo: field.tipo,
        obligatorio: field.obligatorio,
        paso: field.paso,
        orden: field.orden,
        opciones: Array.isArray(field.opciones) ? field.opciones.join('\n') : '',
        max_seleccion: field.max_seleccion || 3,
        max_length: field.max_length || 255,
      });
    } else {
      setEditingField(null);
      resetFieldInput();
    }
    setShowFieldModal(true);
  };

  const resetFieldInput = () => {
    setFieldInput({
      label: '',
      descripcion: '',
      tipo: 'texto',
      obligatorio: 1,
      paso: 1,
      orden: 0,
      opciones: '',
      max_seleccion: 3,
      max_length: 255,
    });
  };

  const groupFieldsByStep = (fields) => {
    const grouped = {};
    fields.forEach((f) => {
      if (!grouped[f.paso]) grouped[f.paso] = [];
      grouped[f.paso].push(f);
    });
    return grouped;
  };

  // ========== RENDER ==========

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Cargando formularios...</p>;

  // ========== LIST VIEW ==========
  if (view === 'list') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Gestión de Formularios</h2>
          <button className="button button-primary" onClick={() => openFormModal()}>
            + Nuevo Formulario
          </button>
        </div>

        {forms.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No hay formularios. Crea uno para comenzar.</p>
        ) : (
          <div className="submissions-list">
            {forms.map((form) => (
              <div key={form.id} className="submission-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="submission-name">{form.titulo}</div>
                    {form.descripcion && (
                      <div className="submission-meta" style={{ fontSize: '13px', marginTop: '0.5rem' }}>
                        {form.descripcion}
                      </div>
                    )}
                  </div>
                  <span className={`form-status-badge form-status-${form.estado}`}>
                    {form.estado === 'publicado' ? '✓' : form.estado === 'archivado' ? '✕' : '◐'}{' '}
                    {form.estado}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    className="button button-text"
                    onClick={() => loadFormDetail(form.id)}
                  >
                    Ver campos
                  </button>
                  <button
                    className="button button-text"
                    onClick={() => openFormModal(form)}
                  >
                    Editar formulario
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showFormModal && (
          <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>
                  {editingForm ? 'Editar Formulario' : 'Nuevo Formulario'}
                </h3>
                <button className="button button-text" onClick={() => setShowFormModal(false)}>
                  ✕
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Título (requerido)</label>
                <input
                  type="text"
                  value={formInput.titulo}
                  onChange={(e) => setFormInput({ ...formInput, titulo: e.target.value })}
                  placeholder="Ej: Encuesta de Satisfacción"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  value={formInput.descripcion}
                  onChange={(e) => setFormInput({ ...formInput, descripcion: e.target.value })}
                  placeholder="Describe el propósito de este formulario..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estado</label>
                <select
                  value={formInput.estado}
                  onChange={(e) => setFormInput({ ...formInput, estado: e.target.value })}
                >
                  <option value="borrador">Borrador</option>
                  <option value="publicado">Publicado</option>
                  <option value="archivado">Archivado</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button className="button" onClick={() => setShowFormModal(false)}>
                  Cancelar
                </button>
                <button className="button button-primary" onClick={saveForm}>
                  {editingForm ? 'Guardar Cambios' : 'Crear Formulario'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========== DETAIL VIEW ==========
  if (view === 'detail' && selectedForm) {
    const groupedFields = groupFieldsByStep(selectedForm.fields || []);

    return (
      <div>
        <button className="button button-text" onClick={() => setView('list')} style={{ marginBottom: '1.5rem' }}>
          ← Volver a Formularios
        </button>

        <div className="submission-card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600' }}>{selectedForm.titulo}</h2>
              {selectedForm.descripcion && (
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  {selectedForm.descripcion}
                </p>
              )}
            </div>
            <span className={`form-status-badge form-status-${selectedForm.estado}`}>
              {selectedForm.estado}
            </span>
          </div>

          <button className="button button-text" onClick={() => openFormModal(selectedForm)}>
            Editar formulario
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Campos del Formulario</h3>
          <button className="button button-primary" onClick={() => openFieldModal()}>
            + Agregar Campo
          </button>
        </div>

        {(!selectedForm.fields || selectedForm.fields.length === 0) ? (
          <p style={{ color: 'var(--text-muted)' }}>No hay campos. Agrega uno para empezar.</p>
        ) : (
          <div>
            {Object.keys(groupedFields)
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map((paso) => (
                <div key={paso}>
                  <div className="field-step-label">Paso {paso}</div>
                  {groupedFields[paso]
                    .sort((a, b) => a.orden - b.orden)
                    .map((field) => (
                      <div key={field.id} className="field-row">
                        <div className="field-row-info">
                          <span className="field-tipo-badge">{field.tipo}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>
                              {field.label}
                              {field.obligatorio && (
                                <span style={{ color: '#d32f2f', marginLeft: '0.25rem' }}>*</span>
                              )}
                            </div>
                            {field.descripcion && (
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                {field.descripcion}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="field-row-actions">
                          <button className="button button-text" onClick={() => openFieldModal(field)}>
                            Editar
                          </button>
                          <button className="button button-text" onClick={() => deleteField(field.id)}>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        )}

        {/* Field Modal */}
        {showFieldModal && (
          <div className="modal-overlay" onClick={() => setShowFieldModal(false)}>
            <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>
                  {editingField ? 'Editar Campo' : 'Nuevo Campo'}
                </h3>
                <button className="button button-text" onClick={() => setShowFieldModal(false)}>
                  ✕
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Label (requerido)</label>
                <input
                  type="text"
                  value={fieldInput.label}
                  onChange={(e) => setFieldInput({ ...fieldInput, label: e.target.value })}
                  placeholder="Ej: ¿Cuál es tu nombre?"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  value={fieldInput.descripcion}
                  onChange={(e) => setFieldInput({ ...fieldInput, descripcion: e.target.value })}
                  placeholder="Texto de ayuda (opcional)"
                  rows="2"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Tipo de Campo</label>
                  <select
                    value={fieldInput.tipo}
                    onChange={(e) => setFieldInput({ ...fieldInput, tipo: e.target.value })}
                  >
                    {FIELD_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label className="form-label">
                    <input
                      type="checkbox"
                      checked={fieldInput.obligatorio === 1}
                      onChange={(e) => setFieldInput({ ...fieldInput, obligatorio: e.target.checked ? 1 : 0 })}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Obligatorio
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Paso</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={fieldInput.paso}
                    onChange={(e) => setFieldInput({ ...fieldInput, paso: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Orden</label>
                  <input
                    type="number"
                    min="0"
                    value={fieldInput.orden}
                    onChange={(e) => setFieldInput({ ...fieldInput, orden: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              {['chip-single', 'chip-multi', 'selector-grid', 'timeline', 'card-3'].includes(fieldInput.tipo) && (
                <div className="form-group">
                  <label className="form-label">Opciones (una por línea)</label>
                  <textarea
                    value={fieldInput.opciones}
                    onChange={(e) => setFieldInput({ ...fieldInput, opciones: e.target.value })}
                    placeholder="Opción 1&#10;Opción 2&#10;Opción 3"
                    rows="4"
                  />
                </div>
              )}

              {['texto', 'textarea'].includes(fieldInput.tipo) && (
                <div className="form-group">
                  <label className="form-label">Máximo de caracteres</label>
                  <input
                    type="number"
                    min="1"
                    value={fieldInput.max_length}
                    onChange={(e) => setFieldInput({ ...fieldInput, max_length: parseInt(e.target.value) })}
                  />
                </div>
              )}

              {['chip-multi'].includes(fieldInput.tipo) && (
                <div className="form-group">
                  <label className="form-label">Máximo de selecciones</label>
                  <input
                    type="number"
                    min="1"
                    value={fieldInput.max_seleccion}
                    onChange={(e) => setFieldInput({ ...fieldInput, max_seleccion: parseInt(e.target.value) })}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button className="button" onClick={() => setShowFieldModal(false)}>
                  Cancelar
                </button>
                <button className="button button-primary" onClick={saveField}>
                  {editingField ? 'Guardar Cambios' : 'Crear Campo'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
