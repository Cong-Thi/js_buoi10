// Tạo function constructor Member
function Member(user, name, email, password, dateOfJob, salary, regency, hour) {
    this.user = user;
    this.name = name;
    this.email = email;
    this.password = password;
    this.dateOfJob = dateOfJob;
    this.salary = salary;
    this.regency = regency;
    this.hour = hour;
}

Member.prototype.total = function () {
    var currentFormat = new Intl.NumberFormat("vn-VN");
    if (this.regency == "Sếp") {
        return currentFormat.format(((this.salary / 176 * this.hour) * 3).toFixed(0))
    } else if (this.regency == "Trưởng Phòng") {
        return currentFormat.format(((this.salary / 176 * this.hour) * 2).toFixed(0))
    } else {
        return currentFormat.format((this.salary / 176 * this.hour).toFixed(0))
    }
}

Member.prototype.rating = function () {
    if (this.hour >= 192) {
        return "Xuất Sắc"
    } else if (this.hour >= 172) {
        return "Giỏi"
    } else if (this.hour >= 160) {
        return "Khá"
    } else {
        return "Trung Bình"
    }
}

// Tạo array members để lưu trữ danh sách nhân viên
let members = [];

// Hàm init sẽ được thực thi khi chương trình được khởi chạy
init();
//=======================================
function init() {
    // Lấy dữ liệu members từ localStorage
    members = JSON.parse(localStorage.getItem("members")) || [];
    members = members.map((member) => {
        return new Member(
            member.user,
            member.name,
            member.email,
            member.password,
            member.dateOfJob,
            member.salary,
            member.regency,
            member.hour
        );
    });


    display(members);
}

function addMember() {
    //B1: DOM lấy thông tin từ input
    let user = dom("#tknv").value;
    let name = dom("#name").value;
    let email = dom("#email").value;
    let password = dom("#password").value;
    let dateOfJob = dom("#datepicker").value;
    let salary = +dom("#luongCB").value;
    let regency = dom("#chucvu").value;
    let hour = dom("#gioLam").value;

    let isValid = validateForm();
    // Kiểm tra nếu form không hợp lệ => Kết thúc hàm
    if (!isValid) {
        return;
    }

    //B2: Tạo object member chứa các thông tin trên
    let member = new Member(user, name, email, password, dateOfJob, salary, regency, hour);

    //B3: Hiển thị thông tin của member vừa thêm ra table
    members.push(member);
    localStorage.setItem("members", JSON.stringify(members)); //LƯU trữ vào localStorage

    //B4: Hiển thị ra giao diện
    display(members)

    //B5: Reset form
    resetForm()

}

function deleteMember(memberUser) {
    //memberUser là user của nhân viên muốn xóa
    members = members.filter((member) => {
        return member.user !== memberUser
    })
    // Lưu trữ array vào localStorage sau khi xóa sinh viên
    localStorage.setItem("members", JSON.stringify(members));
    //Gọi lại hàm display
    display(members);
}

function searchMember() {
    let searchValue = dom("#searchName").value;
    // if(!searchValue){
    //     display(members)
    //     return
    // }
    searchValue = searchValue.toLowerCase();
    let newMember = members.filter((member) => {
        let rating = member.rating().toLowerCase()
        return rating.includes(searchValue)
    })

    display(newMember)
}

function editMember(memberUser) {
    let member = members.find((member) => {
        return member.user === memberUser;
    })

    if (!member) {
        return
    }

    dom("#tknv").value = member.user;
    dom("#name").value = member.name;
    dom("#email").value = member.email;
    dom("#password").value = member.password;
    dom("#datepicker").value = member.dateOfJob;
    dom("#luongCB").value = member.salary;
    dom("#chucvu").value = member.regency;
    dom("#gioLam").value = member.hour;

    dom("#tknv").disabled = true;
    dom("#btnThemNV").disabled = true;
}

function updateMember() {
    //B1: DOM lấy thông tin từ các input
    let user = dom("#tknv").value;
    let name = dom("#name").value;
    let email = dom("#email").value;
    let password = dom("#password").value;
    let dateOfJob = dom("#datepicker").value;
    let salary = +dom("#luongCB").value;
    let regency = dom("#chucvu").value;
    let hour = dom("#gioLam").value;

    let isValid = validateForm();
    // Kiểm tra nếu form không hợp lệ => Kết thúc hàm
    if (!isValid) {
        return;
    }

    //B2: Tạo object student chứa các thông tin trên
    let member = new Member(user, name, email, password, dateOfJob, salary, regency, hour);

    //B3: Cập nhật thông tin nhân viên
    let index = members.findIndex((item) => item.user === member.user);
    members[index] = member;
    // Sau khi cập nhật xong lưu vào localstorage
    localStorage.setItem("members", JSON.stringify(members));

    //B4: Hiển thị ra giao diện
    display(members);

    //B5: Reset form
    resetForm();
}

// Hàm display nhận tham số là 1 array members
function display(members) {
    let html = members.reduce((result, member) => {
        return result + `
            <tr>
                <td>${member.user}</td>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.dateOfJob}</td>
                <td>${member.regency}</td>
                <td>${member.total()}</td>
                <td>${member.rating()}</td>
                <td>
                    <button class="btn btn-success" data-toggle="modal" data-target="#myModal" onclick="editMember('${member.user}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteMember('${member.user}')">Delele</button>
                </td>
            </tr>
        `
    }, "");

    // DOM tới tbody và gán chuỗi html vừa tạo
    dom("#tableDanhSach").innerHTML = html;
}

// Hàm resetForm
function resetForm() {
    dom("#tknv").value = "";
    dom("#name").value = "";
    dom("#email").value = "";
    dom("#password").value = "";
    dom("#datepicker").value = "";
    dom("#luongCB").value = "";
    dom("#chucvu").value = "";
    dom("#gioLam").value = "";

    dom("#tknv").disabled = false;
    dom("#btnThemNV").disabled = false;
}

function dom(selector) {
    return document.querySelector(selector);
}

//======== Validation ========

// Hàm kiểm tra User
function validateUser() {
    let user = dom("#tknv").value;
    let spanEl = dom("#tbTKNV");
    // Kiểm tra rỗng
    if (!user) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = "Tên tài khoản không được để trống"
        return false;
    }
    // Kiểm tra số lượng ký tự
    if (user.length < 4 || user.length > 6) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = "Tên tài khoản tối đa 4 - 6 ký số"
        return false;
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
}

// Hàm kiểm tra tên nhân viên
function validateName() {
    let name = dom("#name").value;
    let spanEl = dom("#tbTen");
    // Kiểm tra rỗng
    if (!name) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Tên nhân viên không được để trống"
        return false;
    }
    // Kiểm tra kiểu chữ
    let regex = /^[A-Za-z]/
    if (!regex.test(name)) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = "Tên nhân viên phải là chữ"
        return false
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
}

// Hàm kiểm tra email
function validateEmail() {
    let email = dom("#email").value;
    let spanEl = dom("#tbEmail");
    // Kiểm tra rỗng
    if (!email) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Email không được để trống"
        return false;
    }
    // Kiểm tra email
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!regex.test(email)) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = "Email không đúng định dạng"
        return false
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
}

// Hàm kiểm tra mật khẩu
function validatePassword() {
    let password = dom("#password").value;
    let spanEl = dom("#tbMatKhau");
    // Kiểm tra rỗng
    if (!password) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Mật khẩu không được để trống"
        return false;
    }
    // Kiểm tra mật khẩu
    let regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,10})/
    if (!regex.test(password)) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = "Mật Khẩu từ 6-10 ký tự (chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt)"
        return false
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
}

// Hàm kiểm tra ngày làm
function validateDate() {
    let date = dom("#datepicker").value;
    let spanEl = dom("#tbNgay");
    // Kiểm tra rỗng
    if (!date) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Ngày tháng không được để trống"
        return false;
    }
    // Kiểm tra ngày tháng mm/dd/yyyy
    let regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
    if (!regex.test(date)) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = "Ngày tháng theo định dạng mm/dd/yyyy"
        return false
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
}

// Hàm kiểm tra lương cơ bản
function validateSalary() {
    let salary = dom("#luongCB").value;
    let spanEl = dom("#tbLuongCB");
    // Kiểm tra rỗng
    if (!salary) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Lương cơ bản không được để trống"
        return false;
    }
    // Kiểm tra lương cơ bản
    if (salary < 1e6 || salary > 2e7) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = "Lương cơ bản 1.000.000 - 20.000.000 VNĐ"
        return false;
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
}

// Hàm kiểm tra chức vụ
function validateRegency() {
    let regency = dom("#chucvu").value;
    let spanEl = dom("#tbChucVu");
    // Kiểm tra chức vụ
    if (!regency) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Chức vụ phải chọn hợp lệ, không được để trống"
        return false;
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
}

// Hàm kiểm tra giờ
function validateHour() {
    let hour = dom("#gioLam").value;
    let spanEl = dom("#tbGiolam");
    // Kiểm tra rỗng
    if (!hour) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Giờ làm việc không được để trống"
        return false;
    }
    // Kiểm tra lương cơ bản
    if (hour < 80 || hour > 200) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = "Giờ làm (80-200 giờ)"
        return false;
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
}

function validateForm() {
    // Kĩ thuật Đặt cờ hiệu, mặc định ban đầu xem như form hợp lệ
    let isValid = true;
    isValid = validateUser() & validateName() & validateEmail() & validatePassword() & validateDate() & validateSalary() & validateRegency() & validateHour();

    if (!isValid) {
        //alert("Form không hợp lệ");
        return false;
    }
    return true;
}
