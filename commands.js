import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple Message Fuck Off Command
const FOAAS_COMMAND = {
  name: 'fuck-off',
  description: 'Tell your loved ones to fuck off',
  type: 1,
  options: [
    {
      type: 3,
      name: 'target',
      description: 'input your target',
      required: true,
    },
  ],
};

// Link Command
const LINK_COMMAND = {
  name: 'link-fuck-off',
  description: 'Tell your loved ones to fuck off by sending a link',
  type: 1,
  options: [
    {
      type: 3,
      name: 'target',
      description: 'input your target',
      required: true,
    },
    {
      type: 3,
      name: 'from',
      description: 'input your name',
      required: true,
    },
  ],
};

// Link Command
const FLASHING_COMMAND = {
  name: 'flashing-fuck-off',
  description: 'Tell your loved ones to fuck off by sending a flashing fuck-off message',
  type: 1,
  options: [
    {
      type: 3,
      name: 'target',
      description: 'input your target',
      required: true,
    },
    {
      type: 3,
      name: 'from',
      description: 'input your name',
      required: true,
    },
  ],
};


const ALL_COMMANDS = [FOAAS_COMMAND, LINK_COMMAND, FLASHING_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);