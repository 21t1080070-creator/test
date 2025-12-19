package com.example.huynhvanminh;

public class SinhVien {
    private String username;
    private String password;
    private String fullname;

    public SinhVien(String username, String password, String fullname) {
        this.username = username;
        this.password = password;
        this.fullname = fullname;
    }
    // Getter và Setter
    public String getUsername() { return username; }
}