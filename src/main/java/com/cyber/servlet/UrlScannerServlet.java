package com.cyber.servlet;


import com.cyber.entity.UrlScan;
import com.cyber.service.UrlScannerService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;


@WebServlet("/scan-url")
public class UrlScannerServlet extends HttpServlet {



    private static final long serialVersionUID = 1L;
    private UrlScannerService scannerService;

    @Override
    public void init() throws ServletException {
        super.init();
        scannerService = new UrlScannerService();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. User input URL receive karo
        String inputUrl = request.getParameter("url");

        if (inputUrl == null || inputUrl.trim().isEmpty()) {
            response.sendRedirect("url-scanner.jsp?error=Please enter a valid URL");
            return;
        }

        // 2. Service ko call karke scan aur save karo
        UrlScan scanResult = scannerService.scanAndSaveUrl(inputUrl);

        // 3. Result ko request attribute mein set karo taaki JSP par dikh sake
        request.setAttribute("scanResult", scanResult);

        // 4. scanResult.jsp par forward karo
        request.getRequestDispatcher("scanResult.jsp").forward(request, response);
    }
}
