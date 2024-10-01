document.getElementById("submit").addEventListener("click", function () {
  const fileInput = document.getElementById("file-Adding");
  const widthInput = document.getElementById("width");
  const heightInput = document.getElementById("height");
  const compressInput = document.getElementById("compress");

  const file = fileInput.files[0];
  if (!file) {
    alert("Please select an image file.");
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = function (event) {
    const img = new Image();
    img.src = event.target.result;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // If user provides dimensions, use them; otherwise, use original dimensions
      const newWidth = widthInput.value
        ? parseInt(widthInput.value)
        : img.width;
      const newHeight = heightInput.value
        ? parseInt(heightInput.value)
        : img.height;
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // If compression size is provided, compress the image
      if (compressInput.value) {
        let quality = 1.0;
        const targetSizeKb = parseFloat(compressInput.value);

        // Try compressing until the size is within the target range
        canvas.toBlob(
          function compressBlob(blob) {
            const compressedSizeKb = blob.size / 1024; // Convert bytes to Kb

            if (compressedSizeKb > targetSizeKb && quality > 0.1) {
              quality -= 0.1;
              canvas.toBlob(compressBlob, "image/jpeg", quality);
            } else {
              const compressedURL = URL.createObjectURL(blob);

              // Example: Download the compressed image
              const a = document.createElement("a");
              a.href = compressedURL;
              a.download = "compressed_image.jpg";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
          },
          "image/jpeg",
          quality
        );
      } else {
        // If no compression size is provided, just download the resized image
        canvas.toBlob(function (blob) {
          const compressedURL = URL.createObjectURL(blob);

          // Example: Download the resized image
          const a = document.createElement("a");
          a.href = compressedURL;
          a.download = "resized_image.jpg";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }, "image/jpeg");
      }
    };
  };

  reader.onerror = function () {
    alert("Failed to read the file!");
  };
});
