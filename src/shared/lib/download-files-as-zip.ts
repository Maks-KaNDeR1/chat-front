import JSZip from "jszip";
import {saveAs} from "file-saver";

export async function downloadFilesAsZip(urls: string[], zipFilename = "files.zip") {
  const zip = new JSZip();

  await Promise.all(
    urls.map(async (url, i) => {
      try {
        // Если обычная (HTTP/HTTPS)
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Не удалось загрузить файл: ${url}`);

        const blob = await response.blob();
        const ext = blob.type.split("/")[1] || "bin";
        zip.file(`file${i + 1}.${ext}`, blob);
      } catch (err) {
        console.error("Ошибка при обработке файла:", err);
      }
    })
  );

  const content = await zip.generateAsync({type: "blob"});
  saveAs(content, zipFilename);
}
