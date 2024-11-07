from flask import Blueprint, request
from .controllers import register_user, login_user, get_classes, get_quizzes

auth_bp = Blueprint('auth', __name__)
class_bp = Blueprint('class', __name__)
quiz_bp = Blueprint('quiz', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    return register_user(request.json)

@auth_bp.route('/login', methods=['POST'])
def login():
    return login_user(request.json)

@class_bp.route('/', methods=['GET'])
def classes():
    return get_classes()

@quiz_bp.route('/', methods=['GET'])
def quizzes():
    return get_quizzes()
    