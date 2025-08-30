from rest_framework import viewsets, permissions
from .models import Blog
from .serializers import BlogSerializer
from .permissions import IsAuthorOrReadOnly

class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
