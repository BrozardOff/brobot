const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var game = args.join(' ')
    bot.user.setActivity(game)


    var quickdb = require('quick.db')
    quickdb.init('./brobot.sqlite')
    var config = new quickdb.table('config')

    config.set('game', game)
    
    return message.reply('jeu changé !')

}


module.exports.help = {
    name:"setplay",
    desc:"Change le jeu du bot !",
    usage:"setplay [jeu]",
    group:"owner",
    examples:"$setplay modérer"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"true"
}