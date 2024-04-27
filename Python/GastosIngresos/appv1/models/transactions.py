from sqlalchemy import Column, Integer, String, Enum, Float, Date,  ForeignKey
from sqlalchemy.orm import relationship
from appv1.models.base_class import Base
from appv1.models.category import Category

class Transaction(Base):
    __tablename__ = 'transactions'

    transactions_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(30), ForeignKey('users.user_id'))
    category_id = Column(Integer, ForeignKey('category.category_id'))
    amount = Column(Float(10, 2))
    t_description = Column(String(120))
    t_type = Column(Enum('revenue', 'expenses'))
    t_date = Column(Date)

    user = relationship("User", back_populates="transactions")
    category = relationship("Category", back_populates="transactions")