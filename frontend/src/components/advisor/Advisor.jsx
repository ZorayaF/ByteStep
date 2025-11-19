import { useState } from 'react';
import { 
  Container, Paper, Stepper, Button, Group, Title, Text, 
  NumberInput, Select, Stack, ThemeIcon, LoadingOverlay, SimpleGrid
} from '@mantine/core';
import { IconUser, IconBulb, IconChartBar, IconCode } from '@tabler/icons-react';
import { Image as MantineImage } from '@mantine/core';
// Importamos los sub-componentes
import { SkillsSelector } from './SkillsSelector';
import { ResultsDashboard } from './ResultsDashboard';
import logoBombillo from '../../assets/bombillo.png'; 

export default function Advisor() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null); // Aquí guardaremos la respuesta de la IA
  
  const [formData, setFormData] = useState({
    experience: 3,
    role: '',
    country: 'United States of America',
    education: 'Bachelor’s degree',
    skills: []
  });

  // Navegación
  const nextStep = () => setActiveStep((current) => (current < 2 ? current + 1 : current));
  const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));

  // Simulación de llamada a la API (Fase de Diseño)
 // Reemplaza tu función handleAnalysis actual con esta:
  const handleAnalysis = async () => {
    // 1. Validación simple
    if(formData.skills.length === 0) {
      alert("Por favor selecciona al menos una habilidad.");
      return;
    }

    setLoading(true);
    
    try {
      // 2. Conexión con tu Backend Python (FastAPI)
      // Asegúrate de que el servidor uvicorn esté corriendo en este puerto
      const response = await fetch('https://bytestep.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Convertimos los datos al formato que espera Python
          experience: parseInt(formData.experience),
          role: formData.role || "Developer, full-stack", // Valor por defecto si está vacío
          country: formData.country,
          education: formData.education,
          skills: formData.skills
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la conexión con la IA');
      }

      // 3. Recibir los datos reales de la predicción
      const realData = await response.json();
      
      setResults(realData); // Guardamos la respuesta real
      nextStep(); // Avanzamos al Dashboard

    } catch (error) {
      console.error("Error:", error);
      alert("No pudimos conectar con el Asesor IA. \n\n1. Revisa que tengas la terminal del backend abierta.\n2. Revisa que diga 'Uvicorn running'.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setActiveStep(0);
    setFormData({ ...formData, skills: [] });
  };

  return (
    <Container size="md" py="xl">
      {/* Contenedor con efecto Glassmorphism leve */}
      <Paper shadow="md" // Usamos nuestra sombra suave definida en el tema
        p={40} 
        radius="xl" // Bordes extra redondeados
        style={{ 
          backgroundColor: '#ffffff', 
          position: 'relative',
          border: '1px solid rgba(0,0,0,0.03)' // Borde casi invisible para definición
        }}
      >
        
        {/* Overlay de carga bonito */}
        <LoadingOverlay 
          visible={loading} 
          zIndex={1000} 
          overlayProps={{ radius: "xl", blur: 3, color: "#ffffff" }} 
          loaderProps={{ color: 'byteYellow', type: 'oval' }} 
        />
        {/* --- HEADER DE MARCA BYTESTEP --- */}
        <Stack align="center" gap="xs" mb={40}>
          
          {/* REEMPLAZAMOS EL ThemeIcon POR TU IMAGEN */}
          <div style={{ 
            backgroundColor: '#fff9c4', 
            padding: '15px', 
            borderRadius: '50%', 
            display: 'inline-block' 
          }}>
             <MantineImage 
               src={logoBombillo} 
               w={60} // Ancho de 60px (ajusta según necesites)
               fit="contain"
             />
          </div>
          
          {/* Título de Marca (Ahora con fuente Poppins se verá idéntico) */}
          <Title 
            order={1} 
            style={{ 
              fontSize: '3rem', // Un poco más grande para impacto
              fontWeight: 800,  // Extra Bold como en tu imagen
              letterSpacing: '-1.5px',
              color: '#212529',
              lineHeight: 1
            }}
          >
            ByteStep
          </Title>
          
          <Text c="dimmed" size="lg" fw={500}>
            Tu salto inteligente al siguiente nivel profesional
          </Text>
        </Stack>

        <Stepper active={activeStep} onStepClick={null} color="byteYellow" allowNextStepsSelect={false} size="sm">
          
          {/* PASO 1: PERFIL (VERSIÓN MEJORADA: MÁS COLOR Y TAMAÑO) */}
          <Stepper.Step label="Perfil" description="Datos básicos" icon={<IconUser size={20} />}>
            
            <Stack mt="xl" gap="xl">
              
              {/* 1. TÍTULO Y SUBTÍTULO CON FONDO DE COLOR */}
              <Paper 
                p="lg" 
                radius="lg" 
                style={{ backgroundColor: '#fffdec', border: '1px solid #fff59d' }} // Un amarillo crema muy suave
              >
                <Group>
                  <ThemeIcon size={42} radius="md" color="byteYellow" variant="filled">
                    <IconUser size={24} color="black" stroke={2} />
                  </ThemeIcon>
                  <div>
                    <Title order={3} style={{ color: '#2d2d2d' }}>Cuéntanos sobre ti</Title>
                    <Text size="md" c="dimmed" style={{ lineHeight: 1.3 }}>
                      Tu experiencia y ubicación son clave para calibrar el algoritmo.
                    </Text>
                  </div>
                </Group>
              </Paper>

              {/* 2. FORMULARIO "BIG & BOLD" */}
              <Stack gap="lg">
                
                {/* Fila 1: Experiencia y Educación */}
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                  <NumberInput
                    label="Años de Experiencia"
                    description="Tiempo trabajando profesionalmente"
                    placeholder="Ej: 3"
                    value={formData.experience}
                    onChange={(val) => setFormData({...formData, experience: val})}
                    min={0} max={50}
                    
                    // ESTILOS NUEVOS: GRANDE Y RELLENO
                    size="lg" 
                    radius="md"
                    variant="filled" 
                    styles={{
                      input: { backgroundColor: '#f1f3f5', fontWeight: 600 }, // Fondo gris suave
                      label: { fontSize: '1.1rem', marginBottom: 6 }
                    }}
                  />
                  
                  <Select
                    label="Nivel Educativo"
                    description="Tu grado académico más alto"
                    data={['No degree', 'Associate degree', 'Bachelor’s degree', 'Master’s degree', 'Professional degree (PhD)']}
                    value={formData.education}
                    onChange={(val) => setFormData({...formData, education: val})}
                    
                    size="lg"
                    radius="md"
                    variant="filled"
                    checkIconPosition="right"
                    styles={{
                      input: { backgroundColor: '#f1f3f5', fontWeight: 500 },
                      label: { fontSize: '1.1rem', marginBottom: 6 }
                    }}
                  />
                </SimpleGrid>

                {/* Fila 2: Rol */}
                <Select
                  label="Rol Actual / Deseado"
                  placeholder="Selecciona tu perfil principal"
                  searchable
                  data={['Developer, back-end', 'Developer, full-stack', 'Developer, front-end', 'DevOps specialist', 'Data scientist', 'Engineering manager']}
                  value={formData.role}
                  onChange={(val) => setFormData({...formData, role: val})}
                  
                  size="lg"
                  radius="md"
                  variant="filled"
                  leftSection={<IconCode size={20} />}
                  styles={{
                    input: { backgroundColor: '#f1f3f5' },
                    label: { fontSize: '1.1rem', marginBottom: 6 }
                  }}
                />

                {/* Fila 3: País */}
                <Select
                  label="País de Residencia"
                  placeholder="¿Dónde trabajas actualmente?"
                  searchable
                  data={['United States of America', 'Germany', 'Spain', 'Brazil', 'India', 'Canada']}
                  value={formData.country}
                  onChange={(val) => setFormData({...formData, country: val})}
                  
                  size="lg"
                  radius="md"
                  variant="filled"
                  leftSection={<IconChartBar size={20} />} // O un icono de mapa si tienes
                  styles={{
                    input: { backgroundColor: '#f1f3f5' },
                    label: { fontSize: '1.1rem', marginBottom: 6 }
                  }}
                />
              </Stack>

            </Stack>
          </Stepper.Step>

          {/* PASO 2: HABILIDADES */}
          <Stepper.Step label="Habilidades" description="Tu stack técnico" icon={<IconCode size={18} />}>
            <Stack mt="lg">
              <Title order={4}>Define tu Stack Tecnológico</Title>
              <SkillsSelector 
                selectedSkills={formData.skills}
                onChange={(newSkills) => setFormData({...formData, skills: newSkills})}
              />
            </Stack>
          </Stepper.Step>

          {/* PASO 3: RESULTADOS (Ahora conectado al Dashboard) */}
          <Stepper.Step label="Análisis" description="Resultados IA" icon={<IconChartBar size={18} />}>
            {results && (
              <ResultsDashboard results={results} onReset={handleReset} />
            )}
          </Stepper.Step>
          
        </Stepper>

        {/* BOTONES DE NAVEGACIÓN (Solo visibles si no estamos en resultados) */}
        {activeStep < 2 && (
          <Group justify="center" mt="xl">
            {activeStep > 0 && (
              <Button variant="default" onClick={prevStep}>Atrás</Button>
            )}
            <Button 
              color="orange" 
              size="md"
              onClick={activeStep === 1 ? handleAnalysis : nextStep}
            >
              {activeStep === 1 ? 'Procesar con IA' : 'Siguiente'}
            </Button>
          </Group>
        )}

      </Paper>
    </Container>
  );
}
