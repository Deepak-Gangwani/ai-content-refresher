from rest_framework import serializers
from .models import Blog

class BlogSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")

    class Meta:
        model = Blog
        fields = "__all__"
        read_only_fields = ("id", "created_at", "updated_at", "author")
