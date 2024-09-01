from django.db import models


# Create your models here.
class TeacherModel(models.Model):
    teacher_id = models.CharField(max_length=255)
    username = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)


class CourseModel(models.Model):
    teacher_id = models.CharField(max_length=255)
    course_code = models.CharField(max_length=255)
    course_name = models.CharField(max_length=255)
    teacher_name = models.CharField(max_length=255)


