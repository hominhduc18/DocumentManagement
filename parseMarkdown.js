const fs = require('fs');
const path = require('path');

const mdPath = path.join('E:', 'DocManagement', 'vnpt-api-docs', 'chi-tiet-field-xml130.md');
const outPath = path.join('E:', 'DocManagement', 'vnpt-api-docs', 'src', 'data', 'xmlFieldsData.json');

const content = fs.readFileSync(mdPath, 'utf8');

const lines = content.split('\n');

const tables = [];
let currentTable = null;
let parsingTableData = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // New table section
  if (line.startsWith('## ')) {
    parsingTableData = false;
    const name = line.substring(3).trim();
    
    // Determine ID
    let id = '';
    if (name.toLowerCase().includes('check-in')) id = 'check-in';
    else {
      const match = name.match(/XML(\d+)/i);
      if (match) id = `XML${match[1]}`;
    }
    
    if (id) {
      currentTable = { id, name, purpose: '', fields: [] };
      tables.push(currentTable);
    }
  } 
  else if (currentTable && !parsingTableData) {
    if (line.startsWith('*Mục đích sử dụng:*')) {
      currentTable.purpose = line.replace('*Mục đích sử dụng:*', '').trim();
    }
    else if (line.startsWith('| STT |')) {
      parsingTableData = true;
      i++; // Skip the separator row `|---|---|...`
    }
  }
  else if (currentTable && parsingTableData) {
    if (!line.startsWith('|')) {
      // Table ended
      parsingTableData = false;
    } else {
      // Parse row
      const cols = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (cols.length >= 5) {
        currentTable.fields.push({
          stt: cols[0],
          name: cols[1].replace(/`/g, ''),
          type: cols[2],
          required: cols[3],
          description: cols[4]
        });
      }
    }
  }
}

// Clean up any tables that have no fields
const finalTables = tables.filter(t => t.fields.length > 0);

fs.writeFileSync(outPath, JSON.stringify(finalTables, null, 2), 'utf8');
console.log(`Successfully parsed ${finalTables.length} tables with a total of ${finalTables.reduce((acc, t) => acc + t.fields.length, 0)} fields.`);
