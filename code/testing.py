from torchvision import models, transforms
import torch
from PIL import Image
import os

# Load Places365-specific weights
def load_places365_model(model_path):
    model = models.resnet18(num_classes=365)  # 365 classes for Places365
    checkpoint = torch.load(model_path, map_location=torch.device('cpu'))  # Load model weights
    model.load_state_dict(checkpoint['state_dict'])
    model.eval()  # Set model to evaluation mode
    return model

# File paths
base_dir = os.path.dirname(__file__)  # Get the directory of the script
model_path = os.path.join(base_dir, "resnet18_places365.pth")
categories_path = os.path.join(base_dir, "categories_places365.txt")

# Load the model
model = load_places365_model(model_path)

# Preprocessing pipeline for input images
preprocess = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(224),  # Ensure correct input size for ResNet
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Load and preprocess the image
img_path = "image.jpg"  # Replace with your image path
img = Image.open(img_path).convert("RGB")  # Ensure RGB format
input_tensor = preprocess(img).unsqueeze(0)  # Add batch dimension

# Predict the scene
with torch.no_grad():
    scene_probs = model(input_tensor)
scene_label_index = scene_probs.argmax(dim=1).item()

# Map the index to a scene label
with open(categories_path, 'r') as f:
    categories = [line.strip().split(' ')[0][3:] for line in f]
scene_label = categories[scene_label_index]

print(f"Scene: {scene_label}")