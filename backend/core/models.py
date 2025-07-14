from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import JSONField, DecimalField

class User(AbstractUser):
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="core_user_set",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="core_user_set",
        related_query_name="user",
    )
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
    ORDER_CHANNEL_CHOICES = [
        ('client_portal', 'Client Portal'),
        ('depot_kiosk', 'Depot Kiosk'),
        ('manual', 'Manual'),
    ]
    VALIDATION_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('validated', 'Validated'),
        ('failed', 'Failed'),
    ]
    SERVICE_TYPE_CHOICES = [
        ('galvanizing', 'Galvanizing'),
        ('powder_coating', 'Powder Coating'),
        ('anodizing', 'Anodizing'),
        ('other', 'Other'),
    ]
    JOB_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)
    order_channel = models.CharField(max_length=20, choices=ORDER_CHANNEL_CHOICES, default='manual')
    validation_status = models.CharField(max_length=20, choices=VALIDATION_STATUS_CHOICES, default='pending')
    inspection_notes = models.TextField(blank=True, null=True)
    inspection_images = models.ImageField(upload_to='inspection_images/', blank=True, null=True)
    estimated_weight = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    service_type = models.CharField(max_length=50, choices=SERVICE_TYPE_CHOICES)
    weight = models.FloatField(blank=True, null=True) # Keeping existing weight field, making it optional
    classification = models.CharField(max_length=100, blank=True, null=True) # Making existing classification optional
    metadata = JSONField(default=dict)
    schedule_date = models.DateTimeField(null=True, blank=True) # Making schedule_date optional
    status = models.CharField(max_length=15, choices=JOB_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Job {self.id} for Quote {self.quote.id}"

class Quote(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Quote(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class JobStatusLog(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=Job.JOB_STATUS_CHOICES)
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