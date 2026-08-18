import threading
from typing import Any, Dict


class AIEngine:
    """Singleton AI engine that simulates loading a model and performing predictions.

    This is a light-weight thread-safe singleton. In real code the _load_model
    method should load the actual heavy model (from disk, network, etc.).
    """

    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(AIEngine, cls).__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        if getattr(self, "_initialized", False):
            return
        self.model = None
        self._load_model()
        self._initialized = True

    def _load_model(self) -> None:
        """Simulate a model loading operation.

        Replace this with real model loading logic (torch.load, transformers, etc.).
        """
        # simulated model metadata
        self.model = {"name": "dummy-model", "version": "0.1"}

    def predict(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Run a fake prediction. Replace this with real inference code."""
        # Simulated deterministic prediction for demo purposes
        value = 0.95
        return {"status": "success", "prediction": value, "input": data}


def get_ia_engine() -> AIEngine:
    """Convenience accessor for the singleton instance."""
    return AIEngine()
