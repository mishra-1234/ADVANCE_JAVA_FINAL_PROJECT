package com.cyber.servlet;


import com.cyber.entity.Admin;
import com.cyber.util.HibernateUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.hibernate.Session;

import java.io.IOException;


@WebServlet("/adminLogin")
public class AdminLoginServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        System.out.println("EMAIL = [" + email + "]");
        System.out.println("PASSWORD = [" + password + "]");

        Session session = null;

        try {


            session = HibernateUtil
                    .getSessionFactory()
                    .openSession();

            System.out.println("Checking admin from database...");

            String hql = "FROM Admin WHERE email = :email AND password = :password";

            Admin admin = session.createQuery(hql, Admin.class)
                    .setParameter("email", email)
                    .setParameter("password", password)
                    .uniqueResult();


            if (admin != null) {

                HttpSession httpSession = request.getSession();

                httpSession.setAttribute("adminEmail",
                        admin.getEmail());

                response.sendRedirect("admindashboard.jsp");

            }


            else {

                response.sendRedirect(
                        "adminlogin.jsp?error=Invalid+admin+email+or+password"
                );
            }

        } catch (Exception e) {

            e.printStackTrace();

            response.sendRedirect(
                    "adminlogin.jsp?error=Something+went+wrong"
            );

        } finally {

            if (session != null) {
                session.close();
            }
        }
    }
}
