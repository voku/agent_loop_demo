/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { VirtualFile } from "../types";
import { Folder, FolderOpen, FileCode, CheckCircle, FileJson, FileText, ChevronRight, ChevronDown, Lock, Code2, Sparkles } from "lucide-react";

interface FileSystemProps {
  files: VirtualFile[];
  activeFilePath: string;
  onSelectFile: (path: string) => void;
  isInstalled: boolean;
}

export default function FileSystem({
  files,
  activeFilePath,
  onSelectFile,
  isInstalled
}: FileSystemProps) {
  const [collapsedDirs, setCollapsedDirs] = useState<Record<string, boolean>>({
    "src": false,
    ".agent-loop": false,
    ".agent-loop/board": false,
    ".agent-loop/sessions": false,
    ".agent-loop/sessions/DEMO-1": false,
    ".agent-loop/recall": false,
    ".agent-loop/learning": false,
  });

  const toggleDirectory = (dirName: string) => {
    setCollapsedDirs((prev) => ({
      ...prev,
      [dirName]: !prev[dirName]
    }));
  };

  const getFileIcon = (file: VirtualFile) => {
    switch (file.language) {
      case "json":
        return <FileJson className="w-3.5 h-3.5 text-[#141414]" />;
      case "php":
        return <FileCode className="w-3.5 h-3.5 text-[#141414]" />;
      case "markdown":
        return <FileText className="w-3.5 h-3.5 text-[#141414]" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-[#141414]" />;
    }
  };

  const getFileBadge = (file: VirtualFile) => {
    switch (file.category) {
      case "board":
        return <span className="text-[8px] bg-[#141414] text-[#E4E3E0] border border-[#141414] px-1.5 py-0.5 rounded-none font-mono uppercase tracking-wider">Board</span>;
      case "session":
        return <span className="text-[8px] bg-[#141414] text-[#E4E3E0] border border-[#141414] px-1.5 py-0.5 rounded-none font-mono uppercase tracking-wider">Session</span>;
      case "recall":
        return <span className="text-[8px] bg-[#141414] text-[#E4E3E0] border border-[#141414] px-1.5 py-0.5 rounded-none font-mono uppercase tracking-wider">Recall</span>;
      case "learning":
        return <span className="text-[8px] bg-[#141414] text-[#E4E3E0] border border-[#141414] px-1.5 py-0.5 rounded-none font-mono uppercase tracking-wider">Learning</span>;
      default:
        return null;
    }
  };

  // Organize files into simulated nested directory structure for clean visual tree
  const activeFile = files.find((f) => f.path === activeFilePath) || files[0];

  const renderFileRow = (file: VirtualFile) => {
    const isActive = file.path === activeFilePath;
    return (
      <button
        key={file.path}
        onClick={() => onSelectFile(file.path)}
        className={`w-full text-left py-1 px-2 rounded-none flex items-center justify-between text-xs gap-1.5 transition cursor-pointer select-none font-mono ${
          isActive
            ? "bg-[#141414] text-[#E4E3E0] border-l-3 border-[#141414] font-bold"
            : "text-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0]"
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {getFileIcon(file)}
          <span className="truncate">{file.name}</span>
        </div>
        {getFileBadge(file)}
      </button>
    );
  };

  const renderVirtualTree = () => {
    // Root files
    const rootFiles = files.filter((f) => !f.path.includes("/"));
    // Src directory files
    const srcFiles = files.filter((f) => f.path.startsWith("src/"));
    // .agent-loop directory files
    const agentLoopFiles = files.filter((f) => f.path.startsWith(".agent-loop/"));

    return (
      <div className="space-y-3">
        {/* Root Level directories first */}
        <div className="space-y-1 select-none">
          {/* Src Directory */}
          <div className="mb-1">
            <button
              onClick={() => toggleDirectory("src")}
              className="w-full text-left py-0.5 px-1 rounded-none hover:bg-[#141414]/10 flex items-center justify-between text-xs text-[#141414] cursor-pointer"
            >
              <div className="flex items-center gap-1">
                {collapsedDirs["src"] ? <ChevronRight className="w-3.5 h-3.5 text-[#141414]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#141414]" />}
                <span className="font-extrabold text-[#141414] font-mono uppercase tracking-widest text-[11px]">SRC/</span>
              </div>
            </button>
            {!collapsedDirs["src"] && (
              <div className="pl-3 mt-1.5 space-y-0.5 border-l-2 border-[#141414]/30 ml-2">
                {srcFiles.map(renderFileRow)}
              </div>
            )}
          </div>

          {/* .agent-loop Directory (Shows up when package initialized) */}
          {isInstalled ? (
            <div className="pt-1.5 border-t border-[#141414]/20">
              <button
                onClick={() => toggleDirectory(".agent-loop")}
                className="w-full text-left py-0.5 px-1 rounded-none hover:bg-[#141414]/10 flex items-center justify-between text-xs text-[#141414] cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  {collapsedDirs[".agent-loop"] ? <ChevronRight className="w-3.5 h-3.5 text-[#141414]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#141414]" />}
                  <span className="font-extrabold text-[#141414] font-mono uppercase tracking-widest text-[11px]">.AGENT-LOOP/</span>
                </div>
              </button>

              {!collapsedDirs[".agent-loop"] && (
                <div className="pl-2 mt-1 space-y-1 ml-2 border-l-2 border-[#141414]/30">
                  {/* .agent-loop/board category */}
                  {agentLoopFiles.some((f) => f.path.includes("/board/")) && (
                    <div>
                      <button
                        onClick={() => toggleDirectory(".agent-loop/board")}
                        className="w-full text-left py-0.5 px-1.5 flex items-center gap-1.5 text-[10px] text-[#141414]/70 font-mono font-bold uppercase tracking-wide cursor-pointer"
                      >
                        {collapsedDirs[".agent-loop/board"] ? <ChevronRight className="w-3 h-3 text-[#141414]" /> : <ChevronDown className="w-3 h-3 text-[#141414]" />}
                        <span>board/</span>
                      </button>
                      {!collapsedDirs[".agent-loop/board"] && (
                        <div className="pl-2.5 space-y-0.5 border-l border-[#141414]/20 ml-1.5 mt-0.5">
                          {agentLoopFiles.filter((f) => f.path.includes("/board/")).map(renderFileRow)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* .agent-loop/sessions state */}
                  {agentLoopFiles.some((f) => f.path.includes("/sessions/")) && (
                    <div>
                      <button
                        onClick={() => toggleDirectory(".agent-loop/sessions")}
                        className="w-full text-left py-0.5 px-1.5 flex items-center gap-1.5 text-[10px] text-[#141414]/70 font-mono font-bold uppercase tracking-wide cursor-pointer"
                      >
                        {collapsedDirs[".agent-loop/sessions"] ? <ChevronRight className="w-3 h-3 text-[#141414]" /> : <ChevronDown className="w-3 h-3 text-[#141414]" />}
                        <span>sessions/</span>
                      </button>
                      {!collapsedDirs[".agent-loop/sessions"] && (
                        <div className="pl-2.5 space-y-0.5 border-l border-[#141414]/20 ml-1.5 mt-0.5">
                          <div className="text-[9px] text-[#141414] font-bold font-mono py-0.5 px-2 bg-[#E4E3E0] m-0.5 tracking-tight">↳ DEMO-1/</div>
                          {agentLoopFiles.filter((f) => f.path.includes("/sessions/")).map(renderFileRow)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* .agent-loop/recall compile state */}
                  {agentLoopFiles.some((f) => f.path.includes("/recall/")) && (
                    <div>
                      <button
                        onClick={() => toggleDirectory(".agent-loop/recall")}
                        className="w-full text-left py-0.5 px-1.5 flex items-center gap-1.5 text-[10px] text-[#141414]/70 font-mono font-bold uppercase tracking-wide cursor-pointer"
                      >
                        {collapsedDirs[".agent-loop/recall"] ? <ChevronRight className="w-3 h-3 text-[#141414]" /> : <ChevronDown className="w-3 h-3 text-[#141414]" />}
                        <span>recall/</span>
                      </button>
                      {!collapsedDirs[".agent-loop/recall"] && (
                        <div className="pl-2.5 space-y-0.5 border-l border-[#141414]/20 ml-1.5 mt-0.5">
                          {agentLoopFiles.filter((f) => f.path.includes("/recall/")).map(renderFileRow)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* .agent-loop/learning approvals */}
                  {agentLoopFiles.some((f) => f.path.includes("/learning/")) && (
                    <div>
                      <button
                        onClick={() => toggleDirectory(".agent-loop/learning")}
                        className="w-full text-left py-0.5 px-1.5 flex items-center gap-1.5 text-[10px] text-[#141414]/70 font-mono font-bold uppercase tracking-wide cursor-pointer"
                      >
                        {collapsedDirs[".agent-loop/learning"] ? <ChevronRight className="w-3 h-3 text-[#141414]" /> : <ChevronDown className="w-3 h-3 text-[#141414]" />}
                        <span>learning/</span>
                      </button>
                      {!collapsedDirs[".agent-loop/learning"] && (
                        <div className="pl-2.5 space-y-0.5 border-l border-[#141414]/20 ml-1.5 mt-0.5">
                          {agentLoopFiles.filter((f) => f.path.includes("/learning/")).map(renderFileRow)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 border border-dashed border-[#141414] rounded-none text-center select-none bg-[#E4E3E0]">
              <Lock className="w-4 h-4 text-[#141414] mx-auto mb-1.5" />
              <div className="text-[10px] text-[#141414] font-semibold uppercase tracking-wider font-mono">
                LOOPS LOCKED
              </div>
            </div>
          )}
        </div>

        {/* Root configuration files */}
        <div className="border-t border-[#141414] pt-2 space-y-0.5 col-span-2 select-none">
          {rootFiles.map(renderFileRow)}
        </div>
      </div>
    );
  };

  // Render file code lines with simulated highlight tags
  const renderHighlightedCode = (file: VirtualFile) => {
    const lines = file.content.split("\n");
    return (
      <div className="font-mono text-xs text-[#E4E3E0] leading-normal overflow-x-auto select-text">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, num) => {
              // Simple formatting colors to make IDE look incredibly rich
              let highlighted = line;
              if (file.language === "php") {
                highlighted = line
                  .replace(/(\/\/.+)/g, '<span class="text-slate-500 italic">$1</span>')
                  .replace(/(\/\*.+?\*\/)/g, '<span class="text-slate-500 italic">$1</span>')
                  .replace(/(namespace|class|public|function|private|return|bool|array)/g, '<span class="text-orange-400 font-bold">$1</span>')
                  .replace(/(\$errors|\$email|\$password|\$data)/g, '<span class="text-amber-200 font-bold">$1</span>')
                  .replace(/(empty|strlen|filter_var|trim|getErrors|register)/g, '<span class="text-[#DAD9D6] font-semibold">$1</span>')
                  .replace(/(FILTER_VALIDATE_EMAIL)/g, '<span class="text-orange-300 font-bold">$1</span>')
                  .replace(/(&lt;&lt;&lt;|"Email is required."|"Password is required."|"Invalid email format."|"Password must be at least 8 characters long.")/g, '<span class="text-emerald-300">$1</span>');
              } else if (file.language === "json") {
                highlighted = line
                  .replace(/("[\w-]+")/g, '<span class="text-orange-300 font-bold">$1</span>')
                  .replace(/(true|false)/g, '<span class="text-emerald-300">$1</span>')
                  .replace(/(:\s*"[^"]*")/g, ': <span class="text-amber-100">$1</span>');
              } else if (file.language === "markdown") {
                highlighted = line
                  .replace(/^(#\s.+)/g, '<span class="text-[#E4E3E0] font-extrabold text-[13px] border-b border-[#333333] pb-1.5 block uppercase tracking-wider">$1</span>')
                  .replace(/^(##\s.+)/g, '<span class="text-[#E4E3E0] font-bold text-xs mt-2 block">$1</span>')
                  .replace(/^(###\s.+)/g, '<span class="text-orange-400 font-semibold text-xs mt-1 block">$1</span>')
                  .replace(/(`[^`]+`)/g, '<span class="px-1.5 py-0.5 bg-[#141414] border border-[#333333] font-mono text-orange-200 font-bold">$1</span>');
              }

              return (
                <tr key={num} className="hover:bg-slate-800/40 group">
                  <td className="pr-4 pl-2 text-right text-[10px] text-slate-500 select-none border-r border-[#333333]/80 w-10 shrink-0 font-sans tracking-wide">
                    {num + 1}
                  </td>
                  <td className="pl-4 py-0.2 break-all whitespace-pre font-mono">
                    <span dangerouslySetInnerHTML={{ __html: highlighted || " " }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-[#E4E3E0] rounded-none border border-[#141414] shadow-none overflow-hidden h-full flex flex-col md:flex-row">
      {/* Visual File Explorer column */}
      <div className="w-full md:w-64 bg-[#DAD9D6] border-b md:border-b-0 md:border-r border-[#141414] p-4 h-[200px] md:h-full flex flex-col shrink-0">
        <div className="text-[10px] text-[#141414] uppercase font-extrabold tracking-widest font-mono mb-3 flex items-center justify-between shrink-0">
          <span>WORKSPACE</span>
          <span className="font-mono text-[#141414]/70 select-none">ITEMS: {files.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar select-none">
          {renderVirtualTree()}
        </div>
      </div>

      {/* Code Editor block */}
      <div className="flex-1 bg-[#141414] h-full flex flex-col min-h-[260px] overflow-hidden">
        {/* Editor Tab Bar */}
        <div className="bg-[#1c1c1c] px-4 py-2 border-b border-[#333333] flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#E4E3E0] tracking-wider uppercase truncate max-w-[200px]">
              {activeFile.path}
            </span>
            <span className="text-[9px] bg-[#141414] text-[#E4E3E0] border border-[#333333] px-1.5 py-0.5 rounded-none font-sans uppercase tracking-widest">
              LOCKED_FILE
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">
            {activeFile.language}
          </div>
        </div>

        {/* Code Canvas */}
        <div className="flex-1 p-4 overflow-auto custom-scrollbar bg-[#141414]">
          {renderHighlightedCode(activeFile)}
        </div>
      </div>
    </div>
  );
}
