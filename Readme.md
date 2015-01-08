node-red-contrib-bmp085
=====================

A <a href="http://nodered.org" target="_new">Node-RED</a> node to receive data from [Bosch BMP085 barometer sensor](http://www.adafruit.com/products/391) using i2c.

Install
-------

	cd node-red/nodes/
	git clone https://github.com/mrkrasser/node-red-contrib-bmp085.git
	cd node-red-contrib-bmp085
	npm install


Pre-reqs
--------

	npm install bmp085	

For Raspberry Pi users: enable i2c on your Pi and add pi user to i2c group


Usage
-----

Outputs msg.payload

**msg.payload.temperature** - temperature in Celsius degrees

**msg.payload.pressure** - pressure in mmHg

You can specify a time in seconds between requests.

![node-red-bmp085-flow](https://cloud.githubusercontent.com/assets/4464231/5672613/02c030dc-97a3-11e4-90c8-45385801d63b.png)

Example Node-RED flow:

	[{"id":"e7da534a.5bc17","type":"template","name":"text","field":"payload","template":"Temperature: {{payload.temperature}}°C; Pressure: {{payload.pressure}}mmHg","x":869,"y":183,"z":"e07c9390.25d6f","wires":[["15f75748.2632a1"]]},{"id":"15f75748.2632a1","type":"debug","name":"","active":true,"console":"false","complete":"payload","x":1061,"y":95,"z":"e07c9390.25d6f","wires":[]},{"id":"dc11fb8f.65593","type":"bmp085","name":"","address":"0x77","device":"/dev/i2c-1","timer":"15","x":717,"y":284,"z":"e07c9390.25d6f","wires":[["e7da534a.5bc17"]]}]
