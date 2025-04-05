from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.RedirectToSearchView.as_view()),
    path('search/', include('search.urls'))
]
