import { useState, useRef, useEffect } from 'react';
import { Copy, Sparkles, UploadCloud, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

function App() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    skills: ''
  });
  const [pdfText, setPdfText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isTestMode, setIsTestMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    setError('');
    setFileName(file.name);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        text += strings.join(' ') + '\n';
      }
      setPdfText(text);
    } catch (err) {
      console.error('Error parsing PDF:', err);
      setError('Failed to parse PDF. Please try another file.');
    }
  };

  const generateLetter = async () => {
    if (!formData.name || !formData.role || !formData.company) {
      setError('Please fill in at least Name, Role, and Company.');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    setGeneratedLetter('');

    try {
      if (isTestMode) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const simulatedText = `Dear Hiring Manager at ${formData.company},\n\nI am ${formData.name}, and I am writing to express my strong interest in the ${formData.role} position at your esteemed company.\n\nMy background and skills, particularly in ${formData.skills || 'the relevant areas'}, align perfectly with your requirements. ${pdfText ? '\\n\\nFurthermore, as my attached resume details, I have extensive experience that makes me a strong fit for this role.' : ''}\n\nThank you for considering my application. I look forward to the opportunity to discuss how I can contribute to ${formData.company}.\n\nSincerely,\n${formData.name}`;
        setGeneratedLetter(simulatedText);
      } else {
        const apiKey = import.meta.env.VITE_API_KEY;
        if (!apiKey) {
          throw new Error('API Key is missing. Please configure VITE_API_KEY in .env file.');
        }

        const prompt = `
          You are an expert cover letter writer. Write a professional, compelling cover letter for the following candidate.
          
          Candidate Name: ${formData.name}
          Target Role: ${formData.role}
          Target Company: ${formData.company}
          Key Skills: ${formData.skills}
          
          ${pdfText ? `The candidate's resume text is provided below. Please incorporate relevant experiences and metrics from the resume to make the cover letter highly personalized and impactful:\n\nRESUME:\n${pdfText}` : ''}
          
          Format the output in clean Markdown. Do not include placeholders like "[Your Address]", just write the body of the letter and sign off with the candidate's name.
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to generate cover letter.');
        }

        const outputText = data.candidates[0].content.parts[0].text;
        setGeneratedLetter(outputText);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>AI Cover Letter Generator</h1>
        <p>Craft professional, highly personalized cover letters in seconds.</p>
      </header>

      <div className="toggle-container">
        <span style={{ color: 'var(--text-secondary)' }}>Simulation Mode</span>
        <label className="switch">
          <input 
            type="checkbox" 
            checked={isTestMode} 
            onChange={(e) => setIsTestMode(e.target.checked)} 
          />
          <span className="slider"></span>
        </label>
      </div>

      <main className="main-content">
        <div className="glass-panel">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} className="icon" />
            Application Details
          </h2>
          
          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              <span style={{ fontSize: '0.9rem' }}>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label>Candidate Name *</label>
            <input 
              type="text" 
              name="name" 
              className="form-control" 
              placeholder="John Doe" 
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Target Role *</label>
            <input 
              type="text" 
              name="role" 
              className="form-control" 
              placeholder="Senior Frontend Engineer" 
              value={formData.role}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Target Company *</label>
            <input 
              type="text" 
              name="company" 
              className="form-control" 
              placeholder="Acme Corp" 
              value={formData.company}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Key Skills (Optional)</label>
            <textarea 
              name="skills" 
              className="form-control" 
              placeholder="React, TypeScript, UI/UX Design..." 
              value={formData.skills}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div 
            className={`file-upload ${pdfText ? 'active' : ''}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="application/pdf"
              onChange={handleFileUpload}
            />
            {fileName ? (
              <>
                <CheckCircle2 size={32} className="icon" style={{ color: 'var(--success-color)' }} />
                <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{fileName}</p>
                <p style={{ fontSize: '0.85rem' }}>Resume parsed successfully. Click to replace.</p>
              </>
            ) : (
              <>
                <UploadCloud size={32} className="icon" />
                <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Upload Resume (PDF)</p>
                <p style={{ fontSize: '0.85rem' }}>Optional: We'll extract your experience to personalize the letter.</p>
              </>
            )}
          </div>

          <button 
            className="btn btn-primary" 
            onClick={generateLetter}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : (
              <>
                <Sparkles size={18} />
                Generate Cover Letter
              </>
            )}
          </button>
        </div>

        <div className="glass-panel output-panel">
          <div className="output-header">
            <h2>Generated Output</h2>
            {generatedLetter && (
              <button className="btn btn-secondary" onClick={copyToClipboard} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                {copied ? <><CheckCircle2 size={16} /> Copied!</> : <><Copy size={16} /> Copy Text</>}
              </button>
            )}
          </div>
          
          <div className="output-content">
            {isGenerating ? (
              <div className="loader">
                <div className="spinner"></div>
                <p className="pulse">Crafting your perfect cover letter...</p>
              </div>
            ) : generatedLetter ? (
              <div className="markdown-body">
                <ReactMarkdown>{generatedLetter}</ReactMarkdown>
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', textAlign: 'center', flexDirection: 'column', gap: '1rem' }}>
                <FileText size={48} opacity={0.5} />
                <p>Your generated cover letter will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
