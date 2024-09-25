import jwt
from django.http import JsonResponse
from functools import wraps
from django.conf import settings

JWT_SECRET = 'your_jwt_secret_key'
JWT_ALGORITHM = 'HS256'

def token_required(f):
    @wraps(f)
    def decorated_function(request, *args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return JsonResponse({'error': 'Token is missing'}, status=403)

        try:
            # Decode the token to verify it
            jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Token has expired'}, status=403)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token'}, status=403)

        return f(request, *args, **kwargs)

    return decorated_function
