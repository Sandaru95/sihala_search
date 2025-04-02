from django.contrib import admin
from django.urls import path, include

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),

    path('', views.ToSearchRedirectView.as_view()),

    path('search/', include('search.urls')),
    path('accounts/', include('accounts.urls')),
]
