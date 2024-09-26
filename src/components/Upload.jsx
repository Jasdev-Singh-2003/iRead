import { config } from 'dotenv';

// Load environment variables from .env file
config();

export async function uploadToGithub(fileContent, fileName, folderName) {
  const TOKEN = import.meta.env.VITE_GITHUB_TOKEN; // Access your GitHub token
  
  // Step 1: Create the folder by uploading a dummy README file
  const createFolderResponse = await fetch(`https://api.github.com/repos/Jasdev-Singh-2003/iRead-Data/contents/${folderName}/README.md`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Create folder ${folderName}`,
      content: btoa(''), // Empty content for the README file
      branch: 'main',
    })
  });

  if (!createFolderResponse.ok) {
    console.error('Failed to create folder:', createFolderResponse.statusText);
    return;
  }

  console.log('Folder created successfully.');

  // Step 2: Upload the actual file
  const GITHUB_API_URL = `https://api.github.com/repos/Jasdev-Singh-2003/iRead-Data/contents/${folderName}/${fileName}`;
  
  // Check if the file is an EPUB or image
  let base64Content;

  if (fileName.endsWith('.epub')) {
    // Convert the EPUB ArrayBuffer to a Base64 string
    base64Content = await getBase64(fileContent); // Expecting fileContent to be an ArrayBuffer
  } else {
    base64Content = await readFileAsDataURL(fileContent); // Use the same function to convert images to Base64
  }

  const uploadResponse = await fetch(GITHUB_API_URL, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Upload ${fileName}`,
      content: base64Content,
      branch: 'main',
    })
  });

  if (uploadResponse.ok) {
    console.log('File uploaded successfully.');
  } else {
    console.error('Failed to upload file:', uploadResponse.statusText);
  }
}

// Helper function to convert an ArrayBuffer to a Base64 string
function getBase64(buffer) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result.split(',')[1]; // Extract Base64 part
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(new Blob([buffer])); // Create Blob from ArrayBuffer and read as Data URL
  });
}
