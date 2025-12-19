package com.example.huynhvanminh;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterActivity extends AppCompatActivity {
    EditText regUser, regPass, regFullname;
    Button btnConfirmRegister;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        regUser = findViewById(R.id.regUser);
        regPass = findViewById(R.id.regPass);
        regFullname = findViewById(R.id.regFullname);
        btnConfirmRegister = findViewById(R.id.btnConfirmRegister);

        btnConfirmRegister.setOnClickListener(v -> {
            SinhVien sv = new SinhVien(regUser.getText().toString(), regPass.getText().toString(), regFullname.getText().toString());
            ApiClient.getApiService().register(sv).enqueue(new Callback<ApiResponse>() {
                @Override
                public void onResponse(Call<ApiResponse> call, Response<ApiResponse> response) {
                    if (response.body() != null && response.body().getR() > 0) {
                        Toast.makeText(RegisterActivity.this, "Đăng ký thành công!", Toast.LENGTH_SHORT).show();
                        finish(); // Quay lại màn hình Đăng nhập
                    } else {
                        Toast.makeText(RegisterActivity.this, "Đăng ký thất bại", Toast.LENGTH_SHORT).show();
                    }
                }
                @Override
                public void onFailure(Call<ApiResponse> call, Throwable t) {}
            });
        });
    }
}