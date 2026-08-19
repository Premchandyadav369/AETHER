import os
import sys
import logging
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure both project root and backend directory are in sys.path
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
for p in [str(BASE_DIR), str(PROJECT_ROOT)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from backend.api.endpoints import router as api_router
except ImportError:
    from api.endpoints import router as api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("aether-backend")

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
        allow_origins=["*"],  # In production, allow all or specify frontend origin
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
            "service": "AETHER AI Drug Discovery Operating System",
            "version": "10.0.0",
            "docs": "/docs",
            "capabilities": [
                "Precision Medicine Engine",
                "Digital Human Twin PBPK Simulator",
                "AI Medicinal Chemist & Lead Optimizer",
                "Quantum Pharmacology & Descriptors",
                "Global Drug Intelligence & Disease Graph",
                "Multi-Omics Foundation Model",
                "Protein Dynamics & MD Workflow",
                "Manufacturing & Synthesis Readiness",
                "Clinical Trial Risk Engine",
                "Explainable AI Center",
                "De Novo Molecular Generator",
                "Benchmarking Arena",
                "Regulatory Readiness Suite"
            ]
        }

    @app.get("/healthz")
    @app.get("/health")
    @app.get("/api/health")
    async def health_check():
        return {
            "status": "healthy",
            "service": "AETHER-RAMI Backend",
            "version": "10.0.0",
            "timestamp": "active"
        }
        
    @app.on_event("startup")
    async def startup_event():
        logger.info("Initializing AETHER-RAMI V10 Omega research engine and retrieval indexes...")
        
    return app

app = create_app()

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

