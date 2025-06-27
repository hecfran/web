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
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = 'block';
      placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
}

setupUpload('leftBox', 'leftInput', 'leftPreview', 'leftPlaceholder');
setupUpload('rightBox', 'rightInput', 'rightPreview', 'rightPlaceholder');

// Form validation: at least one of phone/email/idCard required
function setupFormValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', function(e) {
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const idCard = document.getElementById('idCard');

    const phoneVal = phone ? phone.value.trim() : '';
    const emailVal = email ? email.value.trim() : '';
    const idCardVal = idCard ? idCard.value.trim() : '';

    if (!phoneVal && !emailVal && !idCardVal) {
      alert('Please provide at least one of: phone number, email, or ID card number.');
      e.preventDefault();
      return false;
    }

    // Optionally, handle the form data here (e.g., send to server)
    // For now, just show a success message and prevent actual submission
    alert('Form submitted successfully!');
    e.preventDefault();
  });
}

// Support both forms
setupFormValidation('baselineForm');
setupFormValidation('ikeyForm');
