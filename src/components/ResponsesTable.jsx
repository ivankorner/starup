import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import ResponseDetailModal from './ResponseDetailModal';
import SubmissionEditModal from './SubmissionEditModal';
import { exportAllResponsesToXLS } from '../utils/exportXLS';
import { exportAllResponsesToPDF } from '../utils/exportPDF';

const VEREDICTO_LABELS = {
  viable: 'Viable',
  potencial: 'Potencial',
  'no-viable': 'No viable',
};

const VEREDICTO_COLORS = {
  viable: { bg: 'rgba(46,125,50,0.12)', text: '#2E7D32', border: '#2E7D32' },
  potencial: { bg: 'rgba(178,135,4,0.12)', text: '#B28704', border: '#B28704' },
  'no-viable': { bg: 'rgba(198,40,40,0.12)', text: '#C62828', border: '#C62828' },
};

export default function ResponsesTable({ submissions, token, onRefresh, loading }) {
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [formFilter, setFormFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [veredictoFilter, setVeredictoFilter] = useState('');

  const uniqueForms = useMemo(() => {
    const map = new Map();
    submissions.forEach((s) => {
      if (s.form_titulo && !map.has(s.form_id)) {
        map.set(s.form_id, s.form_titulo);
      }
    });
    return Array.from(map.entries()).map(([id, titulo]) => ({ id, titulo }));
  }, [submissions]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return submissions.filter((s) => {
      if (q && !s.nombre?.toLowerCase().includes(q) && !s.email?.toLowerCase().includes(q)) return false;
      if (formFilter && String(s.form_id) !== String(formFilter)) return false;
      if (veredictoFilter) {
        if (veredictoFilter === 'sin-score' && (s.veredicto || s.raw_maximo > 0)) return false;
        if (veredictoFilter !== 'sin-score' && s.veredicto !== veredictoFilter) return false;
      }
      if (dateFrom) {
        const d = new Date(s.created_at);
        const from = new Date(dateFrom);
        from.setHours(0, 0, 0, 0);
        if (d < from) return false;
      }
      if (dateTo) {
        const d = new Date(s.created_at);
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (d > to) return false;
      }
      return true;
    });
  }, [submissions, search, formFilter, veredictoFilter, dateFrom, dateTo]);

  const hasActiveFilters = search || formFilter || veredictoFilter || dateFrom || dateTo;

  const clearFilters = () => {
    setSearch('');
    setFormFilter('');
    setVeredictoFilter('');
    setDateFrom('');
    setDateTo('');
  };

  const formatDate = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
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

  const handleExportXLS = async () => {
    setExporting(true);
    try {
      const toExport = await Promise.all(
        filtered.map(async (r) => {
          if (r.fields) return r;
          const res = await fetch(`/api/form_responses.php?id=${r.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return res.ok ? res.json() : r;
        })
      );
      exportAllResponsesToXLS(toExport);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const toExport = await Promise.all(
        filtered.map(async (r) => {
          if (r.fields) return r;
          const res = await fetch(`/api/form_responses.php?id=${r.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return res.ok ? res.json() : r;
        })
      );
      await exportAllResponsesToPDF(toExport);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Filter bar */}
        <div style={{
          background: 'var(--bg-light)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'flex-end',
        }}>
          {/* Search */}
          <div style={{ flex: '1 1 220px', minWidth: 0 }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Form selector */}
          <div style={{ flex: '1 1 180px', minWidth: 0 }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>
              Formulario
            </label>
            <select
              value={formFilter}
              onChange={(e) => setFormFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Todos los formularios</option>
              {uniqueForms.map((f) => (
                <option key={f.id} value={f.id}>{f.titulo}</option>
              ))}
            </select>
          </div>

          {/* Date from */}
          <div style={{ flex: '0 1 150px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>
              Desde
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Date to */}
          <div style={{ flex: '0 1 150px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>
              Hasta
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Veredicto filter */}
          <div style={{ flex: '0 1 160px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>
              Veredicto
            </label>
            <select
              value={veredictoFilter}
              onChange={(e) => setVeredictoFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '13px',
                boxSizing: 'border-box',
              }}
            >
              <option value="">Todos</option>
              <option value="viable">Viable</option>
              <option value="potencial">Potencial</option>
              <option value="no-viable">No viable</option>
              <option value="sin-score">Sin score</option>
            </select>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-muted)',
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                alignSelf: 'flex-end',
              }}
            >
              ✕ Limpiar
            </button>
          )}
        </div>

        {/* Toolbar: count + export */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            {loading ? 'Cargando...' : (
              hasActiveFilters
                ? `${filtered.length} de ${submissions.length} respuestas`
                : `${submissions.length} respuesta${submissions.length !== 1 ? 's' : ''}`
            )}
          </p>
          {filtered.length > 0 && !loading && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="button button-secondary"
                onClick={handleExportXLS}
                disabled={exporting}
                style={{ fontSize: '13px', padding: '0.45rem 0.9rem' }}
              >
                {exporting ? 'Exportando...' : '📊 Exportar XLS'}
              </button>
              <button
                className="button button-secondary"
                onClick={handleExportPDF}
                disabled={exporting}
                style={{ fontSize: '13px', padding: '0.45rem 0.9rem' }}
              >
                {exporting ? 'Exportando...' : '📄 Exportar PDF'}
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Cargando...</p>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: 'var(--text-muted)',
            background: 'var(--bg-light)',
            borderRadius: '12px',
          }}>
            {hasActiveFilters ? 'Sin resultados para los filtros aplicados.' : 'No hay respuestas aún.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13px',
              minWidth: '700px',
            }}>
              <thead>
                <tr style={{ background: 'var(--bg-light)', borderBottom: '2px solid var(--border)' }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Nombre</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Formulario</th>
                  <th style={thStyle}>Fecha</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Score</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => {
                  const hasViability = row.veredicto && row.raw_maximo > 0;
                  const vc = hasViability ? VEREDICTO_COLORS[row.veredicto] : null;
                  return (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-light)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      onClick={() => setSelectedResponse(row)}
                    >
                      <td style={{ ...tdStyle, color: 'var(--text-muted)', width: '40px' }}>{idx + 1}</td>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{row.nombre}</td>
                      <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{row.email}</td>
                      <td style={tdStyle}>
                        <span style={{
                          background: 'var(--bg-light)',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          padding: '2px 8px',
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                        }}>
                          {row.form_titulo || '—'}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{formatDate(row.created_at)}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        {hasViability ? (
                          <span style={{
                            display: 'inline-flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1px',
                            background: vc.bg,
                            color: vc.text,
                            border: `1px solid ${vc.border}`,
                            borderRadius: '8px',
                            padding: '3px 10px',
                            fontSize: '12px',
                            fontWeight: 700,
                            lineHeight: 1.3,
                          }}>
                            <span>{row.score}/100</span>
                            <span style={{ fontSize: '10px', fontWeight: 500 }}>{VEREDICTO_LABELS[row.veredicto]}</span>
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>—</span>
                        )}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button
                            className="button button-text"
                            onClick={() => setSelectedResponse(row)}
                            style={{ fontSize: '12px', padding: '0.3rem 0.6rem' }}
                          >
                            Ver
                          </button>
                          <button
                            className="button button-text"
                            onClick={() => deleteResponse(row.id, row.nombre)}
                            style={{ fontSize: '12px', padding: '0.3rem 0.6rem', color: '#d32f2f' }}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedResponse && (
        selectedResponse.form_titulo ? (
          <ResponseDetailModal
            response={selectedResponse}
            onClose={() => setSelectedResponse(null)}
            token={token}
          />
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

const thStyle = {
  padding: '0.75rem 1rem',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: 'var(--text-muted)',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '0.75rem 1rem',
  verticalAlign: 'middle',
};
