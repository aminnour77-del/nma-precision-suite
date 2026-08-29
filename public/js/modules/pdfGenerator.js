export function getPDFDocDefinition(data, user, logs) {
  const logBody = [
    [{ text: 'Orario', style: 'tableHeader', fillColor: '#1e293b', color: 'white' }, 
     { text: 'Descrizione Evento / Allarme', style: 'tableHeader', fillColor: '#1e293b', color: 'white' }]
  ];
  
  logs.forEach(l => {
    logBody.push([
      l.time, 
      { text: l.msg, color: l.isWarning ? 'red' : 'black' }
    ]);
  });

  if (logBody.length === 1) {
    logBody.push(['-', 'Nessuna anomalia o evento registrato in questa sessione.']);
  }

  return {
    content: [
      { text: 'N.M.A. SYSTEMS - CERTIFICATO DI COLLAUDO SCADA', style: 'header' },
      { text: `Operatore: ${user} | Generato il: ${new Date().toLocaleString()}`, margin: [0, 0, 0, 20], color: '#64748b' },
      
      { text: `Target Monitoraggio: ${data.title}`, style: 'subheader' },
      { text: `Coordinate Nodo: ${data.label} (GPS: ${data.gps[0]}, ${data.gps[1]})`, margin: [0, 0, 0, 20] },
      
      { text: '1. RILEVAMENTI SENSORISTICI IN TEMPO REALE', style: 'subheader' },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['*', '*', '*'],
          body: [
            [{text: 'Metrica', style: 'tableHeader'}, {text: 'Valore', style: 'tableHeader'}, {text: 'Stato', style: 'tableHeader'}],
            ...data.metrics.map(m => [
              m.t, 
              `${typeof m.v === 'number' ? m.v.toFixed(2) : m.v}${m.unit}`, 
              { text: m.st, color: m.alarm ? 'red' : 'green', bold: true }
            ])
          ]
        }
      },
      
      { text: '2. AUDIT EVENT LOG (Tracciabilità ISO 9001:2015)', style: 'subheader', margin: [0, 20, 0, 10] },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['auto', '*'],
          body: logBody
        }
      }
    ],
    styles: {
      header: { fontSize: 18, bold: true, color: '#0284c7', margin: [0, 0, 0, 5] },
      subheader: { fontSize: 13, bold: true, color: '#0f172a', margin: [0, 10, 0, 5] },
      tableExample: { margin: [0, 5, 0, 15] },
      tableHeader: { bold: true, fontSize: 11, color: '#333' }
    },
    defaultStyle: { fontSize: 10 }
  };
}
