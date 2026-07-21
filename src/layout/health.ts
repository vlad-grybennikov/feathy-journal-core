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
      props: {
        snap: true,
        rings: [
          {
            key: 'sleep_score',
            label: 'Sleep',
            color: '#6366f1',
            details: [
              { type: 'SleepStages' },
              { type: 'MetricTrend', props: { metric: 'sleep_score', title: 'Sleep score · 7 days' } },
            ],
          },
          {
            key: 'readiness_score',
            label: 'Readiness',
            color: '#16a34a',
            details: [
              { type: 'MetricTrend', props: { metric: 'readiness_score', title: 'Readiness · 7 days' } },
            ],
          },
          {
            key: 'activity_score',
            label: 'Activity',
            color: '#ea580c',
            details: [
              { type: 'MetricTrend', props: { metric: 'steps', title: 'Steps · 7 days', format: 'number' } },
              { type: 'MetricTrend', props: { metric: 'activity_score', title: 'Activity score · 7 days' } },
            ],
          },
        ],
      },
    },
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
