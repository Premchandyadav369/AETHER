from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class ModelRegistry(Base):
    """
    Model Registry Table.
    Tracks neural net checkpoints, architecture metadata, and benchmark evaluations.
    """
    __tablename__ = "model_registry"

    id = Column(Integer, primary_key=True, index=True)
    version = Column(String(50), unique=True, nullable=False)  # e.g., AETHER-RAMI V6.0.1
    status = Column(String(20), default="candidate")  # production, candidate, archived
    framework = Column(String(30), default="PyTorch")
    auc_score = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    mcc_score = Column(Float, nullable=False)
    rmse_score = Column(Float, nullable=False)
    hyperparameters = Column(JSON, nullable=True)
    storage_uri = Column(String(255), nullable=False)  # S3 or local path to .pt file
    created_at = Column(DateTime, default=datetime.utcnow)
    deployed_at = Column(DateTime, nullable=True)

class DatasetRegistry(Base):
    """
    Dataset Registry Table.
    Tracks benchmark datasets (e.g. BBBP, BACE, ClinTox, PDBBind).
    """
    __tablename__ = "dataset_registry"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    task_type = Column(String(20), nullable=False)  # classification, regression, dti
    num_samples = Column(Integer, nullable=False)
    source_url = Column(String(255), nullable=True)
    features_dim = Column(Integer, nullable=False)
    split_method = Column(String(50), default="scaffold")
    created_at = Column(DateTime, default=datetime.utcnow)

class ExperimentRegistry(Base):
    """
    Experiment tracking table.
    Integrates with MLflow/Weights & Biases style logging.
    """
    __tablename__ = "experiment_registry"

    id = Column(Integer, primary_key=True, index=True)
    run_name = Column(String(100), nullable=False)
    epoch = Column(Integer, default=0)
    train_loss = Column(Float, nullable=True)
    val_loss = Column(Float, nullable=True)
    metrics = Column(JSON, nullable=True)  # custom JSON fields
    git_commit = Column(String(40), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ActiveLearningFeedback(Base):
    """
    Expert human-in-the-loop validation table.
    Enables labeling corrections and active learning feedback loops.
    """
    __tablename__ = "active_learning_feedback"

    id = Column(Integer, primary_key=True, index=True)
    smiles = Column(Text, nullable=False)
    protein_pdb_id = Column(String(10), nullable=False)
    predicted_affinity = Column(Float, nullable=False)
    uncertainty_score = Column(Float, nullable=False)  # BALD uncertainty score
    expert_verified_affinity = Column(Float, nullable=True)
    expert_label_corrected = Column(Boolean, default=False)
    expert_username = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    retrained_in_version = Column(String(50), nullable=True)
