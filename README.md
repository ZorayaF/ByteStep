# 🚀 ByteStep: Asesor de Carrera Inteligente con IA

**ByteStep** es una aplicación web *Full Stack* impulsada por Inteligencia Artificial que ayuda a profesionales de TI a planificar su crecimiento laboral.

Utilizando modelos de Machine Learning entrenados con datos reales del mercado, ByteStep predice tu salario actual y te recomienda una ruta de aprendizaje personalizada para aumentar tus ingresos.

## 🌟 Características Principales

- **Predicción Salarial IA:** Estimación precisa basada en experiencia, rol, país y habilidades (Modelo XGBoost).
- **Simulador "What-If":** Calcula cuánto aumentaría tu salario si aprendes tecnologías específicas (ej. AWS, Kubernetes).
- **Análisis de Mercado Real:** Basado en la demanda extraída de LinkedIn y Stack Overflow Survey 2023.
- **Interfaz Moderna:** Dashboard interactivo con visualización de datos.

## 🛠️ Stack Tecnológico

### Ciencia de Datos & ML
- **Python**: Lenguaje principal.
- **Pandas & NumPy**: Procesamiento y limpieza de datos.
- **XGBoost**: Algoritmo de regresión para la predicción salarial.
- **Scikit-Learn**: Métricas y preprocesamiento.
- **Jupyter Notebooks**: Entorno de experimentación.

### 💾 Datos
Los datasets utilizados no se incluyen en este repositorio por su tamaño. 
Puedes descargarlos desde sus fuentes originales y colocarlos en la carpeta `machine-learning/datasets/`:

1. **LinkedIn Job Postings:** [Descargar en Kaggle](https://www.kaggle.com/datasets/arshkon/linkedin-job-postings)
2. **Stack Overflow Survey 2023:** [Descargar en Kaggle](https://www.kaggle.com/datasets/stackoverflow/stack-overflow-2023-developers-survey)

### Backend (API)
- **FastAPI**: Framework moderno y rápido para servir el modelo.
- **Pydantic**: Validación de datos.
- **Uvicorn**: Servidor ASGI.

### Frontend
- **React + Vite**: Entorno de desarrollo ultrarrápido.
- **Mantine UI**: Componentes de diseño y sistema de estilos.
- **Tabler Icons**: Iconografía.
- **React CountUp**: Animaciones numéricas.

## 📂 Estructura del Proyecto

```bash
ByteStep/
├── backend/              # API en FastAPI y Artefactos del Modelo (.pkl)
├── frontend/             # Aplicación React (src, public, components)
└── machine-learning/     # Notebooks de entrenamiento y Datasets
    ├── datasets/         # Datos crudos (LinkedIn, SO Survey)
    └── notebooks/        # Lógica de limpieza, EDA y entrenamiento
        └── finales/      # Procedimientos definitivos y optimizados
            ├── Prediccion_Salarios.ipynb # Pipeline completo de ML: Limpieza de datos (Stack Overflow), entrenamiento del modelo XGBoost y exportación de artefactos.
            └── Analisis_Mercado_TI.ipynb # Análisis estadístico de ofertas (LinkedIn) para identificar la demanda real de habilidades y definir las features del modelo.

```
## ⚡ Guía de Inicio Rápido (Ejecución Local)

## Para probar la aplicación en tu máquina, necesitarás **dos terminales** abiertas simultáneamente (una para backend y otra para frontend).

### Prerrequisitos
- Python 3.9+
- Node.js & npm
### Clonar el repositorio
```bash
git clone [https://github.com/ZorayaF/ByteStep.git](https://github.com/ZorayaF/ByteStep.git)
cd ByteStep
cd backend
```
### Instalar dependencias (si es la primera vez)
```bash
pip install -r requirements.txt
```
### Iniciar el servidor
```bash
uvicorn main:app --reload
cd frontend
```
### Instalar dependencias de React (si es la primera vez)
```bash
npm install
```
### Iniciar la aplicación
```bash
npm run dev
```

