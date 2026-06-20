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
        title="AETHER-RAMI V10 Omega API Platform",
        description="Investor-grade AI-powered drug discovery, protein intelligence, and human digital twin operating system",
        version="10.0.0",
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
            "model": "AETHER-RAMI V10 Omega",
            "capabilities": [
                "Precision Medicine Engine",
                "Multi-Omics Foundation Model",
                "Protein Dynamics & MD Workflow",
                "AI Medicinal Chemist",
                "Drug Repurposing Engine",
                "Disease Knowledge Graph",
                "Autonomous Research Agent",
                "Manufacturing Readiness",
                "Clinical Trial Risk Engine",
                "Digital Human Twin",
                "Explainable AI Center",
                "Global Drug Intelligence",
                "Molecular Generator",
                "Benchmarking Arena",
                "Regulatory Readiness Suite"
            ]
        }
        
    @app.on_event("startup")
    async def startup_event():
        logger.info("Initializing AETHER-RAMI V10 Omega research engine and retrieval indexes...")
        # Models are loaded inside inference services on-demand or at startup
        
    return app

app = create_app()
