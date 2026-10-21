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


@WebServlet("/get-incidents")
public class GetIncidentsServlet extends HttpServlet {



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

            // Manually build JSON array to avoid external library dependencies
            StringBuilder json = new StringBuilder("[");
            for (int i = 0; i < incidents.size(); i++) {
                Incident inc = incidents.get(i);
                json.append("{")
                        .append("\"id\":").append(inc.getId()).append(",")
                        .append("\"title\":\"").append(inc.getIncidentTitle()).append("\",")
                        .append("\"category\":\"").append(inc.getIncidentCategory()).append("\",")
                        .append("\"severity\":\"").append(inc.getIncidentSeverity()).append("\",")
                        .append("\"status\":\"Open\",") // Default status
                        .append("\"date\":\"").append(inc.getIncidentDate()).append("\"")
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
}
