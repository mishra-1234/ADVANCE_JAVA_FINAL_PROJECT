package com.cyber.servlet;

import com.cyber.entity.Incident;
import com.cyber.util.HibernateUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.hibernate.Session;
import org.hibernate.query.Query;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/get-admin-incidents")
public class GetAdminIncidentsServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            Query<Incident> query = session.createQuery("FROM Incident ORDER BY id DESC", Incident.class);
            List<Incident> incidents = query.getResultList();

            StringBuilder json = new StringBuilder("[");
            for (int i = 0; i < incidents.size(); i++) {
                Incident inc = incidents.get(i);
                json.append("{")
                        .append("\"id\":").append(inc.getId()).append(",")
                        .append("\"title\":\"").append(escapeJson(inc.getIncidentTitle())).append("\",")
                        .append("\"category\":\"").append(escapeJson(inc.getIncidentCategory())).append("\",")
                        .append("\"severity\":\"").append(escapeJson(inc.getIncidentSeverity())).append("\",")
                        .append("\"reportedBy\":\"").append(escapeJson(inc.getReportedBy() != null ? inc.getReportedBy() : "System")).append("\",")
                        .append("\"date\":\"").append(escapeJson(inc.getIncidentDate())).append(" ")
                        .append(escapeJson(inc.getIncidentTime())).append("\"")
                        .append("}");
                if (i < incidents.size() - 1) json.append(",");
            }
            json.append("]");

            out.print(json.toString());
        } catch (Exception e) {
            e.printStackTrace();
            out.print("[]");
        } finally {
            if (session != null) session.close();
        }
    }

    private String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\"", "\\\"").replace("\n", " ").replace("\r", " ");
    }


}
