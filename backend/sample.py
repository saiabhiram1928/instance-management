from config import Config
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.users import User
import hashlib
import bcrypt

data = [
    {
        'email' : "user1@gmail.com",
        'password': "Test1@1234"
    },
    {
        'email' : "user2@gmail.com",
        'password': "Test2@1234"
    }
]
engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()

def generate_salt():
    return bcrypt.gensalt().decode('utf-8')

def hash_password(password, salt):
    salted_password = (password + salt).encode('utf-8')
    return hashlib.sha256(salted_password).hexdigest()

def insertData():
    for user in data:
        existing_user = session.query(User).filter_by(email=user['email']).first()
        if existing_user:
            print(f"User with eamil : {user['email']} already existed , skipping ...")
            continue
        salt = generate_salt()
        password_hash = hash_password(user['password'], salt)
        new_user = User(
            email = user['email'],
            password_hash = password_hash,
            salt = salt
        )
        try:
            session.add(new_user)
            session.commit()
            print(f"Successfully added user: {user['email']}")
        except Exception as e:
            session.rollback()
            print(f"Error adding user {user['email']}: {str(e)}")
if __name__ == '__main__':
    print("Inserting sample users...")
    insertData()