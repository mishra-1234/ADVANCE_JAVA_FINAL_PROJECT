package com.cyber.servlet;



import com.cyber.entity.Incident;
import com.cyber.util.HibernateUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.io.IOException;

@WebServlet("/submit-incident")
public class IncidentServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        System.out.println("🔥 INCIDENT SERVLET CALLED SUCCESSFULLY!");

        // 1. Form parameters fetch karein
        String title = request.getParameter("incidentTitle");
        String category = request.getParameter("incidentCategory");
        String severity = request.getParameter("incidentSeverity");
        String date = request.getParameter("incidentDate");
        String time = request.getParameter("incidentTime");
        String asset = request.getParameter("affectedAsset");
        String location = request.getParameter("incidentLocation");
        String description = request.getParameter("incidentDescription");
        String evidence = request.getParameter("incidentEvidence");
        String contact = request.getParameter("contactInfo");
        String reportedBy = request.getParameter("reportedBy");

        System.out.println("Title: " + title + " | ReportedBy: " + reportedBy);

        // 2. Incident Entity object create karein
        Incident incident = new Incident(
                title, category, severity, date, time,
                asset, location, description, evidence, contact, reportedBy
        );

        // 3. Hibernate Session ke zariye DB mein save karein
        Session session = null;
        Transaction transaction = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            session.persist(incident);
            transaction.commit();

            System.out.println("✅ INCIDENT SAVED TO DATABASE SUCCESSFULLY!");
        } catch (Exception e) {
            if (transaction != null && transaction.isActive()) {
                transaction.rollback();
            }
            System.out.println("❌ ERROR SAVING INCIDENT:");
            e.printStackTrace(); // Yahan exact error print hogi
        } finally {
            if (session != null && session.isOpen()) {
                session.close();
            }
        }

        // 4. Success hone par dashboard par redirect karein
        response.sendRedirect("dashboard.html?success=incident_reported");
    }
}
