// Global variables
let selectedAmount = 0;
let selectedDescription = "";
let selectedFrequency = "monthly";
let selectedDuration = 1;
let selectedCountry = "";

// Country URLs mapping
const countryURLs = {
    'usa': 'https://www.zeffy.com/en-US/donation-form/bb809edf-3a48-4fec-931b-18fcbee7da40',
    'australia': 'https://myriadau.fcsuite.com/erp/donate/create/fund?funit_id=1128',
    'uk': 'https://donate.justgiving.com/charity/eff-iitkanpur/donation-amount',
    'canada': 'https://www.canadahelps.org/en/charities/myriad-canada/campaign/h502-support-education-research-and-access-to-healthcare-with-the-iit-kanpur/#create-a-campaign',
    'germany': 'https://donate.transnationalgiving.eu/germany/IITKanpur',
    'belgium': 'https://donate.kbs-frb.be/actions/EFF-IITKanpurUniversity'
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
    // Set default donation option
    const defaultOption = document.querySelector(".donation-option");
    if (defaultOption) {
        defaultOption.click();
    }

    // Initialize year dropdown options
    const yogOptions = document.getElementById("yog-options");
    for (let y = 1965; y <= 2025; y++) {
        let opt = document.createElement("div");
        opt.className = "option";
        opt.textContent = y;
        opt.setAttribute("data-value", y);
        yogOptions.appendChild(opt);
    }

    // Initialize custom dropdowns
    initializeDropdowns();

    // Add event listeners for PAN number field
    const panInput = document.getElementById("panInput");
    const panNote = document.getElementById("panNote");

    panInput.addEventListener("focus", function () {
        panNote.style.display = "block";
    });

    panInput.addEventListener("blur", function () {
        // Hide the note after a short delay to allow clicking on it
        setTimeout(function () {
            panNote.style.display = "none";
        }, 200);
    });

    // Prevent the note from hiding when clicking on it
    panNote.addEventListener("mousedown", function (e) {
        e.preventDefault();
    });

    // Add event listener to Next button
    document.getElementById("nextButton").addEventListener("click", handleNextButtonClick);

    // Add event listeners for Donate Now buttons
    document.getElementById("desktopDonateBtn").addEventListener("click", scrollToForm);
    document.getElementById("mobileDonateBtn").addEventListener("click", scrollToForm);

    // Add scroll event listener to handle button visibility
    window.addEventListener("scroll", handleScroll);
    
    // Initialize testimonial slider
    initializeTestimonialSlider();
    
    // Initialize FAQ functionality
    initializeFAQ();
});

// Handle scroll to show/hide donate buttons
function handleScroll() {
    const formSection = document.querySelector(".form-section");
    const formSectionRect = formSection.getBoundingClientRect();
    const desktopDonateBtn = document.getElementById("desktopDonateBtn");
    const mobileDonateBtn = document.getElementById("mobileDonateBtn");

    // For desktop (width > 768px)
    if (window.innerWidth > 768) {
        // Show desktop button when scrolled past 100px
        if (window.scrollY > 100) {
            desktopDonateBtn.style.display = "block";
        } else {
            desktopDonateBtn.style.display = "none";
        }
        // Hide mobile button on desktop
        mobileDonateBtn.style.display = "none";
    }
    // For mobile (width <= 768px)
    else {
        // Hide desktop button on mobile
        desktopDonateBtn.style.display = "none";

        // Show mobile button when form section is below viewport
        if (formSectionRect.bottom < 0) {
            mobileDonateBtn.style.display = "block";
        } else {
            mobileDonateBtn.style.display = "none";
        }
    }
}

// Scroll to form section when Donate Now button is clicked
function scrollToForm() {
    document.querySelector(".form-section").scrollIntoView({
        behavior: "smooth"
    });
}

// Initialize all custom dropdowns
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const selected = dropdown.querySelector('.dropdown-selected');
        const optionsBox = dropdown.querySelector('.dropdown-options');
        const allOptions = dropdown.querySelectorAll('.option');

        selected.addEventListener('click', () => {
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-options').forEach(box => {
                if (box !== optionsBox) {
                    box.style.display = 'none';
                    box.parentElement.querySelector('.dropdown-selected').classList.remove('active');
                }
            });

            // Toggle current dropdown
            const isOpen = optionsBox.style.display === 'block';
            optionsBox.style.display = isOpen ? 'none' : 'block';
            selected.classList.toggle('active');
        });

        allOptions.forEach(option => {
            option.addEventListener('click', () => {
                selected.textContent = option.textContent;
                selected.classList.remove('active');
                optionsBox.style.display = 'none';

                // Store data value for form submission
                selected.setAttribute('data-value', option.getAttribute('data-value'));

                // Special handling for affiliation dropdown
                if (dropdown.classList.contains('affiliation-dropdown')) {
                    toggleAlumniFields();
                }

                // Store selected country
                if (dropdown.classList.contains('country-dropdown')) {
                    selectedCountry = option.getAttribute('data-value');
                }
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-options').forEach(box => {
                box.style.display = 'none';
                box.parentElement.querySelector('.dropdown-selected').classList.remove('active');
            });
        }
    });
}

// Handle Next button click based on country selection
function handleNextButtonClick() {
    // Validate donation amount
    if (selectedAmount === 0) {
        alert("Please select a donation amount to continue.");
        return;
    }

    // Get country value from custom dropdown
    const countryDropdown = document.querySelector('.country-dropdown .dropdown-selected');
    const selectedCountryValue = countryDropdown.getAttribute('data-value') || countryDropdown.textContent;

    // Check if country is selected
    if (!selectedCountryValue || selectedCountryValue === "Choose Country") {
        alert("Please select a country to continue.");
        return;
    }

    // Handle based on country
    if (selectedCountryValue === "india") {
        // For India, proceed to step 2
        switchTab(2);
    } else {
        // For other countries, redirect to specific URL without alert
        const redirectURL = countryURLs[selectedCountryValue];
        if (redirectURL) {
            // Direct redirect without confirmation message
            window.location.href = redirectURL;
        } else {
            alert("No donation page available for the selected country.");
        }
    }
}

/* ----------------------------
   TAB NAVIGATION
------------------------------ */
function switchTab(step) {
    // Update tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-step') == step) tab.classList.add('active');
    });

    // Update form steps
    document.querySelectorAll('.form-step').forEach(fs => fs.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');

    // Scroll to form on mobile
    if (window.innerWidth <= 1024) {
        document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });
    }
}

// Add click event to tabs
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener("click", function () {
        const step = this.getAttribute("data-step");
        if (step == 2 && selectedAmount === 0) {
            alert("Please select a donation amount first.");
            return;
        }
        switchTab(step);
    });
});

/* ----------------------------
   DONATION AMOUNT SELECTION
------------------------------ */
document.querySelectorAll(".donation-option").forEach(option => {
    option.addEventListener("click", function () {
        // Remove selection from all options
        document.querySelectorAll(".donation-option").forEach(opt => opt.classList.remove("selected"));
        // Add selection to clicked option
        this.classList.add("selected");

        const customAmountContainer = document.getElementById("customAmountContainer");

        if (this.id === "other-option") {
            // Show custom amount input
            customAmountContainer.classList.add("active");
            document.getElementById("customAmountInput").focus();
        } else {
            // Hide custom amount input
            customAmountContainer.classList.remove("active");
            selectedAmount = Number(this.getAttribute("data-amount"));
            selectedDescription = this.getAttribute("data-description");
        }

        updateImpactDisplay();
    });
});

/* ----------------------------
   CUSTOM AMOUNT
------------------------------ */
document.getElementById("customAmountInput").addEventListener("input", function () {
    if (document.getElementById("other-option").classList.contains("selected")) {
        selectedAmount = Number(this.value);
        selectedDescription = "Your custom amount will support student needs based on urgency";
        updateImpactDisplay();
    }
});

/* ----------------------------
   FREQUENCY AND DURATION
------------------------------ */
function updateFrequency(frequency) {
    selectedFrequency = frequency;
    updateImpactDisplay();
}

function updateDuration(duration) {
    selectedDuration = Number(duration);
    updateImpactDisplay();
}

/* ----------------------------
   IMPACT DISPLAY
------------------------------ */
function updateImpactDisplay() {
    const impactAmount = document.getElementById("impact-amount");
    const impactDescription = document.getElementById("impact-description");
    const impactDetails = document.getElementById("impact-details");

    if (selectedAmount > 0) {
        const frequencyText = selectedFrequency === "monthly" ? "monthly" : "quarterly";
        const durationText = selectedDuration === 1 ? "1 year" : `${selectedDuration} years`;

        const paymentsPerYear = selectedFrequency === "monthly" ? 12 : 4;
        const totalPayments = paymentsPerYear * selectedDuration;
        const totalAmount = selectedAmount * totalPayments;

        impactAmount.textContent = `₹${selectedAmount.toLocaleString()} ${frequencyText}`;
        impactDescription.textContent = selectedDescription;
        impactDetails.textContent = `Your ${durationText} commitment totals ₹${totalAmount.toLocaleString()}`;
    } else {
        impactAmount.textContent = "Select an amount";
        impactDescription.textContent = "to see how your donation helps";
        impactDetails.textContent = "";
    }
}

/* ----------------------------
   ALUMNI FIELDS TOGGLE
------------------------------ */
function toggleAlumniFields() {
    const affiliationDropdown = document.querySelector('.affiliation-dropdown .dropdown-selected');
    const alumniFields = document.getElementById("alumniFields");

    if (affiliationDropdown.textContent === "Alumni") {
        alumniFields.classList.add("active");
    } else {
        alumniFields.classList.remove("active");
    }
}

/* ----------------------------
   FORM SUBMISSION
------------------------------ */
document.getElementById("donationForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Basic validation
    if (selectedAmount === 0) {
        alert("Please select a donation amount.");
        switchTab(1);
        return;
    }

    // Get form data
    const formData = new FormData(this);
    formData.append("amount", selectedAmount);
    formData.append("frequency", selectedFrequency);
    formData.append("duration", selectedDuration);
    formData.append("purpose", "MAGIK");

    // Get values from custom dropdowns
    const affiliationDropdown = document.querySelector('.affiliation-dropdown .dropdown-selected');
    if (affiliationDropdown.textContent !== "Affiliation *") {
        formData.append("affiliation", affiliationDropdown.getAttribute('data-value') || affiliationDropdown.textContent);
    }

    const programDropdown = document.querySelector('.program-dropdown .dropdown-selected');
    if (programDropdown.textContent !== "Select Program *") {
        formData.append("program", programDropdown.getAttribute('data-value') || programDropdown.textContent);
    }

    const yogDropdown = document.querySelector('.yog-dropdown .dropdown-selected');
    if (yogDropdown.textContent !== "Year of Graduation *") {
        formData.append("YOG", yogDropdown.getAttribute('data-value') || yogDropdown.textContent);
    }

    // Get country value from custom dropdown
    const countryDropdown = document.querySelector('.country-dropdown .dropdown-selected');
    if (countryDropdown.textContent !== "Choose Country") {
        formData.append("country", countryDropdown.getAttribute('data-value') || countryDropdown.textContent);
    }

    console.log("Form Submitted:", Object.fromEntries(formData));

    // Show success message
    alert("Thank you for your donation! Redirecting to payment gateway...");

    // Here you would typically redirect to payment gateway
    // window.location.href = "payment-gateway-url";
});

/* ----------------------------
   MOBILE MENU TOGGLE
------------------------------ */
function toggleMenu() {
    const nav = document.getElementById("navLinks");
    nav.classList.toggle("active");
}

/* ----------------------------
   TESTIMONIAL SLIDER
------------------------------ */
let currentSlide = 0;

function initializeTestimonialSlider() {
    const slides = document.querySelector('.slides');
    const totalSlides = document.querySelectorAll('.slide').length;
    
    // Set initial position
    updateSlidePosition();
}

function moveSlide(direction) {
    const slides = document.querySelector('.slides');
    const totalSlides = document.querySelectorAll('.slide').length;
    
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateSlidePosition();
}

function updateSlidePosition() {
    const slides = document.querySelector('.slides');
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;
}

/* ----------------------------
   FAQ FUNCTIONALITY
------------------------------ */
function initializeFAQ() {
    document.querySelectorAll(".faq-item").forEach(item => {
        item.addEventListener("click", () => {
            item.classList.toggle("active");
        });
    });
}