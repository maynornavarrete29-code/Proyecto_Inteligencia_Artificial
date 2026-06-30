"""Face ID Service"""
import math
from typing import List, Dict, Tuple, Optional
from app.config import settings


class FaceIDService:
    """Face ID and biometric authentication logic"""
    
    @staticmethod
    def calculate_euclidean_distance(descriptor1: List[float], descriptor2: List[float]) -> float:
        """Calculate Euclidean distance between two descriptors"""
        if len(descriptor1) != len(descriptor2):
            raise ValueError("Descriptors must have same length")
        
        sum_of_squares = sum((d1 - d2) ** 2 for d1, d2 in zip(descriptor1, descriptor2))
        distance = math.sqrt(sum_of_squares)
        return float(distance)
    
    @staticmethod
    def compare_descriptors(
        new_descriptor: List[float],
        stored_descriptors: List[List[float]],
        threshold: float = settings.FACE_DISTANCE_THRESHOLD
    ) -> Dict[str, any]:
        """Compare new descriptor against stored descriptors"""
        
        if not stored_descriptors:
            return {
                "isMatch": False,
                "confidence": 0,
                "distance": float('inf'),
                "bestDistance": float('inf')
            }
        
        distances = []
        for stored_desc in stored_descriptors:
            try:
                distance = FaceIDService.calculate_euclidean_distance(new_descriptor, stored_desc)
                distances.append(distance)
            except Exception as e:
                print(f"Error comparing descriptors: {e}")
                continue
        
        if not distances:
            return {
                "isMatch": False,
                "confidence": 0,
                "distance": float('inf'),
                "bestDistance": float('inf')
            }
        
        best_distance = min(distances)
        max_distance = 1.0
        confidence = max(0, 100 * (1 - best_distance / max_distance))
        
        return {
            "isMatch": best_distance < threshold,
            "confidence": round(confidence),
            "distance": round(best_distance, 4),
            "bestDistance": best_distance
        }
    
    @staticmethod
    def validate_descriptors(descriptors: List[Dict]) -> Tuple[bool, str]:
        """Validate descriptor data"""
        
        if not descriptors:
            return False, "No descriptors provided"
        
        if len(descriptors) < 1:
            return False, "At least 1 descriptor required"
        
        for i, desc in enumerate(descriptors):
            if not isinstance(desc.get("descriptor"), list):
                return False, f"Descriptor {i} is not a list"
            
            if len(desc.get("descriptor", [])) != 128:
                return False, f"Descriptor {i} should have 128 values"
            
            if not isinstance(desc.get("quality"), (int, float)):
                return False, f"Descriptor {i} quality is invalid"
        
        return True, "Valid descriptors"
    
    @staticmethod
    def calculate_average_quality(descriptors: List[Dict]) -> float:
        """Calculate average quality from descriptors"""
        if not descriptors:
            return 0.0
        
        qualities = [d.get("quality", 75) for d in descriptors]
        return round(sum(qualities) / len(qualities), 2)
    
    @staticmethod
    def extract_pure_descriptors(descriptors: List[Dict]) -> List[List[float]]:
        """Extract pure descriptor arrays from descriptor objects"""
        pure_descriptors = []
        for desc in descriptors:
            if isinstance(desc.get("descriptor"), list):
                pure_descriptors.append(desc["descriptor"])
        return pure_descriptors
