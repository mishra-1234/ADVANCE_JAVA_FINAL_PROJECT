package com.cyber.controller;

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
                session.getAttribute("userName") == null) {

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(
                    "{\"loggedIn\":false}"
            );
            return;
        }

        String userName =
                (String) session.getAttribute("userName");

        String role =
                (String) session.getAttribute("role");

        response.getWriter().write(
                "{\"loggedIn\":true,\"userName\":\""
                        + userName
                        + "\",\"role\":\""
                        + role
                        + "\"}"
        );
    }


}
