from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CreateUserView, LoginView, LogoutView, JobViewSet, QuoteViewSet

router = DefaultRouter()
router.register(r'jobs', JobViewSet)
router.register(r'quotes', QuoteViewSet)

urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('', include(router.urls)),
]