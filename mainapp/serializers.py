from rest_framework import serializers
from .models import CourseModel

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseModel
        fields = '__all__'  # You can specify specific fields like ['course_code', 'course_name'] if you don't want to include all fields.
