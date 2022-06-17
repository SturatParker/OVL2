import { Interaction } from 'discord.js';
import { poll } from 'src/commands/poll/poll.command';
import { ClientEventCallback } from 'src/common/types/ClientEventCallback.type';
import { ClientEventHandler } from 'src/common/types/ClientEventHandler.type';

export const processCommand: ClientEventCallback<'interactionCreate'> = (
  interaction: Interaction
) => {
  if (!interaction.isCommand()) return;
  const commands = [poll];
  commands
    .find((command) => command.name == interaction.commandName)
    ?.execute(interaction);
};

export const onInteractionCreate: ClientEventHandler<'interactionCreate'> =
  new ClientEventHandler('interactionCreate', processCommand);
