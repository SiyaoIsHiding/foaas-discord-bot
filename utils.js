import 'dotenv/config';
import https from 'node:https';
import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';

export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

export const hostname = 'foaas-hoaxd.ondigitalocean.app';

// options = { to: string, from : string}
export function foaasRequest(options) {
  const foaasOptions = {
    hostname: 'foaas-hoaxd.ondigitalocean.app',
    path: '/random/' + options.to + '/jane',
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  };
  return new Promise((resolve, reject) => {
    try {
      const request = https.request(foaasOptions, (response) => {
        let data = '';
        response.on('data', (chunk) => {
          data = data + chunk.toString();
        });

        response.on('end', () => {
          const body = JSON.parse(data);
          console.log(body);
          resolve(body);
        });

      })

      request.on('error', (error) => {
        console.log('An error', error);
        reject(error);
      });

      request.end()
    } catch (e) {
      console.log(e);
      reject(e);
    }

  });
}

// options = {token : string}
export function flashingMessages(options) {
  const endpoint = `webhooks/${process.env.APP_ID}/${options.token}/messages/@original`;
  return new Promise((resolve, reject) => {
    for (var i = 1; i <= 20; i++) {
      setTimeout(() => {
        const nonce = Math.floor(Math.random() * 10000);
        DiscordRequest(endpoint, { method: 'PATCH', body: { 
          content: 'https://' + hostname + '/random/' + options.to + '/' + options.from + '?' + nonce,
        } });
        resolve();
      }, 3000 * i);
    }
  });
}