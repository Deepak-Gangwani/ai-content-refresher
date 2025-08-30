from django.db import models
from django.contrib.auth.models import User

class Blog(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    topic = models.CharField(max_length=100, blank=True, null=True)
    meta_tags = models.JSONField(default=dict, blank=True)  # works with SQLite (Django 3.1+)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blogs")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

      # 🔹 New field for storing preview SEO refresh
    preview_data = models.JSONField(null=True, blank=True)
    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
