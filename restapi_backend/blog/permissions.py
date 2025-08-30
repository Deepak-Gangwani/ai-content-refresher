from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission: only the author can edit/delete a blog.
    Read for anyone.
    """

    def has_object_permission(self, request, view, obj):
        # Read-only requests are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write requests require the author to match
        return obj.author == request.user
