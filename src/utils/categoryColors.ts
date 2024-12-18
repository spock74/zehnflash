// Mapa de cores consistente para categorias
const categoryColorMap: { [key: string]: string } = {
  'Programação': '#FF6B6B',    // Vermelho suave
  'Idiomas': '#4ECDC4',        // Turquesa
  'Matemática': '#45B7D1',     // Azul claro
  'Ciências': '#96CEB4',       // Verde suave
  'História': '#D4A5A5',       // Rosa antigo
  'Geografia': '#9B5DE5',      // Roxo
  'Literatura': '#FFD93D',     // Amarelo
  'Artes': '#FF9A8B',         // Coral
  'Música': '#6C5CE7',        // Índigo
  'Tecnologia': '#A8E6CF',    // Menta
  'Filosofia': '#FDCB6E',     // Mostarda
  'Psicologia': '#FF7675',    // Salmão
  'Direito': '#74B9FF',       // Azul céu
  'Medicina': '#55EFC4',      // Verde água
  'Economia': '#FAB1A0',      // Pêssego
  'Estudos Sociais': '#81ECEC' // Ciano
};

// Cores de fallback para categorias não mapeadas
const fallbackColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#D4A5A5',
  '#9B5DE5', '#FFD93D', '#FF9A8B', '#6C5CE7', '#A8E6CF'
];

let fallbackColorIndex = 0;

export const getCategoryColor = (category: string): string => {
  // Se a categoria já tem uma cor mapeada, retorna ela
  if (categoryColorMap[category]) {
    return categoryColorMap[category];
  }

  // Se não, atribui uma nova cor do fallback e a adiciona ao mapa
  const color = fallbackColors[fallbackColorIndex % fallbackColors.length];
  categoryColorMap[category] = color;
  fallbackColorIndex++;

  return color;
};

export const getCategoryColorWithOpacity = (category: string, opacity: number): string => {
  const color = getCategoryColor(category);
  
  // Converte cor hex para RGB e adiciona opacidade
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  return color;
};
