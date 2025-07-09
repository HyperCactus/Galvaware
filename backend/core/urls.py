from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ClientViewSet, QuoteViewSet, JobViewSet, JobStatusLogViewSet, QALogViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'clients', ClientViewSet)
router.register(r'quotes', QuoteViewSet)
router.register(r'jobs', JobViewSet)
router.register(r'job-status-logs', JobStatusLogViewSet)
router.register(r'qa-logs', QALogViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = router.urls