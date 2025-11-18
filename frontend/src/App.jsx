import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import Advisor from './components/advisor/Advisor';
import { BackgroundDecor } from './components/layout/BackgroundDecor';

// --- DEFINICIÓN DEL TEMA BYTESTEP ---
const theme = createTheme({
  // 1. Tipografía Amigable
  fontFamily: 'Poppins, sans-serif',
  headings: { fontFamily: 'Poppins, sans-serif' }, 
  // 2. Color de Marca (Amarillo ByteStep)
  // Mantine necesita una escala de 10 colores. He creado una basada en tu imagen.
  colors: {
    byteYellow: [
      "#fffde7", // 0 (más claro)
      "#fff9c4", // 1
      "#fff59d", // 2
      "#fff176", // 3
      "#ffee58", // 4
      "#ffeb3b", // 5 (Base)
      "#fdd835", // 6 (Tu amarillo fuerte)
      "#fbc02d", // 7
      "#f9a825", // 8
      "#f57f17", // 9 (más oscuro)
    ],
  },
  primaryColor: 'byteYellow', // Usar este color por defecto en botones, inputs, etc.
  primaryShade: 6, // El tono exacto para botones

  // 3. Redondez "Suave" (Bordes muy curvos)
  defaultRadius: 'xl', 

  // 4. "Sombritas" Personalizadas
  shadows: {
    md: '0 8px 30px rgba(0,0,0,0.06)', // Sombra suave y flotante (estilo moderno)
    xl: '0 20px 40px rgba(255, 193, 7, 0.15)', // Sombra con un toque de amarillo para resaltar
  },
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <BackgroundDecor />
      <Advisor />
    </MantineProvider>
  );
}

export default App;