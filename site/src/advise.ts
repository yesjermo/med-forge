import { adviseStream, sourceChecks } from "@/engine/advise";
import type { AdviseRunner } from "@/components/useAdvisor";
import { makeWriter, type Settings } from "./settings";

/** Web edition: run the advisor in the browser with the visitor's own writer. */
export function browserAdvisor(settings: Settings): AdviseRunner {
  return async (req, on) => {
    on.checks(sourceChecks(req.text, req.sources ?? []));
    await adviseStream({ ...req, writer: await makeWriter(settings), signal: on.signal, onText: on.text });
  };
}
