import { useRef, useState } from "react";
import { knownSourceIds, type AdviceCheck } from "@/engine/advise";
import type { Source } from "@/engine/research/types";

export interface AdviseRequest {
  text: string;
  lead?: string;
  sources?: Source[];
}

/** How advice is produced: through the full app's /api/advise, or in the browser (web edition). */
export type AdviseRunner = (
  req: AdviseRequest,
  on: { checks: (c: AdviceCheck[]) => void; text: (delta: string) => void; signal: AbortSignal },
) => Promise<void>;

/** Advisor state for the Advice panel, shared by both versions. */
export function useAdvisor(run: AdviseRunner) {
  const [checks, setChecks] = useState<AdviceCheck[]>([]);
  const [text, setText] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [knownIds, setKnownIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function advise(req: AdviseRequest) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setOpen(true);
    setKnownIds(knownSourceIds(req.text, req.sources ?? []));
    setChecks([]);
    setText("");
    setError(null);
    setRunning(true);
    let acc = "";
    try {
      await run(req, { checks: setChecks, text: (d) => setText((acc += d)), signal: controller.signal });
    } catch (err) {
      if (!controller.signal.aborted) setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRunning(false);
    }
  }

  return { checks, text, running, error, open, knownIds, advise };
}

export type Advisor = ReturnType<typeof useAdvisor>;
