const { Buffer } = require('buffer');
const DB = require("./_global/ltdd_db")
const UTILS = require('./_global/utils.js');

var appRouter = function (app) {

  app.get("/", function (req, res) {
    UTILS.apiResult(1, 'API Quản lý Sinh viên - Project của tôi', res);
  });

  // Lấy danh sách sinh viên
  app.get("/users", async function (req, res) {
    const u = await DB.getUsers();
    UTILS.apiResult(1, u, res);
  });

  // Lấy thông tin chi tiết sinh viên (Yêu cầu Token)
  app.post("/userinfo", function (req, res) {
    var token = req.headers.token;
    POST_userInfo(token, res);
  });

  // API Đăng nhập
  app.post("/login", async function (req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    POST_login(user, pass, res);
  });

  // API Đăng ký sinh viên mới (Thêm mới cho dự án của bạn)
  app.post("/register", async function (req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    var name = req.body.fullname;

    if (!user || !pass || !name) {
        return UTILS.apiResult(-1, "Vui lòng nhập đủ: User, Pass và Fullname", res);
    }

    // Kiểm tra trùng username
    const check = await DB.getUser(user);
    if(check) return UTILS.apiResult(-2, "Tài khoản này đã tồn tại", res);

    const result = await DB.createUser({username: user, password: pass, fullname: name});
    if(result) UTILS.apiResult(1, "Đăng ký thành công", res);
    else UTILS.apiResult(0, "Lỗi đăng ký", res);
  });

  // API Cập nhật thông tin (Yêu cầu Token)
  app.post("/userupdate", function (req, res) {
    var token = req.headers.token;
    var pass = req.body.password;
    var name = req.body.fullname;

    var info = {
      password: pass ? pass.toString() : null,
      fullname: name ? name.toString() : null
    }
    POST_userUpdate(token, info, res);
  });
}

module.exports = appRouter;

// --- CÁC HÀM XỬ LÝ LOGIC (ĐÃ SỬA THEO TRƯỜNG DỮ LIỆU CỦA BẠN) ---

async function POST_login(user, pass, res) {
  if (!user || user.length < 3) {
    UTILS.apiResult(-1, "Tài khoản phải ít nhất 3 ký tự", res);
    return;
  }
  if (!pass || pass.length < 6) {
    UTILS.apiResult(-2, "Mật khẩu phải từ 6 ký tự", res);
    return;
  }

  // Gọi hàm Authentication trong ltdd_db.js (kiểm tra username, password)
  const isAuth = await DB.Authentication(user, pass);
  if (!isAuth) {
    UTILS.apiResult(-3, "Tài khoản hoặc mật khẩu không đúng", res);
    return;
  }

  // Tạo Token Base64
  var user_ = { u: user, t: ~~(Date.now() / 1000) };
  var token = Buffer.from(JSON.stringify(user_), 'utf8').toString('base64');

  UTILS.apiResult(1, token, res);
}

async function POST_userInfo(token, res) {
  var oResult = decodeToken(token);
  if (oResult.error != 1) {
    UTILS.apiResult(oResult.error, oResult.message, res);
    return;
  }

  var oToken = oResult.message;
  var u = await DB.getUser(oToken.u); // Lấy từ collection sinhvien
  if (!u) {
    UTILS.apiResult(-4, "Tài khoản không tồn tại", res);
    return;
  }

  // Trả về object chứa fullname và username
  UTILS.apiResult(1, u, res);
}

async function POST_userUpdate(token, info, res) {
  var oResult = decodeToken(token);
  if (oResult.error != 1) {
    UTILS.apiResult(oResult.error, oResult.message, res);
    return;
  }

  var mod_ = {};
  var count = 0;
  if (info.password && info.password.length >= 6) {
    count++;
    mod_['password'] = info.password;
  }
  if (info.fullname) {
    count++;
    mod_['fullname'] = info.fullname;
  }

  var oToken = oResult.message;
  if (count == 0) {
    UTILS.apiResult(-4, "Không có thông tin mới để cập nhật", res);
    return;
  }

  var u = await DB.modifyUser(oToken.u, mod_);
  if (!u || !u.matchedCount) {
    UTILS.apiResult(-5, "Lỗi cập nhật", res);
    return;
  }
  UTILS.apiResult(1, "Cập nhật thành công", res);
}

function decodeToken(token) {
  var oResult = {};
  if (!token) {
    oResult['error'] = -1; oResult['message'] = "Yêu cầu đăng nhập";
    return oResult;
  }
  try {
    var plain = Buffer.from(token, 'base64').toString('utf8');
    var user_ = JSON.parse(plain);

    // Kiểm tra thời gian hết hạn (5 phút)
    var curSeconds = ~~(Date.now() / 1000);
    if (curSeconds - user_.t > (60 * 5)) {
      oResult['error'] = -3; oResult['message'] = "Token hết hạn";
      return oResult;
    }

    oResult['error'] = 1; oResult['message'] = user_;
  } catch (e) {
    oResult['error'] = -101; oResult['message'] = "Token lỗi";
  }
  return oResult;
}