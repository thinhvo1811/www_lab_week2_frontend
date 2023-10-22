const navbarUser = document.querySelector(".navbar-item.navbar-user")
const register = document.querySelector('.navbar-item--register')
const login = document.querySelector('.navbar-item--login')
const navbarUserName = document.querySelector(".navbar-user-name")
const navbarUserLogout = document.querySelectorAll(".navbar-user-item__logout")
const headerHistoryList = document.querySelector('.header__search-history-list')
const searchMobileIcon = document.querySelector('.header__mobile-search-icon')
const headerSearch = document.querySelector('.header__search')
const headerSearchInput = document.querySelector(".header__search-input")
const basePath = sessionStorage.getItem('BASE_PATH')

headerHistoryList.onmousedown = (e) => {
    e.preventDefault()
}

searchMobileIcon.onclick = () => {
    headerSearch.style.display = "flex"
}

const getAllOrders = (callback) => {
    fetch(`${basePath}/customers/orders/${JSON.parse(sessionStorage.getItem('USER')).id}`)
    .then((response) => {
        return response.json();
    })
    .then(callback)
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

const renderOrders = (orders) => {
    const listOrdersBlock = document.querySelector(".order-list")
    const formatCash = (str) => {
        return str.split('').reverse().reduce((prev, next, index) => {
            return ((index % 3) ? next : (next + '.')) + prev
        })
    }

    var htmls = orders.map(order => {
        var orderDetails = order.orderDetails.map(orderDetail => {
            return `
                <li class="order-detail">
                    <div class="order-detail__product-img" style="background-image: url(${orderDetail.product.productImages[0].path});"></div>
                    <div class="order-detail__product-info">
                        <div class="order-detail__product-name">${orderDetail.product.name}</div>
                        <div class="order-detail__product-detail">
                            <div class="order-detail__product-quantity">x${orderDetail.quantity}</div>
                            <div class="order-detail__product-price">${formatCash(String(orderDetail.price))}đ</div>
                        </div>
                    </div>
                </li>

            `
        })
        return `
            <div class="row">
                <ul class="order">
                    <div class="order-head">Đơn hàng: <span class="order-id">${order.id}</span></div>
                        ${orderDetails.join('')}
                    <div class="order-price">Tổng tiền: <span class="order-total">${formatCash(String(order.orderDetails.reduce((acc,cur)=>acc+cur.price,0)))}đ</span></div>
                </ul>
            </div>
        `
    })

    listOrdersBlock.innerHTML = htmls.join('')
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
    for(var i = 0; i < navbarUserLogout.length; i++){
        navbarUserLogout[i].onclick = (e) => {
            e.preventDefault()
            sessionStorage.removeItem('USER')
            window.location.href = "../index.html"
        }
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

const start = () => {
    getAllOrders(renderOrders);
    getAllProductsByKeyWord("",renderSearchInput)
    handleSearch()
    handleShowUserItem()
    handleLogout()
    renderCartList()
    renderCartNotice()
}

start();