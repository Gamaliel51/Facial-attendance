# consumers.py
import os
import base64
from channels.generic.websocket import AsyncWebsocketConsumer
import cv2
import numpy as np
import json
import pickle
from keras_facenet import FaceNet
from asgiref.sync import async_to_sync


class VideoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        frame_data = json.loads(text_data)['frame']
        course_id = json.loads(text_data)['course_id']
        image = self.decode_base64_image(frame_data)

        # Process the frame (example: convert to grayscale)
        processed_image = self.process_frame(image, course_id)

        # Send the processed frame back to the frontend (optional)
        await self.send(json.dumps({'result': 'Frame processed successfully'}))

    def decode_base64_image(self, frame_data):
        # Decode the base64 image
        image_data = frame_data.split(',')[1]
        img = base64.b64decode(image_data)
        np_arr = np.frombuffer(img, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        return image

    def process_frame(self, image, model_file='facial_model.pkl'):
        # Example: convert the frame to grayscale

        frame = image
        facenet = FaceNet()

        # Load the model (face embeddings)
        if os.path.exists(model_file):
            with open(model_file, 'rb') as f:
                face_embeddings = pickle.load(f)
        else:
            print("No model found. Train the model first.")
            return

        rgb_image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Detect faces and extract embeddings
        faces = facenet.extract(rgb_image, threshold=0.95)

        for face in faces:
            embedding = face['embedding']
            # Find the closest embedding from the saved model
            best_match_name = None
            min_distance = float('inf')

            for name, embeddings in face_embeddings.items():
                # Calculate Euclidean distance between the current embedding and saved embeddings
                distances = np.linalg.norm(embeddings - embedding, axis=1)
                min_dist = np.min(distances)

                if min_dist < min_distance:
                    min_distance = min_dist
                    best_match_name = name

            if min_distance < 1.0:
                return best_match_name

        return None
