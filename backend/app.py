from functools import wraps
import hashlib
from flask import Flask, jsonify , request , session, current_app
import boto3
from datetime import datetime,timedelta , timezone
from config import Config
from database import db
from models.users import User
import uuid
from flask_session import Session
from flask_cors import CORS
from math import ceil
from sqlalchemy.exc import SQLAlchemyError, OperationalError
from werkzeug.exceptions import ServiceUnavailable
from sqlalchemy import text
def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    CORS(app , origins=['http://localhost:5173'], allow_headers=["Content-Type"] , supports_credentials=True,  expose_headers=['Set-Cookie'],
        allow_methods=['GET', 'POST'])
    app.config['SESSION_SQLALCHEMY'] = db
    Session(app)
    @app.errorhandler(Exception)
    def handle_exception(error):
        # Log the error for debugging
        current_app.logger.error(f"Error occurred: {error}")
        
        if isinstance(error, OperationalError):
            return jsonify({
                'error': 'Database Connection Error',
                'message': 'Database is currently unavailable',
                'status': 503
            }), 503
        
        elif isinstance(error, SQLAlchemyError):
            return jsonify({
                'error': 'Database Error',
                'message': 'An error occurred while processing your request',
                'status': 500
            }), 500
        
        elif isinstance(error, ServiceUnavailable):
            return jsonify({
                'error': 'Service Unavailable',
                'message': 'Database service is temporarily unavailable',
                'status': 503
            }), 503
        
        # Catch any other unexpected errors
        return jsonify({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred',
            'status': 500
        }), 500

    @app.before_request
    def check_db_connection():
        try:
            db.session.execute(text('SELECT 1'))
        except Exception as e:
            current_app.logger.error(f"Database connection check failed: {e}")
            raise ServiceUnavailable()

    return app
app = create_app()




def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('session_id'):
            return jsonify({'error': 'Please login to access this endpoint'}), 401
        return f(*args, **kwargs)
    return decorated_function


@app.route('/', methods=['GET'])

def main():
    return "Welcome to instance management server"

@app.route('/get-instances', methods= ['GET'])
@login_required
def manage_instances():
   page = request.args.get('page', default=1, type=int)
   per_page = request.args.get('per_page', default=10, type=int)
   try:
        ec2 = boto3.client('ec2')
        sts = boto3.client('sts')
        
        paginator = ec2.get_paginator('describe_instances')

        all_instances = []
        total_items = 0

        # Use the paginator to count total instances and gather all data
        for aws_page in paginator.paginate():
            for reservation in aws_page['Reservations']:
                for instance in reservation['Instances']:
                    total_items += 1
                    all_instances.append(instance)

        # Determine the instances for the current page
        start_idx = (page - 1) * per_page
        paginated_instances = all_instances[start_idx:start_idx + per_page]

        # Process instances for the response
        response = []
        for instance in paginated_instances:
            name = ''
            if 'Tags' in instance:
                for tag in instance['Tags']:
                    if tag['Key'].lower() == 'name':
                        name = tag['Value']
                        break

            launch_time = instance['LaunchTime']
            region = instance['Placement']['AvailabilityZone'][:-1]
            account_id = sts.get_caller_identity()['Account']
            instance_arn = get_instance_arn(
                instance['InstanceId'],
                region,
                account_id
            )
            current_time = datetime.now(timezone.utc)
            running_seconds = (current_time - launch_time).total_seconds()
            launch_time = launch_time.strftime('%Y-%m-%d')
            instance_type = instance['InstanceType']
            os = 'Linux'
            if 'Platform' in instance:
                os = instance['Platform']

            price = get_instance_pricing(instance_type, region, running_seconds, os)
            response.append({
                "instance_id": instance['InstanceId'],
                "instance_type": instance['InstanceType'],
                "name": name,
                "launch_time": launch_time,
                "instance_arn": instance_arn,
                "price": price
            })

        total_pages = (total_items + per_page - 1) // per_page  

        return jsonify({
            "instances": response,
            "total": total_items, 
            "current_page": page,
            "per_page": per_page,
            "total_pages": total_pages
        })
   except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


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


def get_region_name(region_code):
    region_names = {
        'us-east-1': 'US East (N. Virginia)',
        'us-east-2': 'US East (Ohio)',
        'us-west-1': 'US West (N. California)',
        'us-west-2': 'US West (Oregon)',
    }
    return region_names.get(region_code, region_code)
def get_instance_pricing(instance_type, region,running_seconds , os):
    pricing = boto3.client('pricing', region_name='us-east-1') 
    pricing_filter = [
        {'Type': 'TERM_MATCH', 'Field': 'instanceType', 'Value': instance_type},
        {'Type': 'TERM_MATCH', 'Field': 'operatingSystem', 'Value': os},
        {'Type': 'TERM_MATCH', 'Field': 'preInstalledSw', 'Value': 'NA'},
        {'Type': 'TERM_MATCH', 'Field': 'tenancy', 'Value': 'Shared'},
        {'Type': 'TERM_MATCH', 'Field': 'capacitystatus', 'Value': 'Used'},
        {'Type': 'TERM_MATCH', 'Field': 'location', 'Value': get_region_name(region)}
    ]
    price_response = pricing.get_products(
        ServiceCode='AmazonEC2',
        Filters=pricing_filter
    )
    price_list = price_response['PriceList']
    if not price_list:
        raise ValueError(f"No pricing found for instance type {instance_type} in region {region}")
    price_details = eval(price_list[0])['terms']['OnDemand']
    price_id = list(price_details.keys())[0]
    price_dimensions = price_details[price_id]['priceDimensions']
    dimension_id = list(price_dimensions.keys())[0]
    hourly_price = float(price_dimensions[dimension_id]['pricePerUnit']['USD'])
    total_cost = (running_seconds / 3600) * hourly_price
    return round(total_cost,2)
if __name__ == '__main__':
    app.run(debug=True, port=3000)
