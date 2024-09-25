import json

import bcrypt
from bson import ObjectId
from db_connection import db
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny


task_collection = db['task_collection']
user_collection = db['user_collection']
STATUS_COMPLETED = 0
STATUS_PENDING = 1
STATUS_IN_PROGRESS = 2
STATUS_CANCELLED = 3
STATUS_DELETED = 4

STATUS_CHOICES = {
    STATUS_COMPLETED: "Completed",
    STATUS_PENDING: "Pending",
    STATUS_IN_PROGRESS: "In Progress",
    STATUS_CANCELLED: "Cancelled",
    STATUS_DELETED: "Deleted",
}
# Create your views here
def index(request):
    return HttpResponse("<h1>Welcome</h1>")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return JsonResponse({"message": "This is a protected view!"})

@api_view(['POST'])
@permission_classes([AllowAny])
def add_task(request):
    if request.method == 'POST':
        try:

            data = json.loads(request.body)
            task_name = data.get('task_name')
            task_description = data.get('task_description')
            due_date = data.get('due_date')
            status = data.get('status')
            if status not in STATUS_CHOICES:
                return JsonResponse({"error": f"Invalid status. Valid options are: {list(STATUS_CHOICES.keys())}."},
                                    status=400)

            task_data = {
                'task_name': task_name,
                'task_description': task_description,
                'due_date': due_date,
                'status': status
            }

            task_collection.insert_one(task_data)
            return JsonResponse({"message": "Task added successfully"}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Only POST requests are allowed"}, status=405)


@csrf_exempt
def get_task(request):
    query = request.GET.get('searchKeyword', None)

    # Create a filter to exclude tasks with status 4 (Deleted)
    filter_condition = {'status': {'$ne': STATUS_DELETED}}  # Exclude status 4

    # Pagination parameters
    page = int(request.GET.get('page', 1))  # Default to page 1
    limit = int(request.GET.get('size', 10))  # Default size to 10 tasks per page
    skip = (page - 1) * limit  # Calculate how many tasks to skip

    if page < 1:
        return JsonResponse({'message': 'Page starts from 1'})
    if limit < 1:
        return JsonResponse({'message': 'Limit should be greater than 0'})
    # Initialize total_count to store total number of items
    total_count = 0

    if query:
        # Use a regex to search task_name and task_description fields, combined with the filter
        search_filter = {
            '$or': [
                {'task_name': {'$regex': query, '$options': 'i'}},  # 'i' for case-insensitive search
                {'task_description': {'$regex': query, '$options': 'i'}}
            ]
        }
        search_filter.update(filter_condition)  # Combine with the filter condition

        # Count total tasks matching the search filter
        total_count = task_collection.count_documents(search_filter)

        # Fetch filtered tasks with pagination
        tasks = list(task_collection.find(search_filter).skip(skip).limit(limit))
    else:
        # Fetch all tasks that do not have status 4 (Deleted)
        total_count = task_collection.count_documents(filter_condition)  # Count total tasks excluding status 4

        # Fetch all tasks excluding status 4 with pagination
        tasks = list(task_collection.find(filter_condition).skip(skip).limit(limit))

    print(f"Tasks from database: {tasks}")  # Debugging: Print tasks to see what is retrieved

    if tasks:
        # Serialize tasks into a JSON-friendly format, including new fields (due_date, status)
        tasks_list = [{
            'id': str(task.get('_id')),  # Convert ObjectId to string
            'task_name': task.get('task_name'),
            'task_description': task.get('task_description'),
            'due_date': task.get('due_date'),  # Include due date in response
            'status': task.get('status')  # Include status in response
        } for task in tasks]

        # Calculate total pages
        total_pages = (total_count + limit - 1) // limit  # Ceiling division to get total pages

        return JsonResponse({
            'tasks': tasks_list,
            'page': page,
            'limit': limit,
            'total_items': total_count,
            'total_pages': total_pages
        })
    else:
        return JsonResponse({'message': 'No tasks found'})


@csrf_exempt
def delete_task(request):
    if request.method == 'DELETE':
        task_id = request.GET.get('id')  # Get the task ID from the query parameters

        if not task_id:
            return JsonResponse({'message': 'Task ID is required'}, status=400)

        # Convert the task ID to ObjectId
        try:
            task_object_id = ObjectId(task_id)
        except Exception as e:
            return JsonResponse({'message': 'Invalid Task ID'}, status=400)

        # Update the task's status to 4 (Deleted)
        result = task_collection.update_one(
            {'_id': task_object_id},
            {'$set': {'status': STATUS_DELETED}}  # Set status to 4 (Deleted)
        )

        if result.modified_count > 0:
            return JsonResponse({'message': 'Task deleted successfully'})
        else:
            return JsonResponse({'message': 'Task not found or already deleted'}, status=404)

    return JsonResponse({'message': 'Invalid request method'}, status=405)

@csrf_exempt
def edit_task(request, task_id):
    if request.method == 'PUT':
        try:
            body = json.loads(request.body)
            updated_fields = {
                'task_name': body.get('task_name'),
                'task_description': body.get('task_description'),
                'due_date': body.get('due_date'),
                'status': body.get('status')
            }

            # Update the task in the database
            result = task_collection.update_one({'_id': ObjectId(task_id)}, {'$set': updated_fields})

            if result.modified_count > 0:
                return JsonResponse({'message': 'Task updated successfully'}, status=200)
            else:
                return JsonResponse({'message': 'No changes made or task not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'message': 'Only PUT requests are allowed'}, status=405)




@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        try:

            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            email = data.get('email')

            # Validate required fields
            if not username or not password or not email:
                return JsonResponse({"error": "Username, password, and email are required."}, status=400)

            # Check if the username or email already exists
            if user_collection.find_one({'username': username}):
                return JsonResponse({"error": "Username already exists."}, status=400)
            if user_collection.find_one({'email': email}):
                return JsonResponse({"error": "Email already exists."}, status=400)

            # Hash the password before saving it
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            # Create a new user document
            user_data = {
                'username': username,
                'password': hashed_password.decode('utf-8'),  # Store the hashed password as a string
                'email': email,
            }

            user_collection.insert_one(user_data)
            return JsonResponse({"message": "User registered successfully"}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Only POST requests are allowed"}, status=405)


@csrf_exempt
def login_user(request):
    if request.method == 'POST':

        print("Login")
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            # Validate input
            if not username or not password:
                return JsonResponse({"error": "Username and password are required."}, status=400)

            # Fetch the user from MongoDB
            user = user_collection.find_one({'username': username})
            print("User  {user}")

            # Check if the user exists and verify the password
            if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                # Generate a custom token (you can use any method to generate a token)
                # Here we just return a dummy token for demonstration
                access_token = f"dummy_token_for_{username}"

                return JsonResponse({
                    'access': access_token,
                    'message': 'Login successful'
                }, status=200)
            else:
                return JsonResponse({'error': 'Invalid username or password'}, status=401)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Only POST requests are allowed"}, status=405)
