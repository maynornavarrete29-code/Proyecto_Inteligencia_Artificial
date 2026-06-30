"""JSON Database Handler"""
import json
from pathlib import Path
from typing import Any, Dict, List, Optional
from datetime import datetime
from app.config import settings


class Database:
    """Simple JSON-based database"""
    
    def __init__(self, db_path: Path = None):
        self.db_path = db_path or settings.DB_PATH
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Initialize DB if not exists
        if not self.db_path.exists():
            self._initialize_db()
    
    def _initialize_db(self):
        """Initialize empty database structure"""
        default_data = {
            "users": [],
            "emails": [],
            "projects": [],
            "tasks": []
        }
        self.write(default_data)
    
    def read(self) -> Dict[str, Any]:
        """Read entire database"""
        try:
            with open(self.db_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            self._initialize_db()
            return self.read()
    
    def write(self, data: Dict[str, Any]) -> None:
        """Write entire database"""
        with open(self.db_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def find_user_by_email(self, email: str) -> Optional[Dict]:
        """Find user by email"""
        data = self.read()
        return next(
            (u for u in data.get("users", []) if u["email"].lower() == email.lower()),
            None
        )
    
    def find_user_by_id(self, user_id: str) -> Optional[Dict]:
        """Find user by ID"""
        data = self.read()
        return next(
            (u for u in data.get("users", []) if u["id"] == user_id),
            None
        )
    
    def save_user(self, user: Dict) -> None:
        """Save user to database"""
        data = self.read()
        users = data.get("users", [])
        
        # Update or insert
        existing_index = next(
            (i for i, u in enumerate(users) if u["id"] == user["id"]),
            None
        )
        
        if existing_index is not None:
            users[existing_index] = user
        else:
            users.append(user)
        
        data["users"] = users
        self.write(data)
    
    def save_email(self, email: Dict) -> None:
        """Save email record"""
        data = self.read()
        emails = data.get("emails", [])
        emails.insert(0, email)  # Add to front
        data["emails"] = emails
        self.write(data)
    
    def get_emails(self) -> List[Dict]:
        """Get all emails"""
        data = self.read()
        return data.get("emails", [])
    
    def clear_emails(self) -> None:
        """Clear all emails"""
        data = self.read()
        data["emails"] = []
        self.write(data)


# Global database instance
db = Database()
