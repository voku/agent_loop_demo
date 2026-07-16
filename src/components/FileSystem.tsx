/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { VirtualFile } from "../types";
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  CheckCircle, 
  FileJson, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  Lock, 
  Code2, 
  Sparkles,
  GitPullRequest,
  Map,
  BookOpen,
  History
} from "lucide-react";

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
    "todo": false,
    "session_plan": false,
    "infra": false,
    ".agent-loop": false,
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
        return <FileJson className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case "php":
        return <FileCode className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      case "markdown":
        return <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
    }
  };

  const getFileBadge = (file: VirtualFile) => {
    switch (file.category) {
      case "board":
        return <span className="text-[8px] bg-slate-800 text-slate-100 px-1 py-0.2 select-none font-mono uppercase tracking-widest border border-slate-700">Board</span>;
      case "workflow":
      case "session":
        return <span className="text-[8px] bg-blue-900 text-blue-100 px-1 py-0.2 select-none font-mono uppercase tracking-widest border border-blue-700">Session</span>;
      case "recall":
        return <span className="text-[8px] bg-purple-900 text-purple-100 px-1 py-0.2 select-none font-mono uppercase tracking-widest border border-purple-700">Recall</span>;
      case "map":
        return <span className="text-[8px] bg-teal-900 text-teal-100 px-1 py-0.2 select-none font-mono uppercase tracking-widest border border-teal-700">Map</span>;
      case "learning":
        return <span className="text-[8px] bg-amber-950 text-amber-300 px-1 py-0.2 select-none font-mono uppercase tracking-widest border border-amber-800">Learning</span>;
      default:
        return null;
    }
  };

  const activeFile = files.find((f) => f.path === activeFilePath) || files[0] || {
    name: "Signup.php",
    path: "src/Signup.php",
    content: "",
    language: "php",
    category: "source"
  } as VirtualFile;

  const renderFileRow = (file: VirtualFile) => {
    const isActive = file.path === activeFilePath;
    return (
      <button
        key={file.path}
        onClick={() => onSelectFile(file.path)}
        className={`w-full text-left py-1.5 px-2.5 rounded-none flex items-center justify-between text-xs gap-2 transition cursor-pointer select-none font-mono ${
          isActive
            ? "bg-[#141414] text-[#E4E3E0] border-l-4 border-amber-500 font-bold"
            : "text-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0]"
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {getFileIcon(file)}
          <span className="truncate">{file.name}</span>
        </div>
        {getFileBadge(file)}
      </button>
    );
  };

  const renderVirtualTree = () => {
    const rootFiles = files.filter((f) => !f.path.includes("/"));
    const srcFiles = files.filter((f) => f.path.startsWith("src/"));
    const todoFiles = files.filter((f) => f.path.startsWith("todo/"));
    const sessionFiles = files.filter((f) => f.path.startsWith("session_plan/"));
    const infraFiles = files.filter((f) => f.path.startsWith("infra/"));
    const agentLoopFiles = files.filter((f) => f.path.startsWith(".agent-loop/"));

    return (
      <div className="space-y-4">
        {/* Src Directory */}
        <div className="space-y-1">
          <button
            onClick={() => toggleDirectory("src")}
            className="w-full text-left py-1 px-1.5 rounded-none hover:bg-[#141414]/10 flex items-center justify-between text-xs text-[#141414] cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              {collapsedDirs["src"] ? <ChevronRight className="w-4 h-4 text-[#141414]" /> : <ChevronDown className="w-4 h-4 text-[#141414]" />}
              <span className="font-extrabold text-[#141414] font-mono uppercase tracking-widest text-[11px]">src/</span>
            </div>
          </button>
          {!collapsedDirs["src"] && (
            <div className="pl-3 mt-1 space-y-0.5 border-l-2 border-[#141414]/30 ml-2">
              {srcFiles.map(renderFileRow)}
            </div>
          )}
        </div>

        {/* Todo/ Directory */}
        {todoFiles.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-[#141414]/10">
            <button
              onClick={() => toggleDirectory("todo")}
              className="w-full text-left py-1 px-1.5 rounded-none hover:bg-[#141414]/10 flex items-center justify-between text-xs text-[#141414] cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                {collapsedDirs["todo"] ? <ChevronRight className="w-4 h-4 text-[#141414]" /> : <ChevronDown className="w-4 h-4 text-[#141414]" />}
                <span className="font-extrabold text-[#141414] font-mono uppercase tracking-widest text-[11px] text-slate-800">todo/</span>
              </div>
            </button>
            {!collapsedDirs["todo"] && (
              <div className="pl-3 mt-1 space-y-1 ml-2 border-l-2 border-[#141414]/30">
                {todoFiles.map(renderFileRow)}
              </div>
            )}
          </div>
        )}

        {/* Session Plan Directory */}
        {isInstalled && sessionFiles.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-[#141414]/10">
            <button
              onClick={() => toggleDirectory("session_plan")}
              className="w-full text-left py-1 px-1.5 rounded-none hover:bg-[#141414]/10 flex items-center justify-between text-xs text-[#141414] cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                {collapsedDirs["session_plan"] ? <ChevronRight className="w-4 h-4 text-[#141414]" /> : <ChevronDown className="w-4 h-4 text-[#141414]" />}
                <span className="font-extrabold text-[#141414] font-mono uppercase tracking-widest text-[11px] text-blue-900">session_plan/</span>
              </div>
            </button>
            {!collapsedDirs["session_plan"] && (
              <div className="pl-3 mt-1 space-y-1 ml-2 border-l-2 border-[#141414]/30">
                <div className="text-[9px] text-[#141414]/60 font-bold font-mono py-0.5 px-2 bg-slate-200 m-0.5 tracking-tight uppercase">↳ DEMO-1/</div>
                {sessionFiles.map(renderFileRow)}
              </div>
            )}
          </div>
        )}

        {/* Infra Directory */}
        {isInstalled && infraFiles.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-[#141414]/10">
            <button
              onClick={() => toggleDirectory("infra")}
              className="w-full text-left py-1 px-1.5 rounded-none hover:bg-[#141414]/10 flex items-center justify-between text-xs text-[#141414] cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                {collapsedDirs["infra"] ? <ChevronRight className="w-4 h-4 text-[#141414]" /> : <ChevronDown className="w-4 h-4 text-[#141414]" />}
                <span className="font-extrabold text-[#141414] font-mono uppercase tracking-widest text-[11px] text-purple-900">infra/</span>
              </div>
            </button>
            {!collapsedDirs["infra"] && (
              <div className="pl-3 mt-1 space-y-1 ml-2 border-l-2 border-[#141414]/30">
                {infraFiles.map(renderFileRow)}
              </div>
            )}
          </div>
        )}

        {/* .agent-loop Directory (Codebase Maps only) */}
        {isInstalled && agentLoopFiles.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-[#141414]/10">
            <button
              onClick={() => toggleDirectory(".agent-loop")}
              className="w-full text-left py-1 px-1.5 rounded-none hover:bg-[#141414]/10 flex items-center justify-between text-xs text-[#141414] cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                {collapsedDirs[".agent-loop"] ? <ChevronRight className="w-4 h-4 text-[#141414]" /> : <ChevronDown className="w-4 h-4 text-[#141414]" />}
                <span className="font-extrabold text-[#141414] font-mono uppercase tracking-widest text-[11px] text-teal-800">.agent-loop/</span>
              </div>
            </button>
            {!collapsedDirs[".agent-loop"] && (
              <div className="pl-3 mt-1 space-y-1 ml-2 border-l-2 border-[#141414]/30">
                {agentLoopFiles.map(renderFileRow)}
              </div>
            )}
          </div>
        )}

        {/* Fallback locked state */}
        {!isInstalled && (
          <div className="p-3.5 border border-dashed border-[#141414]/30 rounded-none text-center select-none bg-[#DAD9D6]/45">
            <Lock className="w-4 h-4 text-[#141414]/55 mx-auto mb-1.5" />
            <div className="text-[10px] text-[#141414]/70 font-extrabold uppercase tracking-widest font-mono">
              agent-loop locked
            </div>
          </div>
        )}

        {/* Root Level Config Files */}
        {rootFiles.length > 0 && (
          <div className="border-t border-[#141414]/20 pt-2 space-y-0.5 select-none">
            {rootFiles.map(renderFileRow)}
          </div>
        )}
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
              let highlighted = line;
              if (file.language === "php") {
                // 1. Extract comments first to placeholders to prevent html nesting corruption
                const comments: string[] = [];
                highlighted = line.replace(/(\/\/.*)/g, (match) => {
                  comments.push(match);
                  return `__PHP_COMMENT_${comments.length - 1}__`;
                });

                // 2. Perform all standard token highlights
                highlighted = highlighted
                  .replace(/\b(namespace|class|public|function|private|return|bool|array)\b/g, '<span class="text-orange-400 font-bold">$1</span>')
                  .replace(/\b(FILTER_VALIDATE_EMAIL)\b/g, '<span class="text-orange-300 font-bold">$1</span>')
                  .replace(/(\$errors|\$email|\$password|\$data)/g, '<span class="text-amber-200 font-bold">$1</span>')
                  .replace(/\b(empty|strlen|filter_var|trim|getErrors|register)\b/g, '<span class="text-[#DAD9D6] font-semibold">$1</span>')
                  .replace(/("Email is required."|"Password is required."|"Invalid email format."|"Password must be at least 8 characters long.")/g, '<span class="text-emerald-300">$1</span>');

                // 3. Restore comments safely inside style span
                highlighted = highlighted.replace(/__PHP_COMMENT_(\d+)__/g, (match, idx) => {
                  const commentText = comments[parseInt(idx, 10)];
                  return `<span class="text-slate-500 italic">${commentText}</span>`;
                });

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
