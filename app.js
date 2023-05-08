import 'dotenv/config';

import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, foaasRequest, hostname, flashingMessages } from './utils.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
    if (name === 'fuck-off') {
      const to = req.body.data.options[0].value;
      const foaasResBody = await foaasRequest({ to: to });
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: foaasResBody.message,
        },
      }).end();
    }

    else if (name === 'link-fuck-off') {
      const to = req.body.data.options[0].value;
      const from = req.body.data.options[1].value;
      const nonce = Math.floor(Math.random() * 10000);
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'https://' + hostname + '/random/' + to + '/' + from + '?' + nonce,
        },
      }).end();
    }

    else if (name === 'flashing-fuck-off') {
      const to = req.body.data.options[0].value;
      const from = req.body.data.options[1].value;
      const nonce = Math.floor(Math.random() * 10000);
      const toreturn = res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'https://' + hostname + '/random/' + to + '/' + from + '?' + nonce,
        },
      }).end();
      flashingMessages({ to: to, from: from, token: req.body.token });
      return toreturn;
    }

    // "challenge" command
    if (name === 'challenge' && id) {
      const userId = req.body.member.user.id;
      // User's object choice
      const objectName = req.body.data.options[0].value;

      // Create active game using message ID as the game ID
      activeGames[id] = {
        id: userId,
        objectName,
      };

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `Rock papers scissors challenge from <@${userId}>`,
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.BUTTON,
                  // Append the game ID to use later on
                  custom_id: `accept_button_${req.body.id}`,
                  label: 'Accept',
                  style: ButtonStyleTypes.PRIMARY,
                },
              ],
            },
          ],
        },
      });
    }
  }

});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
