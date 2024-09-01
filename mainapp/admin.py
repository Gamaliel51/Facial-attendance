from django.contrib import admin

import mainapp.models


# Register your models here.
@admin.register(mainapp.models.TeacherModel)
class TeacherModelAdmin(admin.ModelAdmin):
    list_display = ['teacher_id', 'username', 'email', 'first_name', 'last_name']


@admin.register(mainapp.models.CourseModel)
class CourseModelAdmin(admin.ModelAdmin):
    list_display = ['teacher_id', 'course_code', 'course_name', 'teacher_name']

