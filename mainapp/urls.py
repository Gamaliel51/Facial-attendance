from django.contrib import admin
from django.urls import path
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

import mainapp.views

urlpatterns = [
    path("signup/", mainapp.views.SignUp.as_view()),
    path("addcourse/", mainapp.views.AddCourse.as_view()),
    path("get-teacher-courses/", mainapp.views.GetAllCoursesSingle.as_view()),
    path("get-all-courses/", mainapp.views.GetAllCourses.as_view()),
    path("get-coursereg-link/", mainapp.views.GetCourseLink.as_view()),
]
