/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import xmlFieldsData from '../data/xmlFieldsData.json';

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  parsedData: any;
  xmlType: string | null;
  rawXml: string; // Keep track of the original or updated raw XML for this part
}

export interface EnvelopeValidationResult {
  isEnvelope: boolean;
  isValid: boolean;
  files: {
    loaiHoSo: string;
    result: ValidationResult;
  }[];
  parsedEnvelope: any;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseTagValue: false, // Keep as string
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  format: true,
  suppressEmptyNode: true,
});

export function parseXml(xmlString: string) {
  try {
    return parser.parse(xmlString);
  } catch (error) {
    throw new Error('Invalid XML format');
  }
}

export function buildXml(jsonObj: any) {
  return builder.build(jsonObj);
}

export function validateSingleXml(xmlString: string, expectedType?: string): ValidationResult {
  const errors: ValidationError[] = [];
  let parsedData: any = null;
  let xmlType: string | null = null;

  try {
    parsedData = parseXml(xmlString);
  } catch (e) {
    return { isValid: false, errors: [{ field: 'XML', message: 'Lỗi cú pháp XML', type: 'error' }], parsedData: null, xmlType: null, rawXml: xmlString };
  }

  const rootKeys = Object.keys(parsedData).filter(k => !k.startsWith('?')); 
  if (rootKeys.length === 0) {
    return { isValid: false, errors: [{ field: 'XML', message: 'XML trống', type: 'error' }], parsedData, xmlType: null, rawXml: xmlString };
  }

  const rootTag = rootKeys[0];
  const rootData = parsedData[rootTag];

  let matchedRulesDef = null;
  if (expectedType) {
     matchedRulesDef = xmlFieldsData.find(def => def.id === expectedType || def.id === `XML${expectedType}`);
  }
  
  if (!matchedRulesDef) {
      matchedRulesDef = xmlFieldsData.find(def => 
        def.id.toUpperCase() === rootTag.toUpperCase() || 
        (def.id === 'check-in' && rootTag.toUpperCase() === 'CHECK_IN')
      );
  }

  if (!matchedRulesDef) {
      for (const def of xmlFieldsData) {
          const someFieldMatches = def.fields.some(f => rootData[f.name] !== undefined);
          if (someFieldMatches) {
              matchedRulesDef = def;
              break;
          }
      }
  }

  if (matchedRulesDef) {
    xmlType = matchedRulesDef.name;
    const rules = matchedRulesDef.fields;

    const validateNode = (node: any, path: string = '') => {
        if (typeof node === 'object' && node !== null && !Array.isArray(node)) {
            for (const key of Object.keys(node)) {
                if (key.startsWith('@_')) continue;
                
                const rule = rules.find(r => r.name === key);
                const value = node[key];
                
                if (rule) {
                    if (rule.required.includes('Bắt buộc') && !rule.required.includes('điều kiện')) {
                        if (value === undefined || value === null || value === '') {
                            errors.push({ field: key, message: `Trường ${key} là bắt buộc`, type: 'error' });
                        }
                    }
                    
                    if (value !== undefined && value !== null && value !== '') {
                        const strVal = String(value);
                        const typeMatch = rule.type.match(/Chuỗi\((\d+)\)/);
                        if (typeMatch) {
                            const maxLen = parseInt(typeMatch[1]);
                            if (strVal.length > maxLen) {
                                errors.push({ field: key, message: `Độ dài trường ${key} vượt quá ${maxLen} ký tự`, type: 'error' });
                            }
                        }
                    }
                }
                
                validateNode(node[key], path ? `${path}.${key}` : key);
            }
        } else if (Array.isArray(node)) {
            node.forEach((item, index) => validateNode(item, `${path}[${index}]`));
        }
    };

    validateNode(rootData);
  }

  return {
    isValid: errors.length === 0,
    errors,
    parsedData,
    xmlType: xmlType || expectedType || rootTag,
    rawXml: xmlString
  };
}

// Decode base64 UTF-8
function decodeBase64(str: string) {
  try {
    return decodeURIComponent(escape(window.atob(str)));
  } catch (e) {
    return window.atob(str);
  }
}

// Encode base64 UTF-8
function encodeBase64(str: string) {
  try {
    return window.btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    return window.btoa(str);
  }
}

export function validateEnvelopeXml(xmlString: string): EnvelopeValidationResult {
  try {
    const parsedData = parseXml(xmlString);
    const rootKeys = Object.keys(parsedData).filter(k => !k.startsWith('?'));
    const rootTag = rootKeys[0];

    if (rootTag === 'GIAMDINHHS') {
      const hoSoList = parsedData.GIAMDINHHS?.THONGTINHOSO?.DANHSACHHOSO?.HOSO?.FILEHOSO;
      const files: any[] = Array.isArray(hoSoList) ? hoSoList : (hoSoList ? [hoSoList] : []);
      
      const fileResults = files.map(file => {
        const loaiHoSo = file.LOAIHOSO;
        const noidungBase64 = file.NOIDUNGFILE;
        let decodedXml = '';
        try {
          decodedXml = decodeBase64(noidungBase64);
        } catch (e) {
          return { loaiHoSo, result: { isValid: false, errors: [{field: 'NOIDUNGFILE', message: 'Không thể decode Base64', type: 'error' as const}], parsedData: null, xmlType: loaiHoSo, rawXml: '' } };
        }
        
        const result = validateSingleXml(decodedXml, loaiHoSo);
        return { loaiHoSo, result };
      });

      const isValid = fileResults.every(f => f.result.isValid);

      return {
        isEnvelope: true,
        isValid,
        files: fileResults,
        parsedEnvelope: parsedData
      };
    } else {
      // Treat as single XML
      const result = validateSingleXml(xmlString);
      return {
        isEnvelope: false,
        isValid: result.isValid,
        files: [{ loaiHoSo: result.xmlType || 'Unknown', result }],
        parsedEnvelope: null
      };
    }
  } catch (e) {
    return {
      isEnvelope: false,
      isValid: false,
      files: [],
      parsedEnvelope: null
    };
  }
}

export function updateXmlFieldByPath(parsedData: unknown, fullPath: string, newValue: string) {
  const newData = JSON.parse(JSON.stringify(parsedData));
  const rootKeys = Object.keys(newData).filter(k => !k.startsWith('?'));
  if (rootKeys.length === 0) return newData;
  const rootTag = rootKeys[0];
  
  let current = newData[rootTag];
  const parts = fullPath.match(/([^[.\]]+|\[\d+\])/g);
  
  if (parts) {
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (part.startsWith('[')) {
        const idx = parseInt(part.replace(/[\[\]]/g, ''));
        current = current[idx];
      } else {
        current = current[part];
      }
    }
    const lastPart = parts[parts.length - 1];
    if (lastPart.startsWith('[')) {
      const idx = parseInt(lastPart.replace(/[\[\]]/g, ''));
      current[idx] = newValue;
    } else {
      current[lastPart] = newValue;
    }
  }
  
  return newData;
}

export function rebuildEnvelopeXml(envelopeData: any, updatedFiles: { loaiHoSo: string, updatedRawXml: string }[]) {
  const newData = JSON.parse(JSON.stringify(envelopeData));
  
  const hoSoList = newData.GIAMDINHHS?.THONGTINHOSO?.DANHSACHHOSO?.HOSO?.FILEHOSO;
  if (hoSoList) {
    const filesArray = Array.isArray(hoSoList) ? hoSoList : [hoSoList];
    filesArray.forEach(file => {
      const update = updatedFiles.find(u => u.loaiHoSo === file.LOAIHOSO);
      if (update) {
        file.NOIDUNGFILE = encodeBase64(update.updatedRawXml);
      }
    });
  }
  
  return buildXml(newData);
}
