import torch
from torch.autograd import Variable as V
import torchvision.models as models
from torchvision import transforms as trn
from torch.nn import functional as F
import os
from PIL import Image
from ultralytics import YOLO  # For object detection
import requests
from collections import Counter
import genius_spotify_testing
import random
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/classify', methods=['GET'])
def classify():
    filepath = request.args.get('filepath')  # Retrieve parameter 1
    song_number_multiplier = int(request.args.get('list_len'))
    diversity_multiplier = int(request.args.get('diversity'))
    print('params: \n')
    print(song_number_multiplier)
    print(diversity_multiplier)
    scene_breadth = 10 #default 10
    # Hugging Face API details
    API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-base"
    headers = {"Authorization": "Bearer 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"}
     
    # Scene classification setup
    arch = 'resnet18'

    # Load the pre-trained weights for scene classification
    model_file = f'{arch}_places365.pth.tar'
    if not os.access(model_file, os.W_OK):
        weight_url = f'http://places2.csail.mit.edu/models_places365/{model_file}'
        os.system(f'wget {weight_url}')

    model = models.__dict__[arch](num_classes=365)
    checkpoint = torch.load(model_file, map_location=lambda storage, loc: storage)
    state_dict = {str.replace(k, 'module.', ''): v for k, v in checkpoint['state_dict'].items()}
    model.load_state_dict(state_dict)
    model.eval()

    # Load the image transformer
    centre_crop = trn.Compose([
        trn.Resize((256, 256)),
        trn.CenterCrop(224),
        trn.ToTensor(),
        trn.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    # Load the class labels
    file_name = 'categories_places365.txt'
    if not os.access(file_name, os.W_OK):
        synset_url = 'https://raw.githubusercontent.com/csailvision/places365/master/categories_places365.txt'
        os.system(f'wget {synset_url}')
    classes = list()
    with open(file_name) as class_file:
        for line in class_file:
            classes.append(line.strip().split(' ')[0][3:])
    classes = tuple(classes)

    # Object detection setup with frequency counting
    # def detect_objects_with_frequency(image_path):
    #     # Load the YOLOv5 model
    #     model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
    #     print("YOLOv5 model loaded successfully!")

    #     # Perform inference
    #     results = model(image_path)

    #     # Extract detected object names
    #     detected_objects = []
    #     for row in results.pandas().xyxy[0].itertuples():
    #         detected_objects.append(row.name)  # 'name' is the object class name

    #     # Count frequencies of detected objects
    #     object_counts = Counter(detected_objects)
    #     most_prevalent_objects = object_counts.most_common(5)  # Top 5 objects by frequency

    #     return detected_objects, most_prevalent_objects 

    # Query the Hugging Face API
    def query(prompt):
        response = requests.post(
            API_URL,
            headers=headers,
            json={
                "inputs": prompt,
                "parameters": {
                    "max_length": 200,  # Adjust this value as needed
                    "temperature": 0.0,  # Optional: Add variability to the response
                },
            },
        )
        response.raise_for_status()
        return response.json()

    def generate_spotify_api_call(scene, objects):
        # Construct a prompt for the Hugging Face model
        print(scene)
        prompt = f"""
        You are a helpful assistant. Answer the following question: What is 2 + 2 in math equal to?
        """
        # Query the Hugging Face API
        output = query(prompt)
        print("\n--- Spotify API Call ---")
        print(output[0]['generated_text'])

    # Main logic
    img_name = filepath
    if not os.access(img_name, os.W_OK):
        img_url = f'http://places.csail.mit.edu/demo/{img_name}'
        os.system(f'wget {img_url}')

    img = Image.open(img_name)
    input_img = V(centre_crop(img).unsqueeze(0))

    # Scene classification forward pass
    logit = model.forward(input_img)
    h_x = F.softmax(logit, 1).data.squeeze()
    probs, idx = h_x.sort(0, True)
    scene = classes[idx[0]]  # Top scene classification result

    print(f'{arch} prediction on {img_name}')

    # Output the scene prediction
    scene_results = []
    for i in range(0, scene_breadth):
        #scene = f'{probs[i]:.3f} -> {classes[idx[i]]}'
        scene = [(float(probs[i])), (classes[idx[i]])]
        print(scene)
        scene_results.append(scene)
    print(scene_results)
    # Object detection with frequency
    song_list = []
    max_scene = max(scene_results)[0]
    unique_song_list = list(set(song_list))
    if diversity_multiplier > 1 and max_scene < 0.65: #need to think of ways to make this more equitable. Need better algorithm
        scene_number = 0
        counter = 0
        
        for scene in scene_results:
            if scene[0] > max_scene * (1/diversity_multiplier):
                scene_number += float(scene[0])
                counter += 1
        for scene in scene_results:
            if scene[0] > max_scene * (1/diversity_multiplier):
                scene[0] = scene_number/counter
        print("NEW RESULTS")
        print(scene_results)

    for scene in scene_results:
        song_nest = genius_spotify_testing.search_theme_in_lyrics_and_spotify(scene[1])
        print("\nSONG NEST")
        print(song_nest)
        if scene[0] <0.1:
            scene[0] = 0.1 #making sure to include themes that are a little more out there, accurate enough to work
        scene[0] = song_number_multiplier * scene[0]
        song_slice = int(len(song_nest)* scene[0])
        
        unique_song_list.append(song_nest[:song_slice])
    # Print combined results
    random.shuffle(unique_song_list)
    print("\nSONG LIST")
    unique_song_list =[song for sublist in unique_song_list for song in sublist]
    for song in unique_song_list:
        print(f"{song['title']} by {song['artist']} - {song['spotify_url']}")
    print("\n--- Combined Results ---")
    print(f"Scene Predictions (Top 5):")
    for scene in scene_results:
        print(f"  - {scene}")

    return jsonify({'songs': unique_song_list, 'scenes': scene_results[0]})

if __name__ == "__main__":
    app.run(port=5004)