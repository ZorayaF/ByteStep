import streamlit as st
import pandas as pd
import numpy as np
import joblib

# --- CONFIGURACIÓN DE LA PÁGINA ---
st.set_page_config(page_title="Predicción Salarial IA", layout="wide")

# --- 1. CARGA DE ARTEFACTOS ---
@st.cache_resource
def cargar_modelo():
    modelo = joblib.load('modelo_salarial_xgb.pkl')
    features = joblib.load('model_features.pkl')
    return modelo, features

try:
    model, model_features = cargar_modelo()
except FileNotFoundError:
    st.error("Error: No se encontraron los archivos .pkl. Asegúrate de haber ejecutado el notebook de entrenamiento.")
    st.stop()

# --- 2. INTERFAZ DE USUARIO (SIDEBAR) ---
st.sidebar.header("Tu Perfil Profesional")

# A. Entradas Numéricas
experiencia = st.sidebar.slider("Años de Experiencia Profesional", 0, 50, 5)

# B. Entradas Categóricas (Listas simplificadas basadas en tu EDA)
paises = ['United States of America', 'Germany', 'United Kingdom', 'India', 'Canada', 'France', 'Brazil', 'Spain', 'Netherlands', 'Australia', 'Other']
pais = st.sidebar.selectbox("País de Residencia", paises)

roles = ['Developer, back-end', 'Developer, full-stack', 'Developer, front-end', 'Developer, mobile', 'DevOps specialist', 'Data scientist or machine learning specialist', 'Engineering manager', 'Other']
rol = st.sidebar.selectbox("Rol Principal", roles)

nivel_edu = st.sidebar.selectbox("Nivel Educativo", [
    "Bachelor’s degree", "Master’s degree", "Professional degree (PhD)", "Associate degree", "No degree"
])

# C. Habilidades (Checklist)
# Esta lista debe coincidir con las que usamos en el entrenamiento (tu lista de demanda)
skills_disponibles = [
    'python', 'aws', 'azure', 'go', 'java', 'javascript', 'linux', 'c++', 'git',
    'kubernetes', 'docker', 'react', 'google cloud', 'sql', 'bash', 'typescript',
    'terraform', 'node.js', 'php', 'c#', 'spark' # Añade las que faltan de tu lista top
]
skills_usuario = st.sidebar.multiselect("Habilidades que posees", skills_disponibles, default=['python', 'sql'])


# --- 3. LÓGICA DE PREPROCESAMIENTO ---
def preparar_input_usuario(exp, pais, rol, edu, skills, columnas_modelo):
    # Crear un diccionario con ceros para todas las columnas esperadas
    input_data = {col: 0 for col in columnas_modelo}
    
    # 1. Llenar Datos Numéricos
    input_data['YearsCodePro'] = exp
    
    # 2. Llenar Nivel Educativo (Mapeo manual aproximado al Label Encoding)
    edu_map = {
        "No degree": 1, "Associate degree": 4, "Bachelor’s degree": 5,
        "Master’s degree": 6, "Professional degree (PhD)": 7
    }
    input_data['EdLevel_Code'] = edu_map.get(edu, 5)
    
    # 3. Llenar País (One-Hot)
    # El modelo espera 'Country_United States of America', etc.
    col_pais = f"Country_{pais}"
    if col_pais in input_data:
        input_data[col_pais] = 1
    else:
        if 'Country_Other' in input_data: input_data['Country_Other'] = 1
        
    # 4. Llenar Rol (One-Hot)
    col_rol = f"Role_{rol}"
    if col_rol in input_data:
        input_data[col_rol] = 1
    else:
        if 'Role_Other' in input_data: input_data['Role_Other'] = 1
        
    # 5. Llenar Skills (One-Hot)
    # El modelo espera 'Skill_python', 'Skill_aws', etc.
    for skill in skills:
        # Limpieza simple para coincidir con el formato del entrenamiento
        nombre_skill_limpio = skill.replace(' ', '_').replace('.', '')
        col_skill = f"Skill_{nombre_skill_limpio}"
        
        # Intentamos encontrar la columna (Manejo de nombres aprox)
        if col_skill in input_data:
            input_data[col_skill] = 1
        else:
            # Búsqueda manual por si acaso (ej. 'Skill_amazon_web_services' vs 'aws')
            # Aquí podrías añadir más lógica si los nombres difieren
            pass 
            
    return pd.DataFrame([input_data])

# --- 4. MOTOR DE PREDICCIÓN Y RECOMENDACIÓN ---

if st.sidebar.button("Calcular Salario y Recomendaciones"):
    
    # A. Preparar datos
    df_usuario = preparar_input_usuario(experiencia, pais, rol, nivel_edu, skills_usuario, model_features)
    
    # B. Predicción Base
    log_pred = model.predict(df_usuario)[0]
    salario_estimado = np.expm1(log_pred)
    
    st.title("💰 Resultado del Análisis")
    st.metric(label="Salario Anual Estimado", value=f"${salario_estimado:,.2f} USD")
    
    # C. Motor de Recomendación (What-If)
    st.subheader("🚀 Oportunidades de Crecimiento")
    st.write("Basado en la demanda del mercado y tu perfil actual, estas habilidades podrían aumentar tus ingresos:")
    
    recomendaciones = []
    skills_a_evaluar = [s for s in skills_disponibles if s not in skills_usuario]
    
    barra_progreso = st.progress(0)
    
    for i, skill_test in enumerate(skills_a_evaluar):
        # Actualizar barra
        barra_progreso.progress((i + 1) / len(skills_a_evaluar))
        
        # Crear perfil simulado
        df_simulado = df_usuario.copy()
        nombre_col_skill = f"Skill_{skill_test.replace(' ', '_').replace('.', '')}"
        
        if nombre_col_skill in df_simulado.columns:
            df_simulado[nombre_col_skill] = 1 # El usuario "aprende" la habilidad
            
            # Predecir nuevo salario
            log_pred_sim = model.predict(df_simulado)[0]
            salario_simulado = np.expm1(log_pred_sim)
            diferencia = salario_simulado - salario_estimado
            
            if diferencia > 500: # Solo mostrar si el aumento es significativo
                recomendaciones.append({
                    "Habilidad": skill_test.upper(),
                    "Impacto Anual": diferencia,
                    "Nuevo Salario": salario_simulado
                })
    
    barra_progreso.empty() # Limpiar barra
    
    if recomendaciones:
        df_rec = pd.DataFrame(recomendaciones).sort_values(by="Impacto Anual", ascending=False).head(5)
        
        for index, row in df_rec.iterrows():
            st.success(f"Aprender **{row['Habilidad']}** podría sumar **+${row['Impacto Anual']:,.0f}** a tu salario anual.")
    else:
        st.info("Tu perfil ya es muy competitivo. Intenta cambiar de Rol o País para ver mayores saltos.")

else:
    st.info("👈 Configura tu perfil en la barra lateral y presiona 'Calcular' para empezar.")
    st.write("Este modelo utiliza IA entrenada con datos de Stack Overflow 2023 para predecir salarios y recomendar rutas de aprendizaje.")