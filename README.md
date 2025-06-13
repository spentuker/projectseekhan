*This project is proudly mentored under **KMIT's Project School** 🚀*

---

# 📚 Seekhan: AI-Powered Quiz Generation Platform

![Seekhan Logo](https://github.com/user-attachments/assets/2b61bae6-b513-4738-b221-3c8b641d394d)

Seekhan ("to learn" in Hindi) is a revolutionary web-based application that automatically generates intelligent, interactive quizzes from any piece of text or topic input by the user. Powered by state-of-the-art Generative AI, Seekhan makes studying smarter, more efficient, and deeply personalized.

---

## 🎯 Project Objective

To eliminate the hassle of manual quiz creation and make studying more engaging by generating custom quizzes on-the-fly from user inputs like topics, chapters, articles, or documents.

With Seekhan, learners can:

* Reinforce their knowledge
* Get instant feedback
* Practice actively instead of passively reading

---

## ✨ Features

🔎 **Topic-Based Quiz Generation**
Just type in a topic, chapter, or paste any content—Seekhan does the rest.

📄 **Supports Text & Document Input**
Feed in raw text or PDFs—Seekhan converts them to quiz-ready content.

🧠 **Powered by GenAI Models (Llama2, DistilBART)**
LLMs trained to generate different question types: MCQs, True/False, Fill in the Blanks, and Short Answers.

💻 **User-Friendly Web Interface**
A sleek, responsive frontend built in React allows learners to interact seamlessly.

📊 **Analytics (Coming Soon)**
Performance tracking, improvement graphs, and adaptive quiz suggestions.

🎨 **Beautiful UI with Smooth Transitions**
Clean animations and polished UX ensure an enjoyable experience.

📚 **Notebook-based Fine-Tuning**
See exactly how the models are trained and improved through well-documented notebooks.

---

## 🏗️ Project Architecture

```bash
seekhan/
├── frontend/               # React web app (interactive quiz UI)
├── proj-app/
│   └── flask/              # Flask backend (API, model connection)
├── model/                  # LLM model code + custom logic
├── llamato/                # Llama2 integration
├── distilbart_model/       # DistilBART support
├── dataset/                # Data handling and preprocessing scripts
├── archive/notebooks/      # Fine-tuning notebooks and experiments
├── pdf_to_text.ipynb       # Convert PDF content to raw text
└── hi.xlsx                 # Sample dataset
```

---

## 🔁 Workflow

1. **User Input**

   * Type in a topic, paste content, or upload a PDF.

2. **Frontend ➡️ Backend**

   * React frontend sends a request to Flask backend with the input.

3. **Quiz Generation**

   * Backend routes it to the appropriate AI model (Llama2 / DistilBART).
   * The model returns quiz questions and answers.

4. **Frontend Displays Quiz**

   * Questions are rendered interactively in the browser.

5. **Optional Feedback Collection** (Upcoming)

---

## 🧪 Notebooks & Experiments

📓 [`projectseekhannotebook.ipynb`](archive/notebooks/projectseekhannotebook.ipynb)
Complete walkthrough for fine-tuning and inference.

🧬 `alpaca+mistral_final.ipynb`, `WORKING_INFERENCE_MODEL.ipynb`
Other models and inference strategies explored.

---

## ⚙️ Getting Started

### 🔧 Prerequisites

* Python 3.8+
* Node.js (for frontend)
* GPU recommended (for inference speed)

### 🚀 Setup Instructions

#### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/seekhan
```

#### 2. Backend (Flask)

```bash
cd proj-app/flask/
python -m venv venv
source venv/bin/activate     # On Windows: venv\Scripts\activate
pip install -r requirements.txt
flask run
```

#### 3. Frontend (React)

```bash
cd frontend/
npm install
npm run dev
```

#### 4. Model Setup

* Download or fine-tune model weights from notebooks
* Place them in `/model`, `/llamato`, or `/distilbart_model` accordingly

---

## 🚧 Upcoming Features

🧠 Adaptive Quiz Difficulty
📈 Real-time Analytics and Performance Dashboard
🗂️ Save & Export Quizzes as PDFs
🧑‍🏫 Teacher/Admin Dashboard for Batch Quiz Generation
🌍 Language Translation & Accessibility Support

---

## 🤝 Contributing

We’d love to have you on board! Submit issues or PRs to make Seekhan even better.

---

## 📜 License

Educational project. Refer to individual files for license info.

---

## 🙌 Acknowledgements

* KMIT's Project School 🙏
* OpenAI and HuggingFace 💡
* The amazing LLM community 💻
* React, Flask, and all open-source heroes 🛠️

---

> "The future of learning is not just reading—it’s interacting, questioning, and creating. Seekhan is our step towards that future."

---
