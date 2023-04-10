import { Configuration, OpenAIApi } from "openai";
import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";

// Set up OpenAI here
const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

// Set up Discord bot here
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on("ready", () => {
  console.log("Bot is ready!");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== process.env.CHANNEL_ID) return;
  if (message.content.startsWith("!")) return;

  let conversationLog = [
    {
      role: "system",
      content:
        "You are a chatbot, created by Ludovico. You like to answer any question in a sarcastic way.",
    },
  ];

  await message.channel.sendTyping();

  let previousMessage = await message.channel.messages.fetch({ limit: 10 });
  previousMessage.reverse();

  previousMessage.forEach((msg) => {
    if (message.content.startsWith("!")) return;
    if (msg.author.id !== client.user.id && message.author.bot) return;
    if (msg.author.id !== message.author.id) return;

    conversationLog.push({
      role: "user",
      content: msg.content,
    });
  });

  const result = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationLog,
  });

  try {
    await message.reply(result.data.choices[0].message);
  } catch (error) {
    console.log(error);
    await message.reply("<@298043281814585345> This guy tried to break me :(");
  }
});

client.login(process.env.TOKEN);
