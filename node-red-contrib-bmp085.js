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

    // The main node definition - most things happen in here
    function bmp085_Node(n) {
        RED.nodes.createNode(this,n);

        // node configuration
		this.address = n.address;
		this.device = n.device;
		var node = this;
		
        // begin work on inputs
        node.on('input', function (msg) {
			var sensor = new BMP085( { 'mode': 1,        
				'address': this.address,        
				'device': this.device
			});
			sensor.read(function (data) {			
				msg.temperature = data.temperature;
				msg.pressure = data.pressure/1.3332239;
				msg.pressure = msg.pressure.toFixed();
				node.send(msg);
			});	
        });
    }

    // Register the node by name.
    RED.nodes.registerType("bmp085",bmp085_Node);
}
