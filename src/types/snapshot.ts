export type Quality = 'ok' | 'stale' | 'missing' | 'error' | 'manual' | 'warning'

export interface Metric {
  label: string
  value: number | null
  unit: string
  source: string
  timestamp: string | null
  quality: Quality
  note?: string
  change_24h?: number | null
  change_7d?: number | null
  change_30d?: number | null
  change_unit?: string
  kind?: string
  period?: string
  category?: string
}

export interface Series {
  label: string
  unit: string
  source: string
  points: [number, number][]
}

export interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface CandleSet {
  '1d': Candle[]
  '1h': Candle[]
  source: string
  unit: string
  volume_unit: string
}

export interface SourceStatus {
  id: string
  name: string
  url: string
  category: string
  status: 'ok' | 'partial' | 'error' | 'disabled'
  error?: string
  warnings?: string[]
  latency_ms?: number
  last_success?: string | null
  metrics_count?: number
  optional_key?: string | null
  key_present?: boolean | null
}

export interface RiskRow {
  key: string
  label: string
  value: number | null
  unit: string
  risk: 'low' | 'medium' | 'high' | 'na'
  thresholds: [number, number] | null
  note: string
  change_24h: number | null
  change_7d: number | null
}

export interface RegimeRule {
  group: string
  name: string
  value: number | null
  threshold: string
  triggered: boolean | null
  effect: number
}

export interface Regime {
  label: string
  score: number
  score_inputs: number
  rules: RegimeRule[]
  btc_realized_vol_7d: number | null
  btc_realized_vol_30d: number | null
  method: string
}

export interface Correlation {
  assets: string[]
  labels: Record<string, string>
  end_day: string
  windows: Record<string, { matrix: (number | null)[][]; n: number[][] }>
  method: string
  notes: string
}

export interface P2PSize {
  size_vnd: number
  ask: number | null
  bid: number | null
  mid: number | null
  spread_pct: number | null
  ask_count: number
  bid_count: number
}

export interface P2PPlatform {
  by_size?: P2PSize[]
  depth_ask_usdt?: number | null
  depth_bid_usdt?: number | null
  ads_ask?: number
  ads_bid?: number
  timestamp?: string
  error?: string
}

export interface Signal {
  topic: string
  type: 'Fact' | 'Analysis' | 'Hypothesis'
  level?: string
  text: string
}

export interface FomcMeeting {
  start: string
  end: string
  sep: boolean
  tentative?: boolean
}

export interface FxBank {
  id: string
  name: string
  buy_cash: number | null
  buy_transfer: number | null
  sell: number | null
  timestamp: string | null
}

export interface FxFreeQuote {
  source: string
  url: string
  buy: number
  sell: number
  timestamp: string
}

export interface FxPlatform extends P2PPlatform {
  id: string
  name: string
  by_size: P2PSize[]
}

export interface FxGap {
  vnd: number
  pct: number
}

export interface FxBoard {
  banks: FxBank[]
  free: FxFreeQuote[]
  platforms: FxPlatform[]
  trade_sizes_vnd: number[]
  reference_size_vnd?: number | null
  gaps: { free_vs_bank: FxGap | null; usdt_vs_bank: FxGap | null; usdt_vs_free: FxGap | null }
}

export interface VolRow {
  key: string
  label: string
  group: string
  method: 'log' | 'abs'
  unit: string
  status: 'ok' | 'accumulating' | 'stale' | 'no_data'
  note?: string
  vol_7d: number | null
  vol_30d: number | null
  vol_90d: number | null
  obs?: number
  last_date?: string
}

export interface ForwardTable {
  tenor_days: number
  spot_key: string | null
  vnd_rate_key: string | null
  usd_rate_key: string | null
  spot: number | null
  r_vnd: number | null
  r_usd: number | null
  implied: number | null
  points: number | null
  quote: number | null
  quote_vs_implied: number | null
  missing: string[]
  caveats: string[]
}

export interface NewsItem {
  title: string
  link: string
  source: string
  sources: string[]
  published: string
  topic: string
  topic_label: string
  why: string
  markets: string[]
  score: number
  lang: 'vi' | 'en'
  effects?: { market: string; dir: 'up' | 'down' }[]
  effects_basis?: string | null
  tone?: { label: 'positive' | 'negative' | 'neutral'; score: number } | null
  reaction?: { label: string; value: number; unit: string }[]
}

export interface Digest {
  headline: string
  bullets: { tag: string; text: string }[]
  regime_vi: string
  regime_why: string
}

export interface Snapshot {
  schema_version: number
  date: string
  generated_at: string
  fixture?: boolean
  run: {
    trigger: string
    started_at: string
    finished_at: string
    scheduled_for: string | null
    delay_minutes: number | null
    run_id: string | null
    run_url: string | null
  }
  metrics: Record<string, Metric>
  series?: Record<string, Series>
  candles?: Record<string, CandleSet>
  tables: {
    p2p?: { enabled: boolean; note?: string; platforms: Record<string, P2PPlatform>; config?: Record<string, unknown> }
    risk?: RiskRow[]
    volatility?: Record<string, { vol_7d: number | null; vol_30d: number | null; source: string }>
    macro_signals?: Signal[]
    mm_signals?: Signal[]
    fomc?: { source: string; next: FomcMeeting | null; last: FomcMeeting | null; upcoming: FomcMeeting[] }
    sbv_policy_notes?: { date: string; text: string; link?: string }[]
    thresholds?: Record<string, number[]>
    fx?: FxBoard
    vol_board?: VolRow[]
    forward?: ForwardTable
    news?: NewsItem[]
    digest?: Digest
  }
  regime?: Regime
  correlation?: Correlation
  sources: SourceStatus[]
  warnings?: string[]
  quality_summary?: Record<string, number>
}

export interface IndexEntry {
  date: string
  file: string
  generated_at: string
  regime: string
  quality: Record<string, number>
}

export interface DataIndex {
  latest: string
  updated_at: string
  dates: IndexEntry[]
}
