import React, { useState, useEffect } from 'react';
import './App.css';

const App: React.FC = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the list of breeds
  const fetchBreeds = async () => {
    try {
      const response = await fetch('https://dog.ceo/api/breeds/list/all');
      const data = await response.json();
      setBreeds(Object.keys(data.message));
    } catch (error) {
      console.error('Error fetching breeds:', error);
    }
  };

  // Fetch images for the selected breed
  const fetchBreedImages = async (breed: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random/6`);
      const data = await response.json();
      setImages(data.message);
    } catch (error) {
      console.error('Error fetching breed images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle breed selection
  const handleBreedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const breed = event.target.value;
    setSelectedBreed(breed);
    if (breed) {
      fetchBreedImages(breed);
    } else {
      setImages([]);
    }
  };

  // Initial fetch of breeds
  useEffect(() => {
    fetchBreeds();
  }, []);

  return (
    <div className="app">
      <h1 className="title">Dog Breed Explorer</h1>

      <div className="breed-selector">
        <label htmlFor="breed">Choose a breed:</label>
        <select id="breed" value={selectedBreed} onChange={handleBreedChange}>
          <option value="">-- Select a breed --</option>
          {breeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed.charAt(0).toUpperCase() + breed.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading images...</p>
      ) : images.length > 0 ? (
        <div className="images-grid">
          {images.map((image, index) => (
            <img key={index} src={image} alt={`Dog ${index + 1}`} className="dog-image" />
          ))}
        </div>
      ) : (
        <p>Select a breed to view images.</p>
      )}

      {selectedBreed && !loading && (
        <button onClick={() => fetchBreedImages(selectedBreed)} className="refresh-button">
          Refresh Images
        </button>
      )}
      <footer className='footer'>
        <p>By Dayvison; The Dog API; Sistemas Distribuidos</p>
      </footer>
    </div>
  );
};

export default App;
