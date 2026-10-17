package com.cyber.entity;


import jakarta.persistence.*;

import java.util.Date;




@Entity
@Table(name = "url_scans")

public class UrlScan {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "scanned_url", nullable = false, length = 2048)
    private String scannedUrl;

    @Column(name = "https_enabled", nullable = false)
    private boolean httpsEnabled;

    @Column(name = "risk_level", nullable = false, length = 20)
    private String riskLevel;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "scan_date", insertable = false, updatable = false)
    private Date scanDate;

    // Default Constructor
    public UrlScan() {}

    // Parameterized Constructor
    public UrlScan(String scannedUrl, boolean httpsEnabled, String riskLevel) {
        this.scannedUrl = scannedUrl;
        this.httpsEnabled = httpsEnabled;
        this.riskLevel = riskLevel;
    }

    // Getters aur Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getScannedUrl() {
        return scannedUrl;
    }

    public void setScannedUrl(String scannedUrl) {
        this.scannedUrl = scannedUrl;
    }

    public boolean isHttpsEnabled() {
        return httpsEnabled;
    }

    public void setHttpsEnabled(boolean httpsEnabled) {
        this.httpsEnabled = httpsEnabled;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Date getScanDate() {
        return scanDate;
    }

    public void setScanDate(Date scanDate) {
        this.scanDate = scanDate;
    }

}
