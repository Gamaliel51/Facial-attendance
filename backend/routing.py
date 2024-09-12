# routing.py
from django.urls import path
from mainapp.facial_functions.consumers import VideoConsumer

websocket_urlpatterns = [
    path('ws/video/', VideoConsumer.as_asgi()),
]
