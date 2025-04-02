from django.db import models

class WebPage(models.Model):
    title = models.CharField(max_length=500)
    img_url = models.CharField(max_length=5000, blank=True)
    content = models.CharField(max_length=5000)
    url = models.CharField(max_length=5000, default="https://ikman.lk/")

    def __str__(self):
        return self.title


class HeadedUrl(models.Model):
    title = models.CharField(max_length=5000, blank=True, null=True)
    url = models.CharField(max_length=5000)

    def __str__(self):
        return self.url

class LastPageNumber(models.Model):
    last_page_number = models.IntegerField()

    def __str__(self):
        return str(self.last_page_number)
