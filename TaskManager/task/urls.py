from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views
from .serializers import CustomTokenObtainPairView

urlpatterns = [  # Corrected from urlpattern to urlpatterns    963936aa60dcd7ade8dd0edf1c26652aa1f7b7c7cd4c8ea6
    path('', views.index),
    path('add_task/', views.add_task),
    path('list_tasks/', views.get_task),
    path('delete_task/', views.delete_task, name='delete_task'),
    path('edit_task/<str:task_id>', views.edit_task, name='edit_task'),
    path('register/', views.register_user, name='register_user'),
    path('login/', views.login_user, name='login_user'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]