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
    course_code = models.CharField(max_length=255, unique=True)
    course_name = models.CharField(max_length=255)
    teacher_name = models.CharField(max_length=255)


class StudentModel(models.Model):
    matric = models.CharField(max_length=10000)
    name = models.CharField(max_length=10000)
    level = models.CharField(max_length=10000)
    department = models.CharField(max_length=10000)
    course_id = models.CharField(max_length=10000)


# Model for storing individual attendance records
class AttendanceRecord(models.Model):
    matric = models.CharField(max_length=10000)
    name = models.CharField(max_length=10000)
    level = models.CharField(max_length=10000)
    department = models.CharField(max_length=10000)
    time = models.CharField(max_length=10000)

    def __str__(self):
        return f'{self.name} - {self.matric}'


# Model for storing the overall attendance for a course on a specific date
class Attendance(models.Model):
    date = models.CharField(max_length=10000)
    course_code = models.CharField(max_length=10000)
    course_name = models.CharField(max_length=10000)
    teacher_id = models.CharField(max_length=10000)
    records = models.ManyToManyField(AttendanceRecord, related_name='attendances')

    def __str__(self):
        return f'{self.course_name} ({self.course_code}) on {self.date} by {self.teacher_id}'


