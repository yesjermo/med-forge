import { useState } from "react";
import { GeneratorView, type GenerateRunner } from "@/components/GeneratorView";
import { runPack } from "@/engine/run";
import { useAdvisor } from "@/components/useAdvisor";
import { browserAdvisor } from "../advise";
import { makeProviders, makeWriter, writerLabel, type Settings } from "../settings";

/** Web edition generator: runs entirely in the browser with the visitor's own writer and keys. */
export function Generate({ mode, settings }: { mode: "generate" | "check"; settings: Settings }) {
  const advisor = useAdvisor(browserAdvisor(settings));
  const [use, setUse] = useState({ crossref: true, perplexity: true, openalex: true });
  const has = { crossref: true, perplexity: Boolean(settings.perplexityKey.trim()), openalex: Boolean(settings.openalexKey.trim()) };

  const run: GenerateRunner = async (req, emit, signal) => {
    const writer = await makeWriter(settings);
    const providers = makeProviders(settings, use);
    await runPack({ ...req, writer, providers, signal, emit });
  };

  const toggle = (name: keyof typeof use, label: string) => (
    <label key={name} className={`check ${has[name] ? "" : "off"}`}>
      <input
        type="checkbox"
        checked={has[name] && use[name]}
        disabled={!has[name]}
        onChange={() => setUse((u) => ({ ...u, [name]: !u[name] }))}
      />
      <span>{label}</span>
      {!has[name] && (
        <small>
          <a href="#/settings">add key</a>
        </small>
      )}
    </label>
  );

  return (
    <GeneratorView
      mode={mode}
      onModeChange={(m) => (window.location.hash = m === "check" ? "/check" : "/generate")}
      intro="For medical, nursing, pre-med and pre-vet students. Paste lecture notes, a paper or a case. MedForge searches for real papers, then writes proof, idea and exchange blocks that cite them, all in your browser."
      run={run}
      advisor={advisor}
      share={{
        label: "Save to notebook",
        where: "your notebook",
        onShare: (body, title, pack) => {
          try {
            sessionStorage.setItem("study-forge:share", JSON.stringify({ body, title, pack }));
          } catch {}
          window.location.hash = "/hub/new?from=generator";
        },
      }}
      writerControl={
        <div className="field">
          <span>Writer</span>
          <a className="writer-link" href="#/settings">
            {writerLabel(settings)}{" "}
            <span className="hint">change</span>
          </a>
        </div>
      }
      providerControls={
        <>
          {toggle("crossref", "Crossref (free)")}
          {toggle("perplexity", "Perplexity")}
          {toggle("openalex", "OpenAlex")}
          <span className="hint">Elicit and Consensus: paste their results below.</span>
        </>
      }
    />
  );
}
