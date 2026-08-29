export function getTechnicalManualDefinition(user) {
  return {
    content: [
      { text: 'N.M.A. SYSTEMS - MANUALE TECNICO & ARCHITETTURA SCADA', style: 'header' },
      { text: `Redatto da: ${user} | Versione: 2.4.0-Enterprise | Data: ${new Date().toLocaleDateString()}`, margin: [0, 0, 0, 20], color: '#64748b' },
      
      { text: '1. INTRODUZIONE ED ARCHITETTURA DI SISTEMA', style: 'subheader' },
      { text: 'La piattaforma N.M.A. Systems è una suite SCADA / Digital Twin progettata per il monitoraggio in tempo reale e la simulazione di asset industriali complessi (Pipeline Gas, Robotics CNC, AgTech e Automotive Telemetry).', margin: [0, 0, 0, 10] },
      
      { text: '2. PROTOCOLLI DI COMUNICAZIONE & SENSORISTICA', style: 'subheader' },
      {
        ul: [
          'MQTT / WebSocket (JSON payload) per lo streaming dati in tempo reale a latenza < 4ms.',
          'Modbus TCP per l interfacciamento con PLC e schede I/O di campo.',
          'RTK 5G con precisione centimetrica per la geolocalizzazione dei nodi tattici.'
        ],
        margin: [0, 0, 0, 15]
      },

      { text: '3. CONFORMITÀ NORMATIVA & STANDARD ISO', style: 'subheader' },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['100'],
          body: [
            [{text: 'Standard', style: 'tableHeader'}, {text: 'Ambito di Applicazione', style: 'tableHeader'}],
            ['ISO 9001:2015', 'Gestione della qualità della reportistica di collaudo.'],
            ['ISO 14001', 'Monitoraggio impatto ambientale e consumi energetici/emissioni.'],
            ['ISO 45001', 'Sicurezza operativa su impianti e prevenzione anomalie critiche.'],
            ['UNI 9737', 'Qualificazione e tracciabilità saldature ed elementi gas pipeline.']
          ]
        }
      }
    ],
    styles: {
      header: { fontSize: 16, bold: true, color: '#0284c7', margin: [0, 0, 0, 5] },
      subheader: { fontSize: 12, bold: true, color: '#0f172a', margin: [0, 10, 0, 5] },
      tableExample: { margin: [0, 5, 0, 15] },
      tableHeader: { bold: true, fontSize: 10, color: '#333' }
    },
    defaultStyle: { fontSize: 10 }
  };
}
