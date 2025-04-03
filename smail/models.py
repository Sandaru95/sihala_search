from django.db import models
from accounts.models import Signal_User_Profile

class MailThread(models.Model):
    from_mail = models.ForeignKey(Signal_User_Profile, on_delete=models.CASCADE, related_name="from_who")
    to_mail = models.ForeignKey(Signal_User_Profile, on_delete=models.CASCADE, related_name="to_where")
    subject = models.CharField(max_length=300)
    content = models.TextField(max_length=20000)

    def __str__(self):
        return str(f"{self.from_mail}:{self.to_mail}={self.subject}")