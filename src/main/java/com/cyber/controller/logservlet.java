package com.cyber.controller;


import com.cyber.dao.UserDAO;
import com.cyber.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
@WebServlet("/login")
public class logservlet extends HttpServlet {


    private  final UserDAO userDAO = new UserDAO();

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {




        System.out.println("LOGIN SERVLET CALLED");


        String email=request.getParameter("email");
        String password=request.getParameter("password");

        System.out.println("Email: "+email);
        System.out.println("Password: " + password);
        User user=userDAO.loginUser(email,password);


        System.out.println("USER OBJECT: " + user);
        if(user!=null){
        HttpSession session = request.getSession();


            System.out.println("login succes");

            session.setAttribute("user", user);
            session.setAttribute("userId", user.getId());
            session.setAttribute("userName", user.getFullName());
            session.setAttribute("role", user.getRole());

            response.sendRedirect("dashboard.html");


    }
        else
        {
            System.out.println("login faild");

            response.sendRedirect("login.html?error=invalid");
        }



    }

}
