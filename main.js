const mineflayer = require("mineflayer");
const {pathfinder, Movements, goals: {GoalNear, GoalBlock, GoalFollow}} = require('mineflayer-pathfinder');
const bot = mineflayer.createBot({host: 'localhost', port: 3716, username: 'SenseBot'})
const mineflayerViewer = require('prismarine-viewer').mineflayer
const pvp = require('mineflayer-pvp').plugin
const autoeat = require("mineflayer-auto-eat")


bot.loadPlugin(pathfinder);
bot.loadPlugin(pvp);
bot.loadPlugin(require('mineflayer-dashboard'))
bot.loadPlugin(autoeat)

bot.once('spawn', function () {
    mineflayerViewer(bot, { firstPerson: true, port: 6969 })
    const mcData = require('minecraft-data')(bot.version)
    const defaultMove = new Movements(bot, mcData)
    bot.autoEat.options.priority = "foodPoints"
    bot.autoEat.options.bannedFood = ["rotten_flesh"]
    bot.autoEat.options.eatingTimeout = 3
    bot.chat('Команды:')
    bot.chat('.start - Начать')
    bot.chat('.stop - Остановиться')
    bot.chat('.tphere - Телепортироваться к игроку')
    bot.chat('--------------------------------------------------')
    bot.chat('made by mrksbgg')
})
bot.on('chat', function (username, message) {
  if (message === '.start') {
    const player = bot.players[username]
    bot.chat('Начато!')
    bot.chat('/effect give @s glowing 999999 255 true')
    bot.pathfinder.setGoal(new GoalFollow(player.entity, 1), true)

    if (!player) {
      bot.chat("I can't see you.")
      return
    }

    bot.pvp.attack(player.entity)
  }
    if(message === "Ко мне"){
        const player = bot.players[username]
        bot.pathfinder.setGoal(new GoalNear(player.entity.position.x, player.entity.position.y, player.entity.position.z, 1))
    }
    if(message === ".stop"){
        bot.pathfinder.setGoal(null, 1)
        bot.pvp.stop()
    }
    if(message === ".tphere"){
        bot.chat('/tp itslapo')
    }
})

bot.on("health", () => {
  if (bot.food === 16) bot.autoEat.disable()
  else bot.autoEat.enable()
})