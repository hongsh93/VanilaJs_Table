import './style.css'
import jsonData from './temp.json'

let table_data
const DATA_PER_PAGE = 10
let max_page
let cur_page = 1
const HEADERS = ['id', 'content', 'category', 'created_at', 'recommended']
const HEADERS2 = ['id', '제목', '카테고리', '생성날짜', '추천']
let sorted = 0
let direction = 1

const onLoad = function() {  
    window.onload = async function(event) {
        // const res = await fetch('/contents', {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        // table_data = await res.json()
        table_data = jsonData
        max_page = Math.ceil(table_data.length / DATA_PER_PAGE)

        displayItems(1, DATA_PER_PAGE)
        pageNav(DATA_PER_PAGE)
        makeHeaderSort(0)
        makeHeaderSort(3)
        makeHeaderSort(4)
    }
}
onLoad()

const isoToDate = function(str) {
    let date = new Date(str);
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let dt = date.getDate();

    let hour = date.getHours()
    let minute = date.getMinutes()

    if (dt < 10) {
        dt = '0' + dt
    }
    if (month < 10) {
        month = '0' + month
    }
    if (hour < 10) {
        hour = '0' + hour
    }
    if (minute < 10) {
        minute = '0' + minute
    }

    return `${year}-${month}-${dt} ${hour}:${minute}`
}
module.exports = isoToDate

const makeHeaderSort = function(columnNum) {
    document.getElementById('tableHead').children[0].children[columnNum].className += " sortable"
    document.getElementById('tableHead').children[0].children[columnNum].addEventListener('click', function(e) {
        sortTable(columnNum)
    })
    if (columnNum !== 0) {
        document.getElementById('tableHead').children[0].children[columnNum].innerHTML += " <i class=\"fas fa-sort\"></i>"
    }
    else {
        document.getElementById('tableHead').children[0].children[columnNum].innerHTML += " <i class=\"fas fa-sort-up\"></i>"
        document.getElementById('tableHead').children[0].children[columnNum].style.backgroundColor = "#cce6ff"
    }
    
}

const pageNav = function(perPage) {
    let e = document.getElementById('pagination')
    let child = e.lastElementChild; 
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
    let firstButton = document.createElement('button')
    firstButton.innerText = '|<'
    firstButton.addEventListener('click', function(e) {
        displayItems(1, perPage)
        pageNav(perPage)
    })
    document.getElementById('pagination').appendChild(firstButton)

    let previousButton = document.createElement('button')
    previousButton.innerText = '<'
    previousButton.addEventListener('click', function(e) {
        cur_page > 1 ? displayItems(cur_page-1, perPage) : null
        if (cur_page % 10 === 0) {
            pageNav(perPage)
        }
    })
    document.getElementById('pagination').appendChild(previousButton)

    let dividedByTen = Math.floor((cur_page-1)/10)
    let lastPage = (max_page - dividedByTen*10) >= 10 ? (dividedByTen+1)*10 : max_page

    for (let i = dividedByTen*10 + 1; i <= lastPage; i++) {
        let pageButton = document.createElement('button')
        if (i===cur_page) {
            pageButton.style.color = '#FB3C00'
        }
        pageButton.innerText = i
        pageButton.addEventListener('click', function(e) {
            displayItems(i, perPage)
        })
        document.getElementById('pagination').appendChild(pageButton)
    }

    let nextButton = document.createElement('button')
    nextButton.innerText = '>'
    nextButton.addEventListener('click', function(e) {
        cur_page < max_page ? displayItems(cur_page+1, perPage) : null
        if (cur_page % 10 === 1) {
            pageNav(perPage)
        }
    })
    document.getElementById('pagination').appendChild(nextButton)

    let lastButton = document.createElement('button')
    lastButton.innerText = '>|'
    lastButton.addEventListener('click', function(e) {
        displayItems(max_page, perPage)
        pageNav(perPage)
    })
    document.getElementById('pagination').appendChild(lastButton)
}

const displayItems = function(page, perPage) {
    let table = document.querySelector('tbody')
    let child = table.lastElementChild; 
    while (child) {
        table.removeChild(child);
        child = table.lastElementChild;
    }
    if (document.getElementById('pagination').children[(cur_page-1)%10+2]) {
        document.getElementById('pagination').children[(cur_page-1)%10+2].style.color = '#000000'
    }
    cur_page = page
    if (document.getElementById('pagination').children[(cur_page-1)%10+2]) {
        document.getElementById('pagination').children[(cur_page-1)%10+2].style.color = '#FB3C00'
    }

    let temp_length = max_page === page ? table_data.length - perPage * (page-1) : perPage
    table_data.slice(perPage * (page-1), perPage * (page-1) + temp_length).map((data) => {
        let tr = document.createElement('tr')
        table.appendChild(tr)

        for (let i=0; i<5; i++) {
            let tdElement = document.createElement('td')
            switch (i) {
                case 0:
                case 2:
                    tdElement.innerText = data[HEADERS[i]]
                    break
                case 1:
                    tdElement.style.cursor = "pointer"
                    tdElement.addEventListener('click', function(e) {
                        let recommended = localStorage.getItem(data[HEADERS[0]]) != null ? localStorage.getItem(data[HEADERS[0]]) : 0
                        localStorage.setItem(data[HEADERS[0]], parseInt(recommended)+1)
                        this.parentElement.children[4].innerText++
                        if (parseInt(this.parentElement.children[4].innerText) === 10) {
                            tdElement.innerHTML += " <span class=\"badge\">hot</span>"
                        }
                    })
                    tdElement.innerText = data[HEADERS[i]]
                    if (localStorage.getItem(data[HEADERS[0]]) >= 10) {
                        tdElement.innerHTML += " <span class=\"badge\">hot</span>"
                    }
                    break
                case 3:
                    tdElement.innerText = isoToDate(data[HEADERS[i]])
                    break
                case 4:
                    let recommended = localStorage.getItem(data[HEADERS[0]])
                    tdElement.innerText = recommended ? recommended : 0
                    break
            }
            tr.appendChild(tdElement)
        }
    })
}

const sortTable = function(columnNum) {
    if (sorted === columnNum) {
        console.info(document.getElementById('tableHead').children[0].children[columnNum].innerHTML)
        if (direction === 1) {
            document.getElementById('tableHead').children[0].children[sorted].innerHTML = `${HEADERS2[sorted]} <i class=\"fas fa-sort-down\"></i>`
        }
        else {
            document.getElementById('tableHead').children[0].children[sorted].innerHTML = `${HEADERS2[sorted]} <i class=\"fas fa-sort-up\"></i>`
        }
        direction *= (-1)
    }
    else {
        document.getElementById('tableHead').children[0].children[sorted].innerHTML = `${HEADERS2[sorted]} <i class=\"fas fa-sort\"></i>`
        document.getElementById('tableHead').children[0].children[sorted].style.backgroundColor = "#ffffff"
        direction = 1
        sorted = columnNum
        document.getElementById('tableHead').children[0].children[sorted].style.backgroundColor = "#cce6ff"
        document.getElementById('tableHead').children[0].children[sorted].innerHTML = `${HEADERS2[sorted]} <i class=\"fas fa-sort-up\"></i>`
    }
    table_data.sort((a,b) => {
        if (columnNum === 0) {
            return (a[HEADERS[columnNum]] - b[HEADERS[columnNum]]) * direction
        }
        else if (columnNum === 3) {
            let c = new Date(a[HEADERS[columnNum]])
            let d = new Date(b[HEADERS[columnNum]])
            return (c-d) * direction
        }
        else {
            let c = localStorage.getItem(a[HEADERS[0]])
            let d = localStorage.getItem(b[HEADERS[0]])
            return (c-d) * direction
        }
    })
    displayItems(cur_page, DATA_PER_PAGE)
}