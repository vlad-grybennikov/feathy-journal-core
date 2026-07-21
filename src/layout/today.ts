import { LAYOUT_VERSION, type ScreenLayout } from './types';

/**
 * The Today screen's structure — the composition surface over Health, Tasks
 * and Food. Consumed by both platform renderers; edit here, both apps follow.
 *
 * Interactivity (ring customization, task toggling, collapse state, the Add
 * menu) lives inside the leaf components; this document only places them and
 * carries the ring catalog + preference key.
 */
export const todayLayout: ScreenLayout = {
  version: LAYOUT_VERSION,
  screen: 'today',
  nodes: [
    { type: 'TodayHeader' },
    {
      type: 'RingRail',
      props: {
        // Same key the web page has always used, so existing preferences survive.
        storageKey: 'journal_today_rings_v1',
        catalog: [
          { key: 'sleep', metric: 'sleep_score', label: 'Sleep', mode: 'ring' },
          { key: 'readiness', metric: 'readiness_score', label: 'Readiness', mode: 'ring' },
          { key: 'activity', metric: 'activity_score', label: 'Activity', mode: 'ring' },
          { key: 'calories', metric: null, label: 'Calories', mode: 'ring' },
          { key: 'hrv', metric: 'hrv', label: 'HRV', mode: 'number' },
          { key: 'resting_hr', metric: 'resting_hr', label: 'Resting HR', mode: 'number' },
          { key: 'steps', metric: 'steps', label: 'Steps', mode: 'number' },
          { key: 'temp_deviation', metric: 'temp_deviation', label: 'Body temp', mode: 'number' },
          { key: 'spo2', metric: 'spo2', label: 'SpO2', mode: 'number' },
          { key: 'stress_high', metric: 'stress_high', label: 'Stress', mode: 'number' },
          { key: 'respiratory_rate', metric: 'respiratory_rate', label: 'Respiratory', mode: 'number' },
          { key: 'active_calories', metric: 'active_calories', label: 'Active cal', mode: 'number' },
          { key: 'vascular_age', metric: 'vascular_age', label: 'CV age', mode: 'number' },
          { key: 'pulse_wave_velocity', metric: 'pulse_wave_velocity', label: 'PWV', mode: 'number' },
          { key: 'vo2_max', metric: 'vo2_max', label: 'VO₂ max', mode: 'number' },
        ],
      },
    },
    { type: 'TasksBrief' },
    { type: 'NutritionBrief' },
  ],
};
