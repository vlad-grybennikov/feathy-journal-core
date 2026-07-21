import { LAYOUT_VERSION, type ScreenLayout } from './types';

/**
 * The Health screen's structure — consumed by both the web and mobile
 * renderers. Change the arrangement, columns, or which metrics appear HERE and
 * both apps follow.
 *
 * `#1` (snapping ring carousel) and `#2` (2-up metric grid) are expressed as
 * props: `ScoreOverview.snap` and `MetricGrid.minCardWidth`. The
 * clicked-ring-shows-its-trend-chart behaviour lives inside the ScoreOverview
 * component, so it isn't modelled here.
 */
export const healthLayout: ScreenLayout = {
  version: LAYOUT_VERSION,
  screen: 'health',
  nodes: [
    { type: 'SyncHeader', props: { source: 'oura' } },
    {
      type: 'ScoreOverview',
      props: { metrics: ['sleep_score', 'readiness_score', 'activity_score'], snap: true },
    },
    { type: 'SleepStages' },
    {
      type: 'MetricGrid',
      props: {
        minCardWidth: 160,
        order: [
          'hrv',
          'resting_hr',
          'steps',
          'sleep_duration',
          'temp_deviation',
          'spo2',
          'respiratory_rate',
          'active_calories',
          'stress_high',
          'vo2_max',
          'vascular_age',
          'pulse_wave_velocity',
          'body_fat',
          'weight',
          'bmi',
          'exercise_minutes',
        ],
      },
    },
  ],
};
