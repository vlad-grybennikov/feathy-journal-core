import { LAYOUT_VERSION, type ScreenLayout } from './types';

/**
 * The Today screen's structure — the composition surface over Health, Tasks
 * and Food. Consumed by both platform renderers; edit here, both apps follow.
 *
 * Deliberately built from the SAME nodes as the Health screen (per Vlad,
 * 2026-07-21, to avoid component duplication): ScoreOverview and MetricGrid
 * are one component each, shared across screens. Today adds a synthetic
 * calories ring (kind: 'calories', fed by the food log) whose detail chart is
 * the 7-day calories trend, and a Calories tile in the grid
 * (includeCalories). The Customize picker was removed with the old RingRail.
 */
export const todayLayout: ScreenLayout = {
  version: LAYOUT_VERSION,
  screen: 'today',
  nodes: [
    { type: 'TodayHeader' },
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
          {
            key: 'calories',
            label: 'Calories',
            color: '#0d9488',
            kind: 'calories',
            details: [
              { type: 'CaloriesTrend', props: { title: 'Calories · last 7 days', days: 7 } },
            ],
          },
        ],
      },
    },
    {
      type: 'MetricGrid',
      props: {
        minCardWidth: 160,
        includeCalories: true,
        showCharts: false,
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
    { type: 'TasksBrief' },
    { type: 'NutritionBrief' },
  ],
};
