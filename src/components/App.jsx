import React, { useEffect, useState } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const TOYS_URL = "http://localhost:3001/toys";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchToys() {
      try {
        const response = await fetch(TOYS_URL);
        if (!response.ok) {
          throw new Error(`Unable to load toys (${response.status})`);
        }
        const toys = await response.json();
        if (active) {
          setToys(toys);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      }
    }

    fetchToys();
    return () => {
      active = false;
    };
  }, []);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  async function handleAddToy(toyDetails) {
    setError("");
    try {
      const response = await fetch(TOYS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...toyDetails, likes: 0 }),
      });
      if (!response.ok) {
        throw new Error(`Unable to create toy (${response.status})`);
      }
      const newToy = await response.json();
      setToys((currentToys) => [
        ...currentToys,
        { ...newToy, likes: newToy.likes ?? 0 },
      ]);
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    }
  }

  async function handleDeleteToy(toyId) {
    setError("");
    try {
      const response = await fetch(`${TOYS_URL}/${toyId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Unable to donate toy (${response.status})`);
      }
      setToys((currentToys) =>
        currentToys.filter((toy) => toy.id !== toyId),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleLikeToy(toy) {
    setError("");
    try {
      const response = await fetch(`${TOYS_URL}/${toy.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: toy.likes + 1 }),
      });
      if (!response.ok) {
        throw new Error(`Unable to like toy (${response.status})`);
      }
      const updatedToy = await response.json();
      setToys((currentToys) =>
        currentToys.map((currentToy) =>
          currentToy.id === toy.id
            ? { ...currentToy, ...updatedToy }
            : currentToy,
        ),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      {error ? <p role="alert">{error}</p> : null}
      <ToyContainer
        toys={toys}
        onLikeToy={handleLikeToy}
        onDeleteToy={handleDeleteToy}
      />
    </>
  );
}

export default App;
