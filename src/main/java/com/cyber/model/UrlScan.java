package com.cyber.model;

public class UrlScan {
    private int id;
    private String url;
    private String scanType;
    private String result;
    private int riskScore;
    private String scannedOn;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getScanType() { return scanType; }
    public void setScanType(String scanType) { this.scanType = scanType; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }

    public String getScannedOn() { return scannedOn; }
    public void setScannedOn(String scannedOn) { this.scannedOn = scannedOn; }
}