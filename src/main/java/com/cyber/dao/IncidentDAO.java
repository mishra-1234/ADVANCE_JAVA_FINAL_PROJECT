package com.cyber.dao;

import com.cyber.util.DBconnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

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
}