import whisper
import os
from pydub import AudioSegment
import speech_recognition as sr
import ollama
from fpdf import FPDF
import warnings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain.schema import Document
from langchain_community.vectorstores import Chroma


warnings.filterwarnings("ignore", message="You are using `torch.load` with `weights_only=False`")
warnings.filterwarnings("ignore", message="FP16 is not supported on CPU; using FP32 instead")


def transcribe_audio(mp3_file):
    try:
        # Load Whisper model
        model = whisper.load_model("base")
        print("Model loaded successfully!")

        # Transcribe the MP3 file
        print("Transcribing audio...")
        result = model.transcribe(mp3_file)
        return result.get("text", "No transcription found.")
    except Exception as e:
        return f"An error occurred: {e}"

test_document = r"C:\Users\Srujana\OneDrive\Desktop\UNIT - 1INTRODUCTION.mp3"
document_text = transcribe_audio(test_document)
# Split the document into smaller chunks using RecursiveCharacterTextSplitter
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
splits = text_splitter.split_text(document_text)

# Convert the text splits into Document objects
documents = [Document(page_content=text) for text in splits]

# Create Ollama embeddings and vector store
embeddings = OllamaEmbeddings(model="laddo")
vectorstore = Chroma.from_documents(documents=documents, embedding=embeddings)

# Create the retriever
retriever = vectorstore.as_retriever()

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# Define the Ollama LLM function
def ollama_llm(question, context):
    formatted_prompt = f"Question: {question}\n\nContext: {context}"
    response = ollama.chat(model='laddo', messages=[{'role': 'user', 'content': formatted_prompt}])
    return response['message']['content']

# Define the RAG chain
def rag_chain(question):
    retrieved_docs = retriever.invoke(question)
    formatted_context = format_docs(retrieved_docs)
    return ollama_llm(question, formatted_context)
Questions =input("Enter Noof Questions:")
q_type = input("Enter type (MCQs/True or False/Fill in the blanks): ")
Prompt = f"Generate {Questions} {q_type} questions with answers"
# Example usage of the RAG chain
result = rag_chain(Prompt)


from langchain_community.document_loaders import PyPDFLoader
from langchain_community.llms import Ollama
import random
from fpdf import FPDF
import os

# Function to save response to a PDF
def save_to_pdf(response, output_file):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, response)
    pdf.output(output_file)
    print(f"Response saved to {output_file}")

# RAG Setup and PDF Saving
def main():
    # Example response for testing purposes
    # In a real scenario, you will be working with your RAG pipeline to get this result.

    # Get current working directory to save the output PDF
    current_directory = os.getcwd()
    print(f"Saving PDF in directory: {current_directory}")

    x = random.randint(1, 1000)  # Use a larger range to reduce conflicts
    output_file = os.path.join(current_directory, f"{q_type}_{Questions}_{x}.pdf")
    # Save result to PDF
    save_to_pdf(result, output_file)

# Run the main function
if __name__ == "__main__":
    main()




