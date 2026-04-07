// Icon library for Card-3 field type
// Each icon has: render function + search tags for filtering

const S = (size, children) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const iconDefs = {
  // ── Technology ──
  smartphone: {
    tags: 'celular telefono movil mobile phone dispositivo',
    render: (s) => S(s, <><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>),
  },
  tablet: {
    tags: 'tablet ipad dispositivo',
    render: (s) => S(s, <><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>),
  },
  monitor: {
    tags: 'pantalla computadora desktop screen pc',
    render: (s) => S(s, <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>),
  },
  laptop: {
    tags: 'notebook portatil computadora',
    render: (s) => S(s, <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />),
  },
  tv: {
    tags: 'television pantalla media',
    render: (s) => S(s, <><rect x="2" y="7" width="20" height="15" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" /></>),
  },
  wifi: {
    tags: 'internet conexion red wireless signal',
    render: (s) => S(s, <><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></>),
  },
  bluetooth: {
    tags: 'conexion wireless',
    render: (s) => S(s, <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />),
  },
  cpu: {
    tags: 'procesador chip hardware tecnologia',
    render: (s) => S(s, <><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></>),
  },
  server: {
    tags: 'servidor hosting backend infraestructura',
    render: (s) => S(s, <><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></>),
  },
  'hard-drive': {
    tags: 'disco almacenamiento storage',
    render: (s) => S(s, <><line x1="22" y1="12" x2="2" y2="12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /><line x1="6" y1="16" x2="6.01" y2="16" /><line x1="10" y1="16" x2="10.01" y2="16" /></>),
  },
  printer: {
    tags: 'impresora imprimir documento',
    render: (s) => S(s, <><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></>),
  },
  camera: {
    tags: 'camara foto fotografia imagen',
    render: (s) => S(s, <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>),
  },
  video: {
    tags: 'camara video grabar film',
    render: (s) => S(s, <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></>),
  },
  mic: {
    tags: 'microfono audio voz sonido grabar',
    render: (s) => S(s, <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>),
  },
  headphones: {
    tags: 'auriculares audio musica escuchar',
    render: (s) => S(s, <><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></>),
  },
  speaker: {
    tags: 'parlante altavoz audio sonido volumen',
    render: (s) => S(s, <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></>),
  },
  battery: {
    tags: 'bateria energia carga power',
    render: (s) => S(s, <><rect x="1" y="6" width="18" height="12" rx="2" ry="2" /><line x1="23" y1="13" x2="23" y2="11" /></>),
  },
  power: {
    tags: 'encendido apagado boton on off',
    render: (s) => S(s, <><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></>),
  },
  refresh: {
    tags: 'actualizar recargar sincronizar reload sync',
    render: (s) => S(s, <><path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /></>),
  },
  code: {
    tags: 'codigo programacion desarrollo developer',
    render: (s) => S(s, <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>),
  },
  terminal: {
    tags: 'consola comando cli shell',
    render: (s) => S(s, <><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></>),
  },
  git: {
    tags: 'git branch version control',
    render: (s) => S(s, <><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><line x1="6" y1="9" x2="6" y2="21" /></>),
  },
  qrcode: {
    tags: 'qr codigo escanear scan',
    render: (s) => S(s, <><rect x="2" y="2" width="8" height="8" rx="1" /><rect x="14" y="2" width="8" height="8" rx="1" /><rect x="2" y="14" width="8" height="8" rx="1" /><rect x="14" y="14" width="4" height="4" /><line x1="22" y1="18" x2="22" y2="22" /><line x1="18" y1="22" x2="22" y2="22" /></>),
  },

  // ── Business & Finance ──
  clipboard: {
    tags: 'portapapeles formulario registro nota',
    render: (s) => S(s, <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="16" y2="14" /><line x1="8" y1="18" x2="12" y2="18" /></>),
  },
  'file-text': {
    tags: 'archivo documento texto paper',
    render: (s) => S(s, <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>),
  },
  folder: {
    tags: 'carpeta directorio archivos',
    render: (s) => S(s, <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />),
  },
  archive: {
    tags: 'archivo guardar almacenar caja',
    render: (s) => S(s, <><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></>),
  },
  chart: {
    tags: 'grafico pulso linea estadistica actividad',
    render: (s) => S(s, <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />),
  },
  'bar-chart': {
    tags: 'grafico barras estadistica reporte',
    render: (s) => S(s, <><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>),
  },
  'pie-chart': {
    tags: 'grafico torta circular estadistica porcentaje',
    render: (s) => S(s, <><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></>),
  },
  'trending-up': {
    tags: 'tendencia subir crecimiento positivo flecha',
    render: (s) => S(s, <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>),
  },
  'trending-down': {
    tags: 'tendencia bajar caida negativo flecha',
    render: (s) => S(s, <><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></>),
  },
  briefcase: {
    tags: 'maletin trabajo negocio empresa corporativo',
    render: (s) => S(s, <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>),
  },
  dollar: {
    tags: 'dinero moneda plata economia finanzas peso',
    render: (s) => S(s, <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>),
  },
  'credit-card': {
    tags: 'tarjeta credito debito pago banco',
    render: (s) => S(s, <><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></>),
  },
  shopping: {
    tags: 'carrito compras tienda ecommerce',
    render: (s) => S(s, <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>),
  },
  bag: {
    tags: 'bolsa compras tienda shopping',
    render: (s) => S(s, <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></>),
  },
  store: {
    tags: 'tienda local comercio negocio',
    render: (s) => S(s, <><path d="M3 9l1-4h16l1 4" /><path d="M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9" /><path d="M9 21V13h6v8" /><path d="M3 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" /></>),
  },
  receipt: {
    tags: 'recibo factura ticket comprobante',
    render: (s) => S(s, <><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" /><line x1="8" y1="7" x2="16" y2="7" /><line x1="8" y1="11" x2="16" y2="11" /><line x1="8" y1="15" x2="12" y2="15" /></>),
  },
  award: {
    tags: 'premio medalla trofeo logro reconocimiento',
    render: (s) => S(s, <><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></>),
  },
  gift: {
    tags: 'regalo presente obsequio sorpresa',
    render: (s) => S(s, <><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></>),
  },

  // ── Communication ──
  share: {
    tags: 'compartir red social network',
    render: (s) => S(s, <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>),
  },
  mail: {
    tags: 'correo email carta sobre mensaje',
    render: (s) => S(s, <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>),
  },
  inbox: {
    tags: 'bandeja entrada correo recibido',
    render: (s) => S(s, <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>),
  },
  send: {
    tags: 'enviar mandar avion paper plane',
    render: (s) => S(s, <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>),
  },
  message: {
    tags: 'mensaje chat burbuja comentario conversacion',
    render: (s) => S(s, <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />),
  },
  'message-circle': {
    tags: 'mensaje chat burbuja circular comentario',
    render: (s) => S(s, <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />),
  },
  phone: {
    tags: 'telefono llamar comunicacion contacto',
    render: (s) => S(s, <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />),
  },
  globe: {
    tags: 'mundo tierra global internacional web internet',
    render: (s) => S(s, <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>),
  },
  radio: {
    tags: 'radio señal broadcast transmision antena',
    render: (s) => S(s, <><circle cx="12" cy="12" r="2" /><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" /></>),
  },
  rss: {
    tags: 'feed noticias suscripcion',
    render: (s) => S(s, <><path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" /></>),
  },
  bell: {
    tags: 'campana notificacion alerta aviso',
    render: (s) => S(s, <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>),
  },
  megaphone: {
    tags: 'megafono anuncio publicidad marketing altavoz',
    render: (s) => S(s, <><path d="M3 11l18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>),
  },

  // ── Actions & UI ──
  lightning: {
    tags: 'rayo energia rapido automatizar electrico',
    render: (s) => S(s, <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />),
  },
  gear: {
    tags: 'configuracion ajustes settings engranaje opciones',
    render: (s) => S(s, <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></>),
  },
  sliders: {
    tags: 'ajustes filtros controles configuracion',
    render: (s) => S(s, <><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></>),
  },
  search: {
    tags: 'buscar lupa encontrar explorar',
    render: (s) => S(s, <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>),
  },
  filter: {
    tags: 'filtro embudo ordenar clasificar',
    render: (s) => S(s, <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />),
  },
  edit: {
    tags: 'editar modificar escribir lapiz',
    render: (s) => S(s, <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>),
  },
  trash: {
    tags: 'basura eliminar borrar papelera',
    render: (s) => S(s, <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>),
  },
  plus: {
    tags: 'agregar nuevo mas crear sumar',
    render: (s) => S(s, <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>),
  },
  'plus-circle': {
    tags: 'agregar nuevo circulo crear',
    render: (s) => S(s, <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></>),
  },
  minus: {
    tags: 'quitar restar menos reducir',
    render: (s) => S(s, <line x1="5" y1="12" x2="19" y2="12" />),
  },
  x: {
    tags: 'cerrar cancelar eliminar equis',
    render: (s) => S(s, <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>),
  },
  check: {
    tags: 'verificar correcto listo ok confirmar aprobado',
    render: (s) => S(s, <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>),
  },
  'check-square': {
    tags: 'verificar cuadrado checkbox tarea completada',
    render: (s) => S(s, <><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>),
  },
  download: {
    tags: 'descargar bajar obtener flecha',
    render: (s) => S(s, <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>),
  },
  upload: {
    tags: 'subir cargar enviar flecha',
    render: (s) => S(s, <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>),
  },
  'external-link': {
    tags: 'enlace externo abrir nueva ventana link',
    render: (s) => S(s, <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></>),
  },
  copy: {
    tags: 'copiar duplicar clonar',
    render: (s) => S(s, <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>),
  },
  scissors: {
    tags: 'cortar tijeras recortar',
    render: (s) => S(s, <><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></>),
  },
  save: {
    tags: 'guardar salvar disco floppy',
    render: (s) => S(s, <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></>),
  },
  maximize: {
    tags: 'maximizar expandir agrandar pantalla completa',
    render: (s) => S(s, <><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></>),
  },
  minimize: {
    tags: 'minimizar reducir achicar',
    render: (s) => S(s, <><polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" /></>),
  },
  'zoom-in': {
    tags: 'ampliar acercar zoom mas',
    render: (s) => S(s, <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></>),
  },
  'zoom-out': {
    tags: 'reducir alejar zoom menos',
    render: (s) => S(s, <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></>),
  },
  eye: {
    tags: 'ver mirar ojo visible mostrar',
    render: (s) => S(s, <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>),
  },
  'eye-off': {
    tags: 'ocultar esconder invisible privado',
    render: (s) => S(s, <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>),
  },

  // ── People & Social ──
  users: {
    tags: 'personas grupo equipo comunidad gente',
    render: (s) => S(s, <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
  },
  user: {
    tags: 'persona perfil cuenta avatar individual',
    render: (s) => S(s, <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>),
  },
  'user-plus': {
    tags: 'agregar usuario nuevo miembro registrar',
    render: (s) => S(s, <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></>),
  },
  'user-check': {
    tags: 'verificar usuario aprobado confirmado',
    render: (s) => S(s, <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></>),
  },
  smile: {
    tags: 'sonrisa feliz emoji cara contento',
    render: (s) => S(s, <><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></>),
  },
  frown: {
    tags: 'triste infeliz emoji cara descontento',
    render: (s) => S(s, <><circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></>),
  },
  'thumbs-up': {
    tags: 'pulgar arriba me gusta like aprobar bien',
    render: (s) => S(s, <><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></>),
  },
  'thumbs-down': {
    tags: 'pulgar abajo no me gusta dislike desaprobar',
    render: (s) => S(s, <><path d="M10 15V19a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" /><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></>),
  },

  // ── Symbols & Status ──
  heart: {
    tags: 'corazon amor favorito salud vida',
    render: (s) => S(s, <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />),
  },
  star: {
    tags: 'estrella favorito calificacion rating importante',
    render: (s) => S(s, <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />),
  },
  clock: {
    tags: 'reloj tiempo hora horario cronometro',
    render: (s) => S(s, <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>),
  },
  calendar: {
    tags: 'calendario fecha evento agenda planificar',
    render: (s) => S(s, <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>),
  },
  lock: {
    tags: 'candado seguridad privado proteger cerrar',
    render: (s) => S(s, <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>),
  },
  unlock: {
    tags: 'desbloquear abrir libre acceso',
    render: (s) => S(s, <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></>),
  },
  key: {
    tags: 'llave acceso contraseña seguridad',
    render: (s) => S(s, <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></>),
  },
  target: {
    tags: 'objetivo meta diana punteria foco',
    render: (s) => S(s, <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>),
  },
  crosshair: {
    tags: 'mira apuntar objetivo precision',
    render: (s) => S(s, <><circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" /></>),
  },
  flag: {
    tags: 'bandera marcar señalar reporte',
    render: (s) => S(s, <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>),
  },
  bookmark: {
    tags: 'marcador guardar favorito señalador',
    render: (s) => S(s, <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />),
  },
  tag: {
    tags: 'etiqueta label categoria precio',
    render: (s) => S(s, <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></>),
  },
  hash: {
    tags: 'hashtag numero numeral etiqueta canal',
    render: (s) => S(s, <><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></>),
  },
  'at-sign': {
    tags: 'arroba email correo mencion',
    render: (s) => S(s, <><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" /></>),
  },
  info: {
    tags: 'informacion ayuda detalle about',
    render: (s) => S(s, <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>),
  },
  'help-circle': {
    tags: 'ayuda pregunta soporte duda',
    render: (s) => S(s, <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>),
  },
  'alert-triangle': {
    tags: 'alerta advertencia peligro warning cuidado',
    render: (s) => S(s, <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>),
  },
  'alert-circle': {
    tags: 'alerta error exclamacion importante',
    render: (s) => S(s, <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>),
  },

  // ── Ideas & Innovation ──
  rocket: {
    tags: 'cohete startup lanzar innovacion despegar',
    render: (s) => S(s, <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></>),
  },
  bulb: {
    tags: 'foco idea bombilla luz inspiracion creatividad',
    render: (s) => S(s, <><line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" /></>),
  },
  compass: {
    tags: 'brujula direccion navegar orientacion exploracion',
    render: (s) => S(s, <><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></>),
  },
  anchor: {
    tags: 'ancla puerto estabilidad base',
    render: (s) => S(s, <><circle cx="12" cy="5" r="3" /><line x1="12" y1="22" x2="12" y2="8" /><path d="M5 12H2a10 10 0 0 0 20 0h-3" /></>),
  },
  zap: {
    tags: 'rayo rapido energia velocidad instantaneo',
    render: (s) => S(s, <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />),
  },
  flame: {
    tags: 'fuego llama caliente popular trending hot',
    render: (s) => S(s, <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />),
  },
  feather: {
    tags: 'pluma escribir ligero creativo',
    render: (s) => S(s, <><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><line x1="16" y1="8" x2="2" y2="22" /><line x1="17.5" y1="15" x2="9" y2="15" /></>),
  },

  // ── Nature & Environment ──
  sun: {
    tags: 'sol dia claro luz brillante',
    render: (s) => S(s, <><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></>),
  },
  moon: {
    tags: 'luna noche oscuro dormir',
    render: (s) => S(s, <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />),
  },
  cloud: {
    tags: 'nube cielo clima almacenamiento',
    render: (s) => S(s, <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />),
  },
  'cloud-rain': {
    tags: 'lluvia clima agua nube',
    render: (s) => S(s, <><line x1="16" y1="13" x2="16" y2="21" /><line x1="8" y1="13" x2="8" y2="21" /><line x1="12" y1="15" x2="12" y2="23" /><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" /></>),
  },
  snowflake: {
    tags: 'nieve frio invierno hielo cristal',
    render: (s) => S(s, <><line x1="12" y1="2" x2="12" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /><line x1="19.07" y1="4.93" x2="4.93" y2="19.07" /></>),
  },
  wind: {
    tags: 'viento aire brisa clima',
    render: (s) => S(s, <><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" /></>),
  },
  droplet: {
    tags: 'gota agua liquido lluvia hidratacion',
    render: (s) => S(s, <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />),
  },
  tree: {
    tags: 'arbol naturaleza bosque planta ecologia',
    render: (s) => S(s, <><path d="M12 22v-7" /><path d="M5.5 12H2l5-6-1.5-2H12l-1.5 2L16 12h-3.5" /><path d="M8 17h8" /></>),
  },
  leaf: {
    tags: 'hoja planta natural ecologico verde bio',
    render: (s) => S(s, <><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></>),
  },
  mountain: {
    tags: 'montaña paisaje naturaleza terreno',
    render: (s) => S(s, <><path d="M8 3l4 8 5-5 5 15H2z" /></>),
  },

  // ── Places & Transport ──
  home: {
    tags: 'casa hogar inicio principal residencia',
    render: (s) => S(s, <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>),
  },
  building: {
    tags: 'edificio oficina empresa ciudad corporativo',
    render: (s) => S(s, <><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="9" y1="6" x2="9.01" y2="6" /><line x1="15" y1="6" x2="15.01" y2="6" /><line x1="9" y1="10" x2="9.01" y2="10" /><line x1="15" y1="10" x2="15.01" y2="10" /><line x1="9" y1="14" x2="9.01" y2="14" /><line x1="15" y1="14" x2="15.01" y2="14" /><path d="M9 22v-4h6v4" /></>),
  },
  map: {
    tags: 'mapa ubicacion ruta direccion',
    render: (s) => S(s, <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></>),
  },
  'map-pin': {
    tags: 'ubicacion punto marcador lugar direccion gps',
    render: (s) => S(s, <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>),
  },
  navigation: {
    tags: 'navegacion gps direccion flecha brujula',
    render: (s) => S(s, <polygon points="3 11 22 2 13 21 11 13 3 11" />),
  },
  truck: {
    tags: 'camion envio delivery transporte logistica',
    render: (s) => S(s, <><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>),
  },
  car: {
    tags: 'auto coche vehiculo transporte manejar',
    render: (s) => S(s, <><path d="M5 17h14v-5l-2-6H7l-2 6v5z" /><circle cx="7.5" cy="17.5" r="1.5" /><circle cx="16.5" cy="17.5" r="1.5" /><path d="M3 17h2m14 0h2" /></>),
  },
  plane: {
    tags: 'avion vuelo viajar aeropuerto transporte aereo',
    render: (s) => S(s, <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />),
  },
  ship: {
    tags: 'barco navegar maritimo puerto transporte',
    render: (s) => S(s, <><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" /><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" /><line x1="12" y1="1" x2="12" y2="4" /></>),
  },
  'coffee': {
    tags: 'cafe taza bebida descanso break reunion',
    render: (s) => S(s, <><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></>),
  },

  // ── Data & Infrastructure ──
  database: {
    tags: 'base datos almacenamiento servidor mysql',
    render: (s) => S(s, <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></>),
  },
  layers: {
    tags: 'capas niveles stack apilar design',
    render: (s) => S(s, <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>),
  },
  link: {
    tags: 'enlace vincular cadena url conexion',
    render: (s) => S(s, <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>),
  },
  shield: {
    tags: 'escudo proteccion seguridad defensa',
    render: (s) => S(s, <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />),
  },
  'shield-check': {
    tags: 'escudo verificado seguro protegido aprobado',
    render: (s) => S(s, <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></>),
  },
  activity: {
    tags: 'actividad pulso monitor salud ecg frecuencia',
    render: (s) => S(s, <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />),
  },
  toggle: {
    tags: 'interruptor switch on off activar',
    render: (s) => S(s, <><rect x="1" y="5" width="22" height="14" rx="7" ry="7" /><circle cx="16" cy="12" r="3" /></>),
  },

  // ── Education & Science ──
  book: {
    tags: 'libro leer lectura educacion conocimiento',
    render: (s) => S(s, <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>),
  },
  'book-open': {
    tags: 'libro abierto leer educacion estudio',
    render: (s) => S(s, <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>),
  },
  graduation: {
    tags: 'graduacion educacion universidad estudio titulo diploma',
    render: (s) => S(s, <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>),
  },
  beaker: {
    tags: 'laboratorio ciencia quimica experimento investigacion',
    render: (s) => S(s, <><path d="M4.5 3h15" /><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" /><path d="M6 14h12" /></>),
  },
  atom: {
    tags: 'atomo ciencia quimica fisica nuclear',
    render: (s) => S(s, <><circle cx="12" cy="12" r="1" /><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5z" /><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5z" /></>),
  },
  puzzle: {
    tags: 'rompecabezas pieza plugin extension integracion',
    render: (s) => S(s, <><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.315 8.685a.98.98 0 0 1 .837-.276c.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.979.979 0 0 1 .276-.837l1.61-1.61a2.404 2.404 0 0 1 1.705-.707c.618 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02z" /></>),
  },

  // ── Food & Health ──
  apple: {
    tags: 'manzana fruta comida salud nutricion',
    render: (s) => S(s, <><path d="M12 2c1 0 3 1 3 3-2 0-3.5 1-3.5 1S10 5 8 5c0-2 2.5-3 4-3z" /><path d="M12 6C7 6 3 10 3 15s4 7 9 7 9-2 9-7-4-9-9-9z" /></>),
  },
  'heart-pulse': {
    tags: 'salud medico cardiaco latido corazon pulso',
    render: (s) => S(s, <><path d="M19.5 12.572l-7.5 7.428l-7.5-7.428A5 5 0 0 1 12 6.006a5 5 0 0 1 7.5 6.572" /><path d="M4 12h4l1-2 2 4 1-2h4" /></>),
  },
  stethoscope: {
    tags: 'estetoscopio medico doctor salud hospital',
    render: (s) => S(s, <><path d="M4.8 2.62L3 5H1v2h2.2l1-1.5" /><path d="M19.2 2.62L21 5h2v2h-2.2l-1-1.5" /><path d="M5 7c0 3 2 5 7 5s7-2 7-5" /><circle cx="17" cy="17" r="3" /><path d="M12 12v4a5 5 0 0 0 5 5" /></>),
  },

  // ── Design & Media ──
  palette: {
    tags: 'paleta colores diseño arte pintura',
    render: (s) => S(s, <><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" /><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" /><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" /><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></>),
  },
  image: {
    tags: 'imagen foto fotografia picture galeria',
    render: (s) => S(s, <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>),
  },
  music: {
    tags: 'musica cancion audio melodia nota',
    render: (s) => S(s, <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>),
  },
  film: {
    tags: 'pelicula cine video cinema',
    render: (s) => S(s, <><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /></>),
  },
  'pen-tool': {
    tags: 'pluma herramienta diseño dibujar vectores',
    render: (s) => S(s, <><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></>),
  },
  type: {
    tags: 'texto tipografia fuente letra escritura',
    render: (s) => S(s, <><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></>),
  },
  crop: {
    tags: 'recortar cortar imagen ajustar',
    render: (s) => S(s, <><path d="M6.13 1L6 16a2 2 0 0 0 2 2h15" /><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15" /></>),
  },
  grid: {
    tags: 'cuadricula mosaico layout tabla galeria',
    render: (s) => S(s, <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>),
  },
  layout: {
    tags: 'diseño estructura pagina web template',
    render: (s) => S(s, <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></>),
  },

  // ── Arrows & Movement ──
  'arrow-up': {
    tags: 'flecha arriba subir norte',
    render: (s) => S(s, <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>),
  },
  'arrow-down': {
    tags: 'flecha abajo bajar sur',
    render: (s) => S(s, <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>),
  },
  'arrow-left': {
    tags: 'flecha izquierda volver atras',
    render: (s) => S(s, <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>),
  },
  'arrow-right': {
    tags: 'flecha derecha siguiente adelante',
    render: (s) => S(s, <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>),
  },
  'rotate-cw': {
    tags: 'rotar girar derecha clockwise',
    render: (s) => S(s, <><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></>),
  },
  'rotate-ccw': {
    tags: 'rotar girar izquierda counter',
    render: (s) => S(s, <><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></>),
  },
  repeat: {
    tags: 'repetir loop ciclo bucle',
    render: (s) => S(s, <><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></>),
  },
  shuffle: {
    tags: 'mezclar aleatorio random reordenar',
    render: (s) => S(s, <><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></>),
  },

  // ── Misc ──
  'pencil-ruler': {
    tags: 'herramientas dibujar medir construir diseñar',
    render: (s) => S(s, <><path d="M3 21l9-9" /><path d="M12.22 6.94l2.83-2.83a2 2 0 0 1 2.83 0l1.41 1.41a2 2 0 0 1 0 2.83l-2.83 2.83" /><path d="M7.07 16.93l2.83-2.83" /><path d="M21 3l-9 9" /></>),
  },
  wrench: {
    tags: 'llave herramienta reparar arreglar',
    render: (s) => S(s, <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />),
  },
  hammer: {
    tags: 'martillo herramienta construir trabajo',
    render: (s) => S(s, <><path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9" /><path d="M17.64 15L22 10.64" /><path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25V6.5L14.5 4.5 9.33 2l.39 3.36a2.5 2.5 0 0 0 1.2 1.78l.57.37h0L9 10" /></>),
  },
  box: {
    tags: 'caja paquete envio producto contenedor',
    render: (s) => S(s, <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>),
  },
  package: {
    tags: 'paquete envio entrega delivery producto',
    render: (s) => S(s, <><line x1="16.5" y1="9.4" x2="7.55" y2="4.24" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>),
  },
  crown: {
    tags: 'corona rey premium vip premium lider',
    render: (s) => S(s, <><path d="M2 4l3 12h14l3-12-5 4-5-6-5 6z" /><line x1="2" y1="21" x2="22" y2="21" /></>),
  },
  trophy: {
    tags: 'trofeo premio ganador campeon victoria',
    render: (s) => S(s, <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2z" /></>),
  },
  fingerprint: {
    tags: 'huella biometrico identidad seguridad acceso',
    render: (s) => S(s, <><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" /><path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" /><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" /><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" /><path d="M8.65 22c.21-.66.45-1.32.57-2" /><path d="M14 13.12c0 2.38 0 6.38-1 8.88" /><path d="M2 16h.01" /><path d="M21.8 16c.2-2 .131-5.354 0-6" /><path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" /></>),
  },
  infinity: {
    tags: 'infinito ilimitado continuo sin fin',
    render: (s) => S(s, <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />),
  },
  sparkles: {
    tags: 'brillos estrellas magia ia inteligencia artificial',
    render: (s) => S(s, <><path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></>),
  },
  wand: {
    tags: 'varita magia automatico herramienta',
    render: (s) => S(s, <><path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9h2" /><path d="M20 9h2" /><path d="M17.8 11.8L19 13" /><path d="M15 9h0" /><path d="M17.8 6.2L19 5" /><path d="M3 21l9-9" /><path d="M12.2 6.2L11 5" /></>),
  },

  // ── Sports & Fitness ──
  dumbbell: {
    tags: 'pesas gimnasio fitness ejercicio fuerza',
    render: (s) => S(s, <><path d="M6.5 6.5h11" /><path d="M6.5 17.5h11" /><path d="M6 2v4" /><path d="M18 2v4" /><path d="M6 18v4" /><path d="M18 18v4" /><rect x="2" y="4" width="4" height="16" rx="1" /><rect x="18" y="4" width="4" height="16" rx="1" /></>),
  },
  'medal': {
    tags: 'medalla premio deporte competencia logro',
    render: (s) => S(s, <><path d="M7.21 15L2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" /><path d="M11 12L5.12 2.2" /><path d="M13 12l5.88-9.8" /><path d="M8 7h8" /><circle cx="12" cy="17" r="5" /><path d="M12 18v-2h-.5" /></>),
  },
  timer: {
    tags: 'cronometro tiempo deporte velocidad',
    render: (s) => S(s, <><line x1="10" y1="2" x2="14" y2="2" /><line x1="12" y1="14" x2="12" y2="8" /><circle cx="12" cy="14" r="8" /></>),
  },
  running: {
    tags: 'correr persona deporte atletismo actividad',
    render: (s) => S(s, <><circle cx="17" cy="4" r="2" /><path d="M15.6 7.5L12 14l-3-3-4 4" /><path d="M3.5 21.5l4-4 3 3 5-8.5" /><path d="M19 14l2 4h-4" /></>),
  },
  bicycle: {
    tags: 'bicicleta ciclismo deporte transporte ecologico',
    render: (s) => S(s, <><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" /></>),
  },

  // ── Animals ──
  cat: {
    tags: 'gato mascota animal felino',
    render: (s) => S(s, <><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-3.42 7.94" /><path d="M12 5c-.67 0-1.35.09-2 .26C8.22 3.26 4.97 2.42 3.58 3c-1.4.58.42 7 3.42 7.94" /><path d="M8 14v.5" /><path d="M16 14v.5" /><path d="M11.25 16.25h1.5L12 17l-.75-.75z" /><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309" /></>),
  },
  dog: {
    tags: 'perro mascota animal canino',
    render: (s) => S(s, <><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" /><path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" /><path d="M8 14v.5" /><path d="M16 14v.5" /><path d="M11.25 16.25h1.5L12 17l-.75-.75z" /><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309" /></>),
  },
  fish: {
    tags: 'pez pescado animal acuatico marino oceano',
    render: (s) => S(s, <><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6-3.56 0-7.56-2.53-8.5-6z" /><path d="M18 12v.5" /><path d="M16 17.93a9.77 9.77 0 0 1 0-11.86" /><path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5 .23 6.5C6.09 18.03 7 16 7 13.33" /></>),
  },
  bird: {
    tags: 'pajaro ave animal vuelo naturaleza',
    render: (s) => S(s, <><path d="M16 7h.01" /><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" /><path d="M20 7l2 .5-2 .5" /><path d="M10 18v3" /><path d="M14 17.75V21" /><path d="M7 18a6 6 0 0 0 3.84-10.61" /></>),
  },
  bug: {
    tags: 'insecto bicho error debug programacion',
    render: (s) => S(s, <><rect x="8" y="6" width="8" height="14" rx="4" /><path d="M2 10h4" /><path d="M18 10h4" /><path d="M2 14h4" /><path d="M18 14h4" /><path d="M2 18h4" /><path d="M18 18h4" /><path d="M10 2l1 4" /><path d="M14 2l-1 4" /><path d="M12 10v4" /></>),
  },

  // ── Food & Drinks ──
  pizza: {
    tags: 'pizza comida rapida alimento restaurante',
    render: (s) => S(s, <><path d="M15 11h.01" /><path d="M11 15h.01" /><path d="M16 16h.01" /><path d="M2 16l20 6-6-20A20 20 0 0 0 2 16" /><path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4" /></>),
  },
  wine: {
    tags: 'vino copa bebida alcohol celebracion brindis',
    render: (s) => S(s, <><path d="M8 22h8" /><path d="M7 10h10" /><path d="M12 15v7" /><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5z" /></>),
  },
  cake: {
    tags: 'pastel torta cumpleaños fiesta celebracion',
    render: (s) => S(s, <><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" /><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" /><path d="M2 21h20" /><path d="M7 8v2" /><path d="M12 8v2" /><path d="M17 8v2" /><path d="M7 4h0.01" /><path d="M12 4h0.01" /><path d="M17 4h0.01" /></>),
  },
  utensils: {
    tags: 'cubiertos cuchillo tenedor restaurante comer',
    render: (s) => S(s, <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" /></>),
  },
  egg: {
    tags: 'huevo comida desayuno alimento cocina',
    render: (s) => S(s, <path d="M12 22c6.23-.05 7.87-5.57 7.5-10-.36-4.34-3.95-9.96-7.5-10-3.55.04-7.14 5.66-7.5 10-.37 4.43 1.27 9.95 7.5 10z" />),
  },
  cherry: {
    tags: 'cereza fruta dulce postre',
    render: (s) => S(s, <><path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3l-5 3z" /><path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3l-5 3z" /><path d="M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.56 9 3 13" /></>),
  },

  // ── Clothing & Fashion ──
  shirt: {
    tags: 'camisa ropa vestir moda prenda',
    render: (s) => S(s, <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />),
  },
  glasses: {
    tags: 'lentes gafas anteojos ver optica',
    render: (s) => S(s, <><circle cx="6" cy="15" r="4" /><circle cx="18" cy="15" r="4" /><path d="M14 15a2 2 0 0 0-4 0" /><path d="M2.5 13L5 7c.7-1.3 1.4-2 3-2" /><path d="M21.5 13L19 7c-.7-1.3-1.4-2-3-2" /></>),
  },
  watch: {
    tags: 'reloj pulsera accesorio tiempo wearable',
    render: (s) => S(s, <><circle cx="12" cy="12" r="6" /><polyline points="12 10 12 12 13 13" /><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83" /></>),
  },

  // ── Weather Extended ──
  thermometer: {
    tags: 'termometro temperatura calor frio clima medicion',
    render: (s) => S(s, <><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></>),
  },
  umbrella: {
    tags: 'paraguas lluvia proteccion clima',
    render: (s) => S(s, <><path d="M22 12a10.06 10.06 0 0 0-20 0Z" /><path d="M12 12v8a2 2 0 0 0 4 0" /><line x1="12" y1="2" x2="12" y2="3" /></>),
  },
  rainbow: {
    tags: 'arcoiris colores clima naturaleza alegria',
    render: (s) => S(s, <><path d="M22 17a10 10 0 0 0-20 0" /><path d="M6 17a6 6 0 0 1 12 0" /><path d="M10 17a2 2 0 0 1 4 0" /></>),
  },
  sunrise: {
    tags: 'amanecer sol mañana inicio dia',
    render: (s) => S(s, <><path d="M12 2v8" /><path d="M4.93 10.93l1.41 1.41" /><path d="M2 18h2" /><path d="M20 18h2" /><path d="M19.07 10.93l-1.41 1.41" /><path d="M22 22H2" /><path d="M8 6l4-4 4 4" /><path d="M16 18a4 4 0 0 0-8 0" /></>),
  },
  sunset: {
    tags: 'atardecer sol tarde fin ocaso',
    render: (s) => S(s, <><path d="M12 10V2" /><path d="M4.93 10.93l1.41 1.41" /><path d="M2 18h2" /><path d="M20 18h2" /><path d="M19.07 10.93l-1.41 1.41" /><path d="M22 22H2" /><path d="M8 6l4 4 4-4" /><path d="M16 18a4 4 0 0 0-8 0" /></>),
  },

  // ── Mathematics & Numbers ──
  percent: {
    tags: 'porcentaje descuento oferta matematica',
    render: (s) => S(s, <><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></>),
  },
  divide: {
    tags: 'dividir division matematica operacion',
    render: (s) => S(s, <><circle cx="12" cy="6" r="1" /><line x1="5" y1="12" x2="19" y2="12" /><circle cx="12" cy="18" r="1" /></>),
  },
  sigma: {
    tags: 'sigma suma total matematica estadistica',
    render: (s) => S(s, <><path d="M18 6H5l5.5 6L5 18h13" /></>),
  },
  'binary': {
    tags: 'binario codigo datos digital computacion',
    render: (s) => S(s, <><rect x="14" y="14" width="4" height="6" rx="2" /><rect x="6" y="4" width="4" height="6" rx="2" /><path d="M6 20h4" /><path d="M14 10h4" /><path d="M6 14h2v6" /><path d="M14 4h2v6" /></>),
  },

  // ── Legal & Documents ──
  scale: {
    tags: 'balanza justicia legal ley derecho equilibrio',
    render: (s) => S(s, <><path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z" /><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z" /><path d="M7 21h10" /><path d="M12 3v18" /><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" /></>),
  },
  stamp: {
    tags: 'sello aprobado oficial certificado validar',
    render: (s) => S(s, <><path d="M5 22h14" /><path d="M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77z" /><path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13" /></>),
  },
  gavel: {
    tags: 'martillo juez legal justicia tribunal',
    render: (s) => S(s, <><path d="M14.5 6.5L18 10l-4 4" /><path d="M6 6l4.5 4.5" /><path d="M10.5 10.5L6 15" /><path d="M2 22l4-4" /><path d="M18 2l4 4-8 8-4-4z" /></>),
  },
  scroll: {
    tags: 'pergamino documento historico certificado diploma',
    render: (s) => S(s, <><path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" /><path d="M19 3H7a2 2 0 0 0-2 2" /><path d="M19 3a2 2 0 0 1 2 2v14" /></>),
  },

  // ── Gestures & Hands ──
  hand: {
    tags: 'mano alto parar stop detener',
    render: (s) => S(s, <><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" /><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" /></>),
  },
  'hand-shake': {
    tags: 'saludo acuerdo trato alianza cooperacion',
    render: (s) => S(s, <><path d="M11 17l-1.75-1.75" /><path d="M14 14l.5.5" /><path d="M19.93 6.75l-1.18-1.18a2 2 0 0 0-1.52-.55l-1.49.12a1 1 0 0 1-.82-.31L13.07 3a2 2 0 0 0-2.83 0L8.43 4.82a1 1 0 0 1-.82.31l-1.49-.12a2 2 0 0 0-1.52.55L3.42 6.75" /><path d="M2 12l5.5-1.5" /><path d="M22 12l-5.5-1.5" /><path d="M3.42 6.75L2 12l5.34 2.67a1 1 0 0 0 1.1-.2L10 13" /><path d="M20.58 6.75L22 12l-5.34 2.67a1 1 0 0 1-1.1-.2l-1.56-1.47" /></>),
  },
  pointer: {
    tags: 'cursor click puntero mouse raton',
    render: (s) => S(s, <><path d="M22 14a8 8 0 0 1-8 8" /><path d="M18 11v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" /><path d="M14 10V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1" /><path d="M10 9.5V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v10" /><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 17" /></>),
  },

  // ── Symbols & Shapes ──
  circle: {
    tags: 'circulo forma redondo shape geometria',
    render: (s) => S(s, <circle cx="12" cy="12" r="10" />),
  },
  square: {
    tags: 'cuadrado forma shape geometria rectangulo',
    render: (s) => S(s, <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />),
  },
  triangle: {
    tags: 'triangulo forma shape geometria',
    render: (s) => S(s, <path d="M10.5 1.5L1 21h21z" />),
  },
  hexagon: {
    tags: 'hexagono forma shape geometria',
    render: (s) => S(s, <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />),
  },
  octagon: {
    tags: 'octagono forma shape geometria stop parar',
    render: (s) => S(s, <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />),
  },
  diamond: {
    tags: 'diamante rombo joya premium lujo',
    render: (s) => S(s, <><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0z" /></>),
  },

  // ── Accessibility ──
  accessibility: {
    tags: 'accesibilidad discapacidad inclusivo universal',
    render: (s) => S(s, <><circle cx="16" cy="4" r="1" /><path d="M18 19l1-7-6 1" /><path d="M5 8l3-3 5.5 3-2.36 3.5" /><path d="M4.24 14.5a5 5 0 0 0 6.88 6" /><path d="M13.76 17.5a5 5 0 0 0-6.88-6" /></>),
  },
  wheelchair: {
    tags: 'silla ruedas discapacidad movilidad acceso',
    render: (s) => S(s, <><circle cx="8" cy="4" r="2" /><path d="M10 10V6" /><path d="M6 10h8" /><path d="M14 10l2 8h4" /><circle cx="10" cy="18" r="4" /></>),
  },
  braille: {
    tags: 'braille lectura ciego accesibilidad texto',
    render: (s) => S(s, <><circle cx="6" cy="4" r="1" fill="currentColor" /><circle cx="6" cy="12" r="1" fill="currentColor" /><circle cx="6" cy="20" r="1" fill="currentColor" /><circle cx="14" cy="4" r="1" fill="currentColor" /><circle cx="14" cy="12" r="1" fill="currentColor" /><circle cx="14" cy="20" r="1" /><circle cx="22" cy="4" r="1" fill="currentColor" /><circle cx="22" cy="12" r="1" /><circle cx="22" cy="20" r="1" /></>),
  },

  // ── Energy & Sustainability ──
  solar: {
    tags: 'solar panel energia renovable ecologia sustentable',
    render: (s) => S(s, <><rect x="2" y="8" width="20" height="12" rx="2" /><path d="M2 14h20" /><path d="M9 8v12" /><path d="M15 8v12" /><circle cx="12" cy="4" r="1" /><path d="M12 5v3" /><path d="M6.3 5.3l1.4 1.4" /><path d="M17.7 5.3l-1.4 1.4" /></>),
  },
  recycle: {
    tags: 'reciclar reutilizar ecologia medio ambiente verde',
    render: (s) => S(s, <><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" /><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" /><path d="M14 16l-3 3 3 3" /><path d="M8.293 13.596L7.196 9.5 3.1 10.598" /><path d="M9.344 5.811l1.093-1.892A1.83 1.83 0 0 1 12 3a1.784 1.784 0 0 1 1.563.91l3.904 6.763" /><path d="M21.06 11.684l-3.834 1.464-1.464-3.834" /></>),
  },
  'plug-zap': {
    tags: 'enchufe electricidad energia carga conectar',
    render: (s) => S(s, <><path d="M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4z" /><path d="M2 22l3-3" /><path d="M7.5 13.5L10 11" /><path d="M10.5 16.5L13 14" /><path d="M12 6l6 6 2-3V4l-5 1z" /></>),
  },
  windmill: {
    tags: 'molino viento energia eolica renovable turbina',
    render: (s) => S(s, <><path d="M12 8V2l-4 4z" /><path d="M16 12h6l-4-4z" /><path d="M12 16v6l4-4z" /><path d="M8 12H2l4 4z" /><circle cx="12" cy="12" r="2" /></>),
  },

  // ── Music Extended ──
  'music-note': {
    tags: 'nota musical sonido melodia cancion',
    render: (s) => S(s, <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>),
  },
  radio2: {
    tags: 'radio receptor musica emisora',
    render: (s) => S(s, <><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" /><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" /><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" /><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" /></>),
  },
  podcast: {
    tags: 'podcast audio programa escuchar episodio',
    render: (s) => S(s, <><circle cx="12" cy="11" r="1" /><path d="M11 14v6" /><path d="M13 14v6" /><path d="M8 10a4 4 0 0 1 8 0" /><path d="M5.65 8a8 8 0 0 1 12.7 0" /><path d="M3.34 6a12 12 0 0 1 17.32 0" /></>),
  },

  // ── Emojis & Expressions ──
  angry: {
    tags: 'enojado furioso molesto cara emoji',
    render: (s) => S(s, <><circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2" /><path d="M7.5 8L10 9" /><path d="M14 9l2.5-1" /></>),
  },
  meh: {
    tags: 'neutral indiferente cara emoji aburrido',
    render: (s) => S(s, <><circle cx="12" cy="12" r="10" /><line x1="8" y1="15" x2="16" y2="15" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></>),
  },
  laugh: {
    tags: 'risa feliz alegre carcajada contento',
    render: (s) => S(s, <><circle cx="12" cy="12" r="10" /><path d="M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12z" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></>),
  },
  party: {
    tags: 'fiesta celebracion confeti cumpleaños evento',
    render: (s) => S(s, <><path d="M5.8 11.3L2 22l10.7-3.79" /><path d="M4 3h.01" /><path d="M22 8h.01" /><path d="M15 2h.01" /><path d="M22 20h.01" /><path d="M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" /><path d="M22 13l-1.34-.45a2.9 2.9 0 0 0-3.12 1.96v0a1.53 1.53 0 0 1-1.63 1.45h0a1.77 1.77 0 0 0-1.44 1.76L14.5 20" /></>),
  },

  // ── Travel & Vacation ──
  'palm-tree': {
    tags: 'palmera playa vacaciones tropical verano',
    render: (s) => S(s, <><path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4" /><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-4" /><path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35z" /><path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" /></>),
  },
  tent: {
    tags: 'carpa camping acampar aire libre aventura',
    render: (s) => S(s, <><path d="M3.5 21L14 3" /><path d="M20.5 21L10 3" /><path d="M15.5 21l-3-5.25-3 5.25" /><path d="M2 21h20" /></>),
  },
  luggage: {
    tags: 'maleta equipaje viaje viajar aeropuerto',
    render: (s) => S(s, <><path d="M6 20h0a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h0" /><path d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14" /><path d="M10 20h4" /><circle cx="16" cy="20" r="2" /><circle cx="8" cy="20" r="2" /></>),
  },
  passport: {
    tags: 'pasaporte documento viaje identidad internacional',
    render: (s) => S(s, <><rect x="4" y="2" width="16" height="20" rx="2" /><circle cx="12" cy="10" r="4" /><line x1="8" y1="18" x2="16" y2="18" /></>),
  },
  binoculars: {
    tags: 'binoculares observar mirar explorar lejos vision',
    render: (s) => S(s, <><path d="M10 10h4" /><path d="M18.87 14.87C19.56 14.18 20 13.15 20 12V6c0-1.1-.45-2.1-1.17-2.83" /><path d="M5.13 14.87C4.44 14.18 4 13.15 4 12V6c0-1.1.45-2.1 1.17-2.83" /><circle cx="7" cy="17" r="3" /><circle cx="17" cy="17" r="3" /><path d="M10 17h4" /></>),
  },

  // ── Security Extended ──
  fingerprint2: {
    tags: 'huella digital biometrico identidad seguridad',
    render: (s) => S(s, <><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" /><path d="M14 13.12c0 2.38 0 6.38-1 8.88" /><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" /><path d="M2 12a10 10 0 0 1 18-6" /><path d="M2 16h.01" /><path d="M21.8 16c.2-2 .131-5.354 0-6" /><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" /><path d="M8.65 22c.21-.66.45-1.32.57-2" /><path d="M9 6.8a6 6 0 0 1 9 5.2v2" /></>),
  },
  'scan-face': {
    tags: 'reconocimiento facial escanear cara identidad biometrico',
    render: (s) => S(s, <><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h0.01" /><path d="M15 9h0.01" /></>),
  },
  radar: {
    tags: 'radar deteccion señal busqueda sonar',
    render: (s) => S(s, <><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34" /><path d="M4 6h.01" /><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35" /><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67" /><path d="M12 18h.01" /><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67" /><circle cx="12" cy="12" r="2" /><path d="M13.41 10.59L17 7" /></>),
  },
  'scan-line': {
    tags: 'escanear linea codigo barras leer',
    render: (s) => S(s, <><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><line x1="7" y1="12" x2="17" y2="12" /></>),
  },

  // ── Smart Home & IoT ──
  lamp: {
    tags: 'lampara luz iluminacion hogar escritorio',
    render: (s) => S(s, <><path d="M8 2h8l4 10H4z" /><path d="M12 12v6" /><path d="M8 22v-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H8z" /></>),
  },
  fan: {
    tags: 'ventilador aire climatizacion hogar',
    render: (s) => S(s, <><path d="M10.83 3.07A5.93 5.93 0 0 1 12 2c2.76 0 5 2.01 5 4.5 0 .88-.31 1.69-.83 2.36" /><path d="M20.93 10.83c.05.38.07.77.07 1.17 0 2.76-2.01 5-4.5 5-.88 0-1.69-.31-2.36-.83" /><path d="M13.17 20.93A5.93 5.93 0 0 1 12 22c-2.76 0-5-2.01-5-4.5 0-.88.31-1.69.83-2.36" /><path d="M3.07 13.17c-.05-.38-.07-.77-.07-1.17C3 9.24 5.01 7 7.5 7c.88 0 1.69.31 2.36.83" /><circle cx="12" cy="12" r="1" /></>),
  },
  lightbulb: {
    tags: 'foco bombilla luz idea iluminacion smart',
    render: (s) => S(s, <><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></>),
  },

  // ── AI & Future ──
  brain: {
    tags: 'cerebro inteligencia mente pensar neurociencia ia',
    render: (s) => S(s, <><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z" /></>),
  },
  robot: {
    tags: 'robot ia inteligencia artificial bot automatizacion',
    render: (s) => S(s, <><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /><path d="M9 7L6 4" /><path d="M15 7l3-3" /></>),
  },
  chip: {
    tags: 'chip microchip circuito electronica tecnologia',
    render: (s) => S(s, <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M6 12H2" /><path d="M12 2v4" /><path d="M22 12h-4" /><path d="M12 18v4" /><path d="M9 2v2" /><path d="M15 2v2" /><path d="M9 20v2" /><path d="M15 20v2" /><path d="M2 9h2" /><path d="M2 15h2" /><path d="M20 9h2" /><path d="M20 15h2" /></>),
  },
  satellite: {
    tags: 'satelite espacio orbita comunicacion gps',
    render: (s) => S(s, <><path d="M13 7L9 3 3 9l4 4" /><path d="M11 13l4 4 6-6-4-4" /><path d="M8 21l.88-.88a2 2 0 0 0 0-2.83l-1.18-1.17a2 2 0 0 0-2.83 0L4 17" /><path d="M3 21h1" /><path d="M14 10l.88.88a2 2 0 0 1 0 2.83l-1.17 1.17a2 2 0 0 1-2.83 0L10 14" /></>),
  },
  drone: {
    tags: 'dron aereo vuelo camara tecnologia',
    render: (s) => S(s, <><path d="M3 3h4" /><path d="M17 3h4" /><path d="M3 21h4" /><path d="M17 21h4" /><circle cx="5" cy="5" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" /><path d="M7 5h10" /><path d="M5 7v10" /><path d="M19 7v10" /><path d="M7 19h10" /><rect x="9" y="9" width="6" height="6" rx="1" /></>),
  },
  vr: {
    tags: 'realidad virtual lentes visor immersivo metaverso',
    render: (s) => S(s, <><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.5l-2.12 2.12a1.5 1.5 0 0 1-2.12 0L9 18H5a2 2 0 0 1-2-2z" /><path d="M7 12h0.01" /><path d="M17 12h0.01" /></>),
  },
};

// Get all available icon names
export const ICON_NAMES = Object.keys(iconDefs);

// Render an icon by name
export function renderIcon(name, size = 32) {
  const def = iconDefs[name];
  if (!def) return null;
  return def.render(size);
}

// Search icons by query (matches name or tags)
export function searchIcons(query) {
  if (!query || !query.trim()) return ICON_NAMES;
  const q = query.toLowerCase().trim();
  return ICON_NAMES.filter((name) => {
    if (name.includes(q)) return true;
    const tags = iconDefs[name].tags || '';
    return tags.includes(q);
  });
}

// Parse a card-3 option: supports both plain string and {icon, text} object
export function parseCardOption(option) {
  if (typeof option === 'object' && option !== null) {
    return { text: option.text || '', icon: option.icon || null };
  }
  return { text: String(option), icon: null };
}
