// Ethnicity "Other" logic (only if present)
const ethnicityRadios = document.querySelectorAll('input[name="ethnicity"]');
const ethnicityOther = document.getElementById('ethnicityOther');
if (ethnicityRadios.length && ethnicityOther) {
  ethnicityRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === "Other") {
        ethnicityOther.disabled = false;
        ethnicityOther.required = true;
        ethnicityOther.focus();
      } else {
        ethnicityOther.disabled = true;
        ethnicityOther.required = false;
        ethnicityOther.value = "";
      }
    });
  });
}

// Drag-and-drop image upload logic (for left/right images if present)
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
      showPreview(input.files[0]);
    }
  });

  input.addEventListener('change', () => {
    if (input.files && input.files[0]) {
      showPreview(input.files[0]);
    }
  });

  function showPreview(file) {
    // Only preview if image, not DICOM
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

// Helper to read file as base64
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

document.getElementById('baselineForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  // Collect info fields for the info JSON object
  const info = {
    "Clinic/shop ID": document.getElementById('customerId').value.trim(),
    "Customer/Patient ID": document.getElementById('patientId').value.trim(),
    "Ethnicity": (() => {
      const selected = document.querySelector('input[name="ethnicity"]:checked');
      if (selected) {
        if (selected.value === "Other") {
          return document.getElementById('ethnicityOther').value.trim();
        }
        return selected.value;
      }
      return "";
    })(),
    "History of glaucoma": (() => {
      const selected = document.querySelector('input[name="glaucomaHistory"]:checked');
      return selected ? selected.value : "";
    })(),
    "Family history of glaucoma": (() => {
      const selected = document.querySelector('input[name="familyGlaucoma"]:checked');
      return selected ? selected.value : "";
    })(),
    "Diabetes": (() => {
      const selected = document.querySelector('input[name="diabetes"]:checked');
      return selected ? selected.value : "";
    })(),
    "Date of birth": document.getElementById('dob').value
  };

  // Collect fields for patient lookup
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const idCard = document.getElementById('idCard').value.trim();

  if (!phone && !email && !idCard) {
    alert('Please provide at least one of: phone number, email, or ID card number.');
    return false;
  }

  const leftInput = document.getElementById('leftInput');
  const rightInput = document.getElementById('rightInput');
  const leftFile = leftInput.files[0];
  const rightFile = rightInput.files[0];

  if (!leftFile && !rightFile) {
    alert('Please upload at least one image (left or right).');
    return false;
  }

  let image1 = null, image2 = null;
  if (leftFile) image1 = await fileToBase64(leftFile);
  if (rightFile) image2 = await fileToBase64(rightFile);

  // Prepare fields and values arrays
  const fields = [];
  const values = [];
  if (phone) { fields.push("Phone number"); values.push(phone); }
  if (email) { fields.push("Patient email"); values.push(email); }
  if (idCard) { fields.push("ID card number"); values.push(idCard); }

  // Build payload
  const payload = {
    action: "set_baseline",
    fields: fields,
    values: values,
    info: info
  };
  if (image1) payload.image1 = image1;
  if (image2) payload.image2 = image2;

  // Send to API
  const resultDiv = document.getElementById('result');
  resultDiv.style.color = "#333";
  resultDiv.textContent = "Submitting...";
  try {
    const response = await fetch("https://2mb20mukwf.execute-api.us-east-1.amazonaws.com/Prod/set_baseline/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (response.ok) {
      resultDiv.style.color = "green";
      resultDiv.textContent = data.message || "Success!";
    } else {
      resultDiv.style.color = "red";
      resultDiv.textContent = data.error || "Error submitting form.";
    }
  } catch (err) {
    resultDiv.style.color = "red";
    resultDiv.textContent = "Network or server error: " + err;
  }
});
