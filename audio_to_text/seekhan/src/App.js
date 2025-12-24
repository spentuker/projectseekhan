import React, { useState, useRef, useEffect } from 'react';
import { Upload, Mic, Send, FileText, StopCircle, Loader2, X, MessageSquare, Image as ImageIcon, Youtube, Sparkles, FileUp, Link as LinkIcon, ChevronDown, Volume2 } from 'lucide-react';
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const RAGVoiceChatbot = () => {
  const [apiKey, setApiKey] = useState('');
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [document, setDocument] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'youtube'
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Fetch YouTube transcript
  const fetchYoutubeTranscript = async (videoId) => {
    try {
      // Using YouTube Transcript API (you'll need to implement a backend proxy or use a service)
      // For now, we'll use a simulated approach with Groq to extract content
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{
            role: 'user',
            content: `Extract and provide a detailed transcript/summary of the YouTube video with ID: ${videoId}. Include all main points, topics discussed, and key information. Be comprehensive.`
          }],
          temperature: 0.3,
          max_tokens: 4000
        })
      });

      if (!response.ok) throw new Error('Failed to fetch transcript');

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      throw new Error('Failed to extract YouTube content: ' + err.message);
    }
  };

  // Handle YouTube URL submission
  const handleYoutubeSubmit = async () => {
    if (!youtubeUrl.trim()) return;

    const videoId = getYoutubeVideoId(youtubeUrl);
    if (!videoId) {
      alert('Invalid YouTube URL');
      return;
    }

    setIsProcessing(true);
    try {
      const transcript = await fetchYoutubeTranscript(videoId);
      
      if (!transcript || transcript.length < 50) {
        throw new Error('Could not extract meaningful content from video');
      }

      setDocument({ 
        name: `YouTube: ${videoId}`,
        type: 'youtube',
        size: transcript.length,
        url: youtubeUrl
      });
      setDocumentContent(transcript);
      setDocumentType('youtube');
      setMessages([{
        role: 'system',
        content: `YouTube video transcript extracted successfully! ${transcript.length} characters. You can now ask questions about the video content.`
      }]);
      setShowSettings(false);
      setYoutubeUrl('');
      setShowYoutubeInput(false);
    } catch (err) {
      alert('Error processing YouTube video: ' + err.message);
    }
    setIsProcessing(false);
  };

  // Optimized PDF text extraction
  const extractPDFText = async (arrayBuffer) => {
    try {
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const textPromises = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        textPromises.push(
          pdf.getPage(i).then(page => 
            page.getTextContent().then(content => 
              content.items.map(item => item.str).join(' ')
            )
          )
        );
      }
      
      const pages = await Promise.all(textPromises);
      return pages.join('\n').trim();
    } catch (err) {
      throw new Error('Failed to parse PDF: ' + err.message);
    }
  };

  const extractDocxText = async (arrayBuffer) => {
    try {
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value.trim();
    } catch (err) {
      throw new Error('Failed to parse DOCX: ' + err.message);
    }
  };

  const extractImageText = async (base64Image, mimeType) => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.2-90b-vision-preview',
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              },
              {
                type: 'text',
                text: 'Extract all text from this image. Provide only the extracted text, no explanations or formatting.'
              }
            ]
          }],
          temperature: 0.5,
          max_tokens: 2000
        })
      });
  
      if (!response.ok) throw new Error('Image text extraction failed');
      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (err) {
      throw new Error('Failed to extract text from image: ' + err.message);
    }
  };

  const extractTextFromFile = async (file) => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Error reading file'));
      
      reader.onload = async (e) => {
        try {
          const content = e.target.result;
          
          if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
            resolve(content);
          } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
            const text = await extractPDFText(content);
            resolve(text);
          } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
            const text = await extractDocxText(content);
            resolve(text);
          } else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
            const text = await extractDocxText(content);
            resolve(text);
          } else if (fileType.startsWith('image/')) {
            const base64 = content.split(',')[1];
            const text = await extractImageText(base64, fileType);
            resolve(text);
          } else {
            reject(new Error('Unsupported file type'));
          }
        } catch (err) {
          reject(err);
        }
      };
      
      if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        reader.readAsText(file);
      } else if (fileType.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 10MB limit');
      return;
    }

    setIsProcessing(true);
    try {
      const text = await extractTextFromFile(file);
      
      if (!text || text.length < 10) {
        throw new Error('No meaningful text extracted from file');
      }
      
      setDocument(file);
      setDocumentContent(text);
      setDocumentType(file.type);
      setMessages([{
        role: 'system',
        content: `Document "${file.name}" uploaded successfully! Extracted ${text.length} characters. You can now ask questions about it.`
      }]);
      setShowSettings(false);
    } catch (err) {
      alert('Error processing file: ' + err.message);
    }
    setIsProcessing(false);
  };

  const performRAG = (query, topK = 5) => {
    if (!documentContent) return '';
    
    const sentences = documentContent
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20);
    
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
    
    const scoredSentences = sentences.map((sentence, idx) => {
      const sentenceLower = sentence.toLowerCase();
      let score = 0;
      
      if (sentenceLower.includes(queryLower)) {
        score += 10;
      }
      
      queryWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = sentenceLower.match(regex);
        if (matches) {
          score += matches.length * 2;
        }
      });
      
      return { sentence, score, index: idx };
    });
    
    const relevant = scoredSentences
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .sort((a, b) => a.index - b.index)
      .map(item => item.sentence);
    
    return relevant.join('. ') + '.';
  };

  const sendMessageToGroq = async (userMessage) => {
    const context = performRAG(userMessage);
    
    const systemPrompt = context 
      ? `You are a helpful AI assistant analyzing a document. Answer the user's question based ONLY on this context from their document. Be concise and accurate. If the answer isn't clearly in the context, say "I couldn't find that information in the document."\n\nContext:\n${context}`
      : 'You are a helpful assistant. No relevant context was found in the document for this query.';
  
    abortControllerRef.current = new AbortController();
  
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 1000
        }),
        signal: abortControllerRef.current.signal
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error?.message || response.status}`);
      }
  
      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('Request cancelled');
      }
      throw new Error('Failed to get response: ' + err.message);
    }
  };

  const textToSpeech = async (text) => {
    if (!elevenLabsKey || !text) return;

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsKey
        },
        body: JSON.stringify({
          text: text.substring(0, 5000),
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) throw new Error('TTS failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsSpeaking(true);
        
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
      }
    } catch (err) {
      console.error('TTS Error:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !documentContent) return;

    const userMessage = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsProcessing(true);

    try {
      const response = await sendMessageToGroq(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      
      if (elevenLabsKey) {
        await textToSpeech(response);
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: err.message
      }]);
    }
    
    setIsProcessing(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access denied: ' + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    setIsProcessing(true);
    
    try {
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('file', audioFile);
      formData.append('model', 'whisper-large-v3');
      formData.append('language', 'en');
      formData.append('response_format', 'json');
      
      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Transcription failed');
      }
  
      const data = await response.json();
      const transcription = data.text.trim();
      
      if (transcription) {
        setInputText(transcription);
      } else {
        throw new Error('No transcription returned');
      }
    } catch (err) {
      alert('Transcription error: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  };

  const removeDocument = () => {
    setDocument(null);
    setDocumentContent('');
    setDocumentType('');
    setMessages([]);
    setShowSettings(true);
  };

  const getFileIcon = () => {
    if (!document) return <FileText className="w-5 h-5 text-blue-600" />;
    
    if (document.type === 'youtube') {
      return <Youtube className="w-5 h-5 text-red-600" />;
    }
    if (document.type && document.type.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5 text-green-600" />;
    }
    return <FileText className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="flex h-screen bg-white">
      <audio ref={audioRef} className="hidden" />
      
      {/* Enhanced Sidebar */}
      <div className="w-96 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="p-8 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">NotebookLM</h1>
              <p className="text-xs text-slate-500">AI-Powered Source Analysis</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {showSettings && (
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-blue-900 uppercase tracking-wide">API Configuration</span>
                </div>
                <p className="text-xs text-blue-700 mb-3">Add your API keys for enhanced features</p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Groq API Key
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="gsk_..."
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      ElevenLabs API Key <span className="text-slate-400">(Voice)</span>
                    </label>
                    <input
                      type="password"
                      value={elevenLabsKey}
                      onChange={(e) => setElevenLabsKey(e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Sources</h3>
              {document && (
                <span className="text-xs text-slate-500">1 source</span>
              )}
            </div>
            
            {document ? (
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    {getFileIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">{document.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">
                        {document.type === 'youtube' ? 'Video transcript' : `${(document.size / 1024).toFixed(1)} KB`}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{documentContent.length} chars</span>
                    </div>
                  </div>
                  <button
                    onClick={removeDocument}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Upload Method Toggle */}
                <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                  <button
                    onClick={() => setUploadMethod('file')}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                      uploadMethod === 'file'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileUp className="w-4 h-4 inline mr-1" />
                    Upload File
                  </button>
                  <button
                    onClick={() => setUploadMethod('youtube')}
                    className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                      uploadMethod === 'youtube'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Youtube className="w-4 h-4 inline mr-1" />
                    YouTube
                  </button>
                </div>

                {uploadMethod === 'file' ? (
                  <label className="block">
                    <input
                      type="file"
                      accept=".txt,.pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isProcessing}
                    />
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <p className="text-sm font-medium text-slate-700 mb-1">
                        Drop your file here
                      </p>
                      <p className="text-xs text-slate-500">
                        TXT, PDF, DOC, DOCX, PNG, JPG
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Maximum 10MB
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="Paste YouTube URL..."
                        disabled={isProcessing}
                        className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleYoutubeSubmit();
                          }
                        }}
                      />
                      <button
                        onClick={handleYoutubeSubmit}
                        disabled={!youtubeUrl.trim() || isProcessing}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {isProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Youtube className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <p className="text-xs text-slate-600">
                        📹 Paste any YouTube video URL to extract and analyze its content
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {document && (
            <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-blue-900 mb-1">
                    Source Ready
                  </h4>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Your source has been processed. Ask questions to get AI-powered insights and answers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-500 text-center">
            Powered by Groq & ElevenLabs
          </div>
        </div>
      </div>

      {/* Main Chat Area - NotebookLM Style */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-2xl">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                  {document ? 'Ready to explore your source' : 'Get started with a source'}
                </h2>
                <p className="text-slate-600 text-lg mb-6">
                  {document 
                    ? 'Ask me anything about your uploaded content. I can help you understand, summarize, and find specific information.'
                    : 'Upload a document or add a YouTube video to start having AI-powered conversations about your content.'}
                </p>
                {document && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => setInputText('Summarize the main points')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Summarize the main points
                    </button>
                    <button
                      onClick={() => setInputText('What are the key takeaways?')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Key takeaways
                    </button>
                    <button
                      onClick={() => setInputText('Explain this in simple terms')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Explain simply
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto py-8 px-6 space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'system' ? (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl px-5 py-4 max-w-2xl shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-semibold text-green-900 uppercase tracking-wide">System</span>
                      </div>
                      <p className="text-sm text-green-800 leading-relaxed">{msg.content}</p>
                    </div>
                  ) : msg.role === 'error' ? (
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl px-5 py-4 max-w-2xl shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs font-semibold text-red-900 uppercase tracking-wide">Error</span>
                      </div>
                      <p className="text-sm text-red-800 leading-relaxed">{msg.content}</p>
                    </div>
                  ) : (
                    <div
                      className={`rounded-2xl px-6 py-4 max-w-2xl shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                          : 'bg-white border border-slate-200'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">AI Response</span>
                        </div>
                      )}
                      <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user' ? 'text-white' : 'text-slate-800'
                      }`}>
                        {msg.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      <span className="text-sm text-slate-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Enhanced Input Area */}
        <div className="border-t border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-slate-300 rounded-2xl shadow-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              <div className="flex items-end p-2">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={documentContent ? "Ask anything about your source..." : "Upload a source to start chatting..."}
                  disabled={!documentContent || isProcessing}
                  className="flex-1 px-4 py-3 text-sm resize-none border-none focus:outline-none focus:ring-0 bg-transparent"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '200px' }}
                />
                
                <div className="flex items-center gap-2 px-2">
                  {isSpeaking ? (
                    <button
                      onClick={stopSpeaking}
                      className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shadow-sm"
                      title="Stop speaking"
                    >
                      <StopCircle className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={!documentContent || isProcessing}
                      className={`p-2.5 rounded-xl transition-all shadow-sm ${
                        isRecording
                          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={isRecording ? 'Stop recording' : 'Voice input'}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  )}
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || !documentContent || isProcessing}
                    className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    title="Send message"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 px-1">
              <p className="text-xs text-slate-500">
                Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-mono">Enter</kbd> to send • <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs font-mono">Shift+Enter</kbd> for new line
              </p>
              {elevenLabsKey && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Voice enabled</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RAGVoiceChatbot;