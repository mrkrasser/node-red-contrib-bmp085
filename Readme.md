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

Example Node-RED flow:

	[{"id":"6623167f.d42ba8","type":"PCA9685 Output","z":"51946412.34716c","name":"Output 2 (Led)","pca9685":"6ce45bce.cdff94","channel":"2","payload":"","unit":"percent","onStep":"0","x":1240,"y":80,"wires":[]},{"id":"1e739c4b.f66154","type":"inject","z":"51946412.34716c","name":"100%","topic":"","payload":"100","payloadType":"num","repeat":"","crontab":"","once":false,"x":1030,"y":40,"wires":[["6623167f.d42ba8"]]},{"id":"b27865f7.bf8b28","type":"inject","z":"51946412.34716c","name":"50%","topic":"","payload":"50","payloadType":"num","repeat":"","crontab":"","once":false,"x":1030,"y":80,"wires":[["6623167f.d42ba8"]]},{"id":"a6f43014.507c7","type":"inject","z":"51946412.34716c","name":"Off","topic":"","payload":"0","payloadType":"num","repeat":"","crontab":"","once":false,"x":1030,"y":120,"wires":[["6623167f.d42ba8"]]},{"id":"49b08356.1ff8ec","type":"inject","z":"51946412.34716c","name":"160°","topic":"","payload":"2100","payloadType":"num","repeat":"","crontab":"","once":false,"x":1030,"y":180,"wires":[["554cf5e6.77281c"]]},{"id":"523a98be.eb58a8","type":"inject","z":"51946412.34716c","name":"80°","topic":"","payload":"1500","payloadType":"num","repeat":"","crontab":"","once":false,"x":1030,"y":220,"wires":[["554cf5e6.77281c"]]},{"id":"b1d05375.6e682","type":"inject","z":"51946412.34716c","name":"0°","topic":"","payload":"900","payloadType":"num","repeat":"","crontab":"","once":false,"x":1030,"y":260,"wires":[["554cf5e6.77281c"]]},{"id":"554cf5e6.77281c","type":"PCA9685 Output","z":"51946412.34716c","name":"Output 4 (Servo)","pca9685":"6ce45bce.cdff94","channel":"4","payload":"","unit":"microseconds","onStep":"0","x":1250,"y":240,"wires":[]},{"id":"46060143.019b2","type":"inject","z":"51946412.34716c","name":"Off","topic":"","payload":"0","payloadType":"num","repeat":"","crontab":"","once":false,"x":1030,"y":300,"wires":[["554cf5e6.77281c"]]},{"id":"6ce45bce.cdff94","type":"PCA9685","z":"","deviceNumber":"1","address":"64","frequency":"50"}]
