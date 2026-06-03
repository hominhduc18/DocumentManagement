const fs = require('fs');
const filePath = 'src/data/vnptDocumentation.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Map of serviceGroupId to chapter prefix and sub-section numbering
// The order within each group determines the sub-number
const sectionMap = {
  'basic-publish': '2.1',
  'basic-portal': '2.2',
  'basic-business': '2.3',
  'tt78-publish': '3.1',
  'tt78-business': '3.2',
  'ctt-service': '4',
  'mtt-service': '5',
};

// Sub-group mapping: for chapters with sub-sections (like 4.1, 4.2, 5.1, 5.2, 5.3)
// We'll map by id prefix for more granular numbering
const subGroupMap = {
  // CTT chapter 4
  'ctt-import-and-publish': '4.1.1',
  'ctt-get-hash-with-token': '4.1.2',
  'ctt-publish-with-token': '4.1.3',
  'ctt-get-hash-smartca': '4.1.4',
  'ctt-publish-smartca': '4.1.5',
  'ctt-register-publish-ctt': '4.1.6',
  'ctt-import-inv-by-pattern': '4.1.7',
  // CTT 4.2 - Business
  'ctt-replace-ctt-action': '4.2.1',
  'ctt-get-hash-token-replace': '4.2.2',
  'ctt-adjust-replace-token': '4.2.3',
  'ctt-get-hash-smartca-replace': '4.2.4',
  'ctt-adjust-replace-smartca': '4.2.5',
  'ctt-cancel-inv-ctt': '4.3.1',
  'ctt-adjust-ctt-action': '4.3.2',
  // CTT 4.5 - Download
  'ctt-download-token': '4.4.1',
  'ctt-download-fkey': '4.4.2',
  // CTT 4.6 - Notice errors
  'ctt-send-notice-errors': '4.5.1',
  'ctt-get-hash-notice-errors-token': '4.5.2',
  'ctt-send-notice-errors-token': '4.5.3',
  'ctt-get-hash-notice-errors-smartca': '4.5.4',
  'ctt-send-notice-errors-smartca': '4.5.5',

  // MTT chapter 5
  // 5.1 - Publish
  'mtt-import-and-publish': '5.1.1',
  'mtt-import-inv-by-pattern': '5.1.2',
  'mtt-get-hash-with-token': '5.1.3',
  'mtt-publish-with-token': '5.1.4',
  'mtt-adjust-replace-with-token': '5.1.5',
  'mtt-get-hash-smartca': '5.1.6',
  'mtt-publish-smartca': '5.1.7',
  'mtt-send-inv-error': '5.1.8',
  'mtt-get-hash-inv-error': '5.1.9',
  'mtt-send-inv-error-token': '5.1.10',
  // 5.2 - Business (adjust/replace)
  'mtt-send-inv-fkey': '5.2.1',
  'mtt-adjust-inv': '5.2.2',
  'mtt-replace-inv': '5.2.3',
  'mtt-adjust-without-inv': '5.2.4',
  'mtt-replace-without-inv': '5.2.5',
  // 5.3 - Send to CQT with token/smartCA
  'mtt-get-hash-fkey-token': '5.3.1',
  'mtt-send-inv-fkey-token': '5.3.2',
  'mtt-get-hash-fkey-smartca': '5.3.3',
};

// Track counters per serviceGroup for auto-numbering
const counters = {};

// Find all id lines and insert sectionNumber after them
const lines = content.split('\n');
let currentServiceGroupId = null;

for (let i = 0; i < lines.length; i++) {
  const idMatch = lines[i].match(/^\s+id:\s*"([^"]+)"/);
  if (idMatch) {
    const apiId = idMatch[1];
    // Look ahead for serviceGroupId
    if (i + 1 < lines.length) {
      const sgMatch = lines[i + 1].match(/^\s+serviceGroupId:\s*"([^"]+)"/);
      if (sgMatch) {
        currentServiceGroupId = sgMatch[1];
      }
    }

    // Check if this id already has a sectionNumber on the next line (after serviceGroupId)
    const lineAfterSG = i + 2 < lines.length ? lines[i + 2] : '';
    if (lineAfterSG.includes('sectionNumber:')) {
      continue; // Already has one
    }

    let sectionNum = '';
    if (subGroupMap[apiId]) {
      sectionNum = subGroupMap[apiId];
    } else if (currentServiceGroupId && sectionMap[currentServiceGroupId]) {
      const prefix = sectionMap[currentServiceGroupId];
      if (!counters[currentServiceGroupId]) {
        counters[currentServiceGroupId] = 0;
      }
      counters[currentServiceGroupId]++;
      sectionNum = `${prefix}.${counters[currentServiceGroupId]}`;
    }

    if (sectionNum) {
      // Insert sectionNumber line after serviceGroupId line
      const indent = lines[i].match(/^(\s+)/)[1];
      const newLine = `${indent}sectionNumber: "${sectionNum}",`;
      lines.splice(i + 2, 0, newLine);
      i++; // Skip the newly inserted line
    }
  }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Section numbers added!');
console.log('Counters:', counters);
