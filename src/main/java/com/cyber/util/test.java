package com.cyber.util;

import java.sql.Connection;

public class test {

    public static void main(String[] args) {
        try {

            Connection connection = DBconnection.getConnection();

            System.out.println("Database Connected Successfully!");

            connection.close();

        } catch (Exception e) {

            e.printStackTrace();

        }
    }
}
