import type { IMeal } from '../api/meals';
import type { IIngredient } from '../api/ingredients';
import type { MacroTotals } from '../models/nutrition';

/**
 * Macro totals for a meal, resolved through the ingredient DB.
 *
 * A meal is eaten whole — there is no yield/servings to divide by. The amounts
 * on its items ARE the portion, so this is simply the sum, each ingredient
 * scaled from its own reference amount (`amount / ing.ref`).
 */
export const mealTotals = (meal: IMeal, ingredientsById: Record<string, IIngredient>): MacroTotals => {
  const sum = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  (meal.ingredients ?? []).forEach(({ ingredientId, amount }) => {
    const ing = ingredientsById[ingredientId];
    if (!ing || !ing.ref) return;
    const f = amount / ing.ref;
    sum.calories += (ing.calories || 0) * f;
    sum.protein += (ing.protein || 0) * f;
    sum.carbs += (ing.carbs || 0) * f;
    sum.fat += (ing.fat || 0) * f;
  });
  return {
    calories: Math.round(sum.calories),
    protein: Math.round(sum.protein),
    carbs: Math.round(sum.carbs),
    fat: Math.round(sum.fat),
  };
};

/** Ingredient display names for a meal (grocery lists). */
export const mealIngredientNames = (
  meal: IMeal,
  ingredientsById: Record<string, IIngredient>,
): string[] =>
  (meal.ingredients ?? [])
    .map(({ ingredientId }) => ingredientsById[ingredientId]?.name)
    .filter((n): n is string => Boolean(n));

/** Every ingredient id referenced by a set of meals — feed to getIngredientsByIds. */
export const mealIngredientIds = (meals: IMeal[]): string[] => [
  ...new Set(meals.flatMap((m) => (m.ingredients ?? []).map((i) => i.ingredientId))),
];
