package com.example.huynhvanminh;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface ApiService {
    // API Đăng nhập: Gửi object SinhVien lên đường dẫn /login của NodeJS
    @POST("login")
    Call<ApiResponse> login(@Body SinhVien sv);

    // API Đăng ký: Gửi object SinhVien lên đường dẫn /register của NodeJS
    @POST("register")
    Call<ApiResponse> register(@Body SinhVien sv);
}