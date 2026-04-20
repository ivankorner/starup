import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ICON_NAMES, renderIcon, searchIcons } from '../utils/cardIcons';
import { normalizeOptions } from '../utils/fieldOptions';

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
  const [formInput, setFormInput] = useState({ titulo: '', descripcion: '', estado: 'borrador', email_destino: '' });

  const [showFieldModal, setShowFieldModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldInput, setFieldInput] = useState({
    label: '',
    descripcion: '',
    tipo: 'texto',
    obligatorio: 1,
    paso: 1,
    orden: 0,
    scoredOptions: [{ texto: '', puntos: 0 }, { texto: '', puntos: 0 }],
    max_seleccion: 3,
    max_length: 255,
    puntaje_completo: 0,
    card3Options: [
      { texto: '', puntos: 0, icon: '' },
      { texto: '', puntos: 0, icon: '' },
      { texto: '', puntos: 0, icon: '' },
    ],
  });
  const [showIconPicker, setShowIconPicker] = useState(null);
  const [iconSearch, setIconSearch] = useState('');

  // Cargar formularios
  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = () => {
    setLoading(true);
    // Cargar todos los formularios (sin filtrar por estado)
    fetch(`${API_URL}/forms.php`, {
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
        setFormInput({ titulo: '', descripcion: '', estado: 'borrador', email_destino: '' });
        loadForms();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Field Modal - Save
  const saveField = async () => {
    if (!fieldInput.label.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'El label del campo es requerido',
        confirmButtonColor: 'var(--primary)',
      });
      return;
    }

    try {
      const method = editingField ? 'PUT' : 'POST';
      const url = editingField ? `${API_URL}/form_fields.php?id=${editingField.id}` : `${API_URL}/form_fields.php`;

      const payload = {
        ...fieldInput,
        form_id: selectedForm.id,
        obligatorio: fieldInput.obligatorio ? 1 : 0,
        puntaje_completo: Number(fieldInput.puntaje_completo) || 0,
      };

      if (fieldInput.tipo === 'card-3') {
        payload.opciones = fieldInput.card3Options
          .filter((o) => (o.texto || '').trim())
          .map((o) => ({
            texto: o.texto.trim(),
            puntos: Number(o.puntos) || 0,
            ...(o.icon ? { icon: o.icon } : {}),
          }));
      } else if (['chip-single', 'chip-multi', 'selector-grid', 'timeline'].includes(fieldInput.tipo)) {
        payload.opciones = fieldInput.scoredOptions
          .filter((o) => (o.texto || '').trim())
          .map((o) => ({
            texto: o.texto.trim(),
            puntos: Number(o.puntos) || 0,
          }));
      } else {
        payload.opciones = null;
      }

      if (!['texto', 'textarea'].includes(fieldInput.tipo)) {
        payload.max_length = null;
      }

      // Limpiar campos UI-only
      delete payload.scoredOptions;
      delete payload.card3Options;

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

  const deleteField = async (fieldId) => {
    const result = await Swal.fire({
      title: '¿Eliminar este campo?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    fetch(`${API_URL}/form_fields.php?id=${fieldId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Campo eliminado', timer: 1500, showConfirmButton: false });
          loadFormDetail(selectedForm.id);
        }
      })
      .catch((err) => console.error(err));
  };

  const deleteForm = async (formId) => {
    const result = await Swal.fire({
      title: '¿Eliminar este formulario?',
      text: 'Se eliminarán todos sus campos y respuestas. Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    fetch(`${API_URL}/forms.php?id=${formId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Formulario eliminado', timer: 1500, showConfirmButton: false });
          loadForms();
        } else {
          return res.json().then(data => {
            Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Error al eliminar el formulario' });
          });
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
        email_destino: form.email_destino || '',
      });
    } else {
      setEditingForm(null);
      setFormInput({ titulo: '', descripcion: '', estado: 'borrador', email_destino: '' });
    }
    setShowFormModal(true);
  };

  const openFieldModal = (field = null) => {
    if (field) {
      setEditingField(field);
      const isCard3 = field.tipo === 'card-3';
      const normalized = normalizeOptions(field.opciones || []);

      const card3Opts = isCard3 && normalized.length
        ? normalized.map((o) => ({ texto: o.texto, puntos: o.puntos, icon: o.icon || '' }))
        : [
            { texto: '', puntos: 0, icon: '' },
            { texto: '', puntos: 0, icon: '' },
            { texto: '', puntos: 0, icon: '' },
          ];
      while (card3Opts.length < 3) card3Opts.push({ texto: '', puntos: 0, icon: '' });

      const scoredOpts = !isCard3 && normalized.length
        ? normalized.map((o) => ({ texto: o.texto, puntos: o.puntos }))
        : [{ texto: '', puntos: 0 }, { texto: '', puntos: 0 }];

      setFieldInput({
        label: field.label,
        descripcion: field.descripcion || '',
        tipo: field.tipo,
        obligatorio: Number(field.obligatorio) ? 1 : 0,
        paso: Number(field.paso) || 0,
        orden: Number(field.orden) || 0,
        scoredOptions: scoredOpts,
        max_seleccion: field.max_seleccion || 3,
        max_length: field.max_length || 255,
        puntaje_completo: Number(field.puntaje_completo) || 0,
        card3Options: card3Opts,
      });
    } else {
      setEditingField(null);
      resetFieldInput();
    }
    setShowIconPicker(null);
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
      scoredOptions: [{ texto: '', puntos: 0 }, { texto: '', puntos: 0 }],
      max_seleccion: 3,
      max_length: 255,
      puntaje_completo: 0,
      card3Options: [
        { texto: '', puntos: 0, icon: '' },
        { texto: '', puntos: 0, icon: '' },
        { texto: '', puntos: 0, icon: '' },
      ],
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
                    {form.email_destino && (
                      <div style={{ fontSize: '12px', color: 'var(--primary)', marginTop: '0.25rem' }}>
                        📧 {form.email_destino}
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
                  <button
                    className="button button-text"
                    style={{ color: '#d32f2f' }}
                    onClick={() => deleteForm(form.id)}
                  >
                    Eliminar
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

              <div className="form-group">
                <label className="form-label">Email de notificación (opcional)</label>
                <input
                  type="email"
                  value={formInput.email_destino}
                  onChange={(e) => setFormInput({ ...formInput, email_destino: e.target.value })}
                  placeholder="Ej: respuestas@empresa.com"
                />
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Las respuestas de este formulario se enviarán a este correo.
                </p>
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
                              {!!Number(field.obligatorio) && (
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

              {['chip-single', 'chip-multi', 'selector-grid', 'timeline'].includes(fieldInput.tipo) && (
                <div className="form-group">
                  <label className="form-label">Opciones y puntaje</label>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '-0.25rem', marginBottom: '0.5rem' }}>
                    Asigná puntos a cada opción. Mayor puntaje = respuesta más favorable para la viabilidad.
                    {fieldInput.tipo === 'timeline' && ' (Para timeline, usa "Título|||Descripción" en el texto).'}
                    {fieldInput.tipo === 'chip-multi' && ' (Multi-selección: se suman los puntos de todas las elegidas).'}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {fieldInput.scoredOptions.map((opt, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={opt.texto}
                          onChange={(e) => {
                            const updated = [...fieldInput.scoredOptions];
                            updated[idx] = { ...updated[idx], texto: e.target.value };
                            setFieldInput({ ...fieldInput, scoredOptions: updated });
                          }}
                          placeholder={`Opción ${idx + 1}`}
                          style={{ flex: 1 }}
                        />
                        <input
                          type="number"
                          value={opt.puntos}
                          onChange={(e) => {
                            const updated = [...fieldInput.scoredOptions];
                            updated[idx] = { ...updated[idx], puntos: parseInt(e.target.value) || 0 };
                            setFieldInput({ ...fieldInput, scoredOptions: updated });
                          }}
                          placeholder="Puntos"
                          style={{ width: '90px' }}
                          title="Puntos para esta opción"
                        />
                        {fieldInput.scoredOptions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = fieldInput.scoredOptions.filter((_, i) => i !== idx);
                              setFieldInput({ ...fieldInput, scoredOptions: updated });
                            }}
                            style={{
                              background: 'none', border: 'none', color: '#d32f2f',
                              cursor: 'pointer', padding: '4px', fontSize: '18px',
                            }}
                            title="Eliminar opción"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="button button-text"
                      onClick={() => setFieldInput({
                        ...fieldInput,
                        scoredOptions: [...fieldInput.scoredOptions, { texto: '', puntos: 0 }],
                      })}
                      style={{ alignSelf: 'flex-start' }}
                    >
                      + Agregar opción
                    </button>
                  </div>
                </div>
              )}

              {fieldInput.tipo === 'card-3' && (
                <div className="form-group">
                  <label className="form-label">Opciones de tarjeta (con iconos y puntaje)</label>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '-0.25rem', marginBottom: '0.5rem' }}>
                    Icono + texto + puntos. Mayor puntaje = respuesta más favorable.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {fieldInput.card3Options.map((opt, idx) => (
                      <div key={idx} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px',
                        background: 'var(--bg-light)',
                      }}>
                        <div style={{ position: 'relative' }}>
                          <button
                            type="button"
                            onClick={() => { setShowIconPicker(showIconPicker === idx ? null : idx); setIconSearch(''); }}
                            style={{
                              width: '48px', height: '48px', border: '1px dashed var(--border)',
                              borderRadius: '8px', background: 'var(--bg-white)', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: opt.icon ? 'var(--primary)' : '#ccc',
                              transition: 'all 0.2s',
                            }}
                            title="Seleccionar icono"
                          >
                            {opt.icon ? renderIcon(opt.icon, 24) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                            )}
                          </button>

                          {showIconPicker === idx && (
                            <div style={{
                              position: 'absolute', top: '52px', left: 0, zIndex: 1000,
                              background: 'var(--bg-white)', border: '1px solid var(--border)',
                              borderRadius: '12px', padding: '0.75rem',
                              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                              width: '320px',
                            }}>
                              <input
                                type="text"
                                value={iconSearch}
                                onChange={(e) => setIconSearch(e.target.value)}
                                placeholder="Buscar icono..."
                                autoFocus
                                style={{
                                  width: '100%', padding: '6px 10px', marginBottom: '8px',
                                  border: '1px solid var(--border)', borderRadius: '6px',
                                  fontSize: '13px', boxSizing: 'border-box',
                                }}
                              />
                              <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...fieldInput.card3Options];
                                    updated[idx] = { ...updated[idx], icon: '' };
                                    setFieldInput({ ...fieldInput, card3Options: updated });
                                    setShowIconPicker(null);
                                    setIconSearch('');
                                  }}
                                  style={{
                                    width: '38px', height: '38px', border: '1px solid var(--border)',
                                    borderRadius: '6px', background: 'var(--bg-light)', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#999',
                                  }}
                                  title="Sin icono"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                  </svg>
                                </button>
                                {searchIcons(iconSearch).map((name) => (
                                  <button
                                    key={name}
                                    type="button"
                                    onClick={() => {
                                      const updated = [...fieldInput.card3Options];
                                      updated[idx] = { ...updated[idx], icon: name };
                                      setFieldInput({ ...fieldInput, card3Options: updated });
                                      setShowIconPicker(null);
                                      setIconSearch('');
                                    }}
                                    style={{
                                      width: '38px', height: '38px',
                                      border: opt.icon === name ? '2px solid var(--primary)' : '1px solid var(--border)',
                                      borderRadius: '6px',
                                      background: opt.icon === name ? 'var(--primary-light)' : 'var(--bg-white)',
                                      cursor: 'pointer',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      color: opt.icon === name ? 'var(--primary)' : '#666',
                                      transition: 'all 0.15s',
                                    }}
                                    title={name}
                                  >
                                    {renderIcon(name, 18)}
                                  </button>
                                ))}
                              </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <input
                          type="text"
                          value={opt.texto}
                          onChange={(e) => {
                            const updated = [...fieldInput.card3Options];
                            updated[idx] = { ...updated[idx], texto: e.target.value };
                            setFieldInput({ ...fieldInput, card3Options: updated });
                          }}
                          placeholder={`Opción ${idx + 1}`}
                          style={{ flex: 1 }}
                        />
                        <input
                          type="number"
                          value={opt.puntos}
                          onChange={(e) => {
                            const updated = [...fieldInput.card3Options];
                            updated[idx] = { ...updated[idx], puntos: parseInt(e.target.value) || 0 };
                            setFieldInput({ ...fieldInput, card3Options: updated });
                          }}
                          placeholder="Puntos"
                          style={{ width: '80px' }}
                          title="Puntos para esta opción"
                        />
                        {fieldInput.card3Options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = fieldInput.card3Options.filter((_, i) => i !== idx);
                              setFieldInput({ ...fieldInput, card3Options: updated });
                            }}
                            style={{
                              background: 'none', border: 'none', color: '#d32f2f',
                              cursor: 'pointer', padding: '4px', fontSize: '18px',
                            }}
                            title="Eliminar opción"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                    {fieldInput.card3Options.length < 6 && (
                      <button
                        type="button"
                        className="button button-text"
                        onClick={() => setFieldInput({
                          ...fieldInput,
                          card3Options: [...fieldInput.card3Options, { texto: '', puntos: 0, icon: '' }],
                        })}
                        style={{ alignSelf: 'flex-start' }}
                      >
                        + Agregar opción
                      </button>
                    )}
                  </div>
                </div>
              )}

              {['texto', 'textarea'].includes(fieldInput.tipo) && (
                <>
                  <div className="form-group">
                    <label className="form-label">Máximo de caracteres</label>
                    <input
                      type="number"
                      min="1"
                      value={fieldInput.max_length}
                      onChange={(e) => setFieldInput({ ...fieldInput, max_length: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Puntos si está respondido</label>
                    <input
                      type="number"
                      min="0"
                      value={fieldInput.puntaje_completo}
                      onChange={(e) => setFieldInput({ ...fieldInput, puntaje_completo: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Se suman al puntaje total si el usuario completa este campo. Dejar en 0 si el campo no debe puntuar.
                    </p>
                  </div>
                </>
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
