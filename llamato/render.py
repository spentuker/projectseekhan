from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    user_prompt = data.get('user_prompt', '')
    return jsonify({"message": f"The name is {user_prompt}"})  

if __name__ == '__main__':
    app.run(debug=True)

    
