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


headerHistoryList.onmousedown = (e) => {
    e.preventDefault()
}

searchMobileIcon.onclick = () => {
    headerSearch.style.display = "flex"
}

const getAllProductsByKeyWord = (keyword,callback) => {
    fetch(`http://localhost:8080/Gradle___vn_edu_iuh_fit___week02_lab_voquocthinh_20078241_1_0_SNAPSHOT_war/api/products/search?keyword=${keyword}`)
    .then((response) => {
        return response.json();
    })
    .then(callback)
}

const getProductByID = (callback) => {
    if(sessionStorage.getItem('PRODUCT')){
        fetch(`http://localhost:8080/Gradle___vn_edu_iuh_fit___week02_lab_voquocthinh_20078241_1_0_SNAPSHOT_war/api/products/${parseInt(sessionStorage.getItem('PRODUCT'))}`)
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
    productPrice.textContent = `${formatCash(String(product.productPrices[0].price))}đ`

    const productImgList = document.querySelector(".product-detail__img-list--list")
    var htmls = product.productImages.map(image => {
        return `
            <li class="product-detail__img-list--item" style="background-image: url(${image.path});" onclick="renderMainImg('${image.path}')"></li>
        `
    })
    productImgList.innerHTML = htmls.join('')
}

const renderMainImg = (path) => {
    document.querySelector(".product-detail__img-main").style.backgroundImage = `url('${path}')`;
}

const renderSearchInput = (products) => {
    var htmls = products.map(product => {
        return `
            <li class="header__search-history-item">
                <a href="../pages/productDetail.html" onclick="setProductStorage('${product.id}')">${product.name}</a>
            </li>
        `
    })

    headerHistoryList.innerHTML = htmls.join('')
}

const renderCartList = () => {
    const cartListBlock = document.querySelector(".header__cart-list-item")
    const cartList = JSON.parse(localStorage.getItem("CART") || "[]")
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
    const cartList = JSON.parse(localStorage.getItem("CART") || "[]")
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

const handleShowCustomerItem = () => {
    if(sessionStorage.getItem('USER'))
    {
        showUserItem(JSON.parse(sessionStorage.getItem('USER')))
        if(JSON.parse(sessionStorage.getItem('USER')).name){
            showMenuForCustomer()
        }
        else{
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
    var oldCart = JSON.parse(localStorage.getItem("CART") || "[]")

    const newCart = [
    ...oldCart,
    {
        path: productMainImg.style.backgroundImage,
        name: productName.textContent,
        price: productPrice.textContent,
        quantity: productQuantity.value
    }]
    localStorage.setItem('CART', JSON.stringify(newCart))
    renderCartList()
    renderCartNotice()
}

const removeCartItem = (i) => {
    var oldCart = JSON.parse(localStorage.getItem("CART") || "[]")
    oldCart.splice(i,1)
    localStorage.setItem('CART', JSON.stringify(oldCart))
    renderCartList()
    renderCartNotice()
}

const start = () => {
    getAllProductsByKeyWord("",renderSearchInput)
    handleSearch()
    handleShowCustomerItem()
    handleLogout()
    getProductByID(renderProduct)
    renderCartList()
    renderCartNotice()
}

start();