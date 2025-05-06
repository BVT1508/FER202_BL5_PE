import React from "react";
import { Routes, Route } from "react-router-dom";
import RecipeList from "./components/RecipeList";
import CreateRecipe from "./components/CreateRecipe";

function App() {
  return (
    <Routes>
              <Route path="/recipe/create" element={<CreateRecipe />} />

      <Route path="/" element={<RecipeList />} />

    </Routes>
  );
}

export default App;
