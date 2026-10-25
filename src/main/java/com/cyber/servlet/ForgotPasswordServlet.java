package com.cyber.servlet;

import com.cyber.dao.UserDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/forgotpassword")
public class ForgotPasswordServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        UserDAO userDAO = new UserDAO();

        if ("verify".equals(action)) {
            String email = request.getParameter("email");
            if (userDAO.checkEmailExists(email)) {
                HttpSession session = request.getSession();
                session.setAttribute("resetEmail", email);
                response.sendRedirect("reset-password.html");
            } else {
                response.sendRedirect("forgot-password.html?error=Email not registered");
            }
        } else if ("update".equals(action)) {
            HttpSession session = request.getSession();
            String email = (String) session.getAttribute("resetEmail");
            String newPassword = request.getParameter("newPassword");

            if (email != null && newPassword != null) {
                boolean updated = userDAO.updatePasswordByEmail(email, newPassword);
                if (updated) {
                    session.removeAttribute("resetEmail");
                    response.sendRedirect("login.html?success=Password updated successfully");
                } else {
                    response.sendRedirect("reset-password.html?error=Update failed");
                }
            } else {
                response.sendRedirect("login.html");
            }
        }
    }
}