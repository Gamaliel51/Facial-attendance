# consumers.py
import os
import base64
import cv2
import numpy as np
import json
import pickle
from datetime import datetime
from keras_facenet import FaceNet
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer


class VideoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        frame_data = json.loads(text_data)['frame']
        course_id = json.loads(text_data)['course_id']

        course_id += '.pkl'

        print(f"COURSE ID: {course_id}")

        image = self.decode_base64_image(frame_data)

        if image is None:
            await self.send(json.dumps({'result': 'Frame failed'}))
            return

        # Process the frame (example: convert to grayscale)
        processed_array = self.process_frame(image, course_id)

        # Send the processed frame back to the frontend (optional)
        await self.send(json.dumps({'result': processed_array}))

    def decode_base64_image(self, frame_data):
        # Decode the base64 image
        try:
            image_data = frame_data.split(',')[1]
            img = base64.b64decode(image_data)
            np_arr = np.frombuffer(img, np.uint8)
            image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            return image
        except:
            return None

    def process_frame(self, image, model_file='facial_model.pkl'):
        # Example: convert the frame to grayscale

        frame = image
        facenet = FaceNet()

        detected_faces = []

        # Get the directory of the current file and go back one folder
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

        # Construct the full path to 'mainapp/facial_functions/model_file'
        model_file = os.path.join(base_dir, 'facial_functions', model_file)

        print(f"MODEL PATH: {model_file}")

        # Check if the model file exists and load it
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

                matric = best_match_name.split('-')[0]
                name = best_match_name.split('-')[1]

                # Get the current time
                current_time = datetime.now().time()

                # Convert the time to a string in the format 'HH:MM'
                time_str = current_time.strftime('%H:%M')

                face_info = {'result': 'Frame processed successfully', 'matric': matric, 'name': name, 'time': time_str}

                detected_faces.append(face_info)

        return detected_faces
