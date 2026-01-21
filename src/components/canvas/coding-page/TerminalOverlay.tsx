"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./TerminalOverlay.css";

export default function TerminalOverlay({ type }: { type: "enter" | "exit" }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 1. Reset
    setLogs([]);
    setIsVisible(true);

    const addLog = (msg: string) => {
      setLogs((prev) => [...prev, msg]);
    };

    let timeouts: NodeJS.Timeout[] = [];

    if (type === "enter") {
      // --- ENTER SEQUENCE (4 SECONDS) ---
      
      // 0ms: Start
      addLog("> SYSTEM BOOT SEQUENCE INITIATED...");
      
      // 500ms: Environment Check
      timeouts.push(setTimeout(() => addLog("wait - checking environment variables..."), 500));
      
      // 800ms: Compile Start
      timeouts.push(setTimeout(() => addLog("info - loaded env from .env.local"), 800));
      timeouts.push(setTimeout(() => addLog("event - build page: /coding"), 1200));
      
      // 1500ms: Complex Compilation
      timeouts.push(setTimeout(() => addLog("wait - compiling client components..."), 1500));
      timeouts.push(setTimeout(() => addLog("warn - fast refresh enabled"), 1900));
      
      // 2200ms: Server Response
      timeouts.push(setTimeout(() => addLog(generateRealTimeLog("/api/auth/session")), 2200));
      timeouts.push(setTimeout(() => addLog("event - compiled client and server successfully in " + getRandomMs(800, 1200) + "ms"), 2600));
      
      // 3000ms: Optimizing
      timeouts.push(setTimeout(() => addLog("info - optimizing static assets..."), 3000));
      timeouts.push(setTimeout(() => addLog(generateRealTimeLog("/coding")), 3400));
      
      // 3800ms: Final Ready
      timeouts.push(setTimeout(() => addLog("ready - started server on 0.0.0.0:3000, url: http://localhost:3000"), 3800));
      timeouts.push(setTimeout(() => addLog("> LAUNCHING INTERFACE..."), 4000));
      
      // 4500ms: Fade Out (Visuals disappear)
      timeouts.push(setTimeout(() => setIsVisible(false), 4500));
    } 
    else {
      // --- EXIT SEQUENCE (Quick Shutdown) ---
      addLog("> INITIATING SHUTDOWN...");
      timeouts.push(setTimeout(() => addLog("wait - stopping worker threads..."), 200));
      timeouts.push(setTimeout(() => addLog("event - client session terminated"), 400));
      timeouts.push(setTimeout(() => addLog("> NAVIGATING AWAY..."), 600));
    }

    return () => timeouts.forEach(clearTimeout);
  }, [type]);

  const generateRealTimeLog = (path: string) => {
    const total = getRandomMs(100, 500);
    const compile = getRandomMs(10, 50);
    const render = total - compile;
    return `GET ${path} 200 in ${total}ms (compile: ${compile}ms, render: ${render}ms)`;
  };

  const getRandomMs = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="terminal-overlay"
        >
          {/* CRT Effect Background */}
          <div className="scanlines" />
          
          <div className="terminal-content">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="log-line"
              >
                <span className="timestamp">
                  [{new Date().toLocaleTimeString('en-US', { hour12: false })}]
                </span>
                {log}
              </motion.div>
            ))}
            
            {/* Blinking Cursor */}
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="cursor-block"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}