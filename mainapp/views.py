from django.contrib.auth.models import User
from mainapp.models import TeacherModel, CourseModel
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from mainapp.serializers import CourseSerializer

from facial_functions.facial_lib import execute_training

import environ
import uuid


env = environ.Env()
environ.Env.read_env()




@permission_classes([AllowAny])
@authentication_classes([])
class SignUp(APIView):

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')

        user = User.objects.create_user(username=username, password=password)

        if user:
            teacher = TeacherModel(teacher_id=str(uuid.uuid4()), username=username, email=email, first_name=first_name, last_name=last_name)
            teacher.save()

            return Response({'message': 'success'})

        return Response({'message': 'fail'})


class AddCourse(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        course_name = request.data.get('course_name')
        course_code = request.data.get('course_code')

        teacher = TeacherModel.objects.get(username=str(request.user))

        new_course = CourseModel(course_code=course_code, course_name=course_name, teacher_id=teacher.teacher_id,
                                 teacher_name=f"{teacher.first_name} {teacher.last_name}"
        )

        new_course.save()

        return Response({'status': 'success'})


class GetAllCoursesSingle(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        teacher = TeacherModel.objects.get(username=str(request.user))

        courses = CourseModel.objects.filter(teacher_id=teacher.teacher_id)

        # data = list(courses)
        serialized_courses = CourseSerializer(courses, many=True)

        return Response({'status': 'success', 'data': serialized_courses.data})


@permission_classes([AllowAny])
@authentication_classes([])
class GetAllCourses(APIView):

    def get(self):
        courses = CourseModel.objects.all()

        data = list(courses.values())

        return Response({'status': 'success', 'data': data})



class GetCourseLink(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        course_code = request.data.get('course_code')
        course_name = request.data.get('course_name')

        teacher = TeacherModel.objects.get(username=str(request.user))

        course = CourseModel.objects.get(teacher_id=teacher.teacher_id, course_code=course_code, course_name=course_name)

        if course:
            link_id = f"{course.course_code}-{teacher.teacher_id}"

            return Response({'status': 'success', 'link_id': link_id})

        return Response({'message': 'fail'})


@permission_classes([AllowAny])
@authentication_classes([])
class SubmitRegistration(APIView):

    def post(self, request, course_id):

        if not course_id:
            return Response({'error': 'Invalid ID'}, status=400)

        video_file = request.FILES.get('video')
        student_id = request.data.get('student_id')

        url_data = course_id.split('-')

        course_code = url_data[0]
        teacher_id = url_data[1]

        stored_file_name = f"{student_id}.mp4"

        with open(stored_file_name, 'wb+') as f:
            f.write(video_file.read())

        # add part to check if course exists

        success, response = execute_training(student_id=student_id, video_dir=stored_file_name, model_name=course_id)

        if success:
            return Response({'message': 'success'}, status=200)

        return Response({'message': response}, status=400)

