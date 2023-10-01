const modal = document.querySelector('.modal')
const modalOverlay = document.querySelector('.modal__overlay')
const register = document.querySelector('.navbar-item--register')
const login = document.querySelector('.navbar-item--login')
const navbarUser = document.querySelector(".navbar-item.navbar-user")
const navbarUserName = document.querySelector(".navbar-user-name")
const navbarUserLogout = document.querySelector(".navbar-user-item__logout")
const registerForm = document.querySelector('.auth-form--register')
const loginForm = document.querySelector('.auth-form--login')
const backRegisterBtn = document.querySelector('.auth-form--register .btn.auth-form__controls-back')
const backLoginBtn = document.querySelector('.auth-form--login .btn.auth-form__controls-back')
const switchRegisterBtn = document.querySelector('.auth-form--register .auth-form__switch-btn')
const switchLoginBtn = document.querySelector('.auth-form--login .auth-form__switch-btn')
const headerHistoryList = document.querySelector('.header__search-history-list')
const searchMobileIcon = document.querySelector('.header__mobile-search-icon')
const headerSearch = document.querySelector('.header__search')
const registerBtn = document.querySelector(".btn.btn--primary.btn--register")
const loginCustomerBtn = document.querySelector(".btn.btn--primary.btn--login.btn--login-customer")
const headerSearchInput = document.querySelector(".header__search-input")

modalOverlay.onclick = () => {
    modal.style.display = "none"
    registerForm.style.display = "none"
    loginForm.style.display = "none"
}

register.onclick = () => {
    modal.style.display = "flex"
    registerForm.style.display = "block"
}

login.onclick = () => {
    modal.style.display = "flex"
    loginForm.style.display = "block"
}

backRegisterBtn.onclick = () => {
    registerForm.style.display = "none"
    modal.style.display = "none"
}

backLoginBtn.onclick = () => {
    loginForm.style.display = "none"
    modal.style.display = "none"
}

switchRegisterBtn.onclick = () => {
    registerForm.style.display = "none"
    loginForm.style.display = "block"
}

switchLoginBtn.onclick = () => {
    loginForm.style.display = "none"
    registerForm.style.display = "block"
}

headerHistoryList.onmousedown = (e) => {
    e.preventDefault()
}

searchMobileIcon.onclick = () => {
    headerSearch.style.display = "flex"
}

// Call API 
// ----------------------------------------------------------------------------------------------------------------------

const getAllProducts = (callback) => {
    fetch('http://localhost:8080/Gradle___vn_edu_iuh_fit___week02_lab_voquocthinh_20078241_1_0_SNAPSHOT_war/api/products')
    .then((response) => {
        return response.json();
    })
    .then(callback)
}

const registerFunc = (data) => {
    var options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    fetch('http://localhost:8080/Gradle___vn_edu_iuh_fit___week02_lab_voquocthinh_20078241_1_0_SNAPSHOT_war/api/customers', options)
    .then((response) => {
        if(response.ok){
            alert("Bạn đã đăng ký thành công!")
            switchRegisterBtn.onclick()
            document.querySelector('input[name="register-name"]').value = ""
            document.querySelector('input[name="register-email"]').value = ""
            document.querySelector('input[name="register-phone"]').value = ""
            document.querySelector('input[name="register-address"]').value = ""
        }
        else{
            alert("Email đã tồn tại!")
        }
    })
}

const loginFunc = (data,callback) => {
    fetch(`http://localhost:8080/Gradle___vn_edu_iuh_fit___week02_lab_voquocthinh_20078241_1_0_SNAPSHOT_war/api/customers/login?email=${data.email}&phone=${data.phone}`)
    .then((response) => {
        if(response.ok){
            document.querySelector('input[name="login-email"]').value = ""
            document.querySelector('input[name="login-phone"]').value = ""
            return response.json();
        }
        else{
            alert("Tài khoản email hoặc số điện thoại không chính xác!")
        }
    })
    .then(callback)
}

const getAllProducts2 = (keyword,callback) => {
    fetch(`http://localhost:8080/Gradle___vn_edu_iuh_fit___week02_lab_voquocthinh_20078241_1_0_SNAPSHOT_war/api/products/search?keyword=${keyword}`)
    .then((response) => {
        return response.json();
    })
    .then(callback)
}

// ----------------------------------------------------------------------------------------------------------------------



// Từ API render ra giao diện
// ----------------------------------------------------------------------------------------------------------------------

const renderProducts = (products) => {
    const listProductsBlock = document.querySelector(".home-product .row.sm-gutter")
    const categoryList = document.querySelector(".category-list")
    const formatCash = (str) => {
        return str.split('').reverse().reduce((prev, next, index) => {
            return ((index % 3) ? next : (next + '.')) + prev
        })
    }

    var htmls = products.map(product => {
        return `
            <div class="col l-2-4 m-4 c-6">
                <a class="home-product-item" href="#">
                    <div class="home-product-item__img" style="background-image: url(${product.productImages[0].path});"></div>
                    <h4 class="home-product-item__name">${product.name}</h4>
                    <div class="home-product-item__price">
                        <span class="home-product-item__price-current">${formatCash(String(product.productPrices[0].price))}đ <span class="home-product-item__unit">/ ${product.unit}</span></span>
                    </div>
                    <div class="home-product-item__detail">
                        <span class="home-product-item__brand">${product.manufacturer}</span>
                        <span class="home-product-item__sold">${product.orderDetails[0]!=null ? product.orderDetails.reduce((acc,cur)=>acc+cur.quantity,0) : 0} đã bán</span>
                    </div>
                </a>
            </div>
        `
    })

    var htmls2 = products.map(product => {
        return `
            <li class="category-item">
                <a href="#" class="category-item__link">${product.manufacturer}</a>
            </li>
        `
    })

    listProductsBlock.innerHTML = htmls.join('')
    categoryList.innerHTML = htmls2.join('')
}

const renderSearchInput = (products) => {
    const searchHistoryList = document.querySelector(".header__search-history-list")

    var htmls = products.map(product => {
        return `
            <li class="header__search-history-item">
                <a href="">${product.name}</a>
            </li>
        `
    })

    searchHistoryList.innerHTML = htmls.join('')
}

const showUserItem = (customer) => {
    if(customer){
        backLoginBtn.onclick()
        register.style.display = "none"
        login.style.display = "none"
        navbarUser.style.display = "flex"
        navbarUserName.textContent = customer.name
    }
}

// ----------------------------------------------------------------------------------------------------------------------

// Xử lý event
// ----------------------------------------------------------------------------------------------------------------------


const handleRegisterForm = () =>{
    var name = document.querySelector('input[name="register-name"]').value
    var email = document.querySelector('input[name="register-email"]').value
    var phone = document.querySelector('input[name="register-phone"]').value
    var address = document.querySelector('input[name="register-address"]').value
    var formData = {
        name: name,
        email: email,
        phone: phone,
        address: address
    };
    registerFunc(formData)
}

const handleLoginForm = () =>{
    var email = document.querySelector('input[name="login-email"]').value
    var phone = document.querySelector('input[name="login-phone"]').value
    var formData = {
        email: email,
        phone: phone
    };
    loginFunc(formData,showUserItem)
}

const handleSearch = () => {
    headerSearchInput.onchange = (e) => {
        getAllProducts2(e.target.value,renderSearchInput)
    }
}

const handleLogout = () => {
    navbarUserLogout.onclick = (e) => {
        e.preventDefault()
        register.style.display = "flex"
        login.style.display = "flex"
        navbarUser.style.display = "none"
    }
}

// ----------------------------------------------------------------------------------------------------------------------

// Form Validation
// ----------------------------------------------------------------------------------------------------------------------

function Validator(formSelector,submitBtn,handleSubmit) {
    const formRules = {}

    function getParent(element, selector) {
        while (element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    const validatorRules = {
        required: function(value) {
            return value ? undefined : 'Vui lòng nhập trường này!' 
        },
        email: function(value) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) ? undefined : 'Vui lòng nhập đúng định dạng email!' 
        },
        min: function(min) {
            return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự!` 
            }
        },
        max: function(max) {
            return function(value) {
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${min} kí tự!` 
            }
        },
    }

    //Lấy formElement trong DOM theo formSelector
    const formElement = document.querySelector(formSelector)

    //Chỉ xử lý khi có formElement
    if(formElement) {
        const inputs = formElement.querySelectorAll('[name][rules]')
        
        for(let input of inputs){
            let rules = input.getAttribute('rules').split('|')
            for(let rule of rules) {
                if(rule.includes(':')){
                    const ruleInfo = rule.split(':')
                    rule = ruleInfo[0]
                    validatorRules[rule] = validatorRules[rule](ruleInfo[1])
                }

                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(validatorRules[rule])
                }
                else{
                    formRules[input.name] = [validatorRules[rule]]
                }
            }

            //Lắng nghe sự kiện để validate
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }

        function handleValidate(event){
            const rules = formRules[event.target.name]
            let errorMessage

            rules.some((rule) => {
                errorMessage = rule(event.target.value)
                return errorMessage
            })
            
            if(errorMessage){
                const formGroup = getParent(event.target, '.form-group')
                if(formGroup){
                    formGroup.classList.add('invalid')
                    const formMessage = formGroup.querySelector('.form-message')
                    if(formMessage){
                        formMessage.innerText = errorMessage
                    }
                }
            }

            return !errorMessage
        }

        function handleClearError(event){
            const formGroup = getParent(event.target, '.form-group')
            if(formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid')
                const formMessage = formGroup.querySelector('.form-message')
                if(formMessage){
                    formMessage.innerText = ''
                }
            }
        }

    }

    submitBtn.onclick = () => {
        const inputs = formElement.querySelectorAll('[name][rules]')
        let isValid = true
        
        for(let input of inputs){
            if(!handleValidate({target: input})){
                isValid = false
            }
        }

        //Khi không có lỗi
        if(isValid){
            handleSubmit()
        }
    }
}

// ----------------------------------------------------------------------------------------------------------------------



const start = () => {
    getAllProducts(renderProducts);
    getAllProducts2("",renderSearchInput)
    Validator('.auth-form--register',registerBtn,handleRegisterForm)
    Validator('.auth-form--login', loginCustomerBtn, handleLoginForm)
    handleSearch();
    handleLogout();
}

start();
