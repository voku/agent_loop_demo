import React, { useState } from "react";
import { 
  ShieldCheck, 
  Database, 
  BrainCircuit, 
  Activity, 
  CheckCircle, 
  Circle, 
  HardDrive, 
  ListTodo, 
  Kanban, 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  RefreshCw,
  Lock,
  FileText,
  AlertCircle,
  Cpu
} from "lucide-react";
import { VirtualFile } from "../types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

interface AgentMonitorProps {
  files: VirtualFile[];
}

type TabId = "overview" | "board" | "session" | "recall" | "learn";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#141414] text-[#E4E3E0] border border-[#141414] p-2 text-[10px] font-mono shadow-none">
        <p className="font-bold uppercase tracking-wider text-amber-400">{label}</p>
        <p className="mt-1">Memory: <span className="font-bold text-white">{data.memory} MB</span></p>
        <p>Limit: <span className="text-gray-400">{data.limit} MB</span></p>
        <p className="mt-1.5 text-gray-400 italic text-[9px] border-t border-gray-700 pt-1 max-w-[180px]">
          {data.desc}
        </p>
      </div>
    );
  }
  return null;
};

export default function AgentMonitor({ files }: AgentMonitorProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [selectedCard, setSelectedCard] = useState<string>("DEMO-1");
  const [isGCOptimized, setIsGCOptimized] = useState(false);
  const [isGCRunning, setIsGCRunning] = useState(false);

  // Derive state from files to see what steps are complete
  const isInstalled = files.some(f => f.path === "composer.json" && f.content.includes("agent-loop"));
  const hasBoard = files.some(f => f.path.startsWith(".agent-loop/board/"));
  const hasSession = files.some(f => f.path.startsWith(".agent-loop/sessions/"));
  const hasRecall = files.some(f => f.path.startsWith(".agent-loop/recall/"));
  const hasWorkDone = files.some(f => f.path === "src/Signup.php" && f.content.includes("declare(strict_types=1);"));
  const hasLearnings = files.some(f => f.path === ".agent-loop/learning/findings.json" || f.path === "learning-root/findings.json");

  // Derive active step index for memory tracking
  let activeStepIndex = 0;
  if (hasLearnings) {
    activeStepIndex = 5; // Learn Persist
  } else if (hasWorkDone) {
    activeStepIndex = 4; // Strict Verify
  } else if (hasRecall) {
    activeStepIndex = 3; // Recall Compile
  } else if (hasSession) {
    activeStepIndex = 2; // Session Active
  } else if (hasBoard) {
    activeStepIndex = 1; // Board Synced
  } else if (isInstalled) {
    activeStepIndex = 0; // Init
  }

  const baseMemoryData = [
    { step: "01. Sync", memory: 24, limit: 256, desc: "board:sync initialized" },
    { step: "02. Session", memory: 68, limit: 256, desc: "AST parsing & workspace lock" },
    { step: "03. Recall", memory: 142, limit: 256, desc: "Context compression" },
    { step: "04. Test", memory: 185, limit: 256, desc: "PHPUnit process execution" },
    { step: "05. Verify", memory: 230, limit: 256, desc: "PHPStan Level 5 analysis" },
    { step: "06. Persist", memory: 95, limit: 256, desc: "Durable memory write" },
  ];

  const memoryData = baseMemoryData.map((d, index) => {
    let memoryVal = d.memory;
    
    // If GC is running, reduce active steps heavily
    if (isGCRunning) {
      memoryVal = Math.round(d.memory * 0.35); // 65% drop during active sweeps
    } else if (isGCOptimized) {
      memoryVal = Math.round(d.memory * 0.75); // 25% persistent optimization
    }

    const isProjected = index > activeStepIndex;

    return {
      ...d,
      memory: memoryVal,
      isCurrent: index === activeStepIndex,
      isProjected,
    };
  });

  const handleTriggerGC = () => {
    if (isGCRunning) return;
    setIsGCRunning(true);
    setTimeout(() => {
      setIsGCRunning(false);
      setIsGCOptimized(true);
    }, 1500);
  };

  const currentMemory = memoryData[activeStepIndex]?.memory || 12;
  const maxMemory = Math.max(...memoryData.map(d => d.memory));

  // Help determine which column our active card belongs in
  let cardStatus: "backlog" | "todo" | "in_progress" | "in_review" | "done" = "todo";
  if (hasLearnings) {
    cardStatus = "done";
  } else if (hasWorkDone) {
    cardStatus = "in_review";
  } else if (hasRecall) {
    cardStatus = "in_progress";
  } else if (hasSession) {
    cardStatus = "in_progress";
  } else if (hasBoard) {
    cardStatus = "todo";
  } else {
    cardStatus = "backlog";
  }

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

  const renderStatusDot = (active: boolean, done: boolean) => {
    if (done) return <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />;
    if (active) return <Activity className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />;
    return <Circle className="w-4 h-4 text-[#141414]/30 shrink-0" />;
  };

  return (
    <div className="bg-[#E4E3E0] text-[#141414] border-2 border-[#141414] shadow-none overflow-hidden h-full flex flex-col font-sans">
      
      {/* Header */}
      <div className="bg-[#141414] text-[#E4E3E0] px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between shrink-0 border-b-2 border-[#141414] gap-2">
        <div className="flex items-center gap-2.5">
          <BrainCircuit className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-xs font-black tracking-widest uppercase">VOKU // AGENT-LOOP STATE CONTROL</h2>
            <p className="text-[9px] text-gray-400 font-mono tracking-wider mt-0.5">GOVERNED CODING AGENT CONTROLLER</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono uppercase bg-emerald-950 text-emerald-400 px-2 py-0.5 border border-emerald-500/30">
            {hasLearnings ? "SYSTEM GRADUATED" : (isInstalled ? "BOUNDARIES ACTIVE" : "AWAITING PKG INST")}
          </span>
        </div>
      </div>

      {/* Tabs Navigation Rail */}
      <div className="bg-[#F0EFEC] border-b-2 border-[#141414] flex flex-wrap divide-x divide-[#141414] select-none text-[10px] font-mono uppercase tracking-wider shrink-0">
        <button
          onClick={() => handleTabChange("overview")}
          className={`flex-1 min-w-[70px] py-2.5 text-center font-bold transition hover:bg-[#DAD9D6] ${activeTab === "overview" ? "bg-[#141414] text-[#E4E3E0]" : "text-[#141414]"}`}
        >
          Overview
        </button>
        <button
          onClick={() => handleTabChange("board")}
          className={`flex-1 min-w-[70px] py-2.5 text-center font-bold transition hover:bg-[#DAD9D6] relative ${activeTab === "board" ? "bg-[#141414] text-[#E4E3E0]" : "text-[#141414]"}`}
        >
          Kanban Board
          {hasBoard && activeTab !== "board" && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => handleTabChange("session")}
          disabled={!hasSession}
          className={`flex-1 min-w-[70px] py-2.5 text-center font-bold transition hover:bg-[#DAD9D6] disabled:opacity-45 disabled:hover:bg-transparent ${activeTab === "session" ? "bg-[#141414] text-[#E4E3E0]" : "text-[#141414]"}`}
        >
          Session
        </button>
        <button
          onClick={() => handleTabChange("recall")}
          disabled={!hasRecall}
          className={`flex-1 min-w-[70px] py-2.5 text-center font-bold transition hover:bg-[#DAD9D6] disabled:opacity-45 disabled:hover:bg-transparent ${activeTab === "recall" ? "bg-[#141414] text-[#E4E3E0]" : "text-[#141414]"}`}
        >
          Recall Briefs
        </button>
        <button
          onClick={() => handleTabChange("learn")}
          className={`flex-1 min-w-[70px] py-2.5 text-center font-bold transition hover:bg-[#DAD9D6] ${activeTab === "learn" ? "bg-[#141414] text-[#E4E3E0]" : "text-[#141414]"}`}
        >
          Knowledge Base (Learn)
        </button>
      </div>

      {/* Main Tab Screen Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#EAE9E6]">
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-4 animate-fade-in">
            {/* Value card */}
            <div className="border border-[#141414] p-4 bg-[#F0EFEC] space-y-2">
              <h3 className="font-serif italic text-lg leading-tight">"A 10,000-word prompt is not a workflow."</h3>
              <p className="text-xs text-[#141414]/80 leading-relaxed">
                Coding agents fail not because the models are weak, but because they are stateless. If your agent is operating blindly on arbitrary filesystem code, its context inevitably collapses.
              </p>
              <p className="text-xs font-semibold text-amber-700 font-mono text-[10px] uppercase">
                → agent-loop intercepts agent workflows and binds context to localized files.
              </p>
            </div>

            {/* Grid layout for visualizer & memory chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Loop Flow Visualizer */}
              <div className="border border-[#141414] bg-white p-4 space-y-3 font-mono text-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#141414] opacity-50 block mb-2">Loop Steps Diagram:</span>
                  
                  <div className="space-y-2.5">
                    {/* Board Step */}
                    <div className="flex items-center justify-between p-2.5 border border-[#141414] bg-[#F9F8F6]">
                      <div className="flex items-center gap-3">
                        <ListTodo className="w-4 h-4 text-indigo-600" />
                        <div>
                          <div className="font-bold text-[11px] uppercase tracking-wider">01. Board Routing</div>
                          <div className="text-[9.5px] text-[#141414]/65">Jira synced markdown files inside .agent-loop/board/</div>
                        </div>
                      </div>
                      {renderStatusDot(isInstalled && !hasSession, hasBoard)}
                    </div>

                    {/* Session Step */}
                    <div className="flex items-center justify-between p-2.5 border border-[#141414] bg-[#F9F8F6]">
                      <div className="flex items-center gap-3">
                        <HardDrive className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="font-bold text-[11px] uppercase tracking-wider">02. Isolated Session</div>
                          <div className="text-[9.5px] text-[#141414]/65">Scoped plan & decisions.md isolate active directory</div>
                        </div>
                      </div>
                      {renderStatusDot(hasBoard && !hasRecall, hasSession)}
                    </div>

                    {/* Recall Step */}
                    <div className="flex items-center justify-between p-2.5 border border-[#141414] bg-[#F9F8F6]">
                      <div className="flex items-center gap-3">
                        <Database className="w-4 h-4 text-purple-600" />
                        <div>
                          <div className="font-bold text-[11px] uppercase tracking-wider">03. Recall Compile</div>
                          <div className="text-[9.5px] text-[#141414]/65">Compresses static rules/guidelines into system briefs</div>
                        </div>
                      </div>
                      {renderStatusDot(hasSession && !hasWorkDone, hasRecall)}
                    </div>

                    {/* Validate Step */}
                    <div className="flex items-center justify-between p-2.5 border border-[#141414] bg-[#F9F8F6]">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <div>
                          <div className="font-bold text-[11px] uppercase tracking-wider">04. Boundary Verifier</div>
                          <div className="text-[9.5px] text-[#141414]/65">Strict PHPUnit/PHPStan validations with human checkin</div>
                        </div>
                      </div>
                      {renderStatusDot(hasRecall && !hasLearnings, hasWorkDone)}
                    </div>

                    {/* Learn Step */}
                    <div className="flex items-center justify-between p-2.5 border border-[#141414] bg-[#F9F8F6]">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <div>
                          <div className="font-bold text-[11px] uppercase tracking-wider">05. Durable Memory</div>
                          <div className="text-[9.5px] text-[#141414]/65">Elevate session fails & lessons into findings database</div>
                        </div>
                      </div>
                      {renderStatusDot(hasWorkDone && !hasLearnings, hasLearnings)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Memory Consumption Chart */}
              <div className="border border-[#141414] bg-white p-4 space-y-3 font-mono text-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#141414] opacity-50 block">AGENT RESOURCE PROFILE (memory:profile):</span>
                      <h4 className="text-xs font-bold uppercase mt-1 text-[#141414] flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-amber-500 animate-pulse" />
                        Session Memory Consumption
                      </h4>
                    </div>
                    <button
                      onClick={handleTriggerGC}
                      disabled={isGCRunning}
                      className="px-2 py-1 text-[9px] font-bold border-2 border-[#141414] bg-[#E4E3E0] hover:bg-[#DAD9D6] disabled:opacity-50 active:translate-y-0.5 cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      {isGCRunning ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                          <span>RUNNING GC...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3" />
                          <span>TRIGGER GC</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Dynamic Information Log */}
                  <div className="mt-3 p-2 bg-[#F9F8F6] border border-[#141414] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <span className="text-[8.5px] text-gray-500 uppercase block font-bold">Current Active State:</span>
                      <span className="text-[10.5px] font-bold text-gray-800">{baseMemoryData[activeStepIndex]?.step || "Inactive"}</span>
                    </div>
                    <div className="text-right sm:text-right">
                      <span className="text-[8.5px] text-gray-500 uppercase block font-bold">Active Memory:</span>
                      <span className="text-[10.5px] font-bold text-amber-700">{currentMemory} MB <span className="text-gray-400 font-normal">/ 256 MB</span></span>
                    </div>
                  </div>

                  {/* Recharts Container */}
                  <div className="h-[180px] w-full mt-4 select-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={memoryData}
                        margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="memoryColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d97706" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#d97706" stopOpacity={0.01}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e3e0" vertical={false} />
                        <XAxis 
                          dataKey="step" 
                          stroke="#141414" 
                          fontSize={8}
                          tickLine={false}
                          axisLine={{ stroke: '#141414', strokeWidth: 1 }}
                        />
                        <YAxis 
                          stroke="#141414" 
                          fontSize={8}
                          unit="M"
                          tickLine={false}
                          axisLine={{ stroke: '#141414', strokeWidth: 1 }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#141414', strokeWidth: 1, strokeDasharray: '3 3' }} />
                        <Area 
                          type="monotone" 
                          dataKey="memory" 
                          stroke="#d97706" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#memoryColor)" 
                          name="Memory Usage"
                          isAnimationActive={true}
                          animationDuration={600}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="limit" 
                          stroke="#141414" 
                          strokeWidth={1}
                          strokeDasharray="4 4"
                          fill="none" 
                          name="Allocated Limit"
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-3 text-[9px] text-[#141414]/75 border-t border-[#e4e3e0] pt-2.5 flex flex-wrap justify-between items-center gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>PEAK ACTIVE: <span className="font-bold text-[#141414]">{maxMemory} MB</span></span>
                  </div>
                  <div>
                    {isGCRunning ? (
                      <span className="text-amber-600 font-bold animate-pulse uppercase">GC SWEEPING NODES...</span>
                    ) : isGCOptimized ? (
                      <span className="text-emerald-700 font-bold uppercase">✔ MEMORY OPTIMIZED (-25%)</span>
                    ) : (
                      <span className="text-gray-500 uppercase font-mono">AUTOMATIC GC SYSTEM READY</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick installation callout */}
            {!isInstalled && (
              <div className="bg-amber-100 border-l-4 border-amber-500 p-3 text-xs animate-pulse text-amber-900 font-mono">
                💡 COMPOSER REPOSITORY: Open the terminal and execute <b>composer require voku/agent-loop</b> to seed the workspace directory.
              </div>
            )}
          </div>
        )}

        {/* KANBAN BOARD TAB */}
        {activeTab === "board" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between bg-[#F0EFEC] border border-[#141414] p-3">
              <div className="flex items-center gap-1 text-[11px] font-mono tracking-widest uppercase font-bold text-[#141414]">
                <Kanban className="w-4 h-4 text-gray-700" />
                <span>LOCAL KANBAN ROUTER (board:sync)</span>
              </div>
              <div className="text-[9px] font-mono text-gray-500">
                TOTAL CARDS: 3
              </div>
            </div>

            {/* Kanban columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Backlog Column */}
              <div className="bg-[#DAD9D6] border border-[#141414] p-2.5 flex flex-col space-y-2 min-h-[140px]">
                <div className="text-[9px] font-mono uppercase tracking-widest font-black text-[#141414]/60 mb-1 flex justify-between items-center bg-[#F0EFEC]/40 px-1 py-0.5">
                  <span>BACKLOG</span>
                  <span>(2)</span>
                </div>
                
                <div className="bg-[#F0EFEC]/80 border border-dashed border-[#141414]/30 p-2 text-[10px] font-mono text-[#141414]/60">
                  <div className="font-bold">DEMO-2 // Add API key Rotator</div>
                  <div className="mt-1 text-[9px]">Status: Awaiting prioritization</div>
                </div>

                <div className="bg-[#F0EFEC]/80 border border-dashed border-[#141414]/30 p-2 text-[10px] font-mono text-[#141414]/60">
                  <div className="font-bold">DEMO-3 // Secure Session cookies</div>
                  <div className="mt-1 text-[9px]">Status: Awaiting validation schema</div>
                </div>
              </div>

              {/* To Do / Active Column */}
              <div className="bg-[#D1D0CC] border-2 border-[#141414] p-2.5 flex flex-col space-y-2 min-h-[140px]">
                <div className="text-[9px] font-mono uppercase tracking-widest font-black text-[#141414] mb-1 flex justify-between items-center bg-[#141414] text-white px-1.5 py-0.5">
                  <span>ACTIVE / TO-DO</span>
                  <span>(1)</span>
                </div>

                {/* ACTIVE TICKET DETAIL */}
                {(cardStatus === "backlog" || cardStatus === "todo") ? (
                  <div 
                    onClick={() => setSelectedCard("DEMO-1")}
                    className="bg-white border-2 border-[#141414] p-2.5 shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition cursor-pointer"
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="bg-orange-200 text-orange-900 border border-orange-500 text-[8px] font-bold px-1.5 font-mono uppercase">HIGH PRIO</span>
                      <span className="text-[9px] font-mono font-bold text-gray-400">DEMO-1</span>
                    </div>
                    <h4 className="text-[10.5px] font-bold text-[#141414] mt-1.5 uppercase leading-tight">Signup Validation guards</h4>
                    <p className="text-[9px] text-gray-500 mt-1">Acceptance criteria is defined locally in markdown.</p>
                    <div className="mt-2 text-[9px] font-mono px-1 py-0.5 bg-gray-100 text-[#141414]/70 border border-gray-200">
                      State: {hasBoard ? "BOARD SYNCED" : "UNSYNCD FROM JIRA"}
                    </div>
                  </div>
                ) : (
                  <div className="border border-[#141414]/30 border-dashed p-4 text-center text-xs text-gray-400 font-mono italic">
                    All initial tasks routed to Active Progress!
                  </div>
                )}
              </div>

              {/* Progress/Done Column */}
              <div className="bg-[#DAD9D6] border border-[#141414] p-2.5 flex flex-col space-y-2 min-h-[140px]">
                <div className="text-[9px] font-mono uppercase tracking-widest font-black text-[#141414]/60 mb-1 flex justify-between items-center bg-[#F0EFEC]/40 px-1 py-0.5">
                  <span>IN PROGRESS & DONE</span>
                  <span>({(cardStatus !== "backlog" && cardStatus !== "todo") ? "1" : "0"})</span>
                </div>

                {cardStatus !== "backlog" && cardStatus !== "todo" && (
                  <div className="bg-white border-2 border-[#141414] p-2.5">
                    <div className="flex justify-between items-center">
                      <span className={`text-[8px] font-bold px-1.5 font-mono uppercase ${cardStatus === "done" ? "bg-emerald-200 text-emerald-900 border border-emerald-500" : "bg-amber-200 text-amber-900 border border-amber-500 animate-pulse"}`}>
                        {cardStatus.toUpperCase()}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-gray-400">DEMO-1</span>
                    </div>
                    <h4 className="text-[10.5px] font-bold text-[#141414] mt-1.5 uppercase leading-tight">Signup Validation guards</h4>
                    <div className="mt-2 space-y-1 font-mono text-[8.5px]">
                      <div className="flex items-center gap-1 text-emerald-700">
                        <span>✔ Plan active</span>
                      </div>
                      <div className="flex items-center gap-1 text-indigo-700">
                        <span>✔ Recall Brief compiles</span>
                      </div>
                      {hasWorkDone && (
                        <div className="flex items-center gap-1 text-emerald-700">
                          <span>✔ PHP Tests Passing</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Kanban Card details sheet */}
            {selectedCard === "DEMO-1" && (
              <div className="border border-[#141414] bg-white p-4 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-bold uppercase tracking-wider text-gray-800">📋 Ticket Spec Sheet: DEMO-1</span>
                  <span className="text-gray-400">SYNC_ID: ADX-7392</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div><b>Goal:</b> Refactor App\Signup validation rules</div>
                  <div><b>Base commit:</b> e70f2a9db4</div>
                  <div><b>Requirements:</b> Reject junk mail, password &gt; 8 char</div>
                  <div><b>Target:</b> src/Signup.php</div>
                </div>
                <p className="text-[9.5px] text-[#141414]/70 border-t pt-2 max-w-xl">
                  <i>Lars says:</i> "Whenever the agent runs `vendor/bin/agent-loop board:sync`, it automatically fetches active tasks inside `.agent-loop/board/` directly. This translates high-level epic goals into machine-storable constraints."
                </p>
              </div>
            )}
          </div>
        )}

        {/* SESSION DATA TAB */}
        {activeTab === "session" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border border-[#141414] p-3 bg-[#F0EFEC]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold font-mono text-[#141414] uppercase">
                <HardDrive className="w-4 h-4 text-emerald-700" />
                <span>ACTIVE WORKING SESSION MEMORY</span>
              </div>
              <span className="text-[8.5px] font-mono font-semibold bg-indigo-950 text-indigo-400 px-2 py-0.5 uppercase">
                CONSTRAINED WORKSPACE LOCKOUT
              </span>
            </div>

            <p className="text-xs text-slate-800 max-w-xl">
              When an agent starts a session with <code>vendor/bin/agent-loop session:start</code>, it locks an isolated state. The file <code>plan.md</code> defines the approach, and <code>decisions.md</code> holds active temporary guardrails so they don't leak into human branches.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Plan card view */}
              <div className="bg-white border border-[#141414] p-3 space-y-2 font-mono text-xs">
                <div className="flex items-center gap-1.5 text-indigo-700 border-b pb-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="font-bold">.agent-loop/sessions/DEMO-1/plan.md</span>
                </div>
                <div className="text-[10px] space-y-1.5 text-[#141414]/85 leading-relaxed bg-[#F0EFEC]/40 p-2">
                  <div className="font-extrabold uppercase">1. Refactoring Strategy</div>
                  <p>Incorporate native FILTER_VALIDATE_EMAIL logic inside App\Signup.</p>
                  <p>Check parameter arrays directly to prevent null pointer exceptions inside the PHP execution boundary.</p>
                </div>
              </div>

              {/* Decisions card view */}
              <div className="bg-white border border-[#141414] p-3 space-y-2 font-mono text-xs">
                <div className="flex items-center gap-1.5 text-indigo-700 border-b pb-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="font-bold">.agent-loop/sessions/DEMO-1/decisions.md</span>
                </div>
                <div className="text-[10px] space-y-1.5 text-[#141414]/85 leading-relaxed bg-[#F0EFEC]/40 p-2">
                  <div className="font-extrabold uppercase text-amber-700">🔒 RIGID BOUNDARY POLICIES:</div>
                  <div className="flex items-start gap-1">
                    <span>•</span>
                    <span>Constraint 1: Never write tests (User owns tests).</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <span>•</span>
                    <span>Constraint 2: No regexes. Use native php filter_var library only.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RECALL BRIEFS TAB */}
        {activeTab === "recall" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border border-[#141414] p-3 bg-[#F0EFEC]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold font-mono text-[#141414] uppercase">
                <Database className="w-4 h-4 text-[#141414]" />
                <span>RECALL BRIEFCASES COMPILER (recall:compile)</span>
              </div>
              <span className="text-[8.5px] font-mono text-emerald-700 font-bold bg-[#E4E3E0] px-2 py-0.5">
                ANTIDOTE TO LLM BLOWN-UP CONTEXT
              </span>
            </div>

            <p className="text-xs text-slate-800 leading-relaxed max-w-xl">
              Instead of stuffing 40 global configuration files and database briefs into every prompt (which triggers extreme LLM hallucination), <code>recall:compile</code> builds a compressed, single-line-addressed markdown brief.
            </p>

            <div className="border border-[#141414] bg-white p-4 space-y-2.5 font-mono text-xs text-slate-800">
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#141414]/50 block">Active Briefing Payload (system.md):</span>
              <div className="bg-[#141414] text-emerald-400 p-3.5 rounded-none font-mono text-[10.5px] space-y-1.5 leading-relaxed">
                <div>&gt;&gt;&gt; INJECTING COMPACT RECALL GUIDELINES FOR ACTIVE TASK DEMO-1:</div>
                <div className="text-gray-400">--------------------------------------------------</div>
                <div className="text-amber-300">RULE#1: "declare(strict_types=1);" is mandatory in every PHP file.</div>
                <div>RULE#2: Enforce return and param types on register() to avoid level 5 checks.</div>
                <div>RULE#3: Exclude heavy framework dependencies during unit testing.</div>
                <div className="text-gray-400">--------------------------------------------------</div>
                <div className="text-emerald-500 font-bold">✔ RECALL INJECTION BRIEF SUCCESSFULLY STREAMED.</div>
              </div>
            </div>
          </div>
        )}

        {/* LEARNED RULES TAB */}
        {activeTab === "learn" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border border-[#141414] p-3 bg-[#F0EFEC]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold font-mono text-[#141414] uppercase font-black">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>DURABLE KNOWLEDGE CORE (learn:persist)</span>
              </div>
              <span className="text-[8.5px] font-mono font-semibold bg-emerald-950 text-emerald-400 px-2 py-0.5 uppercase">
                PERMANENT LOG DATABASE
              </span>
            </div>

            <p className="text-xs text-[#141414]/80 max-w-xl">
              The loop tracks when validations fail. If the agent makes a mistake (like running PHPStan and missing strict types), the failure observation is elevated into the permanent repository knowledge bank (<code>findings.json</code>) during human review.
            </p>

            <div className="border border-[#141414] bg-white p-4 space-y-3 font-mono text-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#141414]/50 block">Permanent findings.json Record:</span>
              
              {hasLearnings ? (
                <div className="bg-[#141414] text-emerald-400 p-3.5 space-y-2 text-[10.5px] leading-relaxed">
                  <div>&#123;</div>
                  <div className="pl-4">"id": "FIND-001",</div>
                  <div className="pl-4">"task": "DEMO-1",</div>
                  <div className="pl-4">"observation": "PHPStan analysis failed initially due to missing strict type declarations on signUp guards.",</div>
                  <div className="pl-4">"category": "static_analysis",</div>
                  <div className="pl-4">"approvedByHuman": true,</div>
                  <div className="pl-4">"ruleAdded": "Always apply strict types and explicit return types on Signup forms to bypass Level 5 lint."</div>
                  <div>&#125;</div>
                </div>
              ) : (
                <div className="border border-dashed border-[#141414]/30 p-8 text-center bg-[#F0EFEC]/20 text-slate-400 font-mono italic text-[11px]">
                  Waiting for active session's verifier validation of code changes. Once code changes undergo verification, you can persist findings here!
                </div>
              )}
            </div>

            <div className="border-l-4 border-indigo-500 pl-4 py-2">
              <h4 className="font-bold text-[11px] text-[#141414] uppercase tracking-wider mb-1">
                Why findings.json matters:
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                When Lars runs future agent tasks, the loop reads <code>findings.json</code> first. This ensures that the agent <b>inherits previous context</b> and never repeats historical errors.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Footer statistics */}
      <div className="p-3 bg-[#F0EFEC] border-t-2 border-[#141414] flex flex-row items-center justify-between text-[9px] text-[#141414]/60 font-mono tracking-wider shrink-0 uppercase select-none">
        <div>ACTIVE: {files.length} PATHS RECORDED</div>
        <div className="flex items-center gap-1 font-bold text-[#141414]">
          <span>© DEVS GREET Lars voku/agent-loop</span>
        </div>
      </div>

    </div>
  );
}
