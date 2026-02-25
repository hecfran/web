// Setup drag-and-drop upload for each image box
function setupUpload(boxId, inputId, previewId, placeholderId) {
  const box = document.getElementById(boxId);
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const placeholder = document.getElementById(placeholderId);

  if (!box || !input || !preview || !placeholder) return;

  box.addEventListener('click', () => input.click());

  box.addEventListener('dragover', (e) => {
    e.preventDefault();
    box.classList.add('dragover');
  });

  box.addEventListener('dragleave', () => box.classList.remove('dragover'));

  box.addEventListener('drop', (e) => {
    e.preventDefault();
    box.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      input.files = e.dataTransfer.files;
      showPreview(e.dataTransfer.files[0]);
    }
  });

  input.addEventListener('change', () => {
    if (input.files && input.files[0]) {
      showPreview(input.files[0]);
    }
  });

  function showPreview(file) {
    // Only preview if it's an image (for DICOM files, show placeholder text)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    } else {
      preview.style.display = 'none';
      placeholder.textContent = "DICOM file selected";
      placeholder.style.display = 'block';
    }
  }
}

setupUpload('leftBox', 'leftInput', 'leftPreview', 'leftPlaceholder');
setupUpload('rightBox', 'rightInput', 'rightPreview', 'rightPlaceholder');

// Helper function to convert a file to Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Remove the data:*/*;base64, part
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Listen for form submission
document.getElementById('compareForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  // Collect required and lookup fields
  const clinicId = document.getElementById('customerId').value.trim();
  const patientIdInput = document.getElementById('patientId').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const idCard = document.getElementById('idCard').value.trim();

  if (!clinicId) {
    alert('Clinic/shop ID is required.');
    return false;
  }
  if (!patientIdInput && !phone && !email && !idCard) {
    alert('Please provide at least one of: Customer/Patient ID, Phone number, Patient email, or ID card number.');
    return false;
  }

  // Get image files from the drag-and-drop elements
  const leftInput = document.getElementById('leftInput');
  const rightInput = document.getElementById('rightInput');
  const leftFile = leftInput.files[0];
  const rightFile = rightInput.files[0];

  if (!leftFile && !rightFile) {
    alert('Please upload at least one image (left or right).');
    return false;
  }

  // Update the UI to inform the user that processing is underway
  const resultDiv = document.getElementById('result');
  resultDiv.style.color = "#333";
  resultDiv.textContent = "Images are being processed. This can take up to two minutes please be patient.";

  // Convert uploaded files into Base64 strings.
  // If only one image is provided, the same image is used for both image fields.
  let image1, image2;
  try {
    if (leftFile && rightFile) {
      image1 = await fileToBase64(leftFile);
      image2 = await fileToBase64(rightFile);
    } else if (leftFile && !rightFile) {
      image1 = await fileToBase64(leftFile);
      image2 = image1;
    } else if (rightFile && !leftFile) {
      image2 = await fileToBase64(rightFile);
      image1 = image2;
    }
  } catch (err) {
    resultDiv.style.color = "red";
    resultDiv.textContent = "Error processing image files: " + err;
    return;
  }

  // Build the fields and values arrays for patient lookup
  const fields = [];
  const values = [];
  if (phone) {
    fields.push("Phone number");
    values.push(phone);
  }
  if (email) {
    fields.push("Patient email");
    values.push(email);
  }
  if (idCard) {
    fields.push("ID card number");
    values.push(idCard);
  }
  if (patientIdInput) {
    fields.push("Customer/Patient ID");
    values.push(patientIdInput);
  }

  // Build the payload. The API expects the action "compare_images".
  const payload = {
    action: "compare_images",
    fields: fields,
    values: values,
    info: { "Clinic/shop ID": clinicId },
    image1: image1,
    image2: image2
  };

  // Disable form inputs during submission
  const formElements = document.querySelectorAll('#compareForm :input');
  formElements.forEach(el => el.disabled = true);

  try {
    // Replace the URL below with your actual compare endpoint.
    const response = await fetch("https://2mb20mukwf.execute-api.us-east-1.amazonaws.com/Prod/compare_images/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (response.ok) {
      resultDiv.style.color = "green";
      resultDiv.textContent = data.message || "Comparison completed successfully.";
    } else {
      resultDiv.style.color = "red";
      resultDiv.textContent = data.error || "Error during comparison.";
    }
  } catch (err) {
    resultDiv.style.color = "red";
    resultDiv.textContent = "Network or server error: " + err;
  } finally {
    // Re-enable form inputs after submission
    formElements.forEach(el => el.disabled = false);
  }
});
