/**
 * Copyright 2015 Sergey Krasnov <me@sergeykrasnov.ru>
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
 
// BMP085 Node-RED node file
module.exports = function(RED) {
	var BMP085 = require('bmp085');

// Set the bmp085 debug option from the environment variable
	var debugOption = false;
	if (process.env.hasOwnProperty("RED_DEBUG") && process.env.RED_DEBUG.indexOf("bmp085") >= 0) {
		debugOption = true;
	}

    function bmp085_Node(config) {
        RED.nodes.createNode(this,config);

        // node configuration
		this.device = config.device;
		this.timer = config.timer * 1000;
		var node = this;
		
		var sensor = new BMP085({
				'mode': 2,
				'address': '0x77',
				'device': this.device,
				'debug' : debugOption
		});
		
		var getData = function(){
			// TODO: error handling
			sensor.read(function (data) {
				data.pressure = (data.pressure/1.3332239).toFixed();
				var msg = { payload: data };
				node.send(msg);
			});	
		}
		
		getData(); // run on start
		
		tID = setInterval(getData, this.timer);
		node.on("close", function() {
			clearInterval(tID);
		});
    }

    // Register the node by name.
    RED.nodes.registerType("bmp085",bmp085_Node);
}
