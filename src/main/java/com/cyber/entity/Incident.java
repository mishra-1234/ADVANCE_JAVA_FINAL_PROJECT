package com.cyber.entity;


import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "security_incidents")
public class Incident {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "incident_title", nullable = false)
    private String incidentTitle;

    @Column(name = "incident_category", nullable = false)
    private String incidentCategory;

    @Column(name = "incident_severity", nullable = false)
    private String incidentSeverity;

    @Column(name = "incident_date", nullable = false)
    private String incidentDate;

    @Column(name = "incident_time", nullable = false)
    private String incidentTime;

    @Column(name = "affected_asset", nullable = false)
    private String affectedAsset;

    @Column(name = "incident_location", nullable = false)
    private String incidentLocation;

    @Column(name = "incident_description", nullable = false, length = 1000)
    private String incidentDescription;

    @Column(name = "incident_evidence", length = 800)
    private String incidentEvidence;

    @Column(name = "contact_info", nullable = false)
    private String contactInfo;

    @Column(name = "reported_by")
    private String reportedBy; // 👈 Naya field username/name ke liye

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "reported_at", insertable = false, updatable = false)
    private Date reportedAt;

    // Default Constructor
    public Incident() {}

    // Parameterized Constructor (Updated with reportedBy)
    public Incident(String incidentTitle, String incidentCategory, String incidentSeverity,
                    String incidentDate, String incidentTime, String affectedAsset,
                    String incidentLocation, String incidentDescription, String incidentEvidence,
                    String contactInfo, String reportedBy) {
        this.incidentTitle = incidentTitle;
        this.incidentCategory = incidentCategory;
        this.incidentSeverity = incidentSeverity;
        this.incidentDate = incidentDate;
        this.incidentTime = incidentTime;
        this.affectedAsset = affectedAsset;
        this.incidentLocation = incidentLocation;
        this.incidentDescription = incidentDescription;
        this.incidentEvidence = incidentEvidence;
        this.contactInfo = contactInfo;
        this.reportedBy = reportedBy;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIncidentTitle() { return incidentTitle; }
    public void setIncidentTitle(String incidentTitle) { this.incidentTitle = incidentTitle; }

    public String getIncidentCategory() { return incidentCategory; }
    public void setIncidentCategory(String incidentCategory) { this.incidentCategory = incidentCategory; }

    public String getIncidentSeverity() { return incidentSeverity; }
    public void setIncidentSeverity(String incidentSeverity) { this.incidentSeverity = incidentSeverity; }

    public String getIncidentDate() { return incidentDate; }
    public void setIncidentDate(String incidentDate) { this.incidentDate = incidentDate; }

    public String getIncidentTime() { return incidentTime; }
    public void setIncidentTime(String incidentTime) { this.incidentTime = incidentTime; }

    public String getAffectedAsset() { return affectedAsset; }
    public void setAffectedAsset(String affectedAsset) { this.affectedAsset = affectedAsset; }

    public String getIncidentLocation() { return incidentLocation; }
    public void setIncidentLocation(String incidentLocation) { this.incidentLocation = incidentLocation; }

    public String getIncidentDescription() { return incidentDescription; }
    public void setIncidentDescription(String incidentDescription) { this.incidentDescription = incidentDescription; }

    public String getIncidentEvidence() { return incidentEvidence; }
    public void setIncidentEvidence(String incidentEvidence) { this.incidentEvidence = incidentEvidence; }

    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }

    public String getReportedBy() { return reportedBy; }
    public void setReportedBy(String reportedBy) { this.reportedBy = reportedBy; }

    public Date getReportedAt() { return reportedAt; }
    public void setReportedAt(Date reportedAt) { this.reportedAt = reportedAt; }
}
