import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Accordion,
  Button,
  Form,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RecipeList = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    cuisine: [],
    mealType: [],
    tags: [],
  });
  const [availableFilters, setAvailableFilters] = useState({
    cuisine: [],
    mealType: [],
    tags: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:9999/recipes").then((response) => {
      const sortedData = response.data.sort((a, b) => b.rating - a.rating);
      setData(sortedData);

      const cuisineList = Array.from(new Set(response.data.map(r => r.cuisine)));
      const mealTypeList = Array.from(new Set(response.data.flatMap(r => r.mealType)));
      const tagList = Array.from(new Set(response.data.flatMap(r => r.tags)));

      setAvailableFilters({
        cuisine: cuisineList,
        mealType: mealTypeList,
        tags: tagList
      });
    });
  }, []);

  const updateFilter = (category, item) => {
    setFilterOptions((prevFilters) => {
      const selected = prevFilters[category];
      const updated = selected.includes(item)
        ? selected.filter(i => i !== item)
        : [...selected, item];

      return { ...prevFilters, [category]: updated };
    });
  };

  const results = data.filter((recipe) => {
    const matchName = recipe.name.toLowerCase().startsWith(searchTerm.toLowerCase());
    const cuisineValid = filterOptions.cuisine.length === 0 || filterOptions.cuisine.includes(recipe.cuisine);
    const mealTypeValid = filterOptions.mealType.length === 0 || (Array.isArray(recipe.mealType) && recipe.mealType.some(mt => filterOptions.mealType.includes(mt)));
    const tagValid = filterOptions.tags.length === 0 || (Array.isArray(recipe.tags) && recipe.tags.some(tag => filterOptions.tags.includes(tag)));

    return matchName && cuisineValid && mealTypeValid && tagValid;
  });

  return (
    <Container fluid className="p-4">
      <h2 className="text-center mb-4">RECIPES FORUM</h2>

      <Row className="mb-3 justify-content-center">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Enter Recipe Name to search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={() => navigate("/recipe/create")}>
            Create Recipe
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={2}>
          <h5>Tags</h5>
          {availableFilters.tags.map((tag) => (
            <Form.Check
              key={tag}
              label={tag}
              onChange={() => updateFilter("tags", tag)}
            />
          ))}
        </Col>

        <Col md={8}>
          <Accordion defaultActiveKey="0">
            {results.map((item, index) => (
              <Accordion.Item eventKey={index.toString()} key={item.id}>
                <Accordion.Header>
                  <strong>{item.name}</strong> - Rating: {item.rating}
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col md={9}>
                      <p><strong>Preparation Time Minutes:</strong> {item.prepTimeMinutes}</p>
                      <p><strong>Cook Time Minutes:</strong> {item.cookTimeMinutes}</p>
                      <p><strong>Difficulty:</strong> {item.difficulty}</p>
                      <p><strong>Cuisine:</strong> {item.cuisine}</p>
                      <p><strong>Meal Types:</strong> {Array.isArray(item.mealType) ? item.mealType.join("; ") : ""}</p>
                      <p><strong>Tags:</strong> {Array.isArray(item.tags) ? item.tags.join("; ") : ""}</p>
                      <p><strong>Ingredients:</strong></p>
                      <ul>
                        {Array.isArray(item.ingredients) && item.ingredients.map((ing, idx) => (
                          <li key={idx}>{ing}</li>
                        ))}
                      </ul>
                      <p><strong>Instructions:</strong></p>
                      <ul>
                        {Array.isArray(item.instructions) && item.instructions.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </Col>
                    <Col md={3}>
                      <img
                        src={`/images/${item.image}`}
                        alt={item.name}
                        className="img-fluid rounded"
                      />
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>

        <Col md={2}>
          <h5>Cuisine</h5>
          {availableFilters.cuisine.map((c) => (
            <Form.Check
              key={c}
              label={c}
              onChange={() => updateFilter("cuisine", c)}
            />
          ))}

          <h5 className="mt-4">Meal Type</h5>
          {availableFilters.mealType.map((m) => (
            <Form.Check
              key={m}
              label={m}
              onChange={() => updateFilter("mealType", m)}
            />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default RecipeList;
