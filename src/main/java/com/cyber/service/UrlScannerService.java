package com.cyber.service;
import com.cyber.entity.UrlScan;
import com.cyber.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
public class UrlScannerService {



    public UrlScan scanAndSaveUrl(String inputUrl) {
        // 1. Basic URL Validation & HTTPS Check
        boolean httpsEnabled = false;
        if (inputUrl != null && inputUrl.trim().toLowerCase().startsWith("https://")) {
            httpsEnabled = true;
        }

        // 2. Risk Level Calculation Logic
        String riskLevel = "Low";
        if (!httpsEnabled) {
            riskLevel = "High"; // Agar HTTPS nahi hai toh High risk
        } else if (inputUrl.contains("login") || inputUrl.contains("verify") || inputUrl.contains("update")) {
            riskLevel = "Medium"; // Suspicious keywords hone par Medium risk
        }

        // 3. Create Entity Object
        UrlScan scan = new UrlScan(inputUrl.trim(), httpsEnabled, riskLevel);

        // 4. Save into MySQL Database using Hibernate 6 with try-catch-finally
        Session session = null;
        Transaction transaction = null;

        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            // Hibernate 6 method to save entity
            session.persist(scan);

            transaction.commit();
        } catch (Exception e) {
            if (transaction != null && transaction.isActive()) {
                try {
                    transaction.rollback(); // Safe rollback before session closes
                } catch (Exception rbEx) {
                    rbEx.printStackTrace();
                }
            }
            e.printStackTrace();
        } finally {
            if (session != null && session.isOpen()) {
                session.close(); // Session closed safely at the very end
            }
        }

        return scan;
    }
}
