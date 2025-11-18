import { Box } from '@mantine/core';

export function BackgroundDecor() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
      
      {/* 1. Círculo Sólido Grande (Arriba Derecha) */}
      <Box 
        style={{
          position: 'absolute',
          top: '-150px',
          right: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          backgroundColor: '#f5ca0cff', // Tu amarillo fuerte
          opacity: 0.3 // Transparencia para no molestar
        }} 
      />

      {/* 2. Anillo Grande (Abajo Derecha) */}
      <Box 
        style={{
          position: 'absolute',
          bottom: '-200px',
          right: '-100px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          border: '40px solid #fbc02d', // Solo borde
          opacity: 0.2
        }} 
      />

      {/* 3. Anillo Pequeño (Arriba Izquierda) - Estilo cuarto de círculo */}
      <Box 
        style={{
          position: 'absolute',
          top: '50px',
          left: '-60px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: '25px solid #faee7eff',
          opacity: 0.7
        }} 
      />

      {/* 4. Círculos pequeños flotantes (Decoración dispersa) */}
      <Box style={{ position: 'absolute', top: '20%', left: '15%', width: '20px', height: '20px', borderRadius: '50%', background: '#fdd835', opacity: 0.6 }} />
      <Box style={{ position: 'absolute', top: '70%', left: '5%', width: '40px', height: '40px', borderRadius: '50%', background: '#fff176', opacity: 0.5 }} />
      <Box style={{ position: 'absolute', bottom: '15%', left: '25%', width: '15px', height: '15px', borderRadius: '50%', background: '#fbc02d', opacity: 0.4 }} />
      
    </div>
  );
}