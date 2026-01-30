import { useState, useMemo } from 'react';
import './App.css';
import { parseInput } from './utils/parser';
import { generatePPT } from './utils/pptGenerator';

const DEFAULT_TEXT = `감사해 시험이
은혜와진리찬양 004장
---
감사해 시험이 닥쳐 올 때에
주께서 인도하시니 두려움 없네
//
감사해 고통이 찾아 올 때에
주께서 지켜주시니 승리하리라
//
나의 모든 생활 속에서
주님을 찬양하리라
`;

function App() {
  const [inputText, setInputText] = useState(DEFAULT_TEXT);

  const parsedData = useMemo(() => parseInput(inputText), [inputText]);

  const handleGenerate = () => {
    generatePPT(parsedData);
  };

  return (
    <div className="container">
      {/* Left: Input Section */}
      <div className="editor-section">
        <div className="editor-header">
          <div className="editor-title">Church PPT Maker</div>
          <button className="generate-btn" onClick={handleGenerate}>
            Download PPTX
          </button>
        </div>
        <textarea
          className="lyric-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter lyrics here..."
        />
        <div style={{ color: '#888', fontSize: '0.8rem' }}>
          Format: Line 1: Title, Line 2: Source, ---: Splitter, //: New Slide
        </div>
      </div>

      {/* Right: Preview Section */}
      <div className="preview-section">
        <div className="preview-header">Slide Preview</div>

        {/* Slide 1: Title Slide */}
        <div className="slide-preview">
          <div className="slide-title">{parsedData.title || "(Title)"}</div>
          <div className="slide-source">{parsedData.source || "(Source)"}</div>
        </div>

        {/* Slide 2+: Lyrics Slides */}
        {parsedData.slides.map((slideText, index) => (
          <div key={index} className="slide-preview">
            <div className="slide-header">
              {parsedData.title} ({parsedData.source})
            </div>
            <div className="slide-content">
              {slideText}
            </div>
          </div>
        ))}

        {parsedData.slides.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            Add lyrics separated by // to see more slides.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
