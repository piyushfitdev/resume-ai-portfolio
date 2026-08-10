const suggestions = [
  'Tell me about Piyush',
  'What are his technical skills?',
  'Tell me about VectorForge',
  'What projects has he built?',
]

export function WelcomeScreen({ onSelect }: { onSelect: (prompt: string) => void }) {
  return <section className="welcome">
    <div className="welcome-mark"><span>✦</span></div>
    <p className="eyebrow">PIYUSH’S PORTFOLIO INTELLIGENCE</p>
    <h1>Ask me about <em>Piyush.</em></h1>
    <p className="welcome-copy">Explore Piyush’s skills, projects, education, achievements, and experience through a conversational AI.</p>
    <div className="suggestions">
      {suggestions.map((prompt, index) => <button key={prompt} onClick={() => onSelect(prompt)}><span>0{index + 1}</span>{prompt}<i>↗</i></button>)}
    </div>
  </section>
}
