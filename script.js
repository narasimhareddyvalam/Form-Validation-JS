document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input, select');
    const submitButton = document.querySelector('button[type="submit"]');
    const form = document.querySelector('form');
    

    submitButton.disabled = true;
    

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateField(input);
            toggleSubmitButton();
            submitButton.disabled = false;
            
        });
        input.addEventListener('change', () => {
            validateField(input);
            toggleSubmitButton();
            
        });
    });

    document.getElementById('jobApplyingFor').addEventListener('change', toggleCheckbox);
    document.getElementById('specialRequirement').addEventListener('change', toggleAdditionalInfo);

  
    form.addEventListener('submit', function(event) {
        if (!toggleSubmitButton()) {
            event.preventDefault();
        } else {
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                email: document.getElementById('email').value,
                address1: document.getElementById('address1').value,
                address2: document.getElementById('address2').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value,
                jobApplyingFor: document.getElementById('jobApplyingFor').value,
                additionalInfo: document.getElementById('additionalInfo').value,
                skills: Array.from(document.getElementById('skills').selectedOptions).map(option => option.value),
            };

            localStorage.setItem('formData', JSON.stringify(formData));
            window.location.href = 'table.html';
        }
    });
});


function toggleSubmitButton() {
    const inputs = document.querySelectorAll('input, select');
    const submitButton = document.querySelector('button[type="submit"]');

   
    const allValid = [...inputs].every(input => validateField(input));
    submitButton.enabled = !allValid; 

    return allValid; 
}

function toggleCheckbox() {
    const jobSelect = document.getElementById('jobApplyingFor');
    const specialRequirementsDiv = document.getElementById('specialRequirements');
    const checkboxLabel = document.getElementById('checkboxLabel');
    const checkboxInput = document.getElementById('specialRequirement');
    const additionalInfoDiv = document.getElementById('additionalInfoDiv');
    const additionalInfoInput = document.getElementById('additionalInfo');

    switch (jobSelect.value) {
        case 'Data Analyst':
            checkboxLabel.textContent = 'Do you have any certifications related to Data Analysis?';
            specialRequirementsDiv.style.display = 'block';
            checkboxInput.value = 'Data Analysis Skills';
            break;
        case 'UX Designer':
            checkboxLabel.textContent = 'Do you have any certifications related to  User Experience tools?';
            specialRequirementsDiv.style.display = 'block';
            checkboxInput.value = 'UX Tools Experience';
            break;
        case 'Software Engineer':
            checkboxLabel.textContent = 'Do you have any certifications related to Software Developement Tools?';
            specialRequirementsDiv.style.display = 'block';
            checkboxInput.value = 'Agile Methodologies';
            break;
        default:
            specialRequirementsDiv.style.display = 'none';
            checkboxInput.checked = false;
            additionalInfoDiv.style.display = 'none';
            additionalInfoInput.value = '';
            break;
    }

    validateField(checkboxInput); 
}

function toggleAdditionalInfo() {
    const checkboxInput = document.getElementById('specialRequirement');
    const additionalInfoDiv = document.getElementById('additionalInfoDiv');
    if (checkboxInput.checked) {
        additionalInfoDiv.style.display = 'block';
    } else {
        additionalInfoDiv.style.display = 'none';
        document.getElementById('additionalInfo').value = ''; 
    }
}

function validateField(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (input.id) {
        case 'firstName':
            const nameRegex = /^[a-zA-Z\s]+$/;
            if (value.length < 2 || value.length > 30 || !nameRegex.test(value)) {
                isValid = false;
                errorMessage = "Please enter a valid first name (letters and spaces only).";
                
            }
            break;
        case 'lastName':
            const lastnameRegex = /^[a-zA-Z\s]+$/;
            if (value.length < 2 || value.length > 30 || !lastnameRegex.test(value)) {
                isValid = false;
                errorMessage = "Please enter a valid last name (letters and spaces only).";
            }
            break;
        case 'phoneNumber':
            const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
            const validCharsRegex = /^[\d\s\(\)\-]+$/;
            if (!validCharsRegex.test(value)) {
                isValid = false;
                errorMessage = "Phone number can only contain digits, spaces, '(', ')', and '-'.";
            } else if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = "Must be in the format (123) 456-7890.";
            }
            break;
        case 'email':
            const emailRegex = /^[\w-.]+@northeastern\.edu$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = "Must end with @northeastern.edu.";
            }
            break;
        case 'address1':
            if (value.length < 5 || value.length > 100) {
                isValid = false;
                errorMessage = "Please enter a valid address.";
            }
            break;
        case 'city':
            const cityRegex = /^[a-zA-Z\s]+$/;
            if (value.length < 2 || value.length > 30 || !cityRegex.test(value)) {
                isValid = false;
                errorMessage = "Please enter a valid city name (letters and spaces only).";
            }
            break;
        case 'state':
            const stateRegex = /^[a-zA-Z\s]+$/;
            if (value.length < 2 || value.length > 50 || !stateRegex.test(value)) {
                isValid = false;
                errorMessage = "Please enter a valid state.";
            }
            break;
        case 'zip':
            const zipRegex = /^\d{5}$/;
            if (!zipRegex.test(value)) {
                isValid = false;
                errorMessage = "ZIP code must be exactly 5 digits and contain only numbers.";
            }
            break;
            case 'additionalInfo':
                const checkboxInput = document.getElementById('specialRequirement');
                if (checkboxInput.checked) { 
                    if (value.length < 5 || value.length > 200) {
                        isValid = false;
                        errorMessage = "Please name your certifications (between 5 and 200 characters).";
                    }
                }
                break;
        case 'skills':
            const selectedOptions = Array.from(input.selectedOptions);
            if (selectedOptions.length === 0) {
                isValid = false;
                errorMessage = "Please select at least one skill.";
            } else {
                const invalidSkill = selectedOptions.some(option => option.value === 'none');
                if (invalidSkill) {
                    isValid = false;
                    errorMessage = "The selected skill is not valid.";
                }
            }
            break;
    }

    
    const errorDisplay = document.getElementById(`${input.id}Error`);
    if (!isValid) {
        errorDisplay.textContent = errorMessage;
        errorDisplay.style.color = 'red';
        input.style.borderColor = 'red';
    } else {
        errorDisplay.textContent = '';
        input.style.borderColor = 'green';
    }

    return isValid; 
}

