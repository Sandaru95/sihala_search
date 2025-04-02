from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path('signup/', views.UserSignUpView.as_view(), name='signup'),
    path('logout/', views.UserLogoutView.as_view(), name='logout'),
]