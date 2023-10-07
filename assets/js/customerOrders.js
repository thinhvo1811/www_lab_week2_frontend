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

headerHistoryList.onmousedown = (e) => {
    e.preventDefault()
}

searchMobileIcon.onclick = () => {
    headerSearch.style.display = "flex"
}

const getAllOrders = (callback) => {
    fetch(`http://localhost:8080/Gradle___vn_edu_iuh_fit___week02_lab_voquocthinh_20078241_1_0_SNAPSHOT_war/api/customers/orders/${JSON.parse(sessionStorage.getItem('USER')).id}`)
    .then((response) => {
        return response.json();
    })
    .then(callback)
}

const getAllProductsByKeyWord = (keyword,callback) => {
    fetch(`http://localhost:8080/Gradle___vn_edu_iuh_fit___week02_lab_voquocthinh_20078241_1_0_SNAPSHOT_war/api/products/search?keyword=${keyword}`)
    .then((response) => {
        return response.json();
    })
    .then(callback)
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

const renderSearchInput = (products) => {
    var htmls = products.map(product => {
        return `
            <li class="header__search-history-item">
                <a href="">${product.name}</a>
            </li>
        `
    })

    headerHistoryList.innerHTML = htmls.join('')
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

const start = () => {
    getAllOrders(renderOrders);
    getAllProductsByKeyWord("",renderSearchInput)
    handleSearch()
    handleShowCustomerItem()
    handleLogout()
}

start();