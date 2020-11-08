const functions = require('firebase-functions');
const { Telegraf } = require('telegraf')

const OpenWeatherMapHelper = require("openweathermap-node");

let config = require('./env.json');

if(Object.keys(functions.config()).length){
  config = functions.config();
}

const helper = new OpenWeatherMapHelper(
  {
      APPID: config.service.openweathermap_key,
      units: "imperial"
  }
);

const bot = new Telegraf(config.service.telegram_key)
bot.start((ctx) => ctx.reply('Hey there! @anush_weatherbot started. Please send me your city name.'));
bot.help((ctx) => ctx.reply('Try to send city name.'));
bot.hears('hyy', (ctx) => ctx.reply('Hey there'));

bot.on('text',(ctx)=>{
  let query = ctx.update.message.text;
  helper.getCurrentWeatherByCityName(query, (err, currentWeather) => {
    if(err){
        return ctx.reply(`This city does not exits.`);
    }  
        return ctx.reply(`The current weather in ${query} is 👇👇\nMinimum Temp: ${(currentWeather.main.temp_min-32)*(5/9)}°C\nMaximum Temp: ${(currentWeather.main.temp_max-32)*(5/9)}°C\nHumidity: ${currentWeather.main.humidity}%\nPressure: ${currentWeather.main.pressure}Pa.`);
    
});
});


bot.launch();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
 exports.helloWorld = functions.https.onRequest((request, response) => {
  helper.getCurrentWeatherByCityName(query, (err, currentWeather) => {
    if(err){
      return ctx.reply(`This city does not exits.`);
    }
    return ctx.reply(`The current weather in ${query} is 👇👇\nMinimum Temp: ${(currentWeather.main.temp_min-32)*(5/9)}°C\nMaximum Temp: ${(currentWeather.main.temp_max-32)*(5/9)}°C\nHumidity: ${currentWeather.main.humidity}%\nPressure: ${currentWeather.main.pressure}Pa.`);
    
});
});
