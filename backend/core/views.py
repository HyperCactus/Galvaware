from rest_framework import viewsets
from .models import User, Client, Quote, Job, JobStatusLog, QALog, Comment
from .serializers import UserSerializer, ClientSerializer, QuoteSerializer, JobSerializer, JobStatusLogSerializer, QALogSerializer, CommentSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

class JobStatusLogViewSet(viewsets.ModelViewSet):
    queryset = JobStatusLog.objects.all()
    serializer_class = JobStatusLogSerializer

class QALogViewSet(viewsets.ModelViewSet):
    queryset = QALog.objects.all()
    serializer_class = QALogSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer