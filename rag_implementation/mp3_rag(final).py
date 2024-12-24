import os
from pydub import AudioSegment
import speech_recognition as sr
import ollama
from fpdf import FPDF

# Function to convert audio to text
def convert_audio_to_text(audio_file):
    if not os.path.exists(audio_file):
        return f"Error: The file at {audio_file} does not exist. Please check the path."
    
    wav_file = "converted_audio.wav"
    
    try:
        print(f"Converting {audio_file} to WAV format...")
        audio = AudioSegment.from_mp3(audio_file)
        audio.export(wav_file, format="wav")
        print(f"Converted {audio_file} to {wav_file}")
        
        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_file) as source:
            print("Recognizing speech...")
            audio_data = recognizer.record(source)
            return recognizer.recognize_google(audio_data)
    except Exception as e:
        return f"An error occurred during audio processing: {e}"

# Define the Ollama LLM function
def ollama_llm(question, context):
    formatted_prompt = f"Question: {question}\n\nContext: {context}"
    response = ollama.chat(model='laddo', messages=[{'role': 'user', 'content': formatted_prompt}])
    return response['message']['content']

# Define the RAG chain
def rag_chain(question, context):
    return ollama_llm(question, context)

# Function to save response to a PDF
def save_to_pdf(response, output_file):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, response)
    pdf.output(output_file)
    print(f"Response saved to {output_file}")

# Main function
def main():
    # Input: Audio file
    audio_file = input("Enter the path to the audio file: ").strip()
    context = convert_audio_to_text(audio_file)
    
    if "Error" in context:
        print(context)
        return

    # RAG question generation
    questions = input("Enter number of questions: ").strip()
    q_type = input("Enter type (MCQs/True or False/Fill in the blanks): ").strip()
    prompt = f"Generate {questions} {q_type}"
    result = rag_chain(prompt, context)
    
    # Save result to PDF
    current_directory = os.getcwd()
    output_file = os.path.join(current_directory, f"{q_type}_{questions}.pdf")
    save_to_pdf(result, output_file)

# Run the main function
if __name__ == "__main__":
    main()
