from django.urls import path
from . import views

app_name = 'search'

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('results/', views.ResultsView.as_view(), name='results'),
    path('results/videos/', views.ResultsVideoView.as_view(), name='results_videos'),
    path('results/images/', views.ResultsImagesView.as_view(), name='results_images'),
    path('results/market/', views.ResultsMarketView.as_view(), name='results_market'),
    path('results/market/get/', views.ResultsMarketGetView.as_view(), name='results_market_get'),
]