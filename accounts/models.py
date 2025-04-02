from django.db import models
from django.contrib.auth.models import User

class Signal_User_Profile(models.Model):
    user_linked = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True, related_name='signal_user_profile')
    name = models.CharField(max_length=500)
    
    def __str__(self):
        return self.name

