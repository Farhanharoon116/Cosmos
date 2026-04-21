import { useState, useRef, useEffect } from 'react';

const SECTION_SUGGESTIONS = {
  hero:          ['How big is the observable universe?', 'What is dark energy?', 'Are we alone in the universe?'],
  'solar-system':['Why does Saturn have rings?', 'Could humans live on Mars?', 'What is the Kuiper Belt?'],
  'black-hole':  ['What happens inside a black hole?', 'What is Hawking radiation?', 'Can black holes merge?'],
  theories:      ['Explain time dilation simply', 'What is quantum entanglement?', 'Why do we need string theory?'],
  timeline:      ['What happened in the first second?', 'What is the CMB?', 'Will the universe expand forever?'],
  tonight:       ['How do I find the North Star?', 'What causes meteor showers?', 'Why does the Moon change shape?'],
  stars:         ['What will happen to our Sun?', 'What is a neutron star?', 'How do stellar black holes form?'],
};

const CANNED = {
  'How big is the observable universe?':
    'The observable universe is approximately 93 billion light-years in diameter. This seems paradoxical given the universe is only 13.8 billion years old — but space itself has been expanding, so distant objects have moved far beyond where they were when their light first left them.',
  'What is dark energy?':
    'Dark energy is the mysterious force driving the accelerating expansion of the universe, making up ~68% of its total energy. Its nature remains one of the deepest unsolved problems in physics. The leading candidate is the cosmological constant — a property of empty space itself that acts as a repulsive force.',
  'Are we alone in the universe?':
    'The observable universe contains ~2 trillion galaxies, each with hundreds of billions of stars, and we now know most stars host planets. The sheer number of potentially habitable worlds is staggering. The Fermi Paradox asks: if life is common, where is everyone? Proposed answers range from the Great Filter to the Zoo Hypothesis to the simple vastness of interstellar distances.',
  'Why does Saturn have rings?':
    'Saturn\'s rings are composed of ice particles, rocky debris, and dust ranging from grains to house-sized chunks. They likely formed when a moon or comet was torn apart by Saturn\'s tidal forces. The rings extend up to 282,000 km from the planet but are only ~10 meters thick in many places.',
  'What happens inside a black hole?':
    'Beyond the event horizon, all paths in spacetime lead toward the singularity — there is no "staying still." At the singularity, general relativity predicts infinite density and our current physics breaks down entirely. A quantum theory of gravity is needed to describe what truly occurs. Time and space swap roles inside the horizon.',
  'What is Hawking radiation?':
    'In 1974, Stephen Hawking showed that quantum effects near the event horizon cause black holes to emit radiation and slowly evaporate. Virtual particle pairs form at the horizon — one falls in, one escapes. Over astronomical timescales even supermassive black holes would eventually evaporate this way.',
  'Explain time dilation simply':
    'Imagine two identical clocks. You keep one; the other travels on a spaceship near light speed. When it returns, its clock shows less time has passed. This isn\'t an illusion — the astronaut genuinely aged less. It happens because the speed of light is constant for all observers, and time must "stretch" to accommodate this when you\'re moving fast.',
  'What is the CMB?':
    'The Cosmic Microwave Background is the thermal radiation left over from the epoch of recombination (~380,000 years after the Big Bang), when the universe cooled enough for atoms to form and photons to travel freely. It fills the entire sky at a temperature of 2.725 K and is the oldest light we can observe.',
  'What will happen to our Sun?':
    'In ~5 billion years the Sun will exhaust its core hydrogen and expand into a red giant, engulfing Mercury, Venus, and possibly Earth. It will then shed its outer layers as a planetary nebula, leaving behind a white dwarf — a crystal of carbon and oxygen that will cool for trillions of years.',
};

const defaultReply = (q) =>
  `That\'s a profound question about "${q}". The cosmos operates at scales that humble every human framework. While I don\'t have a pre-loaded answer for this specific question, the universe\'s answer is likely stranger and more beautiful than our intuitions allow. Keep exploring — curiosity is the most powerful telescope ever built.`;

export default function AskAI({ activeSection, isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Hello, cosmic explorer. I\'m your AI guide to the universe. Ask me anything about astronomy, astrophysics, or the fundamental nature of reality.',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  const suggestions = SECTION_SUGGESTIONS[activeSection] || SECTION_SUGGESTIONS.hero;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text) => {
    const q = (text || input).trim();
    if (!q) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setTyping(true);
    setTimeout(() => {
      const reply = CANNED[q] || defaultReply(q);
      setMessages((m) => [...m, { role: 'ai', text: reply }]);
      setTyping(false);
    }, 1000 + Math.random() * 900);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl overflow-hidden"
      style={{
        width: 'min(96vw, 400px)',
        maxHeight: '600px',
        background: 'rgba(5, 8, 22, 0.97)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(108, 99, 255, 0.25)',
        boxShadow: '0 0 50px rgba(108,99,255,0.15)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(108,99,255,0.1)' }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">✦</span>
          <div>
            <p className="font-space text-sm font-semibold" style={{ color: '#E8EAF0' }}>Cosmos AI</p>
            <p className="font-body text-xs" style={{ color: 'rgba(232,234,240,0.4)' }}>
              Ask anything about the universe
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0 }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[85%] px-4 py-3 font-body text-sm leading-relaxed"
              style={{
                background: msg.role === 'user' ? 'rgba(108,99,255,0.22)' : 'rgba(30,42,74,0.45)',
                color: '#E8EAF0',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start">
            <div
              className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
              style={{ background: 'rgba(30,42,74,0.45)' }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: '#6C63FF', animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      <div
        className="px-4 py-2.5 flex gap-2 overflow-x-auto flex-shrink-0"
        style={{ borderTop: '1px solid rgba(108,99,255,0.07)' }}
      >
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-body whitespace-nowrap transition-all hover:scale-105"
            style={{
              background: 'rgba(108,99,255,0.1)',
              border: '1px solid rgba(108,99,255,0.2)',
              color: 'rgba(232,234,240,0.7)',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(108,99,255,0.1)' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask the universe…"
          className="flex-1 bg-transparent font-body text-sm outline-none placeholder-gray-600"
          style={{ color: '#E8EAF0' }}
        />
        <button
          onClick={() => send()}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
          style={{ background: '#6C63FF' }}
          aria-label="Send"
        >
          <span className="text-white text-sm">↑</span>
        </button>
      </div>
    </div>
  );
}
