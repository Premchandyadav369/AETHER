import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.endpoints import router as api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("aether-rami-backend")

def create_app() -> FastAPI:
    app = FastAPI(
        title="AETHER-RAMI V6 API Platform",
        description="Production-grade backend service for Protein-Aware Drug Discovery Foundation Model",
        version="6.0.0",
        docs_url="/docs",
        redoc_url="/redoc"
    )
    
    # CORS Configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, specify frontend origin
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include endpoints router
    app.include_router(api_router, prefix="/v1")
    
    @app.get("/")
    async def root():
        return {
            "status": "online",
            "model": "AETHER-RAMI V6",
            "capabilities": [
                "Drug Discovery Studio",
                "Protein Intelligence",
                "Binding Affinity Prediction",
                "Molecular Generation",
                "RAMI Retrieval Engine",
                "Explainable AI (SHAP/Attention)"
            ]
        }
        
    @app.on_event("startup")
    async def startup_event():
        logger.info("Initializing AETHER-RAMI V6 models and FAISS search indexes...")
        # Models are loaded inside inference services on-demand or at startup
        
    return app

app = create_app()
