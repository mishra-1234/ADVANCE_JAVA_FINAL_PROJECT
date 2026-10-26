package com.cyber.servlet;

import com.cyber.dao.UserDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/settings")
public class SettingsServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");

        if ("changePassword".equals(action)) {
            HttpSession session = request.getSession();
            String userEmail = (String) session.getAttribute("userEmail"); // session se email lein

            String currentPassword = request.getParameter("currentPassword");
            String newPassword = request.getParameter("newPassword");
            String confirmPassword = request.getParameter("confirmPassword");

            if (userEmail != null && newPassword != null && newPassword.equals(confirmPassword)) {
                UserDAO userDAO = new UserDAO();
                // Optional: Verify currentPassword and update using UserDAO methods
                boolean updated = userDAO.updatePasswordByEmail(userEmail, newPassword);

                if (updated) {
                    response.sendRedirect("settings.html?success=Password updated successfully");
                } else {
                    response.sendRedirect("settings.html?error=Failed to update password");
                }
            } else {
                response.sendRedirect("settings.html?error=Passwords do not match or session expired");
            }
        }
    }
}