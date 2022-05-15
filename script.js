coinObjects = []
class Coin {
  constructor(id, name, symbol, image, total_supply) {
    this.id = id
    this.name = name
    this.symbol = symbol
    this.image = image
    this.total_supply = total_supply
  }
  getPrice() {
    fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${this.id}&vs_currencies=usd`
    )
      .then(resp => resp.json())
      .then(myPrice => {
        const dataprice = JSON.stringify(Object.values(myPrice)[0]['usd'])
        return dataprice
      })
  }
}
const currencyMarketList = async () => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true'
    )

    if (response.status === 200) {
      const datos = await response.json()
      // console.log(datos)

      let coins = ''
      let body = document.querySelector('.table-body')
      const tableHeadersArray = [
        'name',
        'current_price',
        'ath',
        'ath_change_percentage',
        'circulating_supply',
        'market_cap_rank'
      ]
      datos.forEach(coin => {
        let tableRow = document.createElement('tr')
        tableRow.classList.add(`${coin.id}`)
        let logoTd = document.createElement('td')
        let logoImg = document.createElement('img')
        logoImg.src = `${coin.image}`
        logoTd.appendChild(logoImg)
        tableRow.appendChild(logoTd)
        body.appendChild(tableRow)

        tableHeadersArray.forEach(header => {
          let tableData = document.createElement('td')
          let input = document.createTextNode(`${coin[header]}`)
          tableData.appendChild(input)
          tableData.classList.add(`${header}`)
          tableRow.appendChild(tableData)
        })

        body.appendChild(tableRow)

        selectRow = document.querySelector(`.${coin.id}`)
        selectRow.addEventListener('click', () => {
          document.querySelector('.coinLogo').src = `${coin.image}`
          document.querySelector('.selectedCoin').innerHTML = `${coin.name}`
          document.querySelector('.coins-table').classList.add('displayNone')
          document.querySelector('.calculator').classList.remove('displayNone')
          let userInput = document.querySelector('.coinInput')
          const coinPrice = coin.current_price

          ;['click', 'keyup'].forEach(evento =>
            userInput.addEventListener(evento, () => {
              document.querySelector('.result').innerHTML = `$ ${(
                coinPrice * userInput.value
              ).toFixed(4)}`
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

  fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true'
  )
    .then(resp => resp.json())
    .then(data => {
      console.log(data)

      data.forEach(coin => {
        coinObjects[coin['market_cap_rank']] = new Coin(
          coin['id'],
          coin['name'],
          coin['symbol'],
          coin['image'],
          coin['total_supply']
        )
        //console.log(coinObjects[coin['market_cap_rank']].id)
        let tablePrice = document.querySelector(
          `.${coinObjects[coin['market_cap_rank']].id} .current_price`
        )
        // tablePrice.innerHTML = 'hola'

        // document.querySelector(
        //   `.${coinObjects[coin['market_cap_rank']].id}.current_price`
        // ).innerHTML = coinObjects[coin['market_cap_rank']].getPrice()
      })

      console.log(coinObjects[1])

      coinObjects[1].getPrice().then(res => {
        document.querySelector('.bitcoin .current_price').innerHTML = res
      })

      // document.querySelector('.bitcoin .current_price').innerHTML =
      //   coinObjects[1].getPrice()

      // let i = 30
      // while (i > 0) {
      //   setTimeout(() => {
      //     console.log(coinObjects[1].getPrice())
      //     document.querySelector('.bitcoin .current_price').innerHTML =
      //       coinObjects[1].getPrice()
      //   }, 10000)
      //   i -= 1
      // }
    })

  // let priceDataTable = document.querySelector('.bitcoin .current_price')

  // console.log(priceDataTable)
  // let i = 10
  // while (i > 0) {
  //   setTimeout(() => {
  //     console.log(coinObjects[1].getPrice())
  //     priceDataTable.innerHTML = coinObjects[1].getPrice()
  //   }, 10000)
  //   i -= 1
  // }
}

currencyMarketList()
