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

Connect your PCA9685 to the host on which Node-RED runs.
Use an output node to control a servo, led, or anything that can be driven by a PWM signal.

You will need a "PCA9685 Device" node (which can be set up from within the Output node's property sheet) where you can set up:
The **bus number** on which the PCA9685 is installed (e.g. a 1 here would cause /dev/i2c-1 to be used under Linux)
The **address** on which the PCA9685 is set up (this is 0x40 by default)
The **frequency** to use (in Hz, typically 50)
Then, the Output node will allow you to set the signal that is sent on one of the PCA9685's outputs:
**Payload** indicates the length of the pulse that will be sent on a particular channel.
**Unit** describes how the value in the payload will be evaluated:
- As a length of time (in microseconds). The PWM signal will then be High for that length of time.
- As the index of a step: The PCA9685 allows you to control when, on 4096 steps, the PWM signal becomes Low again.
- As a percentage: The PWM signal is then High for that percentage of the time
Additionally, the **'On' step**, i.e. the step on which the signal becomes High, can be set. This is, in most cases, at the very start of the 4096 steps, and is usually left at 0.

Example:
![alt tag](https://raw.githubusercontent.com/fauberso/node-red-contrib-pca9685/master/images/flow.png)

Node-RED flow for the above example:

	[{"id":"feaadd05.f046d","type":"inject","z":"1fe6197f.0d25c7","name":"100%","topic":"","payload":"100","payloadType":"num","repeat":"","crontab":"","once":false,"x":1045,"y":40,"wires":[["46bd9273.6b279c"]]},{"id":"71dd9036.680b3","type":"inject","z":"1fe6197f.0d25c7","name":"50%","topic":"","payload":"50","payloadType":"num","repeat":"","crontab":"","once":false,"x":1045,"y":80,"wires":[["46bd9273.6b279c"]]},{"id":"89f319a8.9eea78","type":"inject","z":"1fe6197f.0d25c7","name":"Off","topic":"","payload":"0","payloadType":"num","repeat":"","crontab":"","once":false,"x":1045,"y":120,"wires":[["46bd9273.6b279c"]]},{"id":"1c347df.4004b82","type":"inject","z":"1fe6197f.0d25c7","name":"120°","topic":"","payload":"2100","payloadType":"num","repeat":"","crontab":"","once":false,"x":1045,"y":180,"wires":[["d11db9bf.d2cc58"]]},{"id":"ec6ef0f2.d5b56","type":"inject","z":"1fe6197f.0d25c7","name":"60°","topic":"","payload":"1500","payloadType":"num","repeat":"","crontab":"","once":false,"x":1045,"y":220,"wires":[["d11db9bf.d2cc58"]]},{"id":"4b72d6f3.2020e8","type":"inject","z":"1fe6197f.0d25c7","name":"0°","topic":"","payload":"900","payloadType":"num","repeat":"","crontab":"","once":false,"x":1045,"y":260,"wires":[["d11db9bf.d2cc58"]]},{"id":"eaa2a00e.3dfca","type":"inject","z":"1fe6197f.0d25c7","name":"Off","topic":"","payload":"0","payloadType":"num","repeat":"","crontab":"","once":false,"x":1045,"y":300,"wires":[["d11db9bf.d2cc58"]]},{"id":"46bd9273.6b279c","type":"PCA9685 out","z":"1fe6197f.0d25c7","name":"PWM Output 2 (Led)","pca9685":"6ce45bce.cdff94","channel":"2","payload":"","unit":"percent","onStep":"0","x":1260,"y":80,"wires":[]},{"id":"d11db9bf.d2cc58","type":"PCA9685 out","z":"1fe6197f.0d25c7","name":"PWM Output 4 (Servo)","pca9685":"6ce45bce.cdff94","channel":"4","payload":"","unit":"microseconds","onStep":"0","x":1270,"y":240,"wires":[]},{"id":"6ce45bce.cdff94","type":"PCA9685","z":"","deviceNumber":"1","address":"64","frequency":"50"}]
