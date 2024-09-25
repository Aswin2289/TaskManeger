from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt  # Ensure you have the PyJWT package installed

class MongoDBJWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth = request.headers.get('Authorization')
        if not auth:
            return None

        try:
            token = auth.split(' ')[1]  # Extract the token from "Bearer <token>"
            payload = jwt.decode(token, '963936aa60dcd7ade8dd0edf1c26652aa1f7b7c7cd4c8ea6', algorithms=['HS256'])  # Use your secret key
            # Implement user retrieval from MongoDB using the payload info
            user = self.get_user_from_mongodb(payload)  # Your logic here
            return (user, None)  # Return user and None for auth
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError) as e:
            raise AuthenticationFailed('Invalid token.')
        except Exception as e:
            raise AuthenticationFailed('Authentication failed.')

    def get_user_from_mongodb(self, payload):
        # Your logic to retrieve the user from MongoDB
        pass
