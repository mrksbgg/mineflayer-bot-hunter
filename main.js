const mineflayer = require("mineflayer");
const {pathfinder, Movements, goals: {GoalNear, GoalBlock, GoalFollow}} = require('mineflayer-pathfinder');
const bot = mineflayer.createBot({host: 'IP', port: PORT, username: 'BOTNICKNAME'})
const pvp = require('mineflayer-pvp').plugin
const autoeat = require("mineflayer-auto-eat")


bot.loadPlugin(pathfinder);
bot.loadPlugin(pvp);
bot.loadPlugin(autoeat)

bot.once('spawn', function () {
    const mcData = require('minecraft-data')(bot.version)
    const defaultMove = new Movements(bot, mcData)
    bot.autoEat.options = {
    priority: "saturation",
    startAt: 16,
    bannedFood: ["rotten_flesh"],
  }
    bot.chat('Commands')
    bot.chat('.start - Start hunt')
    bot.chat('.stop - Stop hunt')
    bot.chat('--------------------------------------------------')
    bot.chat('made by mrksbgg')
    bot.chat('If you find any bug, please open issue on')
    bot.chat('https://github.com/mrksbgg/mineflayer-bot-hunter/issues')
})


bot.on("autoeat_started", () => {
  console.log("[AutoEat] Eating...")
  bot.pvp.stop()
})

bot.on("autoeat_stopped", function (message) {
  console.log("[AutoEat] Ate!")
  const username = '@p'
  const player = bot.players[username]
  if (!player) {
      bot.chat("I can't see you.")
      return
  }
  const sword = bot.inventory.items().find(item => item.name.includes('sword'))
  if (sword) {
    bot.equip(sword, 'hand')
    }

  if (!player) {
    bot.chat("I can't see you.")
    return
    }

    bot.pvp.attack(player.entity)
})

bot.on('chat', function (username, message) {
  if (message === '.start') {
    const player = bot.players[username]
    bot.chat('Начато!')
    bot.chat('/effect give @s glowing 999999 255 true')
    bot.pathfinder.setGoal(new GoalFollow(player.entity, 1), true)
    const shield = bot.inventory.items().find(item => item.name.includes('shield'))
    if (shield) bot.equip(shield, 'off-hand')

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

bot.on("health", function (message) {
  if (bot.health < 5) {
    const totem = bot.inventory.items().find(item => item.name.includes('totem'))
    if (totem) bot.equip(totem, 'off-hand')
  }
  else {}
})

bot.on("health", () => {
  if (bot.food === 16) bot.autoEat.disable()
  else bot.autoEat.enable()
})
