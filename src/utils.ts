import { TCPHelper, InstanceStatus } from '@companion-module/base'
import { itac_cc } from './main.js'
import { CheckVariables } from './variables.js'

export function initTCP(instance: itac_cc): void {
	if (instance.socket !== undefined) {
		instance.socket.destroy()
		delete instance.socket
	}

	if (instance.config.host) {
		instance.socket = new TCPHelper(this.config.host, 4998)

		instance.socket.on('connect', () => {
			instance.updateStatus(InstanceStatus.Ok)
			instance.log('debug', 'Connected')
			startPolling(instance)
		})

		instance.socket.on('data', (data) => {
			instance.log('debug', 'Received: ' + data)
			const lines = data.toString().split('\r\n')
			for (let i = 0; i < lines.length; i++) {
				const line = lines[i]
				const matches = line.match(/state,(\d+):(\d+),(\d+)/)
				if (matches) {
					const port = matches[2]
					const state = matches[3]
					updatePortState(instance, port, state)
				}
			}
		})

		instance.socket.on('error', function (err) {
			instance.log('error', 'Network error: ' + err.message)
			clearInterval(instance.pollTimer)
		})
	}
}

export function startPolling(instance: itac_cc): void {
	if (instance.config.poll_interval > 0) {
		instance.pollTimer = setInterval(() => {
			getStates(this)
		}, instance.config.poll_interval)
	}
}

export function getStates(instance: itac_cc): void {
	for (let i = 1; i <= instance.config.ports; i++) {
		const cmd = `getstate,1:${i}`
		sendCommand(instance, cmd)
	}
}

export function updatePortState(instance: itac_cc, port: string, state: string): void {
	for (let i = 0; i < instance.DATA.length; i++) {
		const portObj = instance.DATA[i]
		if (portObj) {
			if (portObj.port == port) {
				portObj.state = state
				instance.checkFeedbacks('relaystate')
				CheckVariables(instance)
				break
			}
		}
	}
}

export function sendCommand(instance: itac_cc, cmd: string): void {
	if (cmd !== undefined) {
		if (instance.socket !== undefined && instance.socket.isConnected) {
			instance.log('debug', 'Sending: ' + cmd)
			instance.socket
				.send(cmd + '\r\n')
				.then((_result) => {
					//console.log('send result: ' + result);
				})
				.catch((_error) => {
					//console.log('send error: ' + error);
				})
		} else {
			instance.log('error', 'Network error: Connection to Device not opened.')
			clearInterval(instance.pollTimer)
		}
	}
}
