# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.response import Response
# from rest_framework import status
# from django.shortcuts import get_object_or_404
# from datetime import datetime
# from blog.models import Blog  # ✅ import Blog model
# from blog.serializers import BlogSerializer
# from .utils import detect_outdated, extract_keywords, fetch_current_trends, update_content, update_meta_tags
# from .permissions import IsSuperUser


# @api_view(["POST"])
# @permission_classes([IsSuperUser])  # ✅ only superusers
# def admin_refresh_blog(request, pk):
#     """
#     Refresh a specific blog by ID and update it with SEO-friendly content based on latest trends.
#     """
#     try:
#         blog = get_object_or_404(Blog, pk=pk)

#         title = blog.title
#         content = blog.content
#         meta_tags = blog.meta_tags or {}
#         topic = blog.topic

#         if not title or not content or not topic:
#             return Response({"error": "Blog is missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

#         # 🔹 Get fresh trends (ensures different output per request)
#         outdated = detect_outdated(content)
#         old_keywords = extract_keywords(content)
#         current_year = datetime.now().year
#         trends = fetch_current_trends(topic, current_year)  # always live request

#         # 🔹 Add variation factor to avoid same outputs
#         variation_prompt = f"rewrite in SEO-friendly way with unique style variation {datetime.now().timestamp()}"

#         updated_title, updated_content, error = update_content(
#             content,
#             f"{title} {variation_prompt}",  # inject variation
#             outdated,
#             trends,
#             old_keywords,
#             topic
#         )

#         if error:
#             return Response({"error": f"Content update failed: {error}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#         new_keywords = ", ".join(old_keywords + [f"SEO optimized {current_year}", f"latest {topic} trends"])
#         updated_meta = update_meta_tags(meta_tags, new_keywords, updated_title, updated_content)

#         # ✅ Save back to DB
#         blog.title = updated_title
#         blog.content = updated_content
#         blog.meta_tags = updated_meta
#         blog.save()

#         return Response({
#             "message": f"Blog ID {pk} refreshed successfully with new SEO content",
#             "updated_blog": BlogSerializer(blog).data,
#             "trends_used": trends  # 🔹 show what trends influenced this refresh
#         }, status=status.HTTP_200_OK)

#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.response import Response
# from rest_framework import status
# from django.shortcuts import get_object_or_404
# from datetime import datetime
# from blog.models import Blog
# from blog.serializers import BlogSerializer
# from .utils import detect_outdated, extract_keywords, fetch_current_trends, update_content, update_meta_tags
# from .permissions import IsSuperUser


# @api_view(["POST"])
# @permission_classes([IsSuperUser])  # ✅ only superusers
# def preview_refresh_blog(request, pk):
#     """
#     Preview updated SEO-friendly content for a blog.
#     Does NOT save changes, only stores preview_data.
#     """
#     blog = get_object_or_404(Blog, pk=pk)

#     title = blog.title
#     content = blog.content
#     meta_tags = blog.meta_tags or {}
#     topic = blog.topic

#     if not title or not content or not topic:
#         return Response({"error": "Blog is missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

#     # Detect outdated info
#     outdated = detect_outdated(content)
#     old_keywords = extract_keywords(content)
#     current_year = datetime.now().year
#     trends = fetch_current_trends(topic, current_year)

#     updated_title, updated_content, error = update_content(content, title, outdated, trends, old_keywords, topic)
#     if error:
#         return Response({"error": f"Content update failed: {error}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     new_keywords = ", ".join(old_keywords + [f"SEO optimized {current_year}", f"latest {topic} trends"])
#     updated_meta = update_meta_tags(meta_tags, new_keywords, updated_title, updated_content)

#     # 🔹 Store preview in DB
#     blog.preview_data = {
#         "title": updated_title,
#         "content": updated_content,
#         "meta_tags": updated_meta,
#         "trends_used": trends
#     }
#     blog.save()

#     return Response({
#         "message": f"Preview generated for Blog ID {pk}",
#         "preview_data": blog.preview_data
#     }, status=status.HTTP_200_OK)


# @api_view(["POST"])
# @permission_classes([IsSuperUser])  # ✅ only superusers
# def confirm_refresh_blog(request, pk):
#     """
#     Confirm the previewed SEO-friendly content and apply it permanently.
#     """
#     blog = get_object_or_404(Blog, pk=pk)

#     if not blog.preview_data:
#         return Response({"error": "No preview available. Generate preview first."}, status=status.HTTP_400_BAD_REQUEST)

#     # ✅ Apply previewed content permanently
#     blog.title = blog.preview_data.get("title", blog.title)
#     blog.content = blog.preview_data.get("content", blog.content)
#     blog.meta_tags = blog.preview_data.get("meta_tags", blog.meta_tags)

#     blog.preview_data = None  # clear preview after applying
#     blog.save()

#     return Response({
#         "message": f"Blog ID {pk} updated successfully with previewed SEO content",
#         "updated_blog": BlogSerializer(blog).data
#     }, status=status.HTTP_200_OK)

# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.response import Response
# from rest_framework import status
# from django.shortcuts import get_object_or_404
# from datetime import datetime
# from blog.models import Blog
# from blog.serializers import BlogSerializer
# from .utils import detect_outdated, extract_keywords, fetch_current_trends, update_content, update_meta_tags
# from .permissions import IsSuperUser


# @api_view(["POST"])
# @permission_classes([IsSuperUser])  # ✅ only superusers
# def preview_refresh_blog(request, pk):
#     """
#     Preview updated SEO-friendly content for a blog.
#     Does NOT save changes, only stores preview_data.
#     """
#     blog = get_object_or_404(Blog, pk=pk)

#     title = blog.title
#     content = blog.content
#     meta_tags = blog.meta_tags or {}
#     topic = blog.topic

#     if not title or not content or not topic:
#         return Response({"error": "Blog is missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

#     # Detect outdated info
#     outdated = detect_outdated(content)
#     old_keywords = extract_keywords(content)
#     current_year = datetime.now().year
#     trends = fetch_current_trends(topic, current_year)

#     updated_title, updated_content, error = update_content(content, title, outdated, trends, old_keywords, topic)
#     if error:
#         return Response({"error": f"Content update failed: {error}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     new_keywords = ", ".join(old_keywords + [f"SEO optimized {current_year}", f"latest {topic} trends"])
#     updated_meta = update_meta_tags(meta_tags, new_keywords, updated_title, updated_content)

#     # 🔹 Store preview in DB
#     blog.preview_data = {
#         "title": updated_title,
#         "content": updated_content,
#         "meta_tags": updated_meta,
#         "trends_used": trends
#     }
#     blog.save()

#     return Response({
#         "message": f"Preview generated for Blog ID {pk}",
#         "preview_data": blog.preview_data
#     }, status=status.HTTP_200_OK)


# @api_view(["POST"])
# @permission_classes([IsSuperUser])  # ✅ only superusers
# def confirm_refresh_blog(request, pk):
#     """
#     Confirm the previewed SEO-friendly content and apply it permanently.
#     """
#     blog = get_object_or_404(Blog, pk=pk)

#     if not blog.preview_data:
#         return Response({"error": "No preview available. Generate preview first."}, status=status.HTTP_400_BAD_REQUEST)

#     # ✅ Apply previewed content permanently
#     blog.title = blog.preview_data.get("title", blog.title)
#     blog.content = blog.preview_data.get("content", blog.content)
#     blog.meta_tags = blog.preview_data.get("meta_tags", blog.meta_tags)

#     blog.preview_data = None  # clear preview after applying
#     blog.save()

#     return Response({
#         "message": f"Blog ID {pk} updated successfully with previewed SEO content",
#         "updated_blog": BlogSerializer(blog).data
#     }, status=status.HTTP_200_OK)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from datetime import datetime
from blog.models import Blog
from blog.serializers import BlogSerializer
from .utils import detect_outdated, extract_keywords, fetch_current_trends, update_content, update_meta_tags

# Preview updated content without saving
@api_view(["GET"])
@permission_classes([IsAuthenticated])  # ✅ Any logged-in user
def preview_refresh_blog(request, pk):
    blog = get_object_or_404(Blog, pk=pk)
    title = blog.title
    content = blog.content
    meta_tags = blog.meta_tags or {}
    topic = blog.topic

    outdated = detect_outdated(content)
    old_keywords = extract_keywords(content)
    current_year = datetime.now().year
    trends = fetch_current_trends(topic, current_year)

    variation_prompt = f"rewrite in SEO-friendly way with unique style variation {datetime.now().timestamp()}"
    updated_title, updated_content, error = update_content(
        content,
        f"{title} {variation_prompt}",
        outdated,
        trends,
        old_keywords,
        topic
    )

    if error:
        return Response({"error": f"Content preview failed: {error}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    new_keywords = ", ".join(old_keywords + [f"SEO optimized {current_year}", f"latest {topic} trends"])
    updated_meta = update_meta_tags(meta_tags, new_keywords, updated_title, updated_content)

    return Response({
        "preview_title": updated_title,
        "preview_content": updated_content,
        "preview_meta_tags": updated_meta,
        "trends_used": trends
    }, status=status.HTTP_200_OK)

# Confirm refresh: save updated content to DB
@api_view(["POST"])
@permission_classes([IsAuthenticated])  # ✅ Any logged-in user
def confirm_refresh_blog(request, pk):
    blog = get_object_or_404(Blog, pk=pk)
    title = blog.title
    content = blog.content
    meta_tags = blog.meta_tags or {}
    topic = blog.topic

    outdated = detect_outdated(content)
    old_keywords = extract_keywords(content)
    current_year = datetime.now().year
    trends = fetch_current_trends(topic, current_year)

    variation_prompt = f"rewrite in SEO-friendly way with unique style variation {datetime.now().timestamp()}"
    updated_title, updated_content, error = update_content(
        content,
        f"{title} {variation_prompt}",
        outdated,
        trends,
        old_keywords,
        topic
    )

    if error:
        return Response({"error": f"Content update failed: {error}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    new_keywords = ", ".join(old_keywords + [f"SEO optimized {current_year}", f"latest {topic} trends"])
    updated_meta = update_meta_tags(meta_tags, new_keywords, updated_title, updated_content)

    # Save to DB
    blog.title = updated_title
    blog.content = updated_content
    blog.meta_tags = updated_meta
    blog.save()

    return Response({
        "message": f"Blog ID {pk} refreshed successfully",
        "updated_blog": BlogSerializer(blog).data,
        "trends_used": trends
    }, status=status.HTTP_200_OK)


