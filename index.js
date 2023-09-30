const modal = document.querySelector('.modal')
const modalOverlay = document.querySelector('.modal__overlay')
const register = document.querySelector('.navbar-item--register')
const login = document.querySelector('.navbar-item--login')
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

const start = () => {
    getAllProducts(renderProducts);
    handleRegisterForm();
    getAllProducts2("",renderSearchInput)
    handleSearch();
}

const getAllProducts = (callback) => {
    fetch('http://localhost:8080/Gradle___vn_edu_iuh_fit___week02_lab_voquocthinh_20078241_1_0_SNAPSHOT_war/api/products')
    .then((response) => {
        return response.json();
    })
    .then(callback)
}

const addCustomer = (data) => {
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
        }
    })
}

const getAllProducts2 = (keyword,callback) => {
    fetch(`http://localhost:8080/Gradle___vn_edu_iuh_fit___week02_lab_voquocthinh_20078241_1_0_SNAPSHOT_war/api/products/search?keyword=${keyword}`)
    .then((response) => {
        return response.json();
    })
    .then(callback)
}

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

const handleRegisterForm = () =>{
    registerBtn.onclick = () => {
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
        addCustomer(formData)
    }
}

const handleSearch = () => {
    headerSearchInput.onchange = (e) => {
        getAllProducts2(e.target.value,renderSearchInput)
    }
}

start();
