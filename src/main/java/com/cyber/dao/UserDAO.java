package com.cyber.dao;

import com.cyber.model.User;
import com.cyber.util.DBconnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class UserDAO {

    public boolean registerUser(User user) {

        String sql ="insert into  users (full_name, employee_id, email, department, password, role) values (?,?,?,?,?,?)";


        try (Connection connection = DBconnection.getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setString(1, user.getFullName());
            statement.setString(2, user.getEmployeeId());
            statement.setString(3, user.getEmail());
            statement.setString(4, user.getDepartment());
            statement.setString(5, user.getPassword());
            statement.setString(6, user.getRole());

            int rows = statement.executeUpdate();

            return rows > 0;

        } catch (Exception e) {


            System.out.println("========== DATABASE ERROR ==========");
            System.out.println("Error Message: " + e.getMessage());

            e.printStackTrace();
            return false;
        }
    }

    public User loginUser(String email, String password) {

        String sql = "select *from users where email = ? and password = ? ";

        try (Connection connection = DBconnection.getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setString(1, email);
            statement.setString(2, password);

            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) {

                User user = new User();

                user.setId(resultSet.getInt("id"));
                user.setFullName(resultSet.getString("full_name"));
                user.setEmployeeId(resultSet.getString("employee_id"));
                user.setEmail(resultSet.getString("email"));
                user.setDepartment(resultSet.getString("department"));
                user.setPassword(resultSet.getString("password"));
                user.setRole(resultSet.getString("role"));

                return user;
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return null;
    }
}