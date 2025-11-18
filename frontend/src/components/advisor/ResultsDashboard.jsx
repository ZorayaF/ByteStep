import { 
  Paper, Text, Title, Group, RingProgress, Center, 
  Timeline, ThemeIcon, Badge, Button, 
  HoverCard, Stack, Grid
} from '@mantine/core';
import { 
  IconCurrencyDollar, IconRocket, IconChartBar, 
  IconRefresh, IconInfoCircle, IconTrophy
} from '@tabler/icons-react';
import CountUp from 'react-countup'; // <--- IMPORTANTE: LA NUEVA LIBRERÍA

export function ResultsDashboard({ results, onReset }) {
  
  const currentSalary = results.predicted_salary;
  const maxPotential = results.recommendations.reduce((acc, rec) => acc + rec.estimated_impact, currentSalary);
  const progressValue = (currentSalary / maxPotential) * 100;
  const gap = maxPotential - currentSalary;

  return (
    <Stack gap="xl">
      {/* --- ESTILOS DE ANIMACIÓN (CSS EN JS) --- */}
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseSlow {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .animate-entry {
          opacity: 0; /* Invisible al inicio */
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hover-scale {
          transition: transform 0.2s ease;
        }
        .hover-scale:hover {
          transform: translateY(-5px);
        }
      `}</style>

      {/* 1. CABECERA DE ÉXITO (Animación inmediata: 0s delay) */}
      <Paper 
        p="lg" 
        radius="lg" 
        className="animate-entry"
        style={{ 
          backgroundColor: '#e6fcf5', 
          border: '1px solid #96f2d7',
          animationDelay: '0.1s' 
        }}
      >
        <Group>
          <ThemeIcon size={50} radius="50%" color="teal" variant="filled" className="hover-scale">
            <IconTrophy size={28} stroke={2} />
          </ThemeIcon>
          <div>
            <Title order={3} style={{ color: '#0ca678', lineHeight: 1, fontFamily: 'Poppins, sans-serif' }}>¡Análisis Completado!</Title>
            <Text size="md" c="teal.8" fw={500} mt={4} style={{ fontFamily: 'Poppins, sans-serif' }}>
              Hemos detectado una oportunidad de crecimiento del <b><CountUp end={((gap/currentSalary)*100)} duration={2.5} />%</b> en tu perfil.
            </Text>
          </div>
        </Group>
      </Paper>

      {/* 2. DASHBOARD PRINCIPAL */}
      <Grid gutter="lg">
        
        {/* IZQUIERDA: MEDIDOR (Delay 0.2s) */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper 
            shadow="md" 
            radius="xl" 
            p="xl" 
            className="animate-entry"
            style={{ 
              height: '100%', 
              backgroundColor: '#636262ff', 
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              animationDelay: '0.2s'
            }}
          >
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%' }} />
            
            <Text
              tt="uppercase"
              size="xs"
              fw={700}
              c="white" 
              mb="md"
              style={{ letterSpacing: '2px', fontFamily: 'Poppins, sans-serif' }}
            >
              Valor de Mercado Actual
            </Text>

            <RingProgress
              size={320}
              thickness={30}
              roundCaps
              // Animamos el anillo progresivamente
              sections={[
                { value: progressValue, color: 'byteYellow', tooltip: 'Tu nivel actual' },
                { value: 100 - progressValue, color: 'rgba(255,255,255,0.1)', tooltip: 'Potencial restante' },
              ]}
              label={
                <Stack align="center" gap={0}>
                  <Text size="xs" c="white" style={{ fontFamily: 'Poppins, sans-serif' }}>USD / Año</Text>
                  <Title 
                    order={1} 
                    style={{ 
                      fontSize: '2.5rem', 
                      color: '#ffeb3b', 
                      lineHeight: 1,
                      fontFamily: 'Poppins, sans-serif' 
                    }}
                  >
                    {/* CONTADOR ANIMADO DE DINERO */}
                    $<CountUp end={currentSalary} separator="." duration={2} />
                  </Title>
                </Stack>
              }
            />

            <Group mt="xl" justify="center">
              <Badge variant="filled" color="gray" size="lg" radius="sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Rango: $<CountUp end={results.salary_range_min/1000} />k - $<CountUp end={results.salary_range_max/1000} />k
              </Badge>
            </Group>
          </Paper>
        </Grid.Col>

        {/* DERECHA: ESTADÍSTICAS (Delay 0.3s) */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack h="100%" justify="center">
            
            <Paper shadow="xs" p="lg" radius="lg" withBorder className="animate-entry hover-scale" style={{ borderLeft: '6px solid #fcc419', animationDelay: '0.3s' }}>
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text c="dimmed" size="sm" fw={600} tt="uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>Potencial Máximo</Text>
                  <Title order={2} style={{ fontSize: '2.2rem', fontFamily: 'Poppins, sans-serif' }}>
                    $<CountUp end={maxPotential} separator="." duration={2.5} />
                  </Title>
                </div>
                <ThemeIcon size="xl" radius="md" color="yellow" variant="light">
                  <IconRocket size={28} />
                </ThemeIcon>
              </Group>
              <Text size="sm" c="dimmed" mt="xs" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Nivel salarial alcanzable adquiriendo las habilidades sugeridas.
              </Text>
            </Paper>

            <Paper shadow="xs" p="lg" radius="lg" withBorder className="animate-entry hover-scale" style={{ borderLeft: '6px solid #20c997', animationDelay: '0.4s' }}>
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text c="dimmed" size="sm" fw={600} tt="uppercase" style={{ fontFamily: 'Poppins, sans-serif' }}>Dinero sobre la mesa</Text>
                  <Title order={2} style={{ fontSize: '2.2rem', color: '#20c997', fontFamily: 'Poppins, sans-serif' }}>
                    +$<CountUp end={gap} separator="." duration={3} />
                  </Title>
                </div>
                <ThemeIcon size="xl" radius="md" color="teal" variant="light">
                  <IconChartBar size={28} />
                </ThemeIcon>
              </Group>
              <Text size="sm" c="dimmed" mt="xs" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Valor anual adicional estimado que podrías capturar.
              </Text>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* 3. LA RUTA DE ASCENSO (Delay 0.5s en adelante) */}
      <Paper shadow="sm" radius="xl" p={40} withBorder className="animate-entry" style={{ backgroundColor: '#fff', animationDelay: '0.5s' }}>
        <Title order={3} mb="xl" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
          🚀 Tu Ruta de Aprendizaje
        </Title>

        <Timeline active={1} bulletSize={50} lineWidth={4} color="byteYellow">
          
          <Timeline.Item 
            bullet={<ThemeIcon size={50} radius="xl" color="gray" variant="light"><IconCurrencyDollar size={26}/></ThemeIcon>} 
            title={<Text size="xl" fw={700} style={{ fontFamily: 'Poppins, sans-serif' }}>Situación Actual</Text>}
          >
            <Text c="dimmed" size="md" mt={4} style={{ fontFamily: 'Poppins, sans-serif' }}>
              Estás aquí: <b style={{ color: '#333' }}>$<CountUp end={currentSalary} separator="." /></b>
            </Text>
          </Timeline.Item>

          {results.recommendations.map((rec, index) => (
            <Timeline.Item 
              key={index} 
              // Añadimos un delay progresivo a cada item del timeline
              className="animate-entry"
              style={{ animationDelay: `${0.6 + (index * 0.2)}s` }} 
              bullet={
                <ThemeIcon 
                  size={50} 
                  radius="xl" 
                  color="byteYellow" 
                  variant="filled" 
                  className="hover-scale"
                  style={{ border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                >
                  <Text size="xl" fw={800} c="dark">{index + 1}</Text>
                </ThemeIcon>
              } 
              title={
                <Group gap="sm" mt={8} wrap="nowrap">
                  <Text size="xl" fw={800} tt="capitalize" style={{ fontFamily: 'Poppins, sans-serif', color: '#212529' }}>
                    {rec.skill}
                  </Text>
                  <Badge size="lg" variant="gradient" gradient={{ from: 'orange', to: 'yellow' }} style={{ fontFamily: 'Poppins, sans-serif', padding: '12px' }}>
                    +$<CountUp end={rec.estimated_impact} separator="." />
                  </Badge>
                </Group>
              }
            >
              <Paper withBorder p="md" radius="md" mt="md" bg="gray.0" style={{ borderLeft: '4px solid #fab005' }}>
                <Group align="flex-start" gap="md">
                  <IconInfoCircle size={24} color="#fab005" style={{ marginTop: 2 }}/>
                  <Text size="md" c="dark.3" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: 1.5 }}>
                    {rec.reason}
                  </Text>
                </Group>
              </Paper>
            </Timeline.Item>
          ))}

          <Timeline.Item 
            className="animate-entry"
            style={{ animationDelay: `${0.6 + (results.recommendations.length * 0.2)}s` }}
            bullet={<ThemeIcon size={50} radius="xl" color="teal" variant="filled"><IconRocket size={26}/></ThemeIcon>} 
            title={<Text size="xl" fw={800} c="teal" style={{ fontFamily: 'Poppins, sans-serif' }}>Objetivo Alcanzado</Text>}
          >
            <Text size="lg" mt={4} style={{ fontFamily: 'Poppins, sans-serif' }}>
              Nuevo valor de mercado: <b>$<CountUp end={maxPotential} separator="." /></b>
            </Text>
          </Timeline.Item>

        </Timeline>
      </Paper>

      {/* BOTÓN DE REINICIO */}
      <Center py="md" className="animate-entry" style={{ animationDelay: '2s' }}>
        <Button 
          variant="subtle" 
          color="gray" 
          size="md"
          leftSection={<IconRefresh size={18} />}
          onClick={onReset}
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Realizar nuevo análisis
        </Button>
      </Center>

    </Stack>
  );
}