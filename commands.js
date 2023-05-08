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

// Simple test command
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

// Command containing options
const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      // choices: createCommandChoices(),
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [FOAAS_COMMAND, CHALLENGE_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);