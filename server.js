const Discord = require("discord.js");
const bot = new Discord.Client();
const fetch = require("node-fetch");

var token = ""; //The bot token.
var prefix = "="; //Bot Prefix
var invitelink = ""; //The bot invite link

bot.on("ready", async () => {
  console.log(
    `Bot is online in ${bot.guilds.cache.size} servers with ${bot.users.cache.size} members!`
  );
});

bot.on("message", async message => {
  if (!message.content[0] === prefix) return 0;
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "corona") {
    console.log(
      `${message.author.tag} (${message.author.id}) has used the corona command.`
    );
    if (!args.length) {
      fetch("https://corona.lmao.ninja/v2/all")
        .then(res => res.json())
        .then(json => GetActiveCases(message, json));
    } else {
      fetch(`https://corona.lmao.ninja/v2/countries/${args.join(" ")}`)
        .then(res => res.json())
        .then(json => {
          if (json.cases == undefined)
            return message.channel.send({
              embed: {
                color: 3447003,
                author: {
                  name: "COVID-19 - Invalid Country",
                  icon_url:
                    "https://toppng.com/uploads/preview/coronavirus-covid-19-11582576800djeiqpenmq.png"
                },
                description: `This country doesn't exist.`
              }
            });
          const exampleEmbed = new Discord.MessageEmbed()
            .setAuthor(
              "COVID-19 Stats",
              "https://toppng.com/uploads/preview/coronavirus-covid-19-11582576800djeiqpenmq.png",
              ""
            )
            .setTitle(json.country)
            .addFields(
              {
                name: "Total Cases",
                value: `${json.cases} Cases`,
                inline: true
              },
              {
                name: "New Cases",
                value: `${json.todayCases} Cases`,
                inline: true
              },
              {
                name: "Total Deaths",
                value: `${json.deaths} (${getWholePercent(
                  json.deaths,
                  json.cases
                )}%) Deaths`,
                inline: true
              },
              {
                name: "New Deaths",
                value: `${json.todayDeaths} Deaths`,
                inline: true
              },
              {
                name: "Total Recovered",
                value: `${json.recovered} (${getWholePercent(
                  json.recovered,
                  json.cases
                )}%) Recovered`,
                inline: true
              },
              {
                name: "Active Cases",
                value: `${json.active} Cases`,
                inline: true
              }
            )
            .setTimestamp();
          message.channel.send(exampleEmbed);
        })
        .catch(err => {
          message.channel.send({
            embed: {
              color: 3447003,
              author: {
                name: "COVID-19 - Invalid Country",
                icon_url:
                  "https://toppng.com/uploads/preview/coronavirus-covid-19-11582576800djeiqpenmq.png"
              },
              description: `This country doesn't exist.`
            }
          });
        });
    }
  }

  if (command === "invite") {
    message.channel.send({
      embed: {
        color: 3447003,
        author: {
          name: `COVID-19 - Invite Bot`,
          icon_url:
            "https://toppng.com/uploads/preview/coronavirus-covid-19-11582576800djeiqpenmq.png"
        },
        description:
          "[**Click to invite the bot to your server**](${invitelink})"
      }
    });
  }
  if (command === "help") {
    message.author.send({
      embed: {
        color: 3447003,
        author: {
          name: "COVID-19 - Help",
          icon_url:
            "https://toppng.com/uploads/preview/coronavirus-covid-19-11582576800djeiqpenmq.png"
        },
        fields: [
          {
            name: "/invite",
            value: "Sends you the invitation link."
          },
          {
            name: "/corona (country - optional)",
            value: "Shows you the corona stats of the world/of a country."
          }
        ]
      }
    });
  }
});

function getWholePercent(percentFor, percentOf) {
  return Math.floor((percentFor / percentOf) * 100);
}

function GetActiveCases(message, j2) {
  fetch("https://corona.lmao.ninja/v2/countries")
    .then(res => res.json())
    .then(json => {
      SendCovidMessage(message, j2);
    });
}

function SendCovidMessage(message, json2) {
  const exampleEmbed = new Discord.MessageEmbed()
    .setAuthor(
      "COVID-19 Stats",
      "https://toppng.com/uploads/preview/coronavirus-covid-19-11582576800djeiqpenmq.png",
      "",
      ""
    )
    .setTitle("World")
    .addFields(
      { name: "Total Cases", value: `${json2.cases} Cases`, inline: true },
      { name: "New Cases", value: `${json2.todayCases} Cases`, inline: true },
      {
        name: "Total Deaths",
        value: `${json2.deaths} (${getWholePercent(
          json2.deaths,
          json2.cases
        )}%) Deaths`,
        inline: true
      },
      {
        name: "New Deaths",
        value: `${json2.todayDeaths} Deaths`,
        inline: true
      },
      {
        name: "Total Recovered",
        value: `${json2.recovered} (${getWholePercent(
          json2.recovered,
          json2.cases
        )}%) Recovered`,
        inline: true
      },
      {
        name: "Active Cases",
        value: `${json2.cases - json2.deaths - json2.recovered} Cases`,
        inline: true
      }
    )
    .setTimestamp()
    .setFooter("-corona (country) to view the stats of a single country");

  message.channel.send(exampleEmbed);
}

bot.login(token);
