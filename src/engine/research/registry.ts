import { ConsensusProvider } from "./consensus";
import { CrossrefProvider } from "./crossref";
import { ElicitProvider } from "./elicit";
import { OpenAlexProvider } from "./openalex";
import { PerplexityProvider } from "./perplexity";
import type { ProviderName, ResearchProvider } from "./types";

type Env = Record<string, string | undefined>;

export function allProviders(env: Env = process.env): ResearchProvider[] {
  return [
    new CrossrefProvider(),
    new OpenAlexProvider(env.OPENALEX_API_KEY),
    new ElicitProvider(env.ELICIT_API_KEY),
    new ConsensusProvider(env.CONSENSUS_API_KEY),
    new PerplexityProvider(env.PERPLEXITY_API_KEY),
  ];
}

/** Providers to run: the requested ones that are available, or every available one if none requested. */
export function selectProviders(requested: string[] | undefined, env: Env = process.env): ResearchProvider[] {
  const all = allProviders(env).filter((p) => p.available);
  if (!requested) return all;
  const want = new Set(requested);
  return all.filter((p) => want.has(p.name));
}

export interface ProviderStatus {
  name: ProviderName;
  label: string;
  available: boolean;
  hint: string;
}

export function providerStatus(env: Env = process.env): ProviderStatus[] {
  return allProviders(env).map(({ name, label, available, hint }) => ({ name, label, available, hint }));
}
