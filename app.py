"""
Experiment 8: Feedback Form using Flask
IT Engineering Mini-Project Microservice

Features:
- Flask REST API listening on port 5001
- Handles GET and POST for /api/feedback
- Persists feedback records to local feedback.json
"""

import os
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

FEEDBACK_FILE = os.path.join(os.path.dirname(__file__), 'feedback.json')

def load_feedback():
    if not os.path.exists(FEEDBACK_FILE):
        return []
    try:
        with open(FEEDBACK_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

def save_feedback(data):
    with open(FEEDBACK_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

@app.route('/api/feedback', methods=['GET'])
def get_feedback():
    records = load_feedback()
    return jsonify({
        "status": "success",
        "count": len(records),
        "feedback": records
    }), 200

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    payload = request.get_json() or {}
    agent_name = payload.get('agentName', 'Anonymous Operative')
    email = payload.get('email', 'student@gmail.com')
    rating = payload.get('rating', 5)
    category = payload.get('category', 'General')
    comments = payload.get('comments', '')

    new_record = {
        "id": f"fb_{int(datetime.now().timestamp() * 1000)}",
        "agentName": agent_name,
        "email": email,
        "rating": rating,
        "category": category,
        "comments": comments,
        "submittedAt": datetime.now().isoformat()
    }

    records = load_feedback()
    records.append(new_record)
    save_feedback(records)

    return jsonify({
        "status": "success",
        "message": "Operative feedback successfully processed by Flask controller.",
        "record": new_record
    }), 201

if __name__ == '__main__':
    print("Flask Feedback Form Service active on http://localhost:5001")
    app.run(port=5001, debug=True)
