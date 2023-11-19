import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ComicStrip from "./ComicStrip";
import "./ComicGenerator.css";

// Function to generate comic panels
async function generateComicPanels(texts) {
  try {
    const panelPromises = texts.map(async (text) => {
      const response = await fetch(
        "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
        {
          headers: {
            Accept: "image/png",
            Authorization:
              "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ inputs: text }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.blob();
      return result;
    });

    return await Promise.all(panelPromises);
  } catch (error) {
    console.error("Error generating comic panels:", error);
    throw error;
  }
}

const ComicGenerator = () => {
  const [panelTexts, setPanelTexts] = useState(Array(10).fill(""));
  const [comicPanels, setComicPanels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comicGenerated, setComicGenerated] = useState(false);

  const handleInputChange = (index, text) => {
    const newTexts = [...panelTexts];
    newTexts[index] = text;
    setPanelTexts(newTexts);
    setComicGenerated(false); // Reset comic generated state when input changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const generatedPanels = await generateComicPanels(panelTexts);
      setComicPanels(generatedPanels);
      setError("");
      setComicGenerated(true);
    } catch (error) {
      setError("Failed to generate comic panels.");
    } finally {
      setLoading(false);
    }
  };

  const isComicGenerated = comicGenerated && comicPanels.length > 0;

  return (
    <div className="comic-generator">
      <Header />
      <div className="container">
        <Sidebar
          panelTexts={panelTexts}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
        <ComicStrip
          comicPanels={comicPanels}
          loading={loading}
          error={error}
          comicGenerated={isComicGenerated}
        />
      </div>
    </div>
  );
};

export default ComicGenerator;
