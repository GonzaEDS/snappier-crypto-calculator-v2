import 'bootstrap'
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
const coinObjects = []
// función principal

let renderTable = async () => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true'
    )

    if (response.status === 200) {
      // create custome coin objects

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

      let sortSelecor = document.querySelector('#sort').value
      switch (sortSelecor) {
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

      const body = document.querySelector('.table-body')
      const tableHeadersArray = [
        'current_price',
        'ath',
        'ath_change_percentage',
        'circulating_supply',
        'market_cap_rank'
      ]

      coinObjects.forEach(coin => {
        let tableRow = document.createElement('tr')
        tableRow.classList.add(`${coin.id}`)
        const coinTd = document.createElement('td')
        const logoImg = document.createElement('img')
        logoImg.src = `${coin.image}`
        coinTd.appendChild(logoImg)
        const name = document.createTextNode(coin.name)

        coinTd.appendChild(name)
        tableRow.appendChild(coinTd)
        body.appendChild(tableRow)

        tableHeadersArray.forEach(header => {
          let tableData = document.createElement('td')
          let input = document.createTextNode(`${coin[header]}`)
          tableData.appendChild(input)
          tableData.classList.add(`${header}`)
          tableRow.appendChild(tableData)
        })

        body.appendChild(tableRow)

        // let selectRow = document.querySelector(`.${coin.id}`)
        tableRow.addEventListener('click', () => {
          console.log('click')
          document.querySelector('.coinLogo').src = `${coin.image}`
          document.querySelector('.selectedCoin').innerHTML = `${coin.name}`
          document.querySelector('.coins-table').classList.add('displayNone')
          document.querySelector('.calculator').classList.remove('displayNone')
          let userInput = document.querySelector('.coinInput')
          userInput.value = 1
          const coinPrice = coin.current_price
          let result = document.querySelector('.result')
          result.innerHTML = `$ ${(coinPrice * userInput.value).toFixed(4)}`
          ;['click', 'keyup', 'change'].forEach(evento =>
            userInput.addEventListener(evento, () => {
              result.innerHTML = `$ ${(coinPrice * userInput.value).toFixed(4)}`
            })
          )
          document.querySelector('.arrowSvg').addEventListener('click', () => {
            document.querySelector('.calculator').classList.add('displayNone')
            document
              .querySelector('.coins-table')
              .classList.remove('displayNone')
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

document.querySelector('#sort').addEventListener('change', () => {
  document.querySelectorAll('td').forEach(e => {
    e.remove()
  })
  renderTable()
})

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
