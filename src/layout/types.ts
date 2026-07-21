/**
 * Shared, platform-agnostic page-layout schema.
 *
 * A screen layout is a list of nodes — each `{ type, props }`. Every platform
 * (web, mobile) implements a *renderer* that maps `node.type` to its own
 * component, so a page's STRUCTURE and ARRANGEMENT are defined once here while
 * the leaf components stay platform-native (a `<div>` and a `<View>` can't be
 * shared; their composition can).
 *
 * Authored as typed data now. The same shape is plain JSON, so it can be
 * served from the backend later without changing the renderers — which is why
 * every node carries a stable string `type` and a `version` travels with the
 * document. A renderer that meets an unknown `type` (an old app, a newer
 * layout) skips it rather than crashing.
 *
 * Interactive/stateful behaviour (selection, forms) lives INSIDE the leaf
 * component, not the schema — the schema only places the component.
 */

/** Bump when the node/prop contract changes in a backward-incompatible way. */
export const LAYOUT_VERSION = 1;

export interface LayoutNode {
  type: string;
  props?: Record<string, unknown>;
  children?: LayoutNode[];
}

export interface ScreenLayout {
  version: number;
  /** Screen id, e.g. 'health'. */
  screen: string;
  nodes: LayoutNode[];
}

// ---- Component prop contracts (the shared design-system contract) ----

export interface SyncHeaderProps {
  /** Provider whose `lastSyncAt` drives the "Imported X ago" line + badge. */
  source: string;
}

export interface ScoreRingDef {
  /**
   * Score metric key that drives the ring's value — or, for
   * `kind: 'calories'`, a stable identifier (the value comes from the food
   * log via the renderer's `calories` input instead of the health model).
   */
  key: string;
  label: string;
  /** Ring stroke colour. */
  color: string;
  /**
   * 'score' (default) renders a 0-100 ScoreRing from the health model;
   * 'calories' renders the synthetic calorie-budget ring. This is what lets
   * Health and Today share ONE ScoreOverview component.
   */
  kind?: 'score' | 'calories';
  /**
   * Chart components shown below the rings when this ring is active — a mini
   * layout, rendered by the same node registry. Add a chart to a ring by
   * appending a node here; e.g. Sleep carries [SleepStages, MetricTrend].
   */
  details: LayoutNode[];
}

export interface ScoreOverviewProps {
  /** The rings, in order; each owns its detail charts. */
  rings: ScoreRingDef[];
  /** Snapping carousel with page dots, vs a free scroll. */
  snap?: boolean;
}

export interface MetricTrendProps {
  /** Series key to plot as a 7-day line. */
  metric: string;
  title: string;
  /** Axis-label formatting; 'duration' renders seconds as "6h 44m". */
  format?: 'number' | 'duration';
}

// ---- Today screen ----


export interface CaloriesTrendProps {
  title: string;
  /** Trailing window; the chart densifies to exactly this many days. */
  days?: number;
}

// TodayHeader, TasksBrief and NutritionBrief take no props — everything they
// show is derived from the screen context (user, tasks, meals, model).

export interface MetricGridProps {
  /**
   * Minimum card width in px; the grid fits as many columns as fit, so phones
   * get at least two across. Mirrors the web CSS
   * `repeat(auto-fill, minmax(<n>px, 1fr))`.
   */
  minCardWidth: number;
  /** Metric keys in display order; anything present but unlisted trails after. */
  order: string[];
  /**
   * Prepend a synthetic Calories card (consumed / target, trend spark from the
   * food log). Used by Today; the renderer supplies the food data.
   */
  includeCalories?: boolean;
  /**
   * Render each card's trend sparkline (default true). Health shows charts;
   * Today hides them for compact tiles.
   */
  showCharts?: boolean;
}

// SleepStages takes no props.
