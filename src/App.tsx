import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import { LifecycleSimulator } from "./components/LifecycleSimulator";
import { ScenarioId } from "./types";
import { BrandSpecModal } from "./components/BrandSpecModal";

export default function App() {
  const [view, setView] = useState<"landing" | "sandbox">("landing");
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioId>("scenario_a");
  const [isBrandSpecOpen, setIsBrandSpecOpen] = useState(false);

  const handleLaunchScenario = (scenarioId?: ScenarioId) => {
    if (scenarioId) {
      setActiveScenarioId(scenarioId);
    }
    setView("sandbox");
  };

  if (view === "landing") {
    return (
      <>
        <LandingPage onLaunchSandbox={handleLaunchScenario} />
        <BrandSpecModal
          isOpen={isBrandSpecOpen}
          onClose={() => setIsBrandSpecOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <LifecycleSimulator
        initialScenarioId={activeScenarioId}
        onBackToDocs={() => setView("landing")}
        onOpenBrandSpec={() => setIsBrandSpecOpen(true)}
      />
      <BrandSpecModal
        isOpen={isBrandSpecOpen}
        onClose={() => setIsBrandSpecOpen(false)}
      />
    </>
  );
}
