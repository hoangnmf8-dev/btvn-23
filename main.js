const $ = document.querySelector.bind(document);
const usernameInput = $("#username");
const emailInput = $("#email");
const passwordInput = $("#password");
const confirmationInput = $("#confirmation");
const formEl = $("#register");
const overlayEl = $(".overlay");
const notifyEl = $(".notify");

const checkFuncObj = {
  username: [],
  email: [],
  password: [],
  confirmation: []
};

//Hàm làm sạch đầu vào
const escapeHTML = (input) => {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(input)); // Làm sạch input
  return div.innerHTML; // Trả về nội dung đã được encode
};

//Hàm lấy ra các element trong form-group,
// có thể thêm tham số parent thay (".form-group") để mở rộng khả năng tìm kiếm
const getElementInGroup = (element, selector) => {
  return element.closest(".form-group").querySelector(selector);
};

//Hàm sử dụng chung để thông báo
const validateFunc = (e, input, callback) => {
  let inputEl = input === null ? e.target : input;
  let inputValue = escapeHTML(inputEl.value.trim());
  const conditionObj = callback(inputValue);
  if (!conditionObj.isValid) {
    inputEl.classList.replace("border-gray-400", "border-red-500");
    getElementInGroup(inputEl, ".form-group-error").innerText =
      conditionObj.errorText;
    getElementInGroup(inputEl, ".form-group-error").classList.remove("hidden");
    getElementInGroup(inputEl, ".form-group-svg.complete").classList.add(
      "hidden"
    );
    getElementInGroup(inputEl, ".form-group-svg.error").classList.remove(
      "hidden"
    );
    return false;
  } else {
    inputEl.classList.replace("border-red-500", "border-gray-400");
    getElementInGroup(inputEl, ".form-group-error").classList.add("hidden");
    getElementInGroup(inputEl, ".form-group-svg.complete").classList.remove(
      "hidden"
    );
    getElementInGroup(inputEl, ".form-group-svg.error").classList.add("hidden");
  }
  return true;
};

/* Tách riêng logic kiểm tra ở các trường để dễ mở rộng khi có thêm input và 
dễ sửa lỗi ở các hàm check riêng biệt, tránh sửa lỗi vào logic chung */
/* Có thể mở rộng thêm logic check các lỗi cho từng input. VD: độ dài lớn hơn 8 ký tự, hoa, thường, có chữ số, 
kí tự đặc biệt,.... Với bài tập này chưa yêu cầu những nội dung trên */

//Check username
const checkUser = (inputValue) => {
  let isValid = true;
  let errorText;
  if (!inputValue) {
    isValid = false;
    errorText = "Username cannot be blank";
  }
  return {
    errorText,
    isValid,
  };
};
checkFuncObj.username.push(usernameInput);
checkFuncObj.username.push(checkUser);

//Check email
const checkEmail = (inputValue) => {
  let isValid = true;
  let errorText;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!inputValue || !emailRegex.test(inputValue)) {
    isValid = false;
    errorText = "Please enter valid email address";
  }
  return {
    isValid,
    errorText,
  };
};
checkFuncObj.email.push(emailInput);
checkFuncObj.email.push(checkEmail);

//Check password
const checkPassword = (inputValue) => {
  let isValid = true;
  let errorText;
  if (!inputValue) {
    isValid = false;
    errorText = "Password cannot be blank";
  }
  return {
    isValid,
    errorText,
  };
};
checkFuncObj.password.push(passwordInput);
checkFuncObj.password.push(checkPassword);

//Check comfirmation password
const checkConfirmation = (inputValue) => {
  let isValid = true;
  let errorText;

  if (!inputValue) {
    isValid = false;
    errorText = "Password confirmation required";
  } else if (inputValue !== passwordInput.value) {
    isValid = false;
    errorText = "Password does not match";
  }
  return {
    isValid,
    errorText,
  };
};
checkFuncObj.confirmation.push(confirmationInput);
checkFuncObj.confirmation.push(checkConfirmation);

//Event submit
usernameInput.addEventListener("input", (e) => {
  validateFunc(e, null, checkFuncObj.username[1]);
});

emailInput.addEventListener("input", (e) => {
  validateFunc(e, null, checkFuncObj.email[1]);
});

passwordInput.addEventListener("input", (e) => {
  validateFunc(e, null, checkFuncObj.password[1]);
  validateFunc(null, confirmationInput, checkFuncObj.confirmation[1]); // Khi password và confirmation đã nhập và match với nhau, nhưng sau đó password thay đổi thì confirmation cũng phải được kiểm tra lại 
});

confirmationInput.addEventListener("input", (e) => {
  validateFunc(e, null, checkFuncObj.confirmation[1]);
});

formEl.addEventListener("submit", (e) => {
  e.preventDefault(); //ngăn chặn hành động mặc định của form
  let isValidForm = true;
  Object.values(checkFuncObj).forEach(([input, checkFunc]) => {
    isValidForm
      ? (isValidForm = validateFunc(null, input, checkFunc))
      : validateFunc(null, input, checkFunc);
  });

  if (isValidForm) {
    //Logic khi đã nhập đúng hết các trường
    overlayEl.classList.remove("hidden");
    notifyEl.classList.remove("hidden");
  }
});

const disappear = () => {
  overlayEl.classList.add("hidden");
  notifyEl.classList.add("hidden");
};
notifyEl.querySelector(".btn").addEventListener("click", disappear);
overlayEl.addEventListener("click", disappear);
