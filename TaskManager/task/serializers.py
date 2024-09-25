from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
import bcrypt
from rest_framework.exceptions import AuthenticationFailed
from db_connection import db
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from .models import MongoUser

user_collection = db['user_collection']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = AccessToken()

        # Use properties of MongoUser
        # token['username'] = user.username
        token['email'] = user.email
        # token['mongo_id'] = user.id  # Use the MongoDB ID directly

        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=400)

        # Fetch the user from MongoDB
        user = user_collection.find_one({'username': username})

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            mongo_user = MongoUser(user)  # Wrap the MongoDB user dictionary

            # Pass the MongoUser instance to the serializer
            token = self.get_serializer().get_token(mongo_user)

            # Create a refresh token
            refresh = RefreshToken.for_user(mongo_user)

            return Response({
                'access': str(token),
                'refresh': str(refresh),
            })

        raise AuthenticationFailed('Invalid username or password')
