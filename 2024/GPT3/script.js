// script.js
const fileInput = document.getElementById('file-input');
const dropArea = document.getElementById('drop-area');
const fileList = document.getElementById('file-list');
const uploadBtn = document.getElementById('upload-btn');
const apiUrl = 'https://api.openai.com/v1'; // Replace with the actual API endpoint
const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
let selectedFiles = [];

// Handle file input change
fileInput.addEventListener('change', handleFiles);

// Handle drag and drop events
dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    handleFiles(e);
});

// Handle click on drop area
dropArea.addEventListener('click', () => {
    fileInput.click();
});

uploadBtn.addEventListener('click', uploadFiles);

function handleFiles(event) {
    const files = event.target.files || event.dataTransfer.files;
    selectedFiles = Array.from(files);
    displaySelectedFiles(selectedFiles);
}

function displaySelectedFiles(files) {
    fileList.innerHTML = ''; // Clear the current list
    const ul = document.createElement('ul');
    files.forEach(file => {
        const li = document.createElement('li');
        li.textContent = file.name;
        ul.appendChild(li);
    });
    fileList.appendChild(ul);
}

async function uploadFiles() {
    try {
        // Create a vector store
        const vectorStoreResponse = await fetch(`${apiUrl}/vector_stores`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: 'Financial Statements' })
        });
        const vectorStore = await vectorStoreResponse.json();

        // Upload files and add them to the vector store
        const fileStreams = await Promise.all(selectedFiles.map(file => fileToBase64(file)));
        const fileBatchResponse = await fetch(`${apiUrl}/vector_stores/${vectorStore.id}/file_batches`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: fileStreams.map((content, index) => ({
                    content,
                    name: selectedFiles[index].name
                }))
            })
        });
        const fileBatch = await fileBatchResponse.json();

        // Poll for file batch status
        await pollFileBatchStatus(vectorStore.id, fileBatch.id);

        alert('Files uploaded and processed successfully.');
    } catch (error) {
        console.error('Error uploading files:', error);
        alert('Failed to upload files.');
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

async function pollFileBatchStatus(vectorStoreId, fileBatchId) {
    let isCompleted = false;
    while (!isCompleted) {
        const response = await fetch(`${apiUrl}/vector_stores/${vectorStoreId}/file_batches/${fileBatchId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const fileBatch = await response.json();
        if (fileBatch.status === 'completed') {
            isCompleted = true;
        } else {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before polling again
        }
    }
}
