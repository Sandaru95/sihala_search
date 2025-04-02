from django.contrib import admin
from .models import HeadedUrl, WebPage, LastPageNumber

admin.site.register(HeadedUrl)
admin.site.register(WebPage)
admin.site.register(LastPageNumber)
