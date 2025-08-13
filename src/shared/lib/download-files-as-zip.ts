import JSZip from "jszip";
import {saveAs} from "file-saver";

export async function downloadFilesAsZip(urls: string[], zipFilename = "files.zip") {
  const zip = new JSZip();

  // Конвертируем base64 в Blob
  const base64ToBlob = (base64: string, contentType = "") => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([new Uint8Array(byteNumbers)], {type: contentType});
  };

  await Promise.all(
    urls.map(async (url, i) => {
      try {
        if (url.startsWith("data:")) {
          // base64
          const match = url.match(/^data:(.+);base64,(.*)$/);
          if (!match) throw new Error("Invalid base64 data URL");

          const contentType = match[1];
          const base64Data = match[2];
          const ext = contentType.split("/")[1] || "bin";

          const blob = base64ToBlob(base64Data, contentType);
          zip.file(`file${i + 1}.${ext}`, blob);
        } else {
          // Oбычный URL
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch ${url}`);

          const blob = await response.blob();
          const ext = blob.type.split("/")[1] || "bin";
          zip.file(`file${i + 1}.${ext}`, blob);
        }
      } catch (err) {
        console.error(err);
      }
    })
  );

  const content = await zip.generateAsync({type: "blob"});
  saveAs(content, zipFilename);
}
