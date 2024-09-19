from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from io import BytesIO
from mainapp.models import TeacherModel, CourseModel, Attendance, AttendanceRecord, StudentModel
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from mainapp.serializers import CourseSerializer

from mainapp.facial_functions.facial_lib import execute_training

import openpyxl
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
            link_id = f"{course.course_code}_{teacher.teacher_id}"

            return Response({'status': 'success', 'link_id': link_id})

        return Response({'message': 'fail'})


@permission_classes([AllowAny])
@authentication_classes([])
class SubmitRegistration(APIView):

    def post(self, request, id):

        course_id = id

        if not course_id:
            return Response({'error': 'Invalid ID'}, status=400)

        video_file = request.FILES.get('video')
        matric = request.data.get('matric')
        name = request.data.get('name')
        level = request.data.get("level")
        department = request.data.get("department")

        student_id = f"{matric}-{name}"

        try:
            student = StudentModel.objects.get(matric=matric, course_id=course_id)

            if student:
                return Response({"error": "Student already registered for this course"}, status=400)
        except StudentModel.DoesNotExist:
            pass

        new_student = StudentModel(matric=matric, name=name, level=level, department=department, course_id=course_id)
        new_student.save()

        url_data = course_id.split('_')

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


# Save attendance
class AttendanceAPIView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Extract data from the request
            date = request.data.get('date')
            attendance_list = request.data.get('attendance')
            course_code = request.data.get('course_code')
            course_name = request.data.get('course_name')

            print(f"HERE: {date}, {attendance_list}, {course_code}, {course_name}")

            teacher = TeacherModel.objects.get(username=str(request.user))
            teacher_id = teacher.teacher_id

            print("HERE 2")

            # Validate that all required fields are present
            if not all([date, attendance_list, course_code, course_name, teacher_id]):
                return Response({"error": "Missing fields in the request"}, status=400)

            print("HERE 3")

            # Create an Attendance object
            attendance_obj = Attendance.objects.create(
                date=date,
                course_code=course_code,
                course_name=course_name,
                teacher_id=teacher_id
            )

            print("HERE 3")

            # Iterate through the attendance list and save individual records
            for record in attendance_list:
                matric = record.get('matric')
                name = record.get('name')
                time_str = record.get('time')

                course_id = f"{course_code}_{teacher_id}"
                student = StudentModel.objects.get(matric=matric, course_id=course_id)

                if student is None:
                    return Response({"error": "No such student"}, status=400)

                # Parse the time and create an AttendanceRecord object
                time = time_str
                if time is None:
                    return Response({"error": "Invalid time format"}, status=400)

                attendance_record = AttendanceRecord.objects.create(
                    matric=matric,
                    name=name,
                    level=student.level,
                    department=student.department,
                    time=time
                )

                # Add the individual record to the attendance object
                attendance_obj.records.add(attendance_record)

            attendance_obj.save()

            return Response({"message": "Attendance saved successfully"}, status=201)

        except Exception as e:
            print(str(e))
            return Response({"error": str(e)}, status=500)


# fetch attendance record
class AttendanceRecordsAPIView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get course_code and teacher_id from query parameters
        course_code = request.data.get('course_code')

        print("HERE 1")

        teacher = TeacherModel.objects.get(username=str(request.user))
        teacher_id = teacher.teacher_id

        print(f"HERE 2: {course_code}, {teacher_id}")

        # Validate that both course_code and teacher_id are provided
        if not course_code or not teacher_id:
            print("HERE 2-2")
            return Response({"error": "course_code and teacher_id are required"}, status=400)

        try:
            # Fetch all attendance records for the specified course and teacher
            attendance_records = Attendance.objects.filter(course_code=course_code, teacher_id=teacher_id)

            print("HERE 3")

            if not attendance_records.exists():
                return Response({"error": "No attendance records found"}, status=404)

            print("HERE 4")

            # Format the response in the required structure
            attendance_data = []
            for attendance in attendance_records:
                # Create the attendance list for each attendance object
                records = [
                    {
                        "matric": record.matric, "name": record.name, "level": record.level,
                        "department": record.department, "time": record.time
                    }
                    for record in attendance.records.all()
                ]

                attendance_data.append({
                    "date": attendance.date,
                    "attendance": records,
                    "course_code": attendance.course_code,
                    "course_name": attendance.course_name,
                    "teacher_id": attendance.teacher_id
                })

            print("HERE 5")

            return Response(attendance_data, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


class GetTeacherID(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        teacher = TeacherModel.objects.get(username=str(request.user))
        teacher_id = teacher.teacher_id

        return Response({'teacher_id': teacher_id}, status=200)


class AttendanceExcelAPIView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:

            print(request.data)
            # Extract data from request
            date = request.data.get('date')
            attendance_list = request.data.get('attendance')
            course_code = request.data.get('course_code')
            course_name = request.data.get('course_name')

            teacher = TeacherModel.objects.get(username=str(request.user))
            teacher_id = teacher.teacher_id

            print(f"HERE: {date}, {attendance_list}, {course_code}, {course_name}")

            # Validate input
            if not all([date, attendance_list, course_code, course_name, teacher_id]):
                return Response({"error": "Missing fields in the request"}, status=400)

            # Create an Excel workbook and add a worksheet
            workbook = openpyxl.Workbook()
            sheet = workbook.active
            sheet.title = f"{course_code} Attendance"

            # Create headers for the sheet
            headers = ['Matric Number', 'Name', 'Level', 'Department', 'Time', 'Date']
            sheet.append(headers)

            # Add attendance data to the sheet
            for record in attendance_list:
                row = [record['matric'], record['name'], record['level'], record['department'], record['time'], date]
                sheet.append(row)

            print("HERE 1")

            # Create an in-memory bytes buffer to save the Excel file
            output = BytesIO()
            workbook.save(output)
            output.seek(0)

            print("HERE 2")

            # Prepare the response with the file
            response = HttpResponse(output, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            response['Content-Disposition'] = f'attachment; filename={course_code}_attendance_{date}.xlsx'

            return response

        except Exception as e:
            print(str(e))
            return Response({"error": str(e)}, status=500)



