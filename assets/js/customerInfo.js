const updateCustomerForm = document.querySelector('.auth-form--update')
const updateCustomerBtn = document.querySelector(".btn.btn--primary.btn--update-customer")
const navbarUser = document.querySelector(".navbar-item.navbar-user")
const register = document.querySelector('.navbar-item--register')
const login = document.querySelector('.navbar-item--login')
const navbarUserName = document.querySelector(".navbar-user-name")
const navbarUserMenu = document.querySelector(".navbar-user-menu")
const navbarUserLogout = document.querySelectorAll(".navbar-user-item__logout")
const headerHistoryList = document.querySelector('.header__search-history-list')
const searchMobileIcon = document.querySelector('.header__mobile-search-icon')
const headerSearch = document.querySelector('.header__search')
const headerSearchInput = document.querySelector(".header__search-input")
const nameUser = document.querySelector('input[name="user-name"]')
const emailUser = document.querySelector('input[name="user-email"]')
const phoneUser = document.querySelector('input[name="user-phone"]')
const addressUser = document.querySelector('input[name="user-address"]')
const basePath = sessionStorage.getItem('BASE_PATH')

headerHistoryList.onmousedown = (e) => {
    e.preventDefault()
}

searchMobileIcon.onclick = () => {
    headerSearch.style.display = "flex"
}

const getAllProductsByKeyWord = (keyword,callback) => {
    fetch(`${basePath}/products/search?keyword=${keyword}`)
    .then((response) => {
        return response.json();
    })
    .then(products => {
        callback(products, setProductStorage)
    })
}

const renderCartList = () => {
    const cartListBlock = document.querySelector(".header__cart-list-item")
    var userCurrent = JSON.parse(sessionStorage.getItem("USER"))
    var cartList = []
    if(userCurrent){
        cartList = JSON.parse(localStorage.getItem(`CART${userCurrent.id}`) || "[]")
    }
    else{
        cartList = JSON.parse(localStorage.getItem("CART") || "[]")
    }
    const htmls = cartList.map((cart, index) => {
        return `
            <li class="header__cart-item">
                <img src="${cart.path.slice(5,cart.path.length)}" alt="" class="header__cart-item-img">
                <div class="header__cart-item-info">
                    <div class="header__cart-item-head">
                        <h5 class="header__cart-item-name">${cart.name}</h5>
                        <div class="header__cart-item-price-wrap">
                            <span class="header__cart-item-price">${cart.price}</span>
                            <span class="header__cart-item-multiply">x</span>
                            <span class="header__cart-item-quantity">${cart.quantity}</span>
                        </div>
                    </div>
                    <div class="header__cart-item-body">
                        <span class="header__cart-item-remove" onclick="removeCartItem(${index})">Xóa</span>
                    </div>
                </div>
            </li>
        `
    })

    cartListBlock.innerHTML = htmls.join('')
}

const renderCartNotice = () => {
    var userCurrent = JSON.parse(sessionStorage.getItem("USER"))
    var cartList = []
    if(userCurrent){
        cartList = JSON.parse(localStorage.getItem(`CART${userCurrent.id}`) || "[]")
    }
    else{
        cartList = JSON.parse(localStorage.getItem("CART") || "[]")
    }
    document.querySelector(".header__cart-notice").textContent = cartList.length
}

const renderSearchInput = (products, callback) => {
    var htmls = products.map(product => {
        return `
            <li class="header__search-history-item">
                <a href="../pages/productDetail.html" onclick="(${callback})(${product.id})">${product.name}</a>
            </li>
        `
    })

    headerHistoryList.innerHTML = htmls.join('')
}

const setProductStorage = (product) => {
    sessionStorage.setItem('PRODUCT', product)
} 

const showCustomerInfoForUpdate = () => {
    if(sessionStorage.getItem('USER'))
    {
        nameUser.value = JSON.parse(sessionStorage.getItem('USER')).name
        emailUser.value = JSON.parse(sessionStorage.getItem('USER')).email
        phoneUser.value = JSON.parse(sessionStorage.getItem('USER')).phone
        addressUser.value = JSON.parse(sessionStorage.getItem('USER')).address
    }
}

const showUserItem = (user) => {
    register.style.display = "none"
    login.style.display = "none"
    navbarUser.style.display = "flex"
    navbarUserName.textContent = user.name || user.fullname
}

const hiddenUserItem = () => {
    register.style.display = "flex"
    login.style.display = "flex"
    navbarUser.style.display = "none"
}

const showMenuForCustomer = () => {
    var css = '.navbar-user:hover .navbar-user-menu--customer{display: block;}';
    var style = document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.getElementsByTagName('head')[0].appendChild(style);
}

const showMenuForEmployee = () => {
    var css = '.navbar-user:hover .navbar-user-menu--employee{display: block;}';
    var style = document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    document.getElementsByTagName('head')[0].appendChild(style);
}

const handleSearch = () => {
    headerSearchInput.onkeydown = (e) => {
        getAllProductsByKeyWord(e.target.value,renderSearchInput)
    }
}

const handleShowUserItem = () => {
    if(sessionStorage.getItem('USER'))
    {
        showUserItem(JSON.parse(sessionStorage.getItem('USER')))
        if(JSON.parse(sessionStorage.getItem('USER')).user.type === 'CUSTOMER'){
            showMenuForCustomer()
        }
        else if(JSON.parse(sessionStorage.getItem('USER')).user.type === 'EMPLOYEE'){
            showMenuForEmployee()
        }
    }
    else{
        hiddenUserItem()
    }
}

const handleLogout = () => {
    for(var i = 0; i < navbarUserLogout.length; i++){
        navbarUserLogout[i].onclick = (e) => {
            e.preventDefault()
            sessionStorage.removeItem('USER')
            window.location.href = "../index.html"
        }
    }
}

const handleUpdateCustomerForm = () =>{
    var name = nameUser.value
    var email = emailUser.value
    var phone = phoneUser.value
    var address = addressUser.value
    var formData = {
        id: JSON.parse(sessionStorage.getItem('USER')).id,
        name: name,
        email: email,
        phone: phone,
        address: address
    };
    handleUpdateCustomer(formData,handleSuccessUpdateCustomer)
}

const handleUpdateCustomer = (data, callback) => {
    var options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    fetch(`${basePath}/customers/update`, options)
    .then((response) => {
        if(response.ok){
            return response.json();            
        }
        else{
            alert("Email đã tồn tại!")
        }
    })
    .then(callback)
}

const handleSuccessUpdateCustomer = (customer) => {
    if(customer){
        alert("Bạn đã cập nhật thành công!")
        sessionStorage.setItem('USER', JSON.stringify(customer))
        showCustomerInfoForUpdate()
    }
}

const removeCartItem = (i) => {
    var userCurrent = JSON.parse(sessionStorage.getItem("USER"))
    var oldCart = []
    if(userCurrent){
        oldCart = JSON.parse(localStorage.getItem(`CART${userCurrent.id}`) || "[]")
    }
    else{
        oldCart = JSON.parse(localStorage.getItem("CART") || "[]")
    }
    oldCart.splice(i,1)
    if(userCurrent){
        localStorage.setItem(`CART${userCurrent.id}`, JSON.stringify(oldCart))
    }
    else{
        localStorage.setItem("CART", JSON.stringify(oldCart))
    }
    renderCartList()
    renderCartNotice()
}

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
        phone: function(value) {
            return /((09|03|07|08|05)+([0-9]{8})\b)/g.test(value) ? undefined : 'Vui lòng nhập đúng định dạng số điện thoại!' 
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

const start = () => {
    Validator('.auth-form--update', updateCustomerBtn, handleUpdateCustomerForm)
    getAllProductsByKeyWord("",renderSearchInput)
    showCustomerInfoForUpdate();
    handleSearch()
    handleShowUserItem()
    handleLogout()
    renderCartList()
    renderCartNotice()
}

start();