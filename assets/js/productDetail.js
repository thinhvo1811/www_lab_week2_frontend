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
const addCartBtn = document.querySelector(".product-detail__info-btn--add-cart")
const productMainImg = document.querySelector(".product-detail__img-main")
const productName = document.querySelector(".product-detail__info-name")
const productSoldQuantity = document.querySelector(".product-detail__info-sold-quantity")
const productPrice = document.querySelector(".product-detail__info-price")
const productQuantity = document.querySelector(".product-detail__info-quantity-input")
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

const getProductByID = (callback) => {
    if(sessionStorage.getItem('PRODUCT')){
        fetch(`${basePath}/products/${parseInt(sessionStorage.getItem('PRODUCT'))}`)
        .then((response) => {
            return response.json();
        })
        .then(callback)
    }
}

const renderProduct = (product) => {
    const formatCash = (str) => {
        return str.split('').reverse().reduce((prev, next, index) => {
            return ((index % 3) ? next : (next + '.')) + prev
        })
    }

    productMainImg.style.backgroundImage = `url('${product.productImages[0].path}')`;
    productName.textContent = `${product.name}`
    productSoldQuantity.textContent = `${product.soldQuantity} Đã bán`
    productPrice.textContent = `${formatCash(String(product.productPrices[product.productPrices.length-1].price))}đ`

    const productImgList = document.querySelector(".product-detail__img-list--list")
    var htmls = product.productImages.map((image,index) => {
        return `
            <li class="product-detail__img-list--item" style="background-image: url(${image.path});" onclick="renderMainImg('${image.path}')"></li>
        `
    })
    productImgList.innerHTML = htmls.join('')
}

const renderMainImg = (path) => {
    document.querySelector(".product-detail__img-main").style.backgroundImage = `url('${path}')`;
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

const setProductStorage = (product) => {
    sessionStorage.setItem('PRODUCT', product)
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
    for(i = 0; i < navbarUserLogout.length; i++){
        navbarUserLogout[i].onclick = (e) => {
            e.preventDefault()
            sessionStorage.removeItem('USER')
            window.location.href = "../index.html"
        }
    }
}

addCartBtn.onclick = () =>{
    var userCurrent = JSON.parse(sessionStorage.getItem("USER"))
    var oldCart = []
    if(userCurrent){
        oldCart = JSON.parse(localStorage.getItem(`CART${userCurrent.id}`) || "[]")
    }
    else{
        oldCart = JSON.parse(localStorage.getItem("CART") || "[]")
    }

    const newCart = [
    ...oldCart,
    {
        path: productMainImg.style.backgroundImage,
        name: productName.textContent,
        price: productPrice.textContent,
        quantity: productQuantity.value
    }]
    if(userCurrent){
        localStorage.setItem(`CART${userCurrent.id}`, JSON.stringify(newCart))
    }
    else{
        localStorage.setItem("CART", JSON.stringify(newCart))
    }
    
    renderCartList()
    renderCartNotice()
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

// console.log(JSON.parse(sessionStorage.getItem("USER")).id)

const start = () => {
    getAllProductsByKeyWord("",renderSearchInput)
    handleSearch()
    handleShowUserItem()
    handleLogout()
    getProductByID(renderProduct)
    renderCartList()
    renderCartNotice()
}

start();