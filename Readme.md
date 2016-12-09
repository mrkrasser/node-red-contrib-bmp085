node-red-contrib-pca9685
========================

A <a href="http://nodered.org">Node-RED</a> node to control an NXP [PCA9685](http://www.nxp.com/products/power-management/lighting-driver-and-controller-ics/ic-led-display-control/16-channel-12-bit-pwm-fm-plus-ic-bus-led-controller:PCA9685) such as the [Adafruit Servo Driver](https://www.adafruit.com/product/815) using the I2C interface. Based on Sergey Krasnov's bmp085 node. Uses the pca9685 library.

Install
-------

Run the npm install command in your Node-RED node_modules directory

	npm install node-red-contrib-pca9685

Pre-reqs
--------

For Raspberry Pi users: enable i2c on your Pi and add pi user to i2c group

Usage
-----

Return msg.payload.

**msg.payload.temperature** - temperature

**msg.payload.pressure** - pressure

The temperature and pressure units of measurement can be selected as required.

The measured pressure can optionally be corrected to sea level, as used in meteorolgical surface pressure charts, by entering the actual height above sea level of the sensor (US Standard Atmosphere; maximum height 11,000m).

The measurement update interval can also be specified.


![node-red-bmp085-flow](https://cloud.githubusercontent.com/assets/4464231/5672613/02c030dc-97a3-11e4-90c8-45385801d63b.png)

Example Node-RED flow:

	[{"id":"41f0fc42.bc1834","type":"template","name":"text","field":"payload","template":"Temperature: {{payload.temperature}}°C; Pressure: {{payload.pressure}}mmHg","x":982,"y":626,"z":"c2f61f76.2fd47","wires":[["51c8ed1e.6d326c"]]},{"id":"51c8ed1e.6d326c","type":"debug","name":"","active":true,"console":"false","complete":"payload","x":1174,"y":538,"z":"c2f61f76.2fd47","wires":[]},{"id":"fceb110e.7afd28","type":"bmp085","device":"/dev/i2c-1","timer":"15","pressureUnits":"mmHg","temperatureUnits":"degC","seaLevel":"QFE","height":"NaN","name":"","x":830,"y":727,"z":"c2f61f76.2fd47","wires":[["41f0fc42.bc1834"]]}]
