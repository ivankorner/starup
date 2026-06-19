import { useEffect, useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import ResponseDetailModal from './ResponseDetailModal';
import SubmissionEditModal from './SubmissionEditModal';
import { exportAllResponsesToXLS } from '../utils/exportXLS';
import { exportAllResponsesToPDF } from '../utils/exportPDF';

const API_URL = '/api';

const STATUS_OPTIONS = [
  { value: 'recepcionado', label: 'Recepcionado', bg: '#E8F1FF', text: '#1E5AA8' },
  { value: 'pendiente_revision', label: 'Pendiente de revisión', bg: '#FFF4D6', text: '#A06A00' },
  { value: 'derivado', label: 'Derivado', bg: '#F3E8FF', text: '#7B3FA3' },
  { value: 'leido', label: 'Leído', bg: '#EAF7F5', text: '#157A6E' },
  { value: 'en_analisis', label: 'En análisis', bg: '#FFE9D6', text: '#B45509' },
  { value: 'solicita_informacion', label: 'Solicita información', bg: '#FDE2E2', text: '#B42318' },
  { value: 'en_proceso', label: 'En proceso', bg: '#E3F2FD', text: '#1565C0' },
  { value: 'aprobado', label: 'Aprobado', bg: '#E8F5E9', text: '#2E7D32' },
  { value: 'rechazado', label: 'Rechazado', bg: '#FFEBEE', text: '#C62828' },
  { value: 'implementado', label: 'Implementado', bg: '#E6F4EA', text: '#1B5E20' },
  { value: 'archivado', label: 'Archivado', bg: '#ECEFF1', text: '#455A64' },
];

const STATUS_MAP = STATUS_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option;
  return acc;
}, {});

const VEREDICTO_LABELS = {
  viable: 'Viable',
  potencial: 'Potencial',
  'no-viable': 'No viable',
};

const VEREDICTO_STYLE = {
  viable:     { bg: '#E8F5E9', text: '#2E7D32', dot: '#43A047' },
  potencial:  { bg: '#FFF8E1', text: '#B28704', dot: '#F9A825' },
  'no-viable':{ bg: '#FFEBEE', text: '#C62828', dot: '#E53935' },
};

export default function ResponsesTable({ submissions, token, onRefresh, loading }) {
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState('');
  const [formFilter, setFormFilter] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [veredictoFilter, setVeredictoFilter] = useState('');
  const [rows, setRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [savingRowId, setSavingRowId] = useState(null);

  useEffect(() => {
    setRows(submissions);
  }, [submissions]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/users.php`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Error cargando usuarios');
      })
      .then((data) => setUsers(Array.isArray(data) ? data.filter((user) => user.activo) : []))
      .catch((err) => console.error(err));
  }, [token]);

  const uniqueForms = useMemo(() => {
    const map = new Map();
    rows.forEach((s) => {
      if (s.form_titulo && !map.has(s.form_id)) map.set(s.form_id, s.form_titulo);
    });
    return Array.from(map.entries()).map(([id, titulo]) => ({ id, titulo }));
  }, [rows]);

  const getAssignedAreaName = (response) => {
    const assignedUser = users.find((user) => String(user.id) === String(response.designado_user_id));
    return assignedUser?.area_name || response.designado_area_name || '';
  };

  const uniqueAreas = useMemo(() => {
    const map = new Map();

    users.forEach((user) => {
      if (user.area_name) map.set(user.area_name.toLowerCase(), user.area_name);
    });

    rows.forEach((response) => {
      const areaName = getAssignedAreaName(response);
      if (areaName) map.set(areaName.toLowerCase(), areaName);
    });

    return Array.from(map.values()).sort((a, b) => a.localeCompare(b, 'es'));
  }, [rows, users]);

  const stats = useMemo(() => {
    const total = rows.length;
    const viable = rows.filter(s => s.veredicto === 'viable').length;
    const potencial = rows.filter(s => s.veredicto === 'potencial').length;
    const noViable = rows.filter(s => s.veredicto === 'no-viable').length;
    return { total, viable, potencial, noViable };
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return rows.filter((s) => {
      if (q && !s.nombre?.toLowerCase().includes(q) && !s.email?.toLowerCase().includes(q)) return false;
      if (formFilter && String(s.form_id) !== String(formFilter)) return false;
      if (areaFilter) {
        const assignedArea = getAssignedAreaName(s);
        if (areaFilter === 'sin-area') {
          if (assignedArea) return false;
        } else if (assignedArea !== areaFilter) {
          return false;
        }
      }
      if (veredictoFilter) {
        if (veredictoFilter === 'sin-score' && (s.veredicto || s.raw_maximo > 0)) return false;
        if (veredictoFilter !== 'sin-score' && s.veredicto !== veredictoFilter) return false;
      }
      if (dateFrom) {
        const from = new Date(dateFrom); from.setHours(0,0,0,0);
        if (new Date(s.created_at) < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo); to.setHours(23,59,59,999);
        if (new Date(s.created_at) > to) return false;
      }
      return true;
    });
  }, [rows, search, formFilter, areaFilter, users, veredictoFilter, dateFrom, dateTo]);

  const hasActiveFilters = search || formFilter || areaFilter || veredictoFilter || dateFrom || dateTo;

  const clearFilters = () => {
    setSearch(''); setFormFilter(''); setAreaFilter(''); setVeredictoFilter(''); setDateFrom(''); setDateTo('');
  };

  const formatDate = (str) => {
    if (!str) return '';
    return new Date(str).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const deleteResponse = async (id, nombre) => {
    const result = await Swal.fire({
      title: '¿Eliminar esta respuesta?',
      text: `Se eliminará la respuesta de "${nombre}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`/api/form_responses.php?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Respuesta eliminada', timer: 1500, showConfirmButton: false });
        onRefresh();
      } else {
        const data = await res.json();
        Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Error al eliminar' });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error de conexión' });
    }
  };

  const fetchWithFields = (list) =>
    Promise.all(list.map(async (r) => {
      if (r.fields) return r;
      const res = await fetch(`/api/form_responses.php?id=${r.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.ok ? res.json() : r;
    }));

  const handleExportXLS = async () => {
    setExporting(true);
    try { exportAllResponsesToXLS(await fetchWithFields(filtered)); }
    catch (err) { console.error(err); }
    finally { setExporting(false); }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try { await exportAllResponsesToPDF(await fetchWithFields(filtered)); }
    catch (err) { console.error(err); }
    finally { setExporting(false); }
  };

  const getStatusOption = (value) => STATUS_MAP[value] || STATUS_OPTIONS[0];

  const updateRow = async (row, patch) => {
    const previousRow = row;
    setSavingRowId(row.id);
    setRows((currentRows) => currentRows.map((item) => (item.id === row.id ? { ...item, ...patch } : item)));

    try {
      const res = await fetch(`${API_URL}/form_responses.php?id=${row.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patch),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar');
      }

      if (data.response) {
        setRows((currentRows) => currentRows.map((item) => (item.id === row.id ? { ...item, ...data.response } : item)));
      }

      onRefresh();
      Swal.fire({ icon: 'success', title: 'Actualizado', timer: 1100, showConfirmButton: false });
    } catch (err) {
      setRows((currentRows) => currentRows.map((item) => (item.id === row.id ? previousRow : item)));
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'No se pudo guardar el cambio' });
    } finally {
      setSavingRowId(null);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* ── Stats row ── */}
        {!loading && submissions.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { label: 'Total', value: stats.total, color: '#000' },
              { label: 'Viable', value: stats.viable, color: '#2E7D32' },
              { label: 'Potencial', value: stats.potencial, color: '#B28704' },
              { label: 'No viable', value: stats.noViable, color: '#C62828' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}>
                <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)' }}>
                  {label}
                </span>
                <span style={{ fontSize: '28px', fontWeight: 800, color, lineHeight: 1 }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Filter bar ── */}
        <div style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 1.2fr) minmax(220px, 1.2fr) minmax(160px, 0.8fr) 150px 150px 130px auto',
          gap: '0.75rem',
          alignItems: 'end',
        }}>
          {/* Search */}
          <div>
            <label style={labelStyle}>Buscar</label>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Nombre o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '32px' }}
              />
            </div>
          </div>

          {/* Form selector */}
          <div>
            <label style={labelStyle}>Formulario</label>
            <select value={formFilter} onChange={(e) => setFormFilter(e.target.value)} style={inputStyle}>
              <option value="">Todos los formularios</option>
              {uniqueForms.map((f) => (
                <option key={f.id} value={f.id}>{f.titulo}</option>
              ))}
            </select>
          </div>

          {/* Area selector */}
          <div>
            <label style={labelStyle}>Área</label>
            <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} style={inputStyle}>
              <option value="">Todas las áreas</option>
              {uniqueAreas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
              <option value="sin-area">Sin área</option>
            </select>
          </div>

          {/* Date from */}
          <div>
            <label style={labelStyle}>Desde</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={inputStyle} />
          </div>

          {/* Date to */}
          <div>
            <label style={labelStyle}>Hasta</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={inputStyle} />
          </div>

          {/* Veredicto */}
          <div>
            <label style={labelStyle}>Veredicto</label>
            <select value={veredictoFilter} onChange={(e) => setVeredictoFilter(e.target.value)} style={inputStyle}>
              <option value="">Todos</option>
              <option value="viable">Viable</option>
              <option value="potencial">Potencial</option>
              <option value="no-viable">No viable</option>
              <option value="sin-score">Sin score</option>
            </select>
          </div>

          {/* Clear */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            {hasActiveFilters ? (
              <button onClick={clearFilters} style={{
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                height: '38px',
              }}>
                ✕ Limpiar
              </button>
            ) : <div style={{ height: '38px' }} />}
          </div>
        </div>

        {/* ── Toolbar: count + export ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            {loading ? 'Cargando...' : hasActiveFilters
              ? `${filtered.length} de ${submissions.length} respuestas`
              : `${submissions.length} respuesta${submissions.length !== 1 ? 's' : ''}`
            }
          </p>
          {filtered.length > 0 && !loading && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleExportXLS}
                disabled={exporting}
                style={exportBtnStyle}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12l2.5 3L14 9"/></svg>
                {exporting ? 'Exportando...' : 'Exportar XLS'}
              </button>
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                style={exportBtnStyle}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                {exporting ? 'Exportando...' : 'Exportar PDF'}
              </button>
            </div>
          )}
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Cargando...</div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '0.75rem' }}>🔍</div>
            <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-body)' }}>
              {hasActiveFilters ? 'Sin resultados' : 'No hay respuestas aún'}
            </p>
            <p style={{ fontSize: '13px' }}>
              {hasActiveFilters ? 'Probá cambiando o limpiando los filtros.' : 'Cuando alguien complete un formulario aparecerá aquí.'}
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} style={{ ...exportBtnStyle, marginTop: '1rem' }}>
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div style={{
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '1100px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-light)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ ...thStyle, width: '44px', textAlign: 'center' }}>#</th>
                    <th style={thStyle}>Nombre</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Estado del Proyecto</th>
                    <th style={thStyle}>Designado</th>
                    <th style={thStyle}>Formulario</th>
                    <th style={thStyle}>Fecha</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Score</th>
                    <th style={{ ...thStyle, textAlign: 'center', width: '120px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => {
                    const hasViability = row.veredicto && row.raw_maximo > 0;
                    const vs = hasViability ? VEREDICTO_STYLE[row.veredicto] : null;
                    const statusOption = getStatusOption(row.estado_proyecto || 'recepcionado');
                    const assignedUser = users.find((user) => String(user.id) === String(row.designado_user_id));
                    const assignedArea = assignedUser?.area_name || row.designado_area_name;
                    return (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedResponse(row)}
                        style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 0.12s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#FAFAFA'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                          {idx + 1}
                        </td>
                        <td style={{ ...tdStyle, fontWeight: 600 }}>{row.nombre}</td>
                        <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{row.email}</td>
                        <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                          <select
                            value={row.estado_proyecto || 'recepcionado'}
                            disabled={savingRowId === row.id}
                            onChange={(e) => updateRow(row, { estado_proyecto: e.target.value })}
                            style={{
                              ...statusSelectStyle,
                              background: statusOption.bg,
                              color: statusOption.text,
                              borderColor: statusOption.text,
                            }}
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </td>
                        <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                          <select
                            value={row.designado_user_id || ''}
                            disabled={savingRowId === row.id}
                            onChange={(e) => updateRow(row, { designado_user_id: e.target.value ? Number(e.target.value) : null })}
                            style={assignmentSelectStyle}
                          >
                            <option value="">Sin designar</option>
                            {users.map((user) => (
                              <option key={user.id} value={user.id}>{user.nombre}</option>
                            ))}
                          </select>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {assignedUser ? (assignedArea || 'Sin área') : '—'}
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            display: 'inline-block',
                            background: 'var(--bg-light)',
                            border: '1px solid var(--border)',
                            borderRadius: '20px',
                            padding: '2px 10px',
                            fontSize: '12px',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                          }}>
                            {row.form_titulo || '—'}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, color: 'var(--text-muted)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                          {formatDate(row.created_at)}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          {hasViability ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: vs.bg,
                              color: vs.text,
                              borderRadius: '20px',
                              padding: '3px 10px 3px 8px',
                              fontSize: '12px',
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                            }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: vs.dot, flexShrink: 0 }} />
                              {row.score}/100 · {VEREDICTO_LABELS[row.veredicto]}
                            </span>
                          ) : (
                            <span style={{ color: '#ccc', fontSize: '16px' }}>—</span>
                          )}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                            <button
                              onClick={() => setSelectedResponse(row)}
                              title="Ver detalle"
                              style={iconBtnStyle}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                            <button
                              onClick={() => deleteResponse(row.id, row.nombre)}
                              title="Eliminar"
                              style={{ ...iconBtnStyle, color: '#C62828' }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#FFEBEE'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedResponse && (
        selectedResponse.form_titulo ? (
          <ResponseDetailModal response={selectedResponse} onClose={() => setSelectedResponse(null)} token={token} />
        ) : (
          <SubmissionEditModal
            submission={selectedResponse}
            onClose={() => setSelectedResponse(null)}
            onSave={() => { setSelectedResponse(null); onRefresh(); }}
            token={token}
          />
        )
      )}
    </>
  );
}

const labelStyle = {
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  display: 'block',
  marginBottom: '0.4rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.55rem 0.75rem',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  background: 'var(--bg-light)',
  color: 'var(--text-body)',
  fontSize: '13px',
  boxSizing: 'border-box',
  height: '38px',
  outline: 'none',
};

const exportBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '0.5rem 0.9rem',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  background: '#fff',
  color: 'var(--text-body)',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const statusSelectStyle = {
  width: '100%',
  minWidth: '160px',
  padding: '0.45rem 0.65rem',
  borderRadius: '999px',
  border: '1px solid var(--border)',
  fontSize: '12px',
  fontWeight: 700,
  boxSizing: 'border-box',
  outline: 'none',
  fontFamily: 'inherit',
  cursor: 'pointer',
};

const assignmentSelectStyle = {
  width: '100%',
  minWidth: '160px',
  padding: '0.45rem 0.65rem',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  background: 'var(--bg-light)',
  color: 'var(--text-body)',
  fontSize: '12px',
  boxSizing: 'border-box',
  outline: 'none',
  fontFamily: 'inherit',
  cursor: 'pointer',
};

const thStyle = {
  padding: '0.75rem 0.75rem',
  textAlign: 'left',
  fontWeight: 700,
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
  color: 'var(--text-muted)',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '0.85rem 0.75rem',
  verticalAlign: 'middle',
};

const iconBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  border: 'none',
  background: 'transparent',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  transition: 'background 0.12s',
};
