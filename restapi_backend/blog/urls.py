from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogViewSet
from .views_auth import register_user 

router = DefaultRouter()
router.register(r"blogs", BlogViewSet, basename="blogs")

urlpatterns = [
    path("", include(router.urls)),
     path("register/", register_user, name="register_user"),  # ✅ register endpoint

]
