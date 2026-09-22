<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>


    <meta name="description" content="Report a cybersecurity incident to the CyberShield security team.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="report-incident.css">
</head>
<body>


<header class="topbar">
    <div class="topbar__left">
        <a href="dashboard.html" class="brand">
      <span class="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" width="30" height="30" fill="none">
          <path d="M20 3 L34 8.5V19C34 27.5 28 33.8 20 37C12 33.8 6 27.5 6 19V8.5L20 3Z" fill="url(#shieldGrad)"/>
          <path d="M14.5 20L18 23.5L26 15.5" stroke="#f8fafc" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          <defs>
            <linearGradient id="shieldGrad" x1="6" y1="3" x2="34" y2="37" gradientUnits="userSpaceOnUse">
              <stop stop-color="#2563eb"/><stop offset="1" stop-color="#1e293b"/>
            </linearGradient>
          </defs>
        </svg>
      </span>
            <span class="brand__text">Cyber<strong>Shield</strong></span>
        </a>
        <span class="topbar__divider" aria-hidden="true"></span>
        <h1 class="topbar__title">Report Security Incident</h1>
    </div>

    <div class="topbar__right">
        <button type="button" class="icon-btn" aria-label="Notifications">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.7 21a2 2 0 01-3.4 0" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
            <span class="icon-btn__dot">2</span>
        </button>

        <div class="profile-chip">
            <span class="avatar" aria-hidden="true">AS</span>
            <span class="profile-chip__text">
        <span class="profile-chip__name">Aditya Sharma</span>
        <span class="profile-chip__role">Security Analyst</span>
      </span>
        </div>

        <a href="dashboard.html" class="btn btn--outline btn--sm" id="backToDashboardBtn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>Back to Dashboard</span>
        </a>
    </div>
</header>

<!-- ============ MAIN ============ -->
<main class="page">
    <div class="page__inner">

        <!-- Web/network motif backdrop (original pattern, not licensed IP) -->
        <svg class="web-backdrop" viewBox="0 0 900 300" aria-hidden="true" focusable="false">
            <g class="web-lines" stroke="#3b82f6" stroke-width="1" fill="none">
                <path d="M450 10 L450 290"/>
                <path d="M60 150 L840 150"/>
                <path d="M140 30 L760 270"/>
                <path d="M760 30 L140 270"/>
                <circle cx="450" cy="150" r="50"/>
                <circle cx="450" cy="150" r="100"/>
                <circle cx="450" cy="150" r="150"/>
            </g>
        </svg>

        <div class="page__heading reveal">
            <p class="eyebrow">// INCIDENT INTAKE</p>
            <h2>Report a Security Incident</h2>
            <p class="page__subtitle">Provide accurate details about the incident to help your security team investigate and respond quickly.</p>
        </div>

        <div class="layout">

            <!-- ============ FORM CARD ============ -->
            <section class="card form-card reveal" aria-label="Incident report form">
                <form id="incidentForm" novalidate>

                    <!-- Incident Title -->
                    <div class="form-field form-field--full" id="titleField">
                        <label for="incidentTitle">Incident Title <span class="required" aria-hidden="true">*</span></label>
                        <div class="input-wrap">
              <span class="input-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
              </span>
                            <input type="text" id="incidentTitle" name="incidentTitle" placeholder="Enter incident title" required aria-required="true">
                        </div>
                        <p class="field-error" id="incidentTitleError" role="alert"></p>
                    </div>

                    <div class="form-row">
                        <!-- Category -->
                        <div class="form-field" id="categoryField">
                            <label for="incidentCategory">Incident Category <span class="required" aria-hidden="true">*</span></label>
                            <div class="input-wrap input-wrap--select">
                <span class="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><rect x="3.5" y="4" width="17" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M3.5 9.5h17" stroke="currentColor" stroke-width="1.6"/></svg>
                </span>
                                <select id="incidentCategory" name="incidentCategory" required aria-required="true">
                                    <option value="" disabled selected>Select category</option>
                                    <option value="phishing">Phishing</option>
                                    <option value="malware">Malware</option>
                                    <option value="ransomware">Ransomware</option>
                                    <option value="unauthorized-access">Unauthorized Access</option>
                                    <option value="data-breach">Data Breach</option>
                                    <option value="insider-threat">Insider Threat</option>
                                    <option value="suspicious-activity">Suspicious Activity</option>
                                    <option value="other">Other</option>
                                </select>
                                <span class="select-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                            </div>
                            <p class="field-error" id="incidentCategoryError" role="alert"></p>
                        </div>

                        <!-- Severity -->
                        <div class="form-field" id="severityField">
                            <label for="incidentSeverity">Severity <span class="required" aria-hidden="true">*</span></label>
                            <div class="input-wrap input-wrap--select">
                <span class="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M12 3l9 16H3l9-16z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
                </span>
                                <select id="incidentSeverity" name="incidentSeverity" required aria-required="true">
                                    <option value="" disabled selected>Select severity</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                                <span class="select-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                            </div>
                            <p class="field-error" id="incidentSeverityError" role="alert"></p>
                        </div>
                    </div>

                    <!-- Severity visual indicator -->
                    <div class="severity-indicator" id="severityIndicator" data-level="">
                        <div class="severity-indicator__track">
                            <span class="severity-indicator__fill" id="severityFill"></span>
                        </div>
                        <span class="severity-indicator__label" id="severityLabel">Select a severity level to preview impact</span>
                    </div>

                    <div class="form-row">
                        <!-- Date -->
                        <div class="form-field" id="dateField">
                            <label for="incidentDate">Incident Date <span class="required" aria-hidden="true">*</span></label>
                            <div class="input-wrap">
                <span class="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 3v4M16 3v4M3.5 10h17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
                </span>
                                <input type="date" id="incidentDate" name="incidentDate" required aria-required="true">
                            </div>
                            <p class="field-error" id="incidentDateError" role="alert"></p>
                        </div>

                        <!-- Time -->
                        <div class="form-field" id="timeField">
                            <label for="incidentTime">Incident Time <span class="required" aria-hidden="true">*</span></label>
                            <div class="input-wrap">
                <span class="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
                                <input type="time" id="incidentTime" name="incidentTime" required aria-required="true">
                            </div>
                            <p class="field-error" id="incidentTimeError" role="alert"></p>
                        </div>
                    </div>

                    <div class="form-row">
                        <!-- Affected System -->
                        <div class="form-field" id="assetField">
                            <label for="affectedAsset">Affected System / Asset <span class="required" aria-hidden="true">*</span></label>
                            <div class="input-wrap">
                <span class="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><rect x="3" y="4" width="18" height="12" rx="1.5" stroke="currentColor" stroke-width="1.6"/><path d="M8 20h8M12 16v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
                </span>
                                <input type="text" id="affectedAsset" name="affectedAsset" placeholder="e.g. Employee Laptop, Web Server, Database" required aria-required="true">
                            </div>
                            <p class="field-error" id="affectedAssetError" role="alert"></p>
                        </div>

                        <!-- Location -->
                        <div class="form-field" id="locationField">
                            <label for="incidentLocation">Location <span class="required" aria-hidden="true">*</span></label>
                            <div class="input-wrap">
                <span class="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M12 21s7-6.6 7-11.5A7 7 0 105 9.5C5 14.4 12 21 12 21z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.4" stroke="currentColor" stroke-width="1.6"/></svg>
                </span>
                                <input type="text" id="incidentLocation" name="incidentLocation" placeholder="Enter location" required aria-required="true">
                            </div>
                            <p class="field-error" id="incidentLocationError" role="alert"></p>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="form-field form-field--full" id="descriptionField">
                        <label for="incidentDescription">Description <span class="required" aria-hidden="true">*</span></label>
                        <textarea id="incidentDescription" name="incidentDescription" rows="5" maxlength="1000"
                                  placeholder="Describe what happened, how the incident was detected, and the possible impact..." required aria-required="true" aria-describedby="descriptionCounter"></textarea>
                        <div class="field-footer">
                            <p class="field-error" id="incidentDescriptionError" role="alert"></p>
                            <span class="char-counter" id="descriptionCounter">0 / 1000</span>
                        </div>
                    </div>

                    <!-- Evidence -->
                    <div class="form-field form-field--full" id="evidenceField">
                        <label for="incidentEvidence">Evidence / Additional Information</label>
                        <textarea id="incidentEvidence" name="incidentEvidence" rows="4" maxlength="800"
                                  placeholder="Add logs, URLs, file names, suspicious activity details, or any other relevant information..." aria-describedby="evidenceCounter"></textarea>
                        <div class="field-footer">
                            <span></span>
                            <span class="char-counter" id="evidenceCounter">0 / 800</span>
                        </div>
                    </div>

                    <!-- Contact -->
                    <div class="form-field form-field--full" id="contactField">
                        <label for="contactInfo">Contact Information <span class="required" aria-hidden="true">*</span></label>
                        <div class="input-wrap">
              <span class="input-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M4 6h16v12H4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
                            <input type="text" id="contactInfo" name="contactInfo" placeholder="Enter contact information" required aria-required="true">
                        </div>
                        <p class="field-error" id="contactInfoError" role="alert"></p>
                    </div>

                    <!-- Actions -->
                    <div class="form-actions">
                        <button type="submit" class="btn btn--primary btn--block" id="submitBtn">
              <span class="btn__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M4 12l6 6L20 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
                            <span class="btn__label">Submit Incident</span>
                            <span class="spinner" aria-hidden="true"></span>
                        </button>
                        <div class="form-actions__secondary">
                            <button type="button" class="btn btn--ghost" id="clearBtn">Clear Form</button>
                            <a href="dashboard.html" class="btn btn--ghost" id="cancelBtn">Cancel</a>
                        </div>
                    </div>

                    <p class="form-message" id="formMessage" role="status" aria-live="polite"></p>
                </form>
            </section>

            <!-- ============ SIDE COLUMN ============ -->
            <aside class="side-column">

                <div class="card tip-card reveal">
                    <h3 class="tip-card__title">
            <span class="tip-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M12 2l8 3.4v5.4c0 4.9-3.4 8.9-8 10.2-4.6-1.3-8-5.3-8-10.2V5.4L12 2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
            </span>
                        Before Submitting
                    </h3>
                    <ul class="tip-list">
                        <li><span class="tip-list__icon" aria-hidden="true">✓</span> Provide accurate information</li>
                        <li><span class="tip-list__icon" aria-hidden="true">✓</span> Do not include passwords or sensitive credentials</li>
                        <li><span class="tip-list__icon" aria-hidden="true">✓</span> Attach all relevant evidence</li>
                        <li><span class="tip-list__icon" aria-hidden="true">✓</span> Report critical incidents immediately</li>
                    </ul>
                </div>

                <!-- Original mascot cameo: WebWatch, not licensed IP -->
                <div class="card mascot-card reveal">
          <span class="mascot-card__avatar" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="52" height="52" fill="none">
              <circle cx="32" cy="32" r="30" fill="#1e293b"/>
              <path d="M32 4v56M4 32h56M12 12l40 40M52 12L12 52" stroke="#3b82f6" stroke-width="1.2" opacity="0.55"/>
              <circle cx="32" cy="32" r="15" fill="#2563eb"/>
              <path d="M24 28c2-2 5-3 8-3s6 1 8 3M24 36c2 2 5 3 8 3s6-1 8-3" stroke="#0f172a" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </span>
                    <div>
                        <p class="mascot-card__name">WebWatch says:</p>
                        <p class="mascot-card__quote" id="mascotQuote">"The clearer your report, the faster we can trace the thread."</p>
                    </div>
                </div>

            </aside>
        </div>
    </div>
</main>

<!-- Success overlay -->
<div class="success-overlay" id="successOverlay" role="alertdialog" aria-modal="true" aria-labelledby="successTitle" aria-hidden="true">
    <div class="success-card">
    <span class="success-card__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none"><path d="M4 12l6 6L20 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
        <h3 id="successTitle">Incident Reported Successfully</h3>
        <p>Your report has been submitted to the security team. They'll begin triage shortly. Backend submission will be connected soon.</p>
        <div class="success-card__actions">
            <button type="button" class="btn btn--outline" id="reportAnotherBtn">Report Another</button>
            <a href="dashboard.html" class="btn btn--primary">Return to Dashboard</a>
        </div>
    </div>
</div>

<div class="toast" id="toast" role="status" aria-live="polite"></div>

<script src="report-incident.js"></script>




</body>
</html>