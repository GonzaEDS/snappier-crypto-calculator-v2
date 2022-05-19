import 'bootstrap'

// Dashboard page

//defines coins constructor
class Coin {
  constructor(
    id,
    name,
    symbol,
    current_price,
    image,
    total_supply,
    ath,
    ath_change_percentage,
    circulating_supply,
    market_cap_rank
  ) {
    this.id = id
    this.name = name
    this.symbol = symbol
    this.current_price = current_price
    this.image = image
    this.total_supply = total_supply
    this.ath = ath
    this.ath_change_percentage = ath_change_percentage
    this.circulating_supply = circulating_supply
    this.market_cap_rank = market_cap_rank
  }
  async getPrice() {
    this.current_price = await priceCall(this.id)
  }
}

//coins list
let coinObjects = []

// DOM elements
const dashboardCoinsTable = document.querySelector('.coins-table')
const dashboardTableBody = document.querySelector('.table-body')
const sortSelecor = document.querySelector('#sort')
const dashboardFilter = document.querySelector('#filter')
const calculator = document.querySelector('.calculator')
const calcCoinLogo = document.querySelector('.coinLogo')
const calcSelectedCoin = document.querySelector('.selectedCoin')
const calcUserInput = document.querySelector('.coinInput')
const calcResult = document.querySelector('.result')
const calcReturnArrow = document.querySelector('.arrowSvg')

// Render table function
let renderTable = async () => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=true'
    )

    if (response.status === 200) {
      // get api data
      const datos = await response.json()
      // instanciate coin objects
      datos.forEach(coin => {
        coinObjects[coin['market_cap_rank'] - 1] = new Coin(
          coin['id'],
          coin['name'],
          coin['symbol'],
          coin['current_price'],
          coin['image'],
          coin['total_supply'],
          coin['ath'],
          coin['ath_change_percentage'],
          coin['circulating_supply'],
          coin['market_cap_rank']
        )
      })

      const sortSelecorValue = sortSelecor.value
      switch (sortSelecorValue) {
        case 'price':
          coinObjects.sort((a, b) => b.current_price - a.current_price)
          break
        case 'ATH':
          coinObjects.sort((a, b) => b.ath - a.ath)
          break
        case 'ATHchangepercentage':
          coinObjects.sort(
            (a, b) => a.ath_change_percentage - b.ath_change_percentage
          )
          break
        case 'circulatingSupply':
          coinObjects.sort(
            (a, b) => b.circulating_supply - a.circulating_supply
          )
          break
        case 'marketCap':
          coinObjects.sort((a, b) => a.market_cap_rank - b.market_cap_rank)
          break
        case 'name':
          coinObjects.sort((a, b) => (a.name > b.name ? 1 : -1))
          break
      }

      if (dashboardFilter.value) {
        coinObjects = coinObjects.filter(e =>
          e.name.toLowerCase().includes(dashboardFilter.value.toLowerCase())
        )
      }
      if (coinObjects.length == 0) {
        const tableRow = document.createElement('tr')
        tableRow.classList.add('no-matches-row')
        const msjTd = document.createElement('td')
        msjTd.colSpan = 6
        const message = document.createTextNode('No matches')

        msjTd.appendChild(message)
        tableRow.appendChild(msjTd)
        dashboardTableBody.appendChild(tableRow)
      }

      const tableHeadersArray = [
        'current_price',
        'ath',
        'ath_change_percentage',
        'circulating_supply',
        'market_cap_rank'
      ]

      coinObjects.forEach(coin => {
        const tableRow = document.createElement('tr')
        tableRow.classList.add(`${coin.id}`)
        const coinTd = document.createElement('td')
        const logoImg = document.createElement('img')
        logoImg.src = `${coin.image}`
        coinTd.appendChild(logoImg)
        const name = document.createTextNode(coin.name)

        coinTd.appendChild(name)
        tableRow.appendChild(coinTd)
        dashboardTableBody.appendChild(tableRow)

        tableHeadersArray.forEach(header => {
          let tableData = document.createElement('td')
          let input = document.createTextNode(`${coin[header]}`)
          tableData.appendChild(input)
          tableData.classList.add(`${header}`)
          tableRow.appendChild(tableData)
        })

        dashboardTableBody.appendChild(tableRow)

        tableRow.addEventListener('click', () => {
          calcCoinLogo.src = `${coin.image}`
          calcSelectedCoin.innerHTML = `${coin.name}`
          dashboardCoinsTable.classList.add('displayNone')
          calculator.classList.remove('displayNone')
          calcUserInput.value = 1
          const coinPrice = coin.current_price
          calcResult.innerHTML = `$ ${(coinPrice * calcUserInput.value).toFixed(
            2
          )}`
          // respond to any input change
          ;['click', 'keyup', 'change'].forEach(evento =>
            calcUserInput.addEventListener(evento, () => {
              calcResult.innerHTML = `$ ${(
                coinPrice * calcUserInput.value
              ).toFixed(2)}`
            })
          )
          // return to table
          calcReturnArrow.addEventListener('click', () => {
            calculator.classList.add('displayNone')
            dashboardCoinsTable.classList.remove('displayNone')
          })
        })
      })
    } else if (response.status === 404) {
      console.log('The requested data was not found')
    }
  } catch (error) {
    console.log(error)
  }
}

renderTable()

sortSelecor.addEventListener('change', () => {
  document.querySelectorAll('tbody tr').forEach(e => {
    e.remove()
  })
  renderTable()
})

dashboardFilter.addEventListener('keyup', () => {
  document.querySelectorAll('tbody tr').forEach(e => {
    e.remove()
  })
  renderTable()
})
// ;['click', 'keyup', 'change'].forEach(evento =>
//   dashboardFilter.addEventListener(evento, () => {
//     console.log('change detected')
//     document.querySelectorAll('td').forEach(e => {
//       e.remove()
//     })
//     renderTable()
//   })
// )

// functions
async function priceCall(coinId) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
    )

    if (response.status === 200) {
      const data = await response.json()
      const price = data[Object.keys(data)[0]].usd
      return price
    } else if (response.status === 404) {
      console.log('The requested data was not found')
    }
  } catch (error) {
    console.log(error)
  }
}
