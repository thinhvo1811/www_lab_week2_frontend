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
const productSelect = document.querySelector(".product-chart__product-list")
const chartBtn = document.querySelector(".product-chart__btn")
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

const getAllProducts = (callback) => {
    fetch(`${basePath}/products`)
    .then((response) => {
        return response.json();
    })
    .then(callback)
}

const getProductByID = (id,callback) => {
    fetch(`${basePath}/products/${id}`)
    .then((response) => {
        return response.json();
    })
    .then(callback)
}

const renderChart = (product) => {
    var dates = product.productPrices.map(productPrice => {
        return `${productPrice.priceDateTime[2]}/${productPrice.priceDateTime[1]}/${productPrice.priceDateTime[0]}`
    })
    var prices = product.productPrices.map(productPrice => {
        return productPrice.price
    })
    chartProduct(dates,prices)
}

const renderComboboxProduct = (products) => {
    var htmls = products.map(product => {
        return `
            <option value="${product.id}">${product.id}</option>
        `
    })
    productSelect.innerHTML = htmls.join('')
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

const chartProduct = (categories,data) => {
    Highcharts.chart("product-chart__chart", {
        title: {
            text: 'Product Price Chart',
        },
        xAxis: {
            categories: categories
        },
        yAxis: {
            title: {
                text: 'Price (đ)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: 'đ'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            data: data
        }]
    });
}

chartBtn.onclick = () => {
    getProductByID(productSelect.value,renderChart)
}

const start = () => {
    getAllProductsByKeyWord("",renderSearchInput)
    handleSearch()
    handleShowUserItem()
    handleLogout()
    renderCartList()
    renderCartNotice()
    getAllProducts(renderComboboxProduct)
}

start();