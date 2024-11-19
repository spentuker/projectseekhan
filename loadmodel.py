from transformers import AutoModelForSequenceClassification, AutoTokenizer

# Load model and tokenizer from your local directory
model_path = r'C:\Users\spent\Downloads\vipulchinmay_seekhan'  # Replace with your actual model path
model = AutoModelForSequenceClassification.from_pretrained(model_path)
tokenizer = AutoTokenizer.from_pretrained(model_path)

