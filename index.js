const express = require('express')
const fetch = require('isomorphic-unfetch')
const cheerio = require('cheerio')

const app = express()

const URL_TO_CRAWL = 'http://lsmvaapvs.org'

const PORT = process.env.PORT || 8080

app.get('/api/:id', (req, res) => {
	fetch(`${URL_TO_CRAWL}/search.php?vpn=${req.params.id}`)
		.then(res => res.text())
		.then(html => {
			let $ = cheerio.load(html)

			let plateNumber,
				color,
				model,
				chasisNumber,
				vehicleStatus,
				issueDate,
				expiryDate

			let count = 0

			$('.col-sm-8').map(function() {
				let data = $(this).text()

				switch (count) {
					case 0:
						plateNumber = data
					case 1:
						color = data
					case 2:
						model = data
					case 3:
						chasisNumber = data
					case 4:
						vehicleStatus = data
					case 5:
						issueDate = data
					case 6:
						expiryDate = data
				}

				count++
			})

			if (!plateNumber) {
				return res.end('Invalid Plate Number!')
			}

			res.json({
				color,
				model,
				plate_number: plateNumber,
				chasis_number: chasisNumber,
				vehicle_status: vehicleStatus,
				issue_date: issueDate,
				expiry_date: expiryDate
			})
		})
})

app.get('*', (req, res) => {
	res.end('FORMAT > api/[plate_number]')
})

app.listen(PORT, () => {
	console.log('> App running on PORT ' + PORT)
})
