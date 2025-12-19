module.exports = new CUtils();

function CUtils() { }

// Hàm trả về kết quả API theo định dạng chuẩn {r:code, m:msg}
// code > 0 : thành công
// code <= 0 : thất bại / lỗi logic
// msg : dữ liệu hoặc thông báo lỗi
CUtils.prototype.apiResult = function (code, msg, res) {
    var oResult = {};

    // Xử lý mã trả về (r)
    if (code == undefined || !code) oResult["r"] = 0;
    else oResult["r"] = parseInt(code);

    // Xử lý nội dung (m)
    if (msg == undefined || !msg) oResult["m"] = "WebService Restful API";
    else oResult["m"] = msg;

    // --- SỬA Ở ĐÂY ---
    // Luôn trả về 200 để Android nhận được JSON và tự xử lý logic đúng/sai
    // Chỉ khi nào code sập nguồn mới để server tự báo lỗi 500
    res.status(200).json(oResult);
}