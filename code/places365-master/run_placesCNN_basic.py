# PlacesCNN for scene classification with object detection
#
# by Bolei Zhou, modified to include object detection
# Last modified by Matias Gersberg

import cv2
import torch
from torch.autograd import Variable as V
import torchvision.models as models
from torchvision import transforms as trn
from torch.nn import functional as F
import os
from PIL import Image
from ultralytics import YOLO  # For object detection
import ultralytics
print(f"Ultralytics version: {ultralytics.__version__}")
import matplotlib.pyplot as plt

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

# Object detection setup
def detect_objects(image_path):
    # Load the YOLOv5 model
    model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
    print("YOLOv5 model loaded successfully!")

    # Perform inference
    results = model(image_path)

    # Extract detected object names
    detected_objects = []
    for row in results.pandas().xyxy[0].itertuples():
        detected_objects.append(row.name)  # 'name' is the object class name

    return detected_objects


# Load the test image
img_name = 'test2.jpg'
if not os.access(img_name, os.W_OK):
    img_url = f'http://places.csail.mit.edu/demo/{img_name}'
    os.system(f'wget {img_url}')

img = Image.open(img_name)
input_img = V(centre_crop(img).unsqueeze(0))

# Scene classification forward pass
logit = model.forward(input_img)
h_x = F.softmax(logit, 1).data.squeeze()
probs, idx = h_x.sort(0, True)

print(f'{arch} prediction on {img_name}')
# Output the scene prediction
for i in range(0, 5):
    print(f'{probs[i]:.3f} -> {classes[idx[i]]}')

# Object detection
detected_objects = detect_objects(img_name)
print(f'Detected Objects: {", ".join(detected_objects)}')
