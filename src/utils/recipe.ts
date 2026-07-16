import type { IRecipe } from '../api/recipes';
import type { IIngredient } from '../api/ingredients';
import type { MacroTotals } from '../models/food';

/** Per-serving macro totals for a recipe, resolved through the ingredient DB. */
export const recipeTotals = (
  recipe: IRecipe,
  ingredientsById: Record<string, IIngredient>,
): MacroTotals => {
  const sum = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  recipe.ingredients.forEach(({ ingredientId, amount }) => {
    const ing = ingredientsById[ingredientId];
    if (!ing || !ing.ref) return;
    const f = amount / ing.ref;
    sum.calories += (ing.calories || 0) * f;
    sum.protein += (ing.protein || 0) * f;
    sum.carbs += (ing.carbs || 0) * f;
    sum.fat += (ing.fat || 0) * f;
  });
  const servings = recipe.servings || 1;
  return {
    calories: Math.round(sum.calories / servings),
    protein: Math.round(sum.protein / servings),
    carbs: Math.round(sum.carbs / servings),
    fat: Math.round(sum.fat / servings),
  };
};

/** Ingredient display names for a recipe (for grocery lists). */
export const recipeIngredientNames = (
  recipe: IRecipe,
  ingredientsById: Record<string, IIngredient>,
): string[] =>
  recipe.ingredients
    .map(({ ingredientId }) => ingredientsById[ingredientId]?.name)
    .filter((n): n is string => Boolean(n));
