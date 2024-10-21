import cv2
import os
import numpy as np
from keras_facenet import FaceNet
import pickle


from mtcnn.mtcnn import MTCNN
from keras.src.applications.resnet import ResNet50
from keras.api.applications.resnet import preprocess_input
from keras.api.preprocessing import image
from keras.api.models import Model
from keras.api.layers import GlobalAveragePooling2D


def normalize(embedding):
    norm = np.linalg.norm(embedding)
    if norm == 0:
        return embedding  # In case of zero vector, return it as is.
    return embedding / norm

# Function to split a video into frames and save them in a folder
# def split_video_to_frames(video_path, folder_name):
#     # Create the folder if it doesn't exist
#     if not os.path.exists(folder_name):
#         os.makedirs(folder_name)
#
#     # Open the video
#     cap = cv2.VideoCapture(video_path)
#     count = 0
#
#     while cap.isOpened():
#         ret, frame = cap.read()
#         if not ret:
#             break
#
#         # Save each frame as an image
#         frame_path = os.path.join(folder_name, f"frame_{count}.jpg")
#         cv2.imwrite(frame_path, frame)
#         count += 1
#
#     cap.release()
#     cv2.destroyAllWindows()
#
#     print(f"Saved {count} frames to {folder_name}")

def split_video_to_frames(video_path, folder_name):
    # Create 'train' directory if it doesn't exist
    train_dir = 'train'
    if not os.path.exists(train_dir):
        os.makedirs(train_dir)

    # Path to the specific folder for this person inside 'train'
    face_folder_path = os.path.join(os.getcwd(), 'mainapp', 'facial_functions', train_dir, folder_name)

    # Check if the folder already exists (i.e., this face has been trained)
    if os.path.exists(face_folder_path):
        print(f"Face for '{folder_name}' has already been trained. Stopping.")
        return False, "Already used ID"

    # Create the folder for this person's face
    os.makedirs(face_folder_path)

    # Open the video
    cap = cv2.VideoCapture(video_path)
    count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Save each frame as an image in the person's folder
        frame_path = os.path.join(face_folder_path, f"frame_{count}.jpg")
        cv2.imwrite(frame_path, frame)
        count += 1

    cap.release()
    cv2.destroyAllWindows()

    print(f"Saved {count} frames to {face_folder_path}")
    return True, "success"


# Function to train a facial model using keras_facenet
# def train_facial_model(folder_name, model_file='facial_model.pkl'):
#     facenet = FaceNet()
#
#     # Load or create the model
#     if os.path.exists(model_file):
#         with open(model_file, 'rb') as f:
#             face_embeddings = pickle.load(f)
#     else:
#         face_embeddings = {}  # New dictionary to hold embeddings
#
#     # Go through all the images in the folder
#     embeddings = []
#     for image_file in os.listdir(folder_name):
#         image_path = os.path.join(folder_name, image_file)
#         image = cv2.imread(image_path)
#         rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
#
#         # Detect face and extract embedding
#         faces = facenet.extract(rgb_image, threshold=0.95)
#         for face in faces:
#             embeddings.append(face['embedding'])
#
#     # Store embeddings under the folder name (name/id)
#     if embeddings:
#         face_embeddings[folder_name] = np.array(embeddings)
#
#     # Save the model
#     with open(model_file, 'wb') as f:
#         pickle.dump(face_embeddings, f)
#
#     print(f"Model updated with face embeddings from {folder_name}.")

def train_facial_model(folder_name, model_file='facial_model.pkl'):
    mtcnn = MTCNN()

    # Load ResNet50 model pretrained on ImageNet and remove the top layers to get embeddings
    base_model = ResNet50(weights='imagenet', include_top=False)
    model = Model(inputs=base_model.input, outputs=GlobalAveragePooling2D()(base_model.output))

    # Get the directory of the current file and go back one folder
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # Construct the full path to 'mainapp/facial_functions/model_file'
    model_file = os.path.join(os.getcwd(), 'mainapp', 'facial_functions', model_file)

    # Load or create the model
    if os.path.exists(model_file):
        with open(model_file, 'rb') as f:
            face_embeddings = pickle.load(f)
    else:
        face_embeddings = {}  # New dictionary to hold embeddings

    # Path to the folder inside 'train' directory
    folder_path = os.path.join(os.getcwd(), 'mainapp', 'facial_functions', 'train', folder_name)

    # Go through all the images in the folder
    embeddings = []
    for image_file in os.listdir(folder_path):
        image_path = os.path.join(folder_path, image_file)
        img = cv2.imread(image_path)
        rgb_image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        faces = mtcnn.detect_faces(rgb_image)

        if len(faces) > 0:
            # Extract the bounding box of the first face
            x, y, width, height = faces[0]['box']
            face = rgb_image[y:y + height, x:x + width]

            # Resize the face to match ResNet50 input (224x224)
            resized_face = cv2.resize(face, (224, 224))

            # Preprocess the face image for ResNet50
            img_array = np.expand_dims(resized_face, axis=0)
            img_array = preprocess_input(img_array)

            # Generate embedding using ResNet50
            embedding = model.predict(img_array).flatten()
            embedding = normalize(embedding)

            # Append the embedding to the list
            embeddings.append(embedding.flatten())

    # Store embeddings under the folder name (name/id)
    if embeddings:
        face_embeddings.update({f"{folder_name}": np.array(embeddings)})

    # Save the model
    with open(model_file, 'wb') as f:
        pickle.dump(face_embeddings, f)

    print(f"Model updated with face embeddings from {folder_name}.")
    return True, f"Model updated with face embeddings from {folder_name}."


def train_facial_model_facenet(folder_name, model_file='facial_model.pkl'):
    facenet = FaceNet()

    # Get the directory of the current file and go back one folder
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # Construct the full path to 'mainapp/facial_functions/model_file'
    model_file = os.path.join(os.getcwd(), 'mainapp', 'facial_functions', model_file)

    # Load or create the model
    if os.path.exists(model_file):
        with open(model_file, 'rb') as f:
            face_embeddings = pickle.load(f)
    else:
        face_embeddings = {}  # New dictionary to hold embeddings

    # Path to the folder inside 'train' directory
    folder_path = os.path.join(os.getcwd(), 'mainapp', 'facial_functions', 'train', folder_name)

    # Go through all the images in the folder
    embeddings = []
    for image_file in os.listdir(folder_path):
        image_path = os.path.join(folder_path, image_file)
        image = cv2.imread(image_path)
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Detect face and extract embedding
        faces = facenet.extract(rgb_image, threshold=0.97)

        face = faces[0]  # Only take the first (and only) face
        embeddings.append(face['embedding'])

        # for face in faces:
        #     embeddings.append(face['embedding'])

    # Store embeddings under the folder name (name/id)
    if embeddings:
        # face_embeddings[folder_name] = np.array(embeddings)
        face_embeddings.update({f"{[folder_name]}": np.array(embeddings)})

    # Save the model
    with open(model_file, 'wb') as f:
        pickle.dump(face_embeddings, f)

    print(f"Model updated with face embeddings from {folder_name}.")
    return True, f"Model updated with face embeddings from {folder_name}."

# Function to identify faces in real-time using OpenCV and keras_facenet
def identify_faces_live(model_file='facial_model.pkl'):
    facenet = FaceNet()

    # Load the model (face embeddings)
    if os.path.exists(model_file):
        with open(model_file, 'rb') as f:
            face_embeddings = pickle.load(f)
    else:
        print("No model found. Train the model first.")
        return

    cap = cv2.VideoCapture(0)  # Open webcam
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Convert to RGB
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

            # If the match is good enough, display it on the frame
            if min_distance < 1.0:  # You can adjust this threshold
                cv2.putText(frame, f"ID: {best_match_name}",
                            (face['box'][0], face['box'][1] - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                cv2.rectangle(frame, (face['box'][0], face['box'][1]),
                              (face['box'][2], face['box'][3]), (0, 255, 0), 2)

        cv2.imshow('Live Face Identification', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


def execute_training(student_id, video_dir, model_name):
    # 1. Split the video into frames and save them in a folder
    success, message = split_video_to_frames(video_dir, student_id)
    model_name += '.pkl'

    if success:
        # 2. Train the facial model with the frames in the folder
        success2, message2 = train_facial_model(student_id, model_file=model_name)

        return success2, message2

    return success, message



# Example usage of the functions
if __name__ == "__main__":
    execute_training('miracle', 'video.mp4', 'facial_model.pkl')
