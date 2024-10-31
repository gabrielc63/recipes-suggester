import React, { useState } from "react";
import { Plus, Loader2, ChefHat } from "lucide-react";

const RecipesSuggestions = () => {
  const [ingredients, setIngredients] = useState([""]);
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const getRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:5000/api/suggest-recipes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ingredients: ingredients.filter((i) => i.trim()),
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to fetch recipes");
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <ChefHat className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold">Recipes Suggestions</h1>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Ingredients</h2>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              placeholder="Enter ingredient"
              className="flex-1 p-2 border rounded"
            />
            {ingredients.length > 1 && (
              <button
                onClick={() => removeIngredient(index)}
                className="px-3 py-2 text-red-500 hover:bg-red-50 rounded"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addIngredient}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
        >
          <Plus className="w-4 h-4" /> Add Ingredient
        </button>

        <button
          onClick={getRecipes}
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Getting Suggestions...
            </>
          ) : (
            "Get Recipe Suggestions"
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-50 text-red-500 rounded-lg">{error}</div>
        )}

        {recipes && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Suggested Recipes</h2>
            {recipes.map((recipe, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <h3 className="text-lg font-semibold">{recipe.name}</h3>

                <div>
                  <h4 className="font-medium">Ingredients:</h4>
                  <ul className="list-disc list-inside">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className={ing.missing ? "text-red-500" : ""}>
                        {ing.item} {ing.missing && "(missing)"}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">Instructions:</h4>
                  <p>{recipe.instructions}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipesSuggestions;
