from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
import os
import random 

# --- 1. CONFIGURACIÓN INICIAL ---
app = FastAPI(title="API Asesor Salarial IA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. CARGA DE ARTEFACTOS ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "modelo_salarial_xgb.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "model_features.pkl")

try:
    model = joblib.load(MODEL_PATH)
    model_features = joblib.load(FEATURES_PATH)
    print("✅ Modelo y Features cargados correctamente.")
except Exception as e:
    print(f"❌ Error cargando modelo: {e}")
    raise e

# --- 3. MODELO DE DATOS ---
class UserProfile(BaseModel):
    experience: int
    role: str
    country: str
    education: str
    skills: list[str]

# --- 4. PREPROCESAMIENTO ---
def prepare_input_dataframe(profile: UserProfile, feature_columns):
    input_data = {col: 0 for col in feature_columns}
    
    input_data['YearsCodePro'] = profile.experience
    
    edu_map = {
        "No degree": 1, "Primary/elementary school": 1, "Secondary school": 2,
        "Some college/university study without earning a degree": 3,
        "Associate degree": 4, "Bachelor’s degree": 5,
        "Master’s degree": 6, "Professional degree (PhD)": 7
    }
    input_data['EdLevel_Code'] = edu_map.get(profile.education, 5)

    col_pais = f"Country_{profile.country}"
    if col_pais in input_data:
        input_data[col_pais] = 1
    else:
        if 'Country_Other' in input_data: input_data['Country_Other'] = 1

    col_rol = f"Role_{profile.role}" 
    if col_rol in input_data:
        input_data[col_rol] = 1
    else:
         if 'Role_Other' in input_data: input_data['Role_Other'] = 1

    for skill in profile.skills:
        clean_name = skill.lower().replace(' ', '_').replace('.', '').replace('/', '')
        if clean_name == 'c++': clean_name = 'c++' 
        if clean_name == 'c#': clean_name = 'c#'
        col_skill = f"Skill_{clean_name}"
        if col_skill in input_data:
            input_data[col_skill] = 1
            
    return pd.DataFrame([input_data])

# --- NUEVO: GENERADOR DE TEXTOS INTELIGENTES ---
def generar_razon_inteligente(skill_name, impact):
    s = skill_name.lower()
    
    # A. Razones Técnicas Específicas
    if any(x in s for x in ['aws', 'azure', 'google', 'cloud', 'terraform']):
        return "La infraestructura Cloud es el pilar de la escalabilidad moderna."
    if any(x in s for x in ['kubernetes', 'docker', 'container']):
        return "La orquestación es crítica para reducir costos y tiempos de despliegue."
    if any(x in s for x in ['react', 'vue', 'angular', 'next', 'typescript']):
        return "Domina el ecosistema frontend moderno y mejora la experiencia de usuario."
    if any(x in s for x in ['python', 'go', 'rust', 'java', 'c++']):
        return "Lenguaje de backend de alto rendimiento para sistemas robustos."
    if any(x in s for x in ['sql', 'mongo', 'redis', 'postgres', 'data']):
        return "El manejo avanzado de datos es vital para la inteligencia de negocio."
    if any(x in s for x in ['spark', 'hadoop', 'pandas', 'pytorch', 'tensorflow']):
        return "Habilidad central para liderar en Ciencia de Datos e IA."

    # B. Razones Económicas (Si no cae en técnica específica)
    if impact > 15000:
        return random.choice([
            "Un 'Game Changer' absoluto para tu perfil salarial.",
            "Te posiciona inmediatamente en el percentil superior del mercado.",
            "Habilidad escasa y extremadamente bien pagada."
        ])
    elif impact > 8000:
        return random.choice([
            "Alta demanda en empresas tecnológicas Tier-1.",
            "Fuerte diferenciador frente a perfiles estándar.",
            "Expande significativamente tu abanico de ofertas."
        ])
    else:
        return random.choice([
            "Complemento sólido para redondear tu stack técnico.",
            "Aumenta tu versatilidad y atractivo para reclutadores.",
            "Valorada positivamente para roles full-stack."
        ])

# --- 5. ENDPOINT ---
@app.post("/predict")
def predict_salary(profile: UserProfile):
    try:
        df_input = prepare_input_dataframe(profile, model_features)
        
        log_pred = model.predict(df_input)[0]
        salary_estimated = float(np.expm1(log_pred))
        
        recommendations = []
        possible_skills = [col for col in model_features if col.startswith('Skill_')]
        
        skills_to_try = []
        for skill in possible_skills:
            if skill in df_input.columns:
                if df_input.at[0, skill] == 0:
                    skills_to_try.append(skill)
        
        for skill_col in skills_to_try:
            df_sim = df_input.copy()
            df_sim.at[0, skill_col] = 1 
            
            log_pred_sim = model.predict(df_sim)[0]
            salary_sim = float(np.expm1(log_pred_sim))
            impact = salary_sim - salary_estimated
            
            if impact > 2000:
                readable_name = skill_col.replace('Skill_', '').replace('_', ' ')
                
                # USAMOS LA NUEVA LÓGICA AQUÍ
                reason_text = generar_razon_inteligente(readable_name, impact)
                
                recommendations.append({
                    "skill": readable_name,
                    "estimated_impact": round(impact, 2),
                    "reason": reason_text
                })
        
        recommendations = sorted(recommendations, key=lambda x: x['estimated_impact'], reverse=True)[:4]
        
        return {
            "predicted_salary": round(salary_estimated, 2),
            "salary_range_min": round(salary_estimated * 0.9, 2),
            "salary_range_max": round(salary_estimated * 1.1, 2),
            "recommendations": recommendations
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))