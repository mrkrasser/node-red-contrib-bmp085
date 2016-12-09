/**
 * Copyright 2016 Frederic Auberson <frederic@auberson.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
 
// PCA9685 Node-RED node file
module.exports = function(RED) {
	var i2cBus = require("i2c-bus");
	var Pca9685Driver = require("pca9685").Pca9685Driver;
	
// Set the pca9685 debug option from the environment variable
	var debugOption = false;
	if (process.env.hasOwnProperty("RED_DEBUG") && process.env.RED_DEBUG.indexOf("pca9685") >= 0) {
		debugOption = true;
	}

    function pca9685_Node(config) {
        RED.nodes.createNode(this,config);
		var node = this;
		
        // node configuration
        // https://github.com/101100/pca9685/blob/master/examples/servo.js
        var options = {
            i2c: i2cBus.openSync(parseInt(config.busNumber) || 1),
            address: parseInt(config.addr) || 0x40,
            frequency: parseInt(config.freq) || 50,
            debug: true
        };

        pwm = new Pca9685Driver(options, function startLoop(err) {
            if (err) {
                console.error("Error initializing PCA9685");
                process.exit(-1);
            }
        });
        
		node.on("input", function(msg) {
			unit = msg.unit;
			channel = parseInt(msg.channel || 0);
			payload = parseInt(msg.payload || 0);
			onStep = parseInt(msg.onStep || 0);
			
			if (unit == "microseconds") {
				pwm.setPulseLength(channel, payload, onStep);
            } else if (unit == "steps") {
            	pwm.setPulseRange(channel, onStep, payload);
            } else if (msg.unit == "percent") {
            	pwm.setDutyCycle(channel, payload, onStep);
            }
		});
		
		node.on("close", function() {
			pwm.dispose()
		});
    }

    // Register the node by name.
    RED.nodes.registerType("pca9685",pca9685_Node);
}
 