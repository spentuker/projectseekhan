from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import User, Class, Quiz
from . import db

def register_user(data):
    name = data.get('name')
    email = data.get('email')
    password = generate_password_hash(data.get('password'))
    user = User(name=name, email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

def login_user(data):
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        token = create_access_token(identity=user.id)
        return jsonify(access_token=token), 200
    return jsonify({"message": "Invalid credentials"}), 401

@jwt_required()
def get_classes():
    classes = Class.query.all()
    return jsonify([{"id": c.id, "name": c.name, "description": c.description} for c in classes])

@jwt_required()
def get_quizzes():
    quizzes = Quiz.query.all()
    return jsonify([{"id": q.id, "title": q.title, "subject": q.subject, "date": q.date.isoformat()} for q in quizzes])
