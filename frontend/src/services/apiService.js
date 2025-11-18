// Definimos la URL base de nuestra API de Flask
// Esto es mejor que escribir la URL completa en cada llamada
const API_BASE_URL = 'http://localhost:5000/api/v1';

/**
 * Función para obtener los datos del dashboard.
 * Esta es una función 'async' lo que nos permite usar 'await'
 * para esperar la respuesta de la API.
 */
export const getDashboardTrends = async () => {
  try {
    // 1. Llamamos al endpoint usando fetch (el 'curl' de JavaScript)
    const response = await fetch(`${API_BASE_URL}/dashboard/trends`);

    // 2. Si la respuesta no es OK (ej. 404, 500), lanzamos un error
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.statusText}`);
    }

    // 3. Convertimos la respuesta de JSON a un objeto de JavaScript
    const data = await response.json();

    // 4. Devolvemos los datos
    return data;

  } catch (error) {
    // 5. Si algo falla (la red, la API, etc.), lo mostramos en la consola
    console.error("No se pudieron obtener los datos del dashboard:", error);
    // Y devolvemos 'null' o lanzamos el error para que el componente lo maneje
    throw error;
  }
};

// --- En el futuro, añadiremos más funciones aquí ---
// export const getSalaryPrediction = async (profile) => { ... }
// export const getSkillRecommendations = async (profile) => { ... }