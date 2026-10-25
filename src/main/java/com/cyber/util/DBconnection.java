package com.cyber.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBconnection {

    private static final String URL =
            "jdbc:mysql://localhost:3306/cyber_incident_db";

    private static final String USER =
            "root";

    private static final String PASSWORD =
            "Sahoo@123";

    public static Connection getConnection() throws SQLException {

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("MYSQL DRIVER LOADED");
        } catch (ClassNotFoundException e) {
            System.out.println("MYSQL DRIVER NOT FOUND");
            e.printStackTrace();
        }

        return DriverManager.getConnection(
                URL,
                USER,
                PASSWORD
        );
    }
}