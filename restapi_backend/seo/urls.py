# from django.urls import path
# from . import views

# urlpatterns = [
#     # Superuser SEO Refresh Endpoints
#     path("superuser/refresh-blog/<int:pk>/preview-refresh/", views.preview_refresh_blog, name="admin-preview-refresh-blog"),
#     path("superuser/refresh-blog/<int:pk>/confirm-refresh/", views.confirm_refresh_blog, name="admin-confirm-refresh-blog"),
# ]

from django.urls import path
from .views import preview_refresh_blog, confirm_refresh_blog

urlpatterns = [
    path("refresh-blog/<int:pk>/preview/", preview_refresh_blog, name="preview_refresh_blog"),
    path("refresh-blog/<int:pk>/confirm/", confirm_refresh_blog, name="confirm_refresh_blog"),
]
