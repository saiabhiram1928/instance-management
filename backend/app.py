from functools import wraps
import hashlib
from flask import Flask, jsonify , request , session
import boto3
from datetime import datetime,timedelta
from config import Config
from database import db
from models.users import User
import uuid
from flask_session import Session
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    app.config['SESSION_SQLALCHEMY'] = db
    Session(app)
    CORS(app , origins=['http://localhost:5173'], allow_headers=["Content-Type"] , supports_credentials=True,  expose_headers=['Set-Cookie'],
    allow_methods=['GET', 'POST'])
    return app
app = create_app()

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('session_id'):
            return jsonify({'error': 'Please login to access this endpoint'}), 401
        return f(*args, **kwargs)
    return decorated_function


@app.route('/get-instances', methods= ['GET'])
@login_required
def main():
    try:
        ec2 = boto3.client('ec2')
        instances = ec2.describe_instances()
        sts = boto3.client('sts')
        response = []
        for reservation in instances['Reservations']:
            for instance in reservation['Instances']:
                name = ''
                if 'Tags' in instance:
                    for tag in instance['Tags']:
                        if tag['Key'] == 'Name':
                            name = tag['Value']
                            break
                
                launch_time = instance['LaunchTime'].strftime('%Y-%m-%d')
                region = instance['Placement']['AvailabilityZone'][:-1]
                account_id = sts.get_caller_identity()['Account']
                instance_arn = get_instance_arn(
                    instance['InstanceId'],
                    region,
                    account_id
                )
                response.append({
                    "instance_id": instance['InstanceId'],
                    "instance_type": instance['InstanceType'],
                    "name": name,
                    "launch_time": launch_time,
                    "instance_arn": instance_arn,
                    "price" : getPrice(instance_id=instance['InstanceId'])
                })
                    
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


def getPrice( instance_id):
    # Format dates properly
   
    end_date = datetime.now().strftime('%Y-%m-%d')
    start_date = end_date - timedelta(days=30)
    ce = boto3.client('ce')
    try:
        response = ce.get_cost_and_usage(
            TimePeriod={
                'Start': start_date,
                'End': end_date
            },
            Granularity='MONTHLY',
            Filter={
                'And': [
                    {
                        'Dimensions': {
                            'Key': 'USAGE_TYPE_GROUP',
                            'Values': ['EC2: Running Hours']
                        }
                    },
                    {
                        'Dimensions': {
                            'Key': 'RESERVATION_ID',
                            'Values': [instance_id]
                        }
                    }
                ]
            },
            Metrics=['UnblendedCost']
        )
        

        # Calculate total cost
        total_cost = 0.0
        if 'ResultsByTime' in response:
            for result in response['ResultsByTime']:
                total_cost += float(result['Total']['UnblendedCost']['Amount'])
        return round(total_cost, 2) 
    
    except Exception as e:
        print(f"Error fetching cost for {instance_arn}: {str(e)}")
        return 0.0 
def get_instance_arn(instance_id, region, account_id):
    return f"arn:aws:ec2:{region}:{account_id}:instance/{instance_id}"



def verify_password(stored_hash, stored_salt, provided_password):
    salted_password = (provided_password + stored_salt).encode('utf-8')
    calculated_hash = hashlib.sha256(salted_password).hexdigest()
    return calculated_hash == stored_hash


@app.route('/login' , methods=['POST'])
def login():
    data = request.get_json()
    print(data)
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password required'}), 400
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({'error': 'User or given password is incorrrect'}), 401
    verify = verify_password(user.password_hash, user.salt, data['password'])
    if verify == False:
        return jsonify({'error': 'User or given password is incorrrect'}), 401
    session_id = str(uuid.uuid4())
    session['email']=  user.email
    session['session_id'] = session_id
    session['login_time'] = datetime.now()
    session.permanent = False
    return jsonify({"message": "Login successful!"}), 200


@app.route('/check-auth' , methods=['GET'])
def check_auth():
    if session.get('session_id'):
        return jsonify({
            'authenticated': True,
            'email': session.get('email'),
            'session_id': session.get('session_id'),
            'login_time': session.get('login_time')
        })
    return jsonify({'authenticated': False})

if __name__ == '__main__':
    app.run(debug=True, port=3000)
