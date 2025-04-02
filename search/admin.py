from django.contrib import admin
from .models import YtTrending, NewsItem, StatusObject

admin.site.register(YtTrending)
admin.site.register(NewsItem)
admin.site.register(StatusObject)