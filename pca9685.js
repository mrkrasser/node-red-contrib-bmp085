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
	var debugOption = true; //TODO: remove this once everything works
	if (process.env.hasOwnProperty("RED_DEBUG") && process.env.RED_DEBUG.indexOf("pca9685") >= 0) {
		debugOption = true;
	}

    // The Server Definition - this opens (and closes) the connection
    function pca9685Node(config) {
        RED.nodes.createNode(this, config);
        
        // node configuration
        // https://github.com/101100/pca9685/blob/master/examples/servo.js
        var options = {
            i2c: i2cBus.openSync(parseInt(config.deviceNumber) || 1),
            address: parseInt(config.address) || 0x40,
            frequency: parseInt(config.frequency) || 50,
            debug: debugOption
        };

        this.pwm = new Pca9685Driver(options, function startLoop(err) {
            if (err) {
                console.error("Error initializing PCA9685");
             } else {
            	util.debug("Initialized PCA9685");
            }
        });
     
        
        this.on("close", function() {
            if (this.pwm != null) {
            	pwm.dispose()
            }
        });
    }
    RED.nodes.registerType("PCA9685", pca9685Node);
	
    function pca9685OutputNode(config) {
        RED.nodes.createNode(this,config);
        this.pca9685 = config.pca9685;
        util.debug("- PCA9685="+pca9685);
        this.pca9685Node = RED.nodes.getNode(this.pca9685);
        util.debug("- PCA9685Node="+pca9685Node);
        this.pwm = pca9685Node.pwm;
        util.debug("- pwm="+pwm);        	
        this.unit = config.unit;
        this.channel = config.channel;
        this.payload = config.payload;
        this.onStep = config.onStep;

		this.on("input", function(msg) {
			var unit = msg.unit || this.unit || "percent (assumed)";
			var channel = parseInt(msg.channel || this.channel || 0);
			var payload = parseInt(msg.payload || this.payload || 0);
			var onStep = parseInt(msg.onStep || this.onStep || 0);
			
			util.debug("Set PCA9685 "+pwm+" Output "+channel+" to "+payload+" "+unit);
			
			if (unit == "microseconds") {
				this.pwm.setPulseLength(channel, payload, onStep);
            } else if (unit == "steps") {
            	this.pwm.setPulseRange(channel, onStep, payload);
            } else {
            	this.pwm.setDutyCycle(channel, payload, onStep);
            }
		});
    }
    RED.nodes.registerType("PCA9685 Output",pca9685OutputNode);
}
 