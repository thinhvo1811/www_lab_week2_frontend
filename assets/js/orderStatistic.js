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
const statictisByDate = document.querySelector(".order-statictis__by-date")
const statictisByPeriod = document.querySelector(".order-statictis__by-period")
const statictisByEmployeeAndPeriod = document.querySelector(".order-statictis__by-employee-and-period")
const selectEmployeeForm = document.querySelector(".order-statictis__select-employee")
const fromdateForm = document.querySelector(".order-statictis__select-fromdate")
const todateForm = document.querySelector(".order-statictis__select-todate")
const fromdateLabel = document.querySelector(".fromdate-label")
const statisticBtn = document.querySelector(".statistic__btn")
const selectInputLabel = document.querySelector(".select-input__label")
const employeeSelect = document.querySelector(".order-statictis__employee-list")
const fromdateInput = document.querySelector(".order-statictis__fromdate-input")
const todateInput = document.querySelector(".order-statictis__todate-input")
const basePath = sessionStorage.getItem('BASE_PATH')


statictisByDate.onclick = (e) => {
    e.preventDefault()
    fromdateForm.style.display = "block"
    fromdateLabel.textContent = "Ngày"
    selectInputLabel.textContent = "Theo ngày"
    todateForm.style.display = "none"
    selectEmployeeForm.style.display = "none"
    statisticBtn.style.display = "block"
}

statictisByPeriod.onclick = (e) => {
    e.preventDefault()
    fromdateForm.style.display = "block"
    todateForm.style.display = "block"
    selectEmployeeForm.style.display = "none"
    fromdateLabel.textContent = "Từ ngày"
    selectInputLabel.textContent = "Theo khoảng thời gian"
    statisticBtn.style.display = "block"
}

statictisByEmployeeAndPeriod.onclick = (e) => {
    e.preventDefault()
    fromdateForm.style.display = "block"
    todateForm.style.display = "block"
    selectEmployeeForm.style.display = "block"
    fromdateLabel.textContent = "Từ ngày"
    selectInputLabel.textContent = "Theo nhân viên"
    statisticBtn.style.display = "block"
}


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

const getAllEmployees = (callback) => {
    fetch(`${basePath}/employees`)
    .then((response) => {
        return response.json();
    })
    .then(callback)
}

const getOrdersByDate = (date,callback) => {
    fetch(`${basePath}/orders/searchbydate?date=${date}`)
    .then((response) => {
        return response.json();
    })
    .then(callback)
}

const getOrdersByPeriod = (fromdate,todate,callback) => {
    fetch(`${basePath}/orders/searchbyperiod?fromdate=${fromdate}&todate=${todate}`)
    .then((response) => {
        return response.json();
    })
    .then(callback)
}

const getOrdersByEmployeeAndPeriod = (employeeID,fromdate,todate,callback) => {
    fetch(`${basePath}/orders/searchbyempandperiod?empID=${employeeID}&fromdate=${fromdate}&todate=${todate}`)
    .then((response) => {
        return response.json();
    })
    .then(callback)
}

const renderOrders = (orders) => {
    const orderList = document.querySelector(".order-statictis__order-list")
    const formatCash = (str) => {
        return str.split('').reverse().reduce((prev, next, index) => {
            return ((index % 3) ? next : (next + '.')) + prev
        })
    }
    var htmls = orders.map(order => {
        return `
            <tr>
                <th scope="row">${order.id}</th>
                <td>${order.orderDate[2]}/${order.orderDate[1]}/${order.orderDate[0]} ${order.orderDate[3]}:${order.orderDate[4]}:${order.orderDate[5]}</td>
                <td>${formatCash(String(order.orderDetails.reduce((acc,cur)=>acc+cur.price,0)))}đ</td>
            </tr>
        `
    })
    var html = `
            <table class="table table-striped table-hover">
                <thead class="fs-3">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Date</th>
                        <th scope="col">Total</th>
                    </tr>
                </thead>
                <tbody class="fs-4">
                    ${htmls.join('')}
                    <tr>
                        <th scope="row">Total</th>
                        <td></td>
                        <td>${formatCash(String(orders.reduce((acc,cur)=>acc+cur.orderDetails.reduce((acc,cur)=>acc+cur.price,0),0)))}đ</td>
                  </tr>
                </tbody>
            </table>
    `
    orderList.innerHTML = html
}

const renderComboboxEmployee = (employees) => {
    var htmls = employees.map(employee => {
        return `
            <option value="${employee.id}">${employee.id}</option>
        `
    })
    employeeSelect.innerHTML = htmls.join('')
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

statisticBtn.onclick = () => {
    if(selectInputLabel.textContent == "Theo ngày"){
        const date = fromdateInput.value
        
        if(date){
            getOrdersByDate(date, renderOrders)
        }
        else{
            alert("Vui lòng chọn ngày")
        }
    }
    else if(selectInputLabel.textContent == "Theo khoảng thời gian"){
        const fromdate = fromdateInput.value
        const todate = todateInput.value

        if(fromdate && todate){
            getOrdersByPeriod(fromdate, todate, renderOrders)
        }
        else if(!fromdate){
            alert("Vui lòng chọn từ ngày nào")
        }
        else if(!todate){
            alert("Vui lòng chọn đến ngày nào")
        }
    }
    else if(selectInputLabel.textContent == "Theo nhân viên"){
        const fromdate = fromdateInput.value
        const todate = todateInput.value
        const employeeID = employeeSelect.value

        if(employeeID && fromdate && todate){
            getOrdersByEmployeeAndPeriod(employeeID, fromdate, todate, renderOrders)
        }
        else if(!fromdate){
            alert("Vui lòng chọn từ ngày nào")
        }
        else if(!todate){
            alert("Vui lòng chọn đến ngày nào")
        }
    }
}

const start = () => {
    getAllProductsByKeyWord("",renderSearchInput)
    handleSearch()
    handleShowUserItem()
    handleLogout()
    renderCartList()
    renderCartNotice()
    getAllEmployees(renderComboboxEmployee)
}

start();