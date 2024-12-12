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
labels= [
    "Artificial Intelligence",
    "Operating Systems",
    "Computer Networks",
    "Cybersecurity",
    "Cloud Computing",
    "Distributed Systems",
    "Blockchain Technology",
    "Compiler Design",
    "Computer Architecture",
    "Human-Computer Interaction",
    "Mobile Application Development",
    "Web Development",
    "Internet of Things (IoT)",
    "Big Data",
    "Natural Language Processing",
    "Robotics",
    "Quantum Computing",
    "Graph Theory",
    "Image Processing",
    "Computer Vision",
    "Augmented Reality",
    "Virtual Reality",
    "Embedded Systems",
    "DevOps",
    "Software Testing and Quality Assurance",
    "Agile Methodologies",
    "Version Control Systems",
    "Cryptography",
    "Functional Programming",
    "Object-Oriented Programming",
    "Game Development",
    "Bioinformatics",
    "Ethical Hacking",
    "Digital Signal Processing",
    "Data Visualization",
    "Reinforcement Learning",
    "Edge Computing",
    "Neural Networks",
    "Autonomous Systems",
    "Hardware Design",
    "Semantic Web",
    "API Development",
    "Data Mining",
    "Penetration Testing",
    "Information Retrieval"
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
