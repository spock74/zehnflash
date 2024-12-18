export function pythonDictToJson(pythonStr: string): any {
  try {
    // Remove espaços em branco extras e quebras de linha
    let cleanStr = pythonStr.trim();
    
    // Substitui None por null
    cleanStr = cleanStr.replace(/None/g, 'null');
    
    // Substitui True/False por true/false
    cleanStr = cleanStr.replace(/True/g, 'true').replace(/False/g, 'false');
    
    // Substitui aspas simples por aspas duplas
    cleanStr = cleanStr.replace(/'/g, '"');
    
    // Substitui nomes de chaves sem aspas por chaves com aspas
    cleanStr = cleanStr.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

    // Verifica se é uma lista de dicionários
    if (!cleanStr.startsWith('[')) {
      cleanStr = `[${cleanStr}]`;
    }

    return JSON.parse(cleanStr);
  } catch (error) {
    throw new Error('Erro ao converter formato Python para JSON');
  }
}

export function validateFlashcardData(data: any[]): boolean {
  if (!Array.isArray(data)) {
    throw new Error('Os dados devem ser uma lista de dicionários');
  }

  data.forEach((item, index) => {
    if (!item.front || !item.back) {
      throw new Error(`Cartão ${index + 1} está faltando front ou back`);
    }
    if (!item.deck?.name || !item.deck?.category) {
      throw new Error(`Cartão ${index + 1} está faltando informações do deck`);
    }
  });

  return true;
}
