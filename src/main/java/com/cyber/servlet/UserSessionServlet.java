package com.cyber.servlet;

import com.cyber.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

@WebServlet("/user-session")
public class UserSessionServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if (session == null ||
                (session.getAttribute("user") == null && session.getAttribute("userName") == null)) {

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"loggedIn\":false}");
            return;
        }

        User user = (User) session.getAttribute("user");

        String name  = (user != null) ? user.getFullName() : (String) session.getAttribute("userName");
        String role  = (user != null) ? user.getRole() : (String) session.getAttribute("role");
        String email = (user != null) ? user.getEmail() : "";
        String empId = (user != null) ? user.getEmployeeId() : "";
        String dept  = (user != null) ? user.getDepartment() : "";

        response.getWriter().write("{"
                + "\"loggedIn\": true,"
                + "\"userName\": \"" + (name != null ? name : "") + "\","
                + "\"role\": \"" + (role != null ? role : "") + "\","
                + "\"email\": \"" + (email != null ? email : "") + "\","
                + "\"employeeId\": \"" + (empId != null ? empId : "") + "\","
                + "\"department\": \"" + (dept != null ? dept : "") + "\""
                + "}");
    }
}
