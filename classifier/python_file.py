# Import necessary libraries
import torch
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import os
# Suppress TensorFlow warnings
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"  # Disable oneDNN optimizations
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"  # 0 = all logs, 1 = info, 2 = warnings, 3 = errors only

# Suppress PyTorch storage warnings
import warnings
warnings.filterwarnings("ignore", category=UserWarning)  # Ignores all UserWarnings

# Define the question or topic
question = "Python Programming"

# Adjusted labels based on the content of the uploaded file
labels = [
    "data structures and algorithms",
    "programming concepts",
    "software engineering",
    "databases and data management",
    "machine learning and data science"
]

# Initialize the zero-shot classifier
classifier = pipeline(
    "zero-shot-classification",
    model="valhalla/distilbart-mnli-12-1",
    framework="pt"
)

# Classify the topic
classification = classifier(question, labels)

# Check if the topic belongs to computer science
if classification["labels"][0] in labels and classification["scores"][0] > 0.4:
    print(f"Topic '{question}' is related to computer science.")
    # Clear CUDA cache
    torch.cuda.empty_cache()

else:
    # If not related to the topics, print an appropriate message
    print(f"Sorry, the topic '{question}' is out of the domain of computer science. Try again with a relevant topic.")
