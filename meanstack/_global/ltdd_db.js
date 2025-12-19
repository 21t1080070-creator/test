const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";

var DBLTDD = new CDBLTDD();

module.exports = DBLTDD;

function CDBLTDD() {
    this.client_ = new MongoClient(uri, {});
    this.db_ = null;
}

CDBLTDD.prototype.Init = async function () {
    console.log('Connecting LTDD Database...');
    try {        
        await this.client_.connect();
        console.log("Connected to MongoDB!");
        
        // 1. KẾT NỐI DATABASE "SinhVien"
        this.db_ = this.client_.db("SinhVien"); 
        
        console.log('...MONGO Actived : [' + this.db_.databaseName + ']');
        return true;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return false;
    }
}

// Lấy thông tin 1 sinh viên
CDBLTDD.prototype.getUser = async function(user){
  // 2. SỬA COLLECTION THÀNH "sinhvien"
  const u = await this.db_.collection("sinhvien").findOne({username:user});
  return u;   // trả về user hoặc null
}

// Lấy danh sách tất cả sinh viên
CDBLTDD.prototype.getUsers = async function(){
  // 3. SỬA COLLECTION THÀNH "sinhvien"
  // projection: { _id: 0 } nghĩa là không lấy trường _id về, chỉ lấy data
  const users = await this.db_.collection("sinhvien").find({}, { projection: { _id: 0 } }).toArray();
  return users;   
}

// Kiểm tra đăng nhập (User & Pass)
CDBLTDD.prototype.Authentication = async function(user, pass){
  // 4. SỬA COLLECTION THÀNH "sinhvien"
  const u = await this.db_.collection("sinhvien").findOne({ username: user, password: pass});
  return u;   // trả về user (nếu đúng) hoặc null (nếu sai)
}

// Cập nhật thông tin sinh viên
CDBLTDD.prototype.modifyUser = async function (user, modify){
    // 5. SỬA COLLECTION THÀNH "sinhvien"
    const oDoc = await this.db_.collection("sinhvien").updateOne({username:user},{$set:modify});
    return oDoc;
}

// --- MỚI: HÀM TẠO SINH VIÊN (Dùng cho Đăng ký) ---
CDBLTDD.prototype.createUser = async function (userObj){
    // userObj sẽ là object dạng: { username: "...", password: "...", fullname: "..." }
    try {
        const result = await this.db_.collection("sinhvien").insertOne(userObj);
        return result;
    } catch (e) {
        console.log(e);
        return null;
    }
}