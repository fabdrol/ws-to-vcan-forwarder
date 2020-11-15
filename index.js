const can = require('socketcan')
const WebSocket = require('ws')

const ADDRESS = 'ws://10.147.19.192:8989'
const channel = can.createRawChannel('vcan0', false)
const ws = new WebSocket(ADDRESS)

// Start CAN communication
channel.start()

const parse = (line) => {
  const split = line.split('[')
  const id = split[0].replace('can0', '').trim()
  const data = split[1].split(']')[1].trim().split(' ').map(hex => parseInt(hex, 16))
  return { id, data }
}

ws.on('open', function open() {
  console.log(`Connected to ${ADDRESS}`)
})
 
ws.on('message', (line) => {
  const { id, data } = parse(line)
  channel.send({
    ext: true,
    id: parseInt(id, 16),
    data: Buffer.from(data)
  })
})

