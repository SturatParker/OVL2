import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { ApplicationCommand, Client } from 'discord.js';

export async function deleteApplicationCommands(token: string): Promise<void> {
  const client = new Client({ intents: [] });
  await client.login(token);

  const rest = new REST({ version: '9' }).setToken(token);
  const userId = client.user?.id;
  if (!userId) return;
  const data = (await rest.get(
    Routes.applicationCommands(userId)
  )) as ApplicationCommand[];
  await Promise.all(
    data.map((command) =>
      rest.delete(`${Routes.applicationCommands(userId)}/${command.id}`)
    )
  );
  return;
}
