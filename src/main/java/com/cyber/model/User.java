package com.cyber.model;

public class User {

    private int id;
    private String fullName;
    private String employeeId;
    private String email;
    private String department;
    private String password;
    private String role;

    public User() {
    }

    public User(String fullName, String employeeId,
                String email, String department,
                String password) {

        this.fullName = fullName;
        this.employeeId = employeeId;
        this.email = email;
        this.department = department;
        this.password = password;
        this.role = "EMPLOYEE";
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}