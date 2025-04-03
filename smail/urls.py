from django.urls import path
from . import views

app_name = "smail"

urlpatterns = [
    path('', views.IndexView.as_view(), name="index"),
    path('sent/', views.SentView.as_view(), name="sent_box"),
    path('bin/', views.BinView.as_view(), name="bin_box"),
    path('compose/', views.ComposeView.as_view(), name="compose_box")
]