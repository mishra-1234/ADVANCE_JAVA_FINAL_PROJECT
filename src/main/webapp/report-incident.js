/* ==========================================================================
   CyberShield — report-incident.js
   Vanilla JS only. Frontend validation only — no backend connection yet.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initSeverityIndicator();
    initCharCounters();
    initLiveClear();
    initFormSubmit();
    initClearForm();
    initSuccessOverlay();
    initCancelButton();
});

/* --------------------------------------------------------------------------
   Scroll reveal
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Dynamic severity indicator
   -------------------------------------------------------------------------- */
const SEVERITY_TEXT = {
    low: 'Low severity — minimal impact expected.',
    medium: 'Medium severity — moderate impact, review promptly.',
    high: 'High severity — significant impact, respond quickly.',
    critical: 'Critical severity — immediate response required.',
};

function initSeverityIndicator() {
    const select = document.getElementById('incidentSeverity');
    const indicator = document.getElementById('severityIndicator');
    const label = document.getElementById('severityLabel');
    if (!select || !indicator || !label) return;

    select.addEventListener('change', () => {
        const level = select.value;
        indicator.dataset.level = level;
        label.textContent = SEVERITY_TEXT[level] || 'Select a severity level to preview impact';
    });
}

/* --------------------------------------------------------------------------
   Character counters for Description and Evidence
   -------------------------------------------------------------------------- */
function initCharCounters() {
    setupCounter('incidentDescription', 'descriptionCounter', 1000);
    setupCounter('incidentEvidence', 'evidenceCounter', 800);
}

function setupCounter(textareaId, counterId, max) {
    const textarea = document.getElementById(textareaId);
    const counter = document.getElementById(counterId);
    if (!textarea || !counter) return;

    const update = () => {
        const length = textarea.value.length;
        counter.textContent = `${length} / ${max}`;
        counter.classList.remove('is-near-limit', 'is-at-limit');
        if (length >= max) counter.classList.add('is-at-limit');
        else if (length >= max * 0.9) counter.classList.add('is-near-limit');
    };

    textarea.addEventListener('input', update);
    update();
}

/* --------------------------------------------------------------------------
   Validation helpers
   -------------------------------------------------------------------------- */
function requiredText(value, message, minLength = 2) {
    const trimmed = value.trim();
    if (!trimmed) return message;
    if (trimmed.length < minLength) return `Please provide more detail (min. ${minLength} characters).`;
    return '';
}

function requiredSelect(value, message) {
    return value ? '' : message;
}

function requiredDate(value) {
    if (!value) return 'Please select the incident date.';
    const selected = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selected > today) return 'Incident date cannot be in the future.';
    return '';
}

function requiredTime(value) {
    return value ? '' : 'Please select the incident time.';
}

function requiredTextarea(value, message, minLength = 10) {
    const trimmed = value.trim();
    if (!trimmed) return message;
    if (trimmed.length < minLength) return `Please provide more detail (min. ${minLength} characters).`;
    return '';
}

function setFieldState(fieldEl, errorEl, errorMessage) {
    if (errorMessage) {
        fieldEl.classList.add('is-invalid');
        fieldEl.classList.remove('is-valid');
        if (errorEl) errorEl.textContent = errorMessage;
    } else {
        fieldEl.classList.remove('is-invalid');
        fieldEl.classList.add('is-valid');
        if (errorEl) errorEl.textContent = '';
    }
}

function clearFieldState(fieldEl, errorEl) {
    fieldEl.classList.remove('is-invalid');
    if (errorEl) errorEl.textContent = '';
}

/* --------------------------------------------------------------------------
   Live error clearing as the user interacts with each field
   -------------------------------------------------------------------------- */
function initLiveClear() {
    const map = [
        ['incidentTitle', 'titleField', 'incidentTitleError', 'input'],
        ['incidentCategory', 'categoryField', 'incidentCategoryError', 'change'],
        ['incidentSeverity', 'severityField', 'incidentSeverityError', 'change'],
        ['incidentDate', 'dateField', 'incidentDateError', 'input'],
        ['incidentTime', 'timeField', 'incidentTimeError', 'input'],
        ['affectedAsset', 'assetField', 'affectedAssetError', 'input'],
        ['incidentLocation', 'locationField', 'incidentLocationError', 'input'],
        ['incidentDescription', 'descriptionField', 'incidentDescriptionError', 'input'],
        ['contactInfo', 'contactField', 'contactInfoError', 'input'],
    ];

    map.forEach(([inputId, fieldId, errorId, eventName]) => {
        const input = document.getElementById(inputId);
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);
        if (!input || !field) return;
        input.addEventListener(eventName, () => clearFieldState(field, error));
    });
}

/* --------------------------------------------------------------------------
   Full form validation
   -------------------------------------------------------------------------- */
function validateForm() {
    let firstInvalidEl = null;
    let isValid = true;

    const checks = [
        {
            input: document.getElementById('incidentTitle'),
            field: document.getElementById('titleField'),
            error: document.getElementById('incidentTitleError'),
            validate: (v) => requiredText(v, 'Please enter an incident title.', 4),
        },
        {
            input: document.getElementById('incidentCategory'),
            field: document.getElementById('categoryField'),
            error: document.getElementById('incidentCategoryError'),
            validate: (v) => requiredSelect(v, 'Please select an incident category.'),
        },
        {
            input: document.getElementById('incidentSeverity'),
            field: document.getElementById('severityField'),
            error: document.getElementById('incidentSeverityError'),
            validate: (v) => requiredSelect(v, 'Please select a severity level.'),
        },
        {
            input: document.getElementById('incidentDate'),
            field: document.getElementById('dateField'),
            error: document.getElementById('incidentDateError'),
            validate: (v) => requiredDate(v),
        },
        {
            input: document.getElementById('incidentTime'),
            field: document.getElementById('timeField'),
            error: document.getElementById('incidentTimeError'),
            validate: (v) => requiredTime(v),
        },
        {
            input: document.getElementById('affectedAsset'),
            field: document.getElementById('assetField'),
            error: document.getElementById('affectedAssetError'),
            validate: (v) => requiredText(v, 'Please enter the affected system or asset.', 2),
        },
        {
            input: document.getElementById('incidentLocation'),
            field: document.getElementById('locationField'),
            error: document.getElementById('incidentLocationError'),
            validate: (v) => requiredText(v, 'Please enter a location.', 2),
        },
        {
            input: document.getElementById('incidentDescription'),
            field: document.getElementById('descriptionField'),
            error: document.getElementById('incidentDescriptionError'),
            validate: (v) => requiredTextarea(v, 'Please describe the incident.', 10),
        },
        {
            input: document.getElementById('contactInfo'),
            field: document.getElementById('contactField'),
            error: document.getElementById('contactInfoError'),
            validate: (v) => requiredText(v, 'Please enter your contact information.', 3),
        },
    ];

    checks.forEach(({ input, field, error, validate }) => {
        if (!input || !field) return;
        const message = validate(input.value);
        setFieldState(field, error, message);
        if (message) {
            isValid = false;
            if (!firstInvalidEl) firstInvalidEl = input;
        }
    });

    return { isValid, firstInvalidEl };
}

/* --------------------------------------------------------------------------
   Form submission — validate, show loading state, then success overlay
   -------------------------------------------------------------------------- */
function initFormSubmit() {
    const form = document.getElementById('incidentForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    if (!form || !submitBtn || !formMessage) return;

    const btnLabel = submitBtn.querySelector('.btn__label');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        try {
            const { isValid, firstInvalidEl } = validateForm();

            if (!isValid) {
                showFormMessage(formMessage, 'Please fix the highlighted fields before submitting.', 'error');
                if (firstInvalidEl) firstInvalidEl.focus();
                return;
            }

            showFormMessage(formMessage, '', null);
            submitIncident(form, submitBtn, btnLabel);
        } catch (error) {
            console.error('CyberShield: incident form submission failed unexpectedly.', error);
            showFormMessage(formMessage, 'Something went wrong. Please try again.', 'error');
        }
    });
}

function submitIncident(form, submitBtn, btnLabel) {
    // TODO (backend): replace this simulated delay with a real request, e.g.
    // fetch('report-incident', { method: 'POST', body: new FormData(form) })
    //   .then(handleServerResponse)
    //   .catch(handleServerError);
    form.classList.add('is-loading');
    submitBtn.disabled = true;
    const originalLabel = btnLabel.textContent;
    btnLabel.textContent = 'Submitting...';

    setTimeout(() => {
        form.classList.remove('is-loading');
        submitBtn.disabled = false;
        btnLabel.textContent = originalLabel;
        showSuccessOverlay();
    }, 1500);
}

/* --------------------------------------------------------------------------
   Clear form
   -------------------------------------------------------------------------- */
function initClearForm() {
    const clearBtn = document.getElementById('clearBtn');
    const form = document.getElementById('incidentForm');
    if (!clearBtn || !form) return;

    clearBtn.addEventListener('click', () => {
        const confirmed = window.confirm('Clear all entered information from this form?');
        if (!confirmed) return;
        resetIncidentForm();
        showToast('Form cleared.');
    });
}

function resetIncidentForm() {
    const form = document.getElementById('incidentForm');
    if (!form) return;

    form.reset();

    // Clear validation states
    document.querySelectorAll('.form-field').forEach((field) => {
        field.classList.remove('is-invalid', 'is-valid');
    });
    document.querySelectorAll('.field-error').forEach((error) => {
        error.textContent = '';
    });

    // Reset severity indicator
    const indicator = document.getElementById('severityIndicator');
    const severityLabel = document.getElementById('severityLabel');
    if (indicator) indicator.dataset.level = '';
    if (severityLabel) severityLabel.textContent = 'Select a severity level to preview impact';

    // Reset character counters
    const descCounter = document.getElementById('descriptionCounter');
    const evidenceCounter = document.getElementById('evidenceCounter');
    if (descCounter) { descCounter.textContent = '0 / 1000'; descCounter.classList.remove('is-near-limit', 'is-at-limit'); }
    if (evidenceCounter) { evidenceCounter.textContent = '0 / 800'; evidenceCounter.classList.remove('is-near-limit', 'is-at-limit'); }

    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.textContent = '';
        formMessage.classList.remove('is-visible', 'is-error');
    }
}

/* --------------------------------------------------------------------------
   Cancel button — confirm before leaving if the form has content
   -------------------------------------------------------------------------- */
function initCancelButton() {
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('incidentForm');
    if (!cancelBtn || !form) return;

    cancelBtn.addEventListener('click', (event) => {
        const hasContent = Array.from(form.elements).some((el) => {
            if (el.type === 'submit' || el.type === 'button') return false;
            return el.value && el.value.trim() !== '';
        });

        if (hasContent) {
            const confirmed = window.confirm('Discard this incident report and return to the dashboard?');
            if (!confirmed) {
                event.preventDefault();
            }
        }
        // If confirmed (or no content), the <a href="dashboard.html"> navigates normally.
    });
}

/* --------------------------------------------------------------------------
   Success overlay
   -------------------------------------------------------------------------- */
function initSuccessOverlay() {
    const reportAnotherBtn = document.getElementById('reportAnotherBtn');
    if (!reportAnotherBtn) return;

    reportAnotherBtn.addEventListener('click', () => {
        hideSuccessOverlay();
        resetIncidentForm();
        document.getElementById('incidentTitle')?.focus();
    });

    document.addEventListener('keydown', (event) => {
        const overlay = document.getElementById('successOverlay');
        if (event.key === 'Escape' && overlay && overlay.classList.contains('is-visible')) {
            hideSuccessOverlay();
        }
    });
}

function showSuccessOverlay() {
    const overlay = document.getElementById('successOverlay');
    if (!overlay) return;
    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
}

function hideSuccessOverlay() {
    const overlay = document.getElementById('successOverlay');
    if (!overlay) return;
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
}

/* --------------------------------------------------------------------------
   Shared UI helpers
   -------------------------------------------------------------------------- */
function showFormMessage(el, message, type) {
    el.textContent = message;
    el.classList.remove('is-error', 'is-visible');
    if (!message) return;
    el.classList.add('is-error', 'is-visible');
}

let toastTimeoutId = null;
function showToast(message) {
    try {
        const toastEl = document.getElementById('toast');
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.classList.add('is-visible');
        if (toastTimeoutId) clearTimeout(toastTimeoutId);
        toastTimeoutId = setTimeout(() => toastEl.classList.remove('is-visible'), 2600);
    } catch (error) {
        console.error('CyberShield: unable to display toast message.', error);
    }
}