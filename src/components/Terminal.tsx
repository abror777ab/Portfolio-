import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Terminal as TermIcon, ShieldAlert, Check, ChevronRight } from 'lucide-react';
import { ConsoleLine } from '../types';

interface TerminalProps {
  onAdminTrigger?: () => void;
}

export default function Terminal({ onAdminTrigger }: TerminalProps) {
  const [history, setHistory] = useState<ConsoleLine[]>([
    {
      id: 'init-1',
      type: 'system',
      text: 'ABROR SYS v1.4.0 INITIALIZED SUCCESSFULLY.',
      timestamp: '05:43:55'
    },
    {
      id: 'init-2',
      type: 'system',
      text: 'TYPE "help" TO DECRYPT EMBEDDED DIRECTORIES OR QUERY ABILITIES.',
      timestamp: '05:43:56'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getTimestamp = () => {
    const d = new Date();
    return d.toTimeString().split(' ')[0];
  };

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    const userLine: ConsoleLine = {
      id: `user-${Date.now()}`,
      type: 'user',
      text: `guest@abror-sys:~$ ${trimmed}`,
      timestamp: getTimestamp()
    };

    setHistory(prev => [...prev, userLine]);

    setTimeout(() => {
      let responses: ConsoleLine[] = [];

      switch (command) {
        case 'help':
          responses = [
            {
              id: `resp-h1-${Date.now()}`,
              type: 'response',
              text: 'AVAILABLE OPERATIONS LIST:',
              timestamp: getTimestamp()
            },
            {
              id: `resp-h2-${Date.now()}`,
              type: 'response',
              text: '  about      - Display developer persona and profile overview',
              timestamp: getTimestamp()
            },
            {
              id: `resp-h3-${Date.now()}`,
              type: 'response',
              text: '  skills     - Access quantitative capability indicators',
              timestamp: getTimestamp()
            },
            {
              id: `resp-h4-${Date.now()}`,
              type: 'response',
              text: '  specs      - Print system hardware and package environments',
              timestamp: getTimestamp()
            },
            {
              id: `resp-h5-${Date.now()}`,
              type: 'response',
              text: '  age        - Validate user chronological authenticity report',
              timestamp: getTimestamp()
            },
            {
              id: `resp-h6-${Date.now()}`,
              type: 'response',
              text: '  clear      - Clear buffer history state',
              timestamp: getTimestamp()
            },
            {
              id: `resp-h7-${Date.now()}`,
              type: 'response',
              text: '  ask <query>- Ask Abror\'s digital twin AI any questions directly',
              timestamp: getTimestamp()
            },
            {
              id: `resp-h8-${Date.now()}`,
              type: 'response',
              text: '  admin      - Launch secure administrator CMS control panel',
              timestamp: getTimestamp()
            }
          ];
          break;

        case 'about':
          responses = [
            {
              id: `resp-a1-${Date.now()}`,
              type: 'success',
              text: '[IDENTITY FOUND] Name: Abror | Location: Tashkent, Uzbekistan.',
              timestamp: getTimestamp()
            },
            {
              id: `resp-a2-${Date.now()}`,
              type: 'response',
              text: 'I create immersive interfaces and luxury digital realities. I believe passion, discipline, and consistency weigh heavier than mere chronological count.',
              timestamp: getTimestamp()
            },
            {
              id: `resp-a3-${Date.now()}`,
              type: 'response',
              text: 'Strength index: Continuous optimization and constant learning cycles.',
              timestamp: getTimestamp()
            }
          ];
          break;

        case 'skills':
          responses = [
            {
              id: `resp-s1-${Date.now()}`,
              type: 'response',
              text: 'DIAGNOSTIC SKILL REPORT:',
              timestamp: getTimestamp()
            },
            {
              id: `resp-s2-${Date.now()}`,
              type: 'response',
              text: '  TYPESCRIPT     [█████████░] 92% - Strong typing structures',
              timestamp: getTimestamp()
            },
            {
              id: `resp-s3-${Date.now()}`,
              type: 'response',
              text: '  REACT 19       [█████████░] 90% - Advanced hooks & architectures',
              timestamp: getTimestamp()
            },
            {
              id: `resp-s4-${Date.now()}`,
              type: 'response',
              text: '  TAILWIND CSS   [██████████] 95% - BESPOKE layouts & design',
              timestamp: getTimestamp()
            },
            {
              id: `resp-s5-${Date.now()}`,
              type: 'response',
              text: '  NODE.JS        [████████░░] 82% - Back-end stream configurations',
              timestamp: getTimestamp()
            }
          ];
          break;

        case 'specs':
          responses = [
            {
              id: `resp-sp1-${Date.now()}`,
              type: 'response',
              text: 'COMPILER SPECS:',
              timestamp: getTimestamp()
            },
            {
              id: `resp-sp2-${Date.now()}`,
              type: 'response',
              text: '  ENV: NODE.JS v22+ // VITE v6+ // REACT v19.0.1',
              timestamp: getTimestamp()
            },
            {
              id: `resp-sp3-${Date.now()}`,
              type: 'response',
              text: '  ANIMATION PHYSICS: MOTION ENGINE (SPRING PHYSICS ACCELERATED)',
              timestamp: getTimestamp()
            }
          ];
          break;

        case 'age':
          responses = [
            {
              id: `resp-ag1-${Date.now()}`,
              type: 'success',
              text: '[VERIFIED] Age: 14 | Identity authentic.',
              timestamp: getTimestamp()
            },
            {
              id: `resp-ag2-${Date.now()}`,
              type: 'response',
              text: '"Age is merely a temporal coordinate. Quality, rigor, and discipline are absolute constants."',
              timestamp: getTimestamp()
            }
          ];
          break;

        case 'admin':
          if (onAdminTrigger) {
            onAdminTrigger();
            responses = [
              {
                id: `resp-adm-${Date.now()}`,
                type: 'success',
                text: 'BYPASS_CMD_RECEIVED. LAUNCHING SECURE ADMIN PORTAL VIA CLI PORT.',
                timestamp: getTimestamp()
              }
            ];
          } else {
            responses = [
              {
                id: `resp-adm-err-${Date.now()}`,
                type: 'error',
                text: 'SYSTEM ERROR: ROOT_PORT_MAPPING_NOT_SET.',
                timestamp: getTimestamp()
              }
            ];
          }
          break;

        case 'clear':
          setHistory([]);
          return;

        case 'ask':
          if (!args) {
            responses = [
              {
                id: `resp-ask-err-${Date.now()}`,
                type: 'error',
                text: 'Usage: ask [your question here]. Example: ask what technologies do you like?',
                timestamp: getTimestamp()
              }
            ];
          } else {
            const queryLower = args.toLowerCase();
            let aiResp = '';

            if (queryLower.includes('how old') || queryLower.includes('age')) {
              aiResp = "I am 14 years old. While some might think that is young, my passion and commitment to high-end frontend craftsmanship let me deliver premium results.";
            } else if (queryLower.includes('technology') || queryLower.includes('tech') || queryLower.includes('framework')) {
              aiResp = "I specialize in TypeScript, React, Tailwind CSS, Motion, and Node.js. I love working with high-performance build systems like Vite and crafting modular code architectures.";
            } else if (queryLower.includes('location') || queryLower.includes('live') || queryLower.includes('where')) {
              aiResp = "I live in Tashkent, Uzbekistan. It's a beautiful place with rapidly expanding technical ambition.";
            } else if (queryLower.includes('why') || queryLower.includes('motivation')) {
              aiResp = "My main motivation is creating beautiful, immersive experiences that impact visitors emotionally. I never stop learning because technology evolves every single day.";
            } else {
              aiResp = "I am fully dedicated to creating clean codebases and cinematic micro-interactions. My workflow is based on extreme consistency, discipline, and detail. Let's collaborate together on your next project!";
            }

            responses = [
              {
                id: `resp-ask1-${Date.now()}`,
                type: 'system',
                text: 'CONNECTING DIGITAL CLONE ENVELOPE...',
                timestamp: getTimestamp()
              },
              {
                id: `resp-ask2-${Date.now()}`,
                type: 'response',
                text: `ABROR_AI: "${aiResp}"`,
                timestamp: getTimestamp()
              }
            ];
          }
          break;

        default:
          responses = [
            {
              id: `resp-err-${Date.now()}`,
              type: 'error',
              text: `SYSTEM ERR: Command "${command}" not recognized. Type "help" to list protocols.`,
              timestamp: getTimestamp()
            }
          ];
      }

      setHistory(prev => [...prev, ...responses]);
    }, 250);

    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    }
  };

  return (
    <div 
      className="w-full bg-black/90 border border-white/10 rounded-none overflow-hidden h-[450px] flex flex-col relative box-glow-white cursor-text select-text"
      onClick={focusInput}
      id="dev-terminal-frame"
    >
      {/* Console Title Bar */}
      <div className="bg-white/[0.03] px-4 py-3 border-b border-white/[0.08] flex items-center justify-between font-mono text-[10px] tracking-widest text-white/40 select-none">
        <div className="flex items-center gap-2">
          <TermIcon className="w-3.5 h-3.5" />
          <span>DEVELOPER_CONSOLE_MAIN</span>
        </div>
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Output Stream */}
      <div 
        ref={containerRef}
        className="flex-1 p-6 overflow-y-auto font-mono text-xs space-y-3 leading-relaxed"
        id="terminal-output-buffer"
      >
        {history.map((line) => {
          let colorClass = 'text-white/60';
          if (line.type === 'system') colorClass = 'text-white/40 font-semibold';
          if (line.type === 'user') colorClass = 'text-white font-medium';
          if (line.type === 'success') colorClass = 'text-white/90 font-semibold text-glow-white';
          if (line.type === 'error') colorClass = 'text-white/80 border-l-2 border-white/50 pl-2';
          if (line.type === 'response') colorClass = 'text-white/80';

          return (
            <div key={line.id} className={`flex items-start gap-4 transition-all duration-300`}>
              <span className="text-[9px] text-white/20 select-none pt-0.5">[{line.timestamp}]</span>
              <span className={`${colorClass} whitespace-pre-wrap`}>{line.text}</span>
            </div>
          );
        })}
      </div>

      {/* Input Prompt */}
      <div className="p-4 bg-white/[0.01] border-t border-white/[0.05] flex items-center gap-3">
        <ChevronRight className="w-4 h-4 text-white/50 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Type command ("help", "about", "skills")...'
          className="bg-transparent text-white border-none outline-none font-mono text-xs w-full placeholder-white/20"
          id="terminal-input-prompt"
        />
      </div>
    </div>
  );
}
