from django.contrib import admin
from .models import Blog

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author", "topic", "created_at")
    list_filter = ("author", "topic", "created_at")
    search_fields = ("title", "content", "topic")
