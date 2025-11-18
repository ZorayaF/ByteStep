import { useState } from 'react';
import { 
  Tabs, Chip, Group, Text, TextInput, Paper, ScrollArea, rem,
  ThemeIcon, Title, Stack, Badge, ActionIcon
} from '@mantine/core';
import { IconSearch, IconCloud, IconCode, IconDatabase, IconTools, IconX } from '@tabler/icons-react';

// --- LISTA DE HABILIDADES AMPLIADA (Basada en tu análisis de mercado) ---
const SKILL_CATEGORIES = {
  languages: {
    label: 'Lenguajes & Scripting',
    icon: <IconCode style={{ width: rem(18), height: rem(18) }} />,
    skills: [
      'Python', 'JavaScript', 'TypeScript', 'Go', 'Java',
      'C', 'C++', 'C#', 'R', 'Ruby', 'Rust', 'Swift',
      'Kotlin', 'Scala', 'PHP', 'Perl', 'Ada',
      'Bash', 'PowerShell'
    ]
  },

  cloud: {
    label: 'Cloud & DevOps',
    icon: <IconCloud style={{ width: rem(18), height: rem(18) }} />,
    skills: [
      'AWS', 'Azure', 'Google Cloud',
      'Docker', 'Kubernetes', 'Terraform',
      'Jenkins', 'Git', 'GitHub', 'GitLab',
      'Linux', 'Unix', 'VMware',
      'Ansible', 'Chef', 'Puppet'
    ]
  },

  data: {
    label: 'Bases de Datos & Data',
    icon: <IconDatabase style={{ width: rem(18), height: rem(18) }} />,
    skills: [
      'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL',
      'Microsoft SQL Server', 'Redis', 'Oracle',
      'Pandas', 'NumPy', 'TensorFlow', 'PyTorch',
      'Spark', 'PySpark', 'SAS', 'Hadoop', 'Tableau'
    ]
  },

  frameworks: {
    label: 'Frameworks & Desarrollo Web',
    icon: <IconTools style={{ width: rem(18), height: rem(18) }} />,
    skills: [
      'React', 'Node.js', 'Vue', 'Angular',
      'Django', 'Spring Boot', 'FastAPI',
      'Next.js', 'GraphQL', 'jQuery', 'Bootstrap', 'J2EE'
    ]
  },

  tools: {
    label: 'Herramientas',
    icon: <IconTools style={{ width: rem(18), height: rem(18) }} />,
    skills: [
      'Figma', 'Postman', 'Selenium', 'JUnit',
      'Microsoft Project', 'ServiceNow'
    ]
  }
};


export function SkillsSelector({ selectedSkills, onChange }) {
  const [search, setSearch] = useState('');

  const handleToggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      onChange(selectedSkills.filter(s => s !== skill));
    } else {
      onChange([...selectedSkills, skill]);
    }
  };

  return (
    <Stack gap="lg">
      
      {/* CABECERA */}
      <Paper p="lg" radius="lg" style={{ backgroundColor: '#fffdec', border: '1px solid #fff59d' }}>
        <Group justify="space-between">
          <Group>
            <ThemeIcon size={42} radius="md" color="byteYellow" variant="filled">
              <IconCode size={24} color="black" stroke={2} />
            </ThemeIcon>
            <div>
              <Title order={3} style={{ color: '#2d2d2d' }}>Stack Tecnológico</Title>
              <Text size="md" c="dimmed" style={{ lineHeight: 1.3 }}>
                Selecciona las tecnologías que dominas actualmente.
              </Text>
            </div>
          </Group>
          <Badge size="xl" circle color="black">{selectedSkills.length}</Badge>
        </Group>
      </Paper>

      {/* ÁREA DE SELECCIÓN */}
      <Paper shadow="none" p={0} radius="lg">
        
        <TextInput
          placeholder="¿Qué sabes hacer? (Ej: Java, AWS, Tableau...)"
          leftSection={<IconSearch style={{ width: rem(20), height: rem(20) }} />}
          rightSection={search && (<ActionIcon variant="transparent" onClick={() => setSearch('')}><IconX size={16} /></ActionIcon>)}
          mb="lg" value={search} onChange={(e) => setSearch(e.target.value)}
          size="lg" radius="md" variant="filled"
          styles={{ input: { backgroundColor: '#f1f3f5', fontWeight: 500 } }}
        />

        <Tabs 
          defaultValue="languages" 
          variant="pills" 
          radius="md" 
          color="byteYellow"
          styles={{
            tab: {
              color: '#666',
              fontSize: '1rem',
              padding: '12px',
              '&[data-active]': {
                color: '#000000', 
                fontWeight: 700,
              }
            }
          }}
        >
          <Tabs.List mb="md" grow>
            {Object.entries(SKILL_CATEGORIES).map(([key, category]) => (
              <Tabs.Tab key={key} value={key} leftSection={category.icon}>
                {category.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          {Object.entries(SKILL_CATEGORIES).map(([key, category]) => (
            <Tabs.Panel key={key} value={key}>
              <Paper withBorder p="md" radius="md" style={{ borderColor: 'rgba(0,0,0,0.05)', backgroundColor: '#fafafa' }}>
                
                {/* Mantenemos la altura optimizada que definimos antes */}
                <ScrollArea h={180} type="hover" offsetScrollbars>
                  <Group gap="sm">
                    {category.skills
                      .filter(skill => skill.toLowerCase().includes(search.toLowerCase()))
                      .map(skill => (
                        <Chip
                          key={skill}
                          checked={selectedSkills.includes(skill)}
                          onChange={() => handleToggleSkill(skill)}
                          variant="filled"
                          color="byteYellow"
                          size="lg" 
                          radius="md"
                          styles={{
                            label: { fontWeight: 600, color: selectedSkills.includes(skill) ? 'black' : '#555' },
                            iconWrapper: { color: 'black' }
                          }}
                        >
                          {skill}
                        </Chip>
                      ))}
                      
                    {category.skills.filter(s => s.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                      <Text c="dimmed" size="sm" ta="center" w="100%" py="xl">
                        No encontramos "{search}" en esta categoría. <br/> Prueba buscar en otra pestaña.
                      </Text>
                    )}
                  </Group>
                </ScrollArea>

              </Paper>
            </Tabs.Panel>
          ))}
        </Tabs>
      </Paper>

      {/* RESUMEN */}
      {selectedSkills.length > 0 && (
        <Paper p="md" radius="md" bg="gray.0">
          <Text size="sm" fw={700} tt="uppercase" c="dimmed" mb="xs">Tu Stack Seleccionado:</Text>
          <Group gap="xs">
            {selectedSkills.map(skill => (
              <Badge key={skill} size="lg" color="dark" variant="outline" rightSection={<ActionIcon size="xs" color="dark" variant="transparent" onClick={() => handleToggleSkill(skill)}><IconX size={10} /></ActionIcon>}>
                {skill}
              </Badge>
            ))}
          </Group>
        </Paper>
      )}
    </Stack>
  );
}