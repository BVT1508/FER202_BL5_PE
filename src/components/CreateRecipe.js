import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateRecipe() {
  const navigate = useNavigate();

  const [recipeInput, setRecipeInput] = useState({
    name: "",
    ingredients: "",
    instructions: "",
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    cuisine: "",
    difficulty: "",
    tags: "",
    mealTypes: "",
  });

  const [validationMessage, setValidationMessage] = useState("");

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeInput((prev) => ({ ...prev, [name]: value }));
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    if (!recipeInput.name.trim()) {
      setValidationMessage("Recipe Name is required");
      return;
    }

    const formattedRecipe = {
      ...recipeInput,
      ingredients: recipeInput.ingredients.split(";").map(item => item.trim()).filter(Boolean),
      instructions: recipeInput.instructions.split(";").map(step => step.trim()).filter(Boolean),
      tags: recipeInput.tags.split(";").map(tag => tag.trim()).filter(Boolean),
      mealTypes: recipeInput.mealTypes.split(";").map(type => type.trim()).filter(Boolean),
      prepTimeMinutes: Number(recipeInput.prepTimeMinutes),
      cookTimeMinutes: Number(recipeInput.cookTimeMinutes),
    };

    try {
      await axios.post("http://localhost:9999/recipes", formattedRecipe);
      alert("Recipe created successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("An error occurred while creating the recipe.");
    }
  };

  return (
    <div className="container mt-3">
      <h2>Create A New Recipe</h2>
      <form onSubmit={onFormSubmit}>
        <div className="form-group">
          <label>Recipe Name (*)</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={recipeInput.name}
            onChange={onInputChange}
          />
          {validationMessage && <small className="text-danger">{validationMessage}</small>}
        </div>

        <div className="form-group">
          <label>Ingredients</label>
          <input
            type="text"
            className="form-control"
            name="ingredients"
            placeholder="Separate ingredients with ;"
            value={recipeInput.ingredients}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group">
          <label>Instructions</label>
          <input
            type="text"
            className="form-control"
            name="instructions"
            placeholder="Separate instructions with ;"
            value={recipeInput.instructions}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group d-flex">
          <div className="me-2">
            <label>Preparation Time Minutes</label>
            <input
              type="number"
              className="form-control"
              name="prepTimeMinutes"
              value={recipeInput.prepTimeMinutes}
              onChange={onInputChange}
            />
          </div>
          <div>
            <label>Cook Time Minutes</label>
            <input
              type="number"
              className="form-control"
              name="cookTimeMinutes"
              value={recipeInput.cookTimeMinutes}
              onChange={onInputChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Cuisine</label>
          <input
            type="text"
            className="form-control"
            name="cuisine"
            value={recipeInput.cuisine}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group">
          <label>Difficulty</label>
          <input
            type="text"
            className="form-control"
            name="difficulty"
            value={recipeInput.difficulty}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group">
          <label>Tags</label>
          <input
            type="text"
            className="form-control"
            name="tags"
            placeholder="Separate tags with ;"
            value={recipeInput.tags}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group">
          <label>Meal Types</label>
          <input
            type="text"
            className="form-control"
            name="mealTypes"
            placeholder="Separate meal types with ;"
            value={recipeInput.mealTypes}
            onChange={onInputChange}
          />
        </div>

        <button type="submit" className="btn btn-primary mt-2">Save</button>
      </form>
    </div>
  );
}

export default CreateRecipe;
