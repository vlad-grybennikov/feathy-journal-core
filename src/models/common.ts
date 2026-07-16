/**
 * Generic structure for time accumulation calculations
 * Represents an item with time and optional children for hierarchical time summation
 */
export interface TimeAccumulationItem {
  time: number | null;
  children: TimeAccumulationItem[];
}
