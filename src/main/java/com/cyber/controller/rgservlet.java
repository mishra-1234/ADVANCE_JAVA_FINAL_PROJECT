package com.cyber.controller;

import com.cyber.dao.UserDAO;
import com.cyber.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;


@WebServlet("/register")
public class rgservlet  extends HttpServlet {

    private final UserDAO userDAO = new UserDAO();



    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {


        System.out.println("REGISTER SERVLET CALLED");

        String fullName = request.getParameter("fullName");
        String employeeId = request.getParameter("employeeId");
        String email = request.getParameter("email");
        String department = request.getParameter("department");
        String password = request.getParameter("password");


        System.out.println("Name: " + fullName);
        System.out.println("Email: " + email);
        System.out.println("Department: " + department);

        User user = new User(
                fullName,
                employeeId,
                email,
                department,
                password
        );

        boolean registered = userDAO.registerUser(user);


        System.out.println("REGISTER RESULT: " + registered);
        if (registered) {

            response.sendRedirect("login.html");

        } else {

            response.sendRedirect("signup.html?error=registration_failed");
        }
    }
}
