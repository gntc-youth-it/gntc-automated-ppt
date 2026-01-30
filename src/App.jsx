import { useState, useMemo, useEffect } from 'react';
import './App.css';
import { parseInput } from './utils/parser';
import { generatePPT } from './utils/pptGenerator';

const DEFAULT_TEXT = `# 제목은 이렇게 쓰면 됩니다.
## 찬양위치를 써주시면 됩니다.
가사는 엔터를 잘 맞춰서
써주시면 됩니다.
//
새슬라이드는 슬래시
두개로 구분합니다.
//
새로운 찬양을 시작하려면
샾을 입력하셔서 시작합니다.
//
예시를 확인해 보시길 바랍니다.
# 감사해 시험이
## 은혜와진리찬양 004장
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
  const [inputText, setInputText] = useState(() => localStorage.getItem('church-ppt-input') || DEFAULT_TEXT);
  const [verticalAlign, setVerticalAlign] = useState(() => localStorage.getItem('church-ppt-align') || 'top');
  const [titleFontSize, setTitleFontSize] = useState(() => Number(localStorage.getItem('church-ppt-title-size')) || 54);
  const [lyricsFontSize, setLyricsFontSize] = useState(() => Number(localStorage.getItem('church-ppt-lyrics-size')) || 44);
  const [showSongInfo, setShowSongInfo] = useState(() => {
    const saved = localStorage.getItem('church-ppt-show-info');
    return saved !== null ? saved === 'true' : true;
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('church-ppt-input', inputText);
  }, [inputText]);

  useEffect(() => {
    localStorage.setItem('church-ppt-align', verticalAlign);
  }, [verticalAlign]);

  useEffect(() => {
    localStorage.setItem('church-ppt-title-size', titleFontSize);
  }, [titleFontSize]);

  useEffect(() => {
    localStorage.setItem('church-ppt-lyrics-size', lyricsFontSize);
  }, [lyricsFontSize]);

  useEffect(() => {
    localStorage.setItem('church-ppt-show-info', showSongInfo);
  }, [showSongInfo]);

  const parsedData = useMemo(() => parseInput(inputText), [inputText]);

  const handleGenerate = () => {
    generatePPT(parsedData, { verticalAlign, titleFontSize, lyricsFontSize, showSongInfo });
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

        {/* Controls Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', backgroundColor: '#252525', padding: '1rem', borderRadius: '8px', border: '1px solid #333' }}>

          {/* Alignment Control */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#eee' }}>
            <label>Vertical Align</label>
            <select
              value={verticalAlign}
              onChange={(e) => setVerticalAlign(e.target.value)}
              style={{ padding: '0.3rem', borderRadius: '4px', backgroundColor: '#333', color: 'white', border: '1px solid #555' }}
            >
              <option value="top">Top</option>
              <option value="middle">Middle</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>

          {/* Title Size Control */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#eee' }}>
            <label>Title Size ({titleFontSize}pt)</label>
            <input
              type="range"
              min="30"
              max="100"
              value={titleFontSize}
              onChange={(e) => setTitleFontSize(Number(e.target.value))}
              style={{ width: '120px', cursor: 'pointer' }}
            />
          </div>

          {/* Lyrics Size Control */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#eee' }}>
            <label>Lyrics Size ({lyricsFontSize}pt)</label>
            <input
              type="range"
              min="20"
              max="80"
              value={lyricsFontSize}
              onChange={(e) => setLyricsFontSize(Number(e.target.value))}
              style={{ width: '120px', cursor: 'pointer' }}
            />
          </div>

          {/* Show Song Info Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#eee' }}>
            <label htmlFor="showSongInfo">Show Song Info</label>
            <input
              id="showSongInfo"
              type="checkbox"
              checked={showSongInfo}
              onChange={(e) => setShowSongInfo(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>
        </div>
        <textarea
          className="lyric-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter lyrics here..."
        />
        <div style={{ color: '#888', fontSize: '0.8rem' }}>
          Format: # Title, ## Source, // New Slide
        </div>
      </div>

      {/* Right: Preview Section */}
      <div className="preview-section">
        <div className="preview-header">Slide Preview</div>

        {/* Iterate over Songs */}
        {parsedData.map((song, songIndex) => (
          <div key={songIndex} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {/* Visual Separator for Songs */}
            {songIndex > 0 && <hr style={{ borderColor: '#333', width: '100%', margin: '1rem 0' }} />}

            {/* Slide 1: Title Slide */}
            <div className="slide-preview">
              <div className="slide-title" style={{ fontSize: `${Math.max(titleFontSize * 0.6, 20)}px` }}>
                {song.title || "(Title)"}
              </div>
              <div className="slide-source">{song.source || "(Source)"}</div>
            </div>

            {/* Slide 2+: Lyrics Slides */}
            {song.slides.map((slideText, index) => (
              <div key={index} className="slide-preview">
                {showSongInfo && (
                  <div className="slide-header">
                    {song.title} ({song.source})
                  </div>
                )}
                <div
                  className="slide-content"
                  style={{
                    justifyContent: verticalAlign === 'top' ? 'flex-start' : verticalAlign === 'bottom' ? 'flex-end' : 'center',
                    fontSize: `${Math.max(lyricsFontSize * 0.5, 12)}px` // Scale down for preview
                  }}
                >
                  {slideText}
                </div>
              </div>
            ))}
          </div>
        ))}

        {parsedData.length === 0 && (
          <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            Start with # Title to create slides.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
