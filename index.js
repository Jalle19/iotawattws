const fetch = require('node-fetch');
const WebSocket = require('ws');

const iotawattAddr = process.env.IOTAWATT_ADDR;
const wsPort = process.env.PORT;

if (iotawattAddr === undefined) {
  console.error('IOTAWATT_ADDR environment variable not specified');
  process.exit(1);
}

if (wsPort === undefined) {
  console.error('PORT environment variable not specified');
  process.exit(1);
}

async function requestConfig() {
  const configUrl = `http://${iotawattAddr}/config.txt`;
  const configResponse = await fetch(configUrl)

  return await configResponse.json();
}

async function requestStatus() {
  const statusUrl = `http://${iotawattAddr}/status?state=yes&inputs=yes&outputs=yes&stats=yes&datalogs=yes&influx=yes&emon=yes&pvoutput=yes`;
  const statusResponse = await fetch(statusUrl);

  return await statusResponse.json();
}

function generateOutput(config, status) {
  let augmentedStatus = status;

  for (i = 0; i < status.inputs.length; i++) {
    augmentedStatus.inputs[i].name = config.inputs[i].name;
  }

  return {
    config: config,
    status: augmentedStatus,
  };
}

const app = async () => {
  // Request config.txt so we can get input names
  const config = await requestConfig();
  const wss = new WebSocket.Server({ port: wsPort });

  // Poll the status page and broadcast the augmented status to all connected clients
  setInterval(async () => {
    const status = await requestStatus();
    const output = generateOutput(config, status);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const data = JSON.stringify(output);

        client.send(data);
      }
    })
  }, 2500);
};

app();
