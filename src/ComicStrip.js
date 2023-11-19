import React from "react";
import "./ComicStrip.css";
import CircularProgress from "@mui/material/CircularProgress";

const ComicStrip = ({ comicPanels, loading, error, comicGenerated }) => {
  const handleDownload = async () => {
    try {
      const imagesPerRow = 5;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const loadedImages = await Promise.all(
        comicPanels.map(async (imageSrc) => {
          const img = new Image();
          img.src = URL.createObjectURL(imageSrc);
          await new Promise((resolve) => {
            img.onload = resolve;
          });
          return img;
        })
      );

      const totalRows = Math.ceil(loadedImages.length / imagesPerRow);
      const canvasHeight = totalRows * 300;
      canvas.width = imagesPerRow * 320;
      canvas.height = canvasHeight;

      loadedImages.forEach((img, index) => {
        const rowIndex = Math.floor(index / imagesPerRow);
        const colIndex = index % imagesPerRow;
        ctx.drawImage(img, colIndex * 320, rowIndex * 300, 320, 300);
      });

      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "comic_grid.png";
      link.click();
    } catch (error) {
      console.error("Error generating comic strip:", error);
    }
  };

  return (
    <div className={`comic-strip ${loading || error ? "buffering" : ""}`}>
      {loading && (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
      <div className="comic-panels">
        {comicPanels.map((panel, index) => (
          <div key={index} className="comic-panel">
            <img src={URL.createObjectURL(panel)} alt={`Panel ${index + 1}`} />
            {/* <img
              src="https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630"
              alt={`Panel ${index + 1}`}
            /> */}
          </div>
        ))}
      </div>
      {comicGenerated && (
        <div className="download-comic-button">
          <button onClick={handleDownload} disabled={loading}>
            Download
          </button>
        </div>
      )}
    </div>
  );
};

export default ComicStrip;
