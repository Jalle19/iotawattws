# iotawattws

A WebSocket proxy for Iotawatt status information. It combines the output of `/config.txt` and `/status`
and augments the channel names into the status object. The combined and augmented output is 
broadcast to all connected WebSocket clients.

## Usage

```bash
IOTAWATT_ADDR=10.110.4.4 PORT=8009 INTERVAL_MS=2500 node ./index.js
```

The application will not produce any output during normal operation

## License

GPL version 3 or newer
