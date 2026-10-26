package com.cyber.dao;

import com.cyber.model.UrlScan;
import com.cyber.util.DBconnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class IncidentDAO {

    // Total incidents count fetch karne ke liye
    public int getTotalThreatsCount() {
        String sql = "SELECT COUNT(*) FROM incidents";
        try (Connection conn = DBconnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    // Critical severity wale incidents count karne ke liye
    public int getCriticalThreatsCount() {
        String sql = "SELECT COUNT(*) FROM incidents WHERE severity = 'Critical'";
        try (Connection conn = DBconnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    // Scan History: saari scans latest pehle
    public List<UrlScan> getAllScanHistory() {
        List<UrlScan> list = new ArrayList<>();
        String sql = "SELECT * FROM url_scans ORDER BY scanned_on DESC";
        try (Connection conn = DBconnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                UrlScan scan = new UrlScan();
                scan.setId(rs.getInt("id"));
                scan.setUrl(rs.getString("url"));
                scan.setScanType(rs.getString("scan_type"));
                scan.setResult(rs.getString("result"));
                scan.setRiskScore(rs.getInt("risk_score"));
                scan.setScannedOn(rs.getString("scanned_on"));
                list.add(scan);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }
}