from sqlalchemy import Column, String, SmallInteger, Boolean
from sqlalchemy.orm import relationship
from appv1.models.base_class import Base

class Category(Base):
    _tablename_ = "category"

    category_id = Column(SmallInteger, primary_key=True, autoincrement=True)
    category_name = Column(String(50),nullable=False)
    category_description = Column(String(120),nullable=False)
    category_status = Column(Boolean, default=True)

    transactions = relationship("Transaction", back_populates="category")