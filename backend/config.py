from os import path,environ
from dotenv import load_dotenv
from datetime import timedelta


basedir = path.abspath(path.dirname(__file__))
load_dotenv(path.join(basedir, '.env'))
allowed_host = environ.get('ALLOW_ORIGINS')
class Config:
    POSTGRES_USER = environ.get('POSTGRES_USER')
    POSTGRES_PASSWORD = environ.get('POSTGRES_PASSWORD')
    POSTGRES_HOST = environ.get('POSTGRES_HOST')
    POSTGRES_PORT = environ.get('POSTGRES_PORT')
    POSTGRES_DB = environ.get('POSTGRES_DB')
    SQLALCHEMY_DATABASE_URI = f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SESSION_TYPE = 'sqlalchemy'
    SESSION_SQLALCHEMY_TABLE = 'sessions'
    SESSION_COOKIE_SAMESITE = 'None'
    SECRET_KEY = environ.get('SECRET_KEY')
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    PERMANENT_SESSION_LIFETIME = timedelta(hours=1)

