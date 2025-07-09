from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import JSONField

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('client', 'Client'),
        ('staff', 'Staff'),
        ('qa', 'QA'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    is_client = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

class Client(models.Model):
    name = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True)
    contact_info = models.TextField()
    pricing_tier = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Quote(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('expired', 'Expired'),
    ]
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    service_type = models.CharField(max_length=100)
    pricing_tier = models.CharField(max_length=50)
    estimated_tonnes = models.FloatField()
    expiration_date = models.DateField()
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Quote {self.id} for {self.client.name}"

class Job(models.Model):
    ORDER_SOURCE_CHOICES = [
        ('portal', 'Client Portal'),
        ('kiosk', 'Depot Kiosk'),
        ('manual', 'Manual'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)
    order_source = models.CharField(max_length=10, choices=ORDER_SOURCE_CHOICES)
    weight = models.FloatField()
    classification = models.CharField(max_length=100)
    service_type = models.CharField(max_length=100)
    metadata = JSONField(default=dict)
    schedule_date = models.DateTimeField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Job {self.id} for Quote {self.quote.id}"

class JobStatusLog(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=Job.STATUS_CHOICES)
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    comment = models.TextField(blank=True)

    def __str__(self):
        return f"Status {self.status} for Job {self.job.id}"

class QALog(models.Model):
    QA_LEVEL_CHOICES = [
        ('level1', 'Level 1'),
        ('level2', 'Level 2'),
        ('level3', 'Level 3'),
    ]
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    qa_level = models.CharField(max_length=10, choices=QA_LEVEL_CHOICES)
    checklist_data = JSONField(default=dict)
    notes = models.TextField(blank=True)
    non_conformance = models.BooleanField(default=False)
    images = models.TextField(blank=True)  # Store image URLs or paths
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"QA Log {self.id} for Job {self.job.id}"

class Comment(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField()
    attachment = models.TextField(blank=True)  # Store file paths or URLs
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user} on {self.content_object}"