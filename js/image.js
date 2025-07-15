    // Mostrar nombre de archivo y vista previa de la imagen original
    document.getElementById("image-input").addEventListener("change", function(){
      const file = this.files[0];
      const fileName = file ? file.name : "";
      document.getElementById("file-name").textContent = fileName;
      
      if(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const originalImg = document.getElementById("original-image");
          originalImg.src = e.target.result;
          originalImg.style.display = "block";
          // Limpiar canvas y botón de descarga si existían datos previos
          document.getElementById("canvas").style.display = "none";
          document.getElementById("download-image").style.display = "none";
        }
        reader.readAsDataURL(file);
      }
    });
    
    // Función de conversión a escala de grises
    document.getElementById("convert-image").addEventListener("click", function() {
      const fileInput = document.getElementById("image-input");
      if (!fileInput.files || !fileInput.files[0]) {
        alert("Por favor, selecciona una imagen.");
        return;
      }
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
          // Configurar canvas con el tamaño de la imagen
          const canvas = document.getElementById("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          
          // Dibujar imagen original en el canvas
          ctx.drawImage(img, 0, 0);
          
          // Convertir a escala de grises
          let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          let data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const red   = data[i];
            const green = data[i+1];
            const blue  = data[i+2];
            const gray  = red * 0.3 + green * 0.59 + blue * 0.11;
            data[i]     = gray;
            data[i+1]   = gray;
            data[i+2]   = gray;
          }
          ctx.putImageData(imageData, 0, 0);
          
          // Mostrar el canvas con la imagen convertida
          canvas.style.display = "block";
          
          // Objeto que mapea las extensiones con su MIME type
          const mimeTypes = {

            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            webp: "image/webp",
            bmp: "image/bmp",
            png: "image/png",
            ico: "image/x-icon",
            svg: "image/svg+xml",
            tiff: "image/tiff"
          };
          
          const exportFormat = document.getElementById("export-format").value;
          const mimeType = mimeTypes[exportFormat] || "image/png";
          
          // Configurar el enlace de descarga
          const downloadLink = document.getElementById("download-image");
          downloadLink.href = canvas.toDataURL(mimeType);
          downloadLink.style.display = "inline-block";
          downloadLink.download = "converted." + exportFormat;
        }
        img.src = event.target.result;
      }
      reader.readAsDataURL(file);
    });