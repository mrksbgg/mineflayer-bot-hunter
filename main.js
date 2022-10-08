const mineflayer = require("mineflayer");
const {pathfinder, Movements, goals: {GoalNear, GoalBlock, GoalFollow}} = require('mineflayer-pathfinder');
const bot = mineflayer.createBot({host: 'IP', port: SERVER_PORT, username: 'BOT_NAME'})
const pvp = require('mineflayer-pvp').plugin
const autoeat = require("mineflayer-auto-eat")


bot.loadPlugin(pathfinder);
bot.loadPlugin(pvp);
bot.loadPlugin(require('mineflayer-dashboard'))
bot.loadPlugin(autoeat)

bot.once('spawn', function () {
    const mcData = require('minecraft-data')(bot.version)
    const defaultMove = new Movements(bot, mcData)
    bot.autoEat.options.priority = "foodPoints"
    bot.autoEat.options.bannedFood = ["rotten_flesh"]
    bot.autoEat.options.eatingTimeout = 3
    bot.chat('Commands')
    bot.chat('.start - Start hunt')
    bot.chat('.stop - Stop hunt')
    bot.chat('--------------------------------------------------')
    bot.chat('made by mrksbgg')
})
bot.on('chat', function (username, message) {
  if (message === '.start') {
    const player = bot.players[username]
    bot.chat('Started!')
    bot.chat('/effect give @s glowing 999999 255 true')
    bot.pathfinder.setGoal(new GoalFollow(player.entity, 1), true)

    if (!player) {
      bot.chat("I can't see you.")
      return
    }

    bot.pvp.attack(player.entity)
  }
    if(message === ".stop"){
        bot.pathfinder.setGoal(null, 1)
        bot.pvp.stop()
    }
})

bot.on("health", () => {
  if (bot.food === 16) bot.autoEat.disable()
  else bot.autoEat.enable()
})