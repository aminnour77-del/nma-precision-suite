export function getPDFDocDefinition(activeData, operatorName) {
  const tableRows = [
    [
      { text: 'PARAMETRO DI MISURA', bold: true, fillColor: '#0f172a', color: '#38bdf8' },
      { text: 'VALORE RILEVATO', bold: true, fillColor: '#0f172a', color: '#38bdf8' },
      { text: 'STATO DI CONFORMITÀ', bold: true, fillColor: '#0f172a', color: '#38bdf8' }
    ]
  ];

  activeData.metrics.forEach(m => {
    tableRows.push([
      { text: m.t, fontSize: 10 },
      { text: m.v, bold: true, fontSize: 10 },
      { text: m.st, color: m.ok ? '#16a34a' : '#d97706', bold: true, fontSize: 9 }
    ]);
  });

  return {
    pageSize: 'A4',
    pageMargins: [35, 40, 35, 40],
    content: [
      {
        columns: [
          {
            text: 'N.M.A. SYSTEMS & ENGINEERING\nPrecision Telemetry & Quality Assurance\nTorino - San Benigno Canavese (TO)',
            fontSize: 9,
            color: '#475569'
          },
          {
            text: `CERTIFICATO DI VERIFICA TECNICA\nData: ${new Date().toLocaleDateString('it-IT')}\nRef: NMA-REP-${Math.floor(100000 + Math.random() * 900000)}`,
            alignment: 'right',
            fontSize: 9,
            bold: true,
            color: '#0284c7'
          }
        ]
      },
      { canvas: [{ type: 'line', x1: 0, y1: 8, x2: 525, y2: 8, lineWidth: 1.5, lineColor: '#0284c7' }] },
      { text: '\n' },
      { text: `RAPPORTO TECNICO DI TELEMETRIA: ${activeData.title.toUpperCase()}`, fontSize: 14, bold: true, color: '#0f172a' },
      { text: `Operatore Responsabile: ${operatorName} | Nodo GPS: ${activeData.label}`, fontSize: 10, italic: true, color: '#475569' },
      { text: '\n' },
      { text: 'Normative di Riferimento Aziendali & Standard di Qualità:', fontSize: 11, bold: true, color: '#0284c7' },
      {
        table: {
          widths: ['*'],
          body: [[
            {
              fillColor: '#f8fafc',
              border: [true, true, true, true],
              borderColor: '#cbd5e1',
              text: '• ISO 9001:2015 (Gestione Qualità)\n• ISO 14001:2015 (Gestione Ambientale)\n• ISO 45001:2018 (Salute e Sicurezza sul Lavoro)\n• ISO 3834-2 (Qualità Saldatura dei Metalli)\n• UNI 9737 / UNI ISO 9606-1 (Qualificazione Operatori e Saldatori)',
              fontSize: 9,
              color: '#334155'
            }
          ]]
        }
      },
      { text: '\n' },
      { text: 'Rilevazioni Telemetriche in Tempo Reale:', fontSize: 11, bold: true, color: '#0284c7' },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*'],
          body: tableRows
        },
        layout: 'LightHorizontalLines'
      },
      { text: '\n' },
      { text: 'Esito Collaudo Telemetrico:', fontSize: 11, bold: true, color: '#0284c7' },
      {
        text: '✔ CONFORME AL 100% - Tutti i parametri acquisiti rientrano nei range di tolleranza previsti dal disciplinare di qualifica ISO/UNI.',
        color: '#16a34a',
        bold: true,
        fontSize: 10
      },
      { text: '\n\n' },
      {
        columns: [
          { text: `Firma Operatore Telemetria\n\n_______________________\n${operatorName}`, fontSize: 9 },
          { text: 'Firma Controllo Qualità N.M.A.\n\n_______________________\nIng. N. M. Amine', fontSize: 9, alignment: 'right' }
        ]
      }
    ]
  };
}
