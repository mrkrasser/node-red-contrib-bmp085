node-red-contrib-pca9685
========================

A <a href="http://nodered.org">Node-RED</a> node to control an NXP [PCA9685](http://www.nxp.com/products/power-management/lighting-driver-and-controller-ics/ic-led-display-control/16-channel-12-bit-pwm-fm-plus-ic-bus-led-controller:PCA9685) such as the [Adafruit Servo Driver](https://www.adafruit.com/product/815) using the I2C interface. Based on Sergey Krasnov's bmp085 node. Uses the pca9685 library.

Install
-------

It's advisable to install the i2c package first. Refer to [The i2c npm page](https://www.npmjs.com/package/i2c) for more informations. This may require manual steps (e.g. enabling kernel modules). Please only proceed with this module once you've managed to properly install the i2c package, to simplify troubleshooting.

Once the i2c module is installed, run the npm install command in your Node-RED node_modules directory:

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


Simple Example: Control a LED or a Servo
----------------------------------------

Connect your PCA9685 board to an I2C bus. In this example, we'll connect a LED to output 2, and a Servo to output 4:

![alt tag](https://raw.githubusercontent.com/fauberso/node-red-contrib-pca9685/master/images/hardware.png)

We will inject values into the corresponding PCA9685 output node to control the intensity of the LED and the position of the servo:

![alt tag](https://raw.githubusercontent.com/fauberso/node-red-contrib-pca9685/master/images/flow.png)

The Node-RED flow for the above example can be copied from here:

	[{"id":"feaadd05.f046d","type":"inject","z":"1fe6197f.0d25c7","name":"100%","topic":"","payload":"100","payloadType":"num","repeat":"","crontab":"","once":false,"x":1045,"y":40,"wires":[["46bd9273.6b279c"]]},{"id":"71dd9036.680b3","type":"inject","z":"1fe6197f.0d25c7","name":"50%","topic":"","payload":"50","payloadType":"num","repeat":"","crontab":"","once":false,"x":1045,"y":80,"wires":[["46bd9273.6b279c"]]},{"id":"89f319a8.9eea78","type":"inject","z":"1fe6197f.0d25c7","name":"Off","topic":"","payload":"0","payloadType":"num","repeat":"","crontab":"","once":false,"x":1045,"y":120,"wires":[["46bd9273.6b279c"]]},{"id":"1c347df.4004b82","type":"inject","z":"1fe6197f.0d25c7","name":"120°","topic":"","payload":"2100","payloadType":"num","repeat":"","crontab":"","once":false,"x":1045,"y":180,"wires":[["d11db9bf.d2cc58"]]},{"id":"ec6ef0f2.d5b56","type":"inject","z":"1fe6197f.0d25c7","name":"60°","topic":"","payload":"1500","payloadType":"num","repeat":"","crontab":"","once":false,"x":1045,"y":220,"wires":[["d11db9bf.d2cc58"]]},{"id":"4b72d6f3.2020e8","type":"inject","z":"1fe6197f.0d25c7","name":"0°","topic":"","payload":"900","payloadType":"num","repeat":"","crontab":"","once":false,"x":1045,"y":260,"wires":[["d11db9bf.d2cc58"]]},{"id":"eaa2a00e.3dfca","type":"inject","z":"1fe6197f.0d25c7","name":"Off","topic":"","payload":"0","payloadType":"num","repeat":"","crontab":"","once":false,"x":1045,"y":300,"wires":[["d11db9bf.d2cc58"]]},{"id":"46bd9273.6b279c","type":"PCA9685 out","z":"1fe6197f.0d25c7","name":"PWM Output 2 (Led)","pca9685":"6ce45bce.cdff94","channel":"2","payload":"","unit":"percent","onStep":"0","x":1260,"y":80,"wires":[]},{"id":"d11db9bf.d2cc58","type":"PCA9685 out","z":"1fe6197f.0d25c7","name":"PWM Output 4 (Servo)","pca9685":"6ce45bce.cdff94","channel":"4","payload":"","unit":"microseconds","onStep":"0","x":1270,"y":240,"wires":[]},{"id":"6ce45bce.cdff94","type":"PCA9685","z":"","deviceNumber":"1","address":"64","frequency":"50"}]
	

Complete Example: Drive DC Motors with up to 35V using an H-Bridge 
------------------------------------------------------------------

Again, connect your PCA9685 board to an I2C bus. In this example, we'll use an L298N Dual H-Bridge to control two DC motors. Each H-Bridge (of which there are two in the L298N chip) allows the voltage to be regulated using a PWM signal, which we'll generate using our PCA9685. Additionally, each H-Bridge requires two additional signals: One causes the motor to turn in one direction, the other causes it to turn in the opposite direction. If the signals are both off (or both on), the motor will brake. We will use the Raspberry Pi's GPIO outputs to generate these, but we could also use one of the outputs on the PCA9685 instead (depending on which are more scarce in our project).
This setup should allow us to drive two motors with up to 35 Volts and 2 Amps each, but you will have to check your particular case and you proceed of course at your own risk: Modules will vary in what needs to be done in order to accept higher voltage (some have a voltage regulator on board that will be damaged if you supply more than 12 Volts) and may not have sufficient cooling to be able to sustain 2 Amps over a loger period of time.

![alt tag](https://raw.githubusercontent.com/fauberso/node-red-contrib-pca9685/master/images/hardware-hbridge.png)

We will inject values into the corresponding PCA9685 output node to control the speed of each motor, and digital values into GPIO pins to control the direction. Positive values between 0 and 100 will make a motor turn in one direction, negative values will make it turn in the other, and 0 will make it brake and stop:

![alt tag](https://raw.githubusercontent.com/fauberso/node-red-contrib-pca9685/master/images/flow-hbridge.png)

The Node-RED flow for the above example can be copied from here:

	[{"id":"79b5f5e8.53237c","type":"inject","z":"1fe6197f.0d25c7","name":"\"Stop\"","topic":"","payload":"0","payloadType":"num","repeat":"","crontab":"","once":false,"x":150,"y":180,"wires":[["a30b11b.3045ef"]]},{"id":"4b1212c1.963d0c","type":"inject","z":"1fe6197f.0d25c7","name":"\"Half Ahead\"","topic":"","payload":"50","payloadType":"num","repeat":"","crontab":"","once":false,"x":170,"y":140,"wires":[["a30b11b.3045ef"]]},{"id":"4af748e9.da9048","type":"inject","z":"1fe6197f.0d25c7","name":"\"Full Ahead\"","topic":"","payload":"100","payloadType":"num","repeat":"","crontab":"","once":false,"x":170,"y":100,"wires":[["a30b11b.3045ef"]]},{"id":"f78d67cf.6abd68","type":"inject","z":"1fe6197f.0d25c7","name":"\"Half Astern\"","topic":"","payload":"-50","payloadType":"num","repeat":"","crontab":"","once":false,"x":170,"y":220,"wires":[["a30b11b.3045ef"]]},{"id":"273d5c0b.73d1e4","type":"inject","z":"1fe6197f.0d25c7","name":"\"Full Astern\"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":170,"y":260,"wires":[["a30b11b.3045ef"]]},{"id":"28c6d545.167e5a","type":"rpi-gpio out","z":"1fe6197f.0d25c7","name":"Right Forward","pin":"18","set":"","level":"0","out":"out","x":620,"y":520,"wires":[]},{"id":"4b9d1edf.a6ea6","type":"rpi-gpio out","z":"1fe6197f.0d25c7","name":"Right Reverse","pin":"13","set":"","level":"0","out":"out","x":620,"y":460,"wires":[]},{"id":"50a8dc38.5c99d4","type":"rpi-gpio out","z":"1fe6197f.0d25c7","name":"Left Reverse","pin":"11","set":"","level":"0","out":"out","x":610,"y":180,"wires":[]},{"id":"eb609fae.1d4ee","type":"rpi-gpio out","z":"1fe6197f.0d25c7","name":"Left Forward","pin":"15","set":"","level":"0","out":"out","x":610,"y":240,"wires":[]},{"id":"a30b11b.3045ef","type":"function","z":"1fe6197f.0d25c7","name":"set left speed","func":"var en = { payload: msg.payload };\nvar in1 = { payload: 0 };\nvar in2 = { payload: 0 };\n\nif (msg.payload > 0) {\n    in2 = { payload: 1 };\n} else if (msg.payload < 0) {\n    in1 = { payload: 1 };\n} \ncontext.leftSpeed = msg.payload;\nreturn [ en, in1, in2 ];","outputs":"3","noerr":0,"x":420,"y":180,"wires":[["76b4c430.c8d9dc"],["50a8dc38.5c99d4"],["eb609fae.1d4ee"]]},{"id":"87f2b753.8f1678","type":"function","z":"1fe6197f.0d25c7","name":"set right speed","func":"var en = { payload: msg.payload };\nvar in1 = { payload: 0 };\nvar in2 = { payload: 0 };\n\nif (msg.payload > 0) {\n    in2 = { payload: 1 };\n} else if (msg.payload < 0) {\n    in1 = { payload: 1 };\n} \ncontext.rightSpeed = msg.payload;\nreturn [ en, in1, in2 ];","outputs":"3","noerr":0,"x":420,"y":460,"wires":[["8330c922.59d3c8"],["4b9d1edf.a6ea6"],["28c6d545.167e5a"]]},{"id":"76b4c430.c8d9dc","type":"PCA9685 out","z":"1fe6197f.0d25c7","name":"Left Velocity","pca9685":"6ce45bce.cdff94","channel":"9","payload":"","unit":"percent","onStep":"0","x":610,"y":120,"wires":[]},{"id":"8330c922.59d3c8","type":"PCA9685 out","z":"1fe6197f.0d25c7","name":"Right Velocity","pca9685":"6ce45bce.cdff94","channel":"8","payload":"","unit":"percent","onStep":"0","x":620,"y":400,"wires":[]},{"id":"ad1c39de.fb6368","type":"comment","z":"1fe6197f.0d25c7","name":"Left Engine:","info":"","x":110,"y":60,"wires":[]},{"id":"c0f51cf9.621f6","type":"inject","z":"1fe6197f.0d25c7","name":"\"Stop\"","topic":"","payload":"0","payloadType":"num","repeat":"","crontab":"","once":false,"x":150,"y":460,"wires":[["87f2b753.8f1678"]]},{"id":"9a65b2c4.ff3ae","type":"inject","z":"1fe6197f.0d25c7","name":"\"Half Ahead\"","topic":"","payload":"50","payloadType":"num","repeat":"","crontab":"","once":false,"x":170,"y":420,"wires":[["87f2b753.8f1678"]]},{"id":"1b666d11.99f393","type":"inject","z":"1fe6197f.0d25c7","name":"\"Full Ahead\"","topic":"","payload":"100","payloadType":"num","repeat":"","crontab":"","once":false,"x":170,"y":380,"wires":[["87f2b753.8f1678"]]},{"id":"57f0765d.886218","type":"inject","z":"1fe6197f.0d25c7","name":"\"Half Astern\"","topic":"","payload":"-50","payloadType":"num","repeat":"","crontab":"","once":false,"x":170,"y":500,"wires":[["87f2b753.8f1678"]]},{"id":"7a9cf884.f49228","type":"inject","z":"1fe6197f.0d25c7","name":"\"Full Astern\"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":170,"y":540,"wires":[["87f2b753.8f1678"]]},{"id":"e099d888.468728","type":"comment","z":"1fe6197f.0d25c7","name":"Right Engine:","info":"","x":110,"y":340,"wires":[]},{"id":"6ce45bce.cdff94","type":"PCA9685","z":"","deviceNumber":"1","address":"64","frequency":"50"}]
