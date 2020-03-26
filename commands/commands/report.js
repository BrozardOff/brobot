const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config) => {

    message.delete()
    var reason = args.slice(1).join(" ")
    var membre = message.mentions.members.first()
    if(!membre || !args[1]) return message.reply('mentionne un membre et entre une raison !')
    bot.channels.get('558383165224517653').send(membre+' report par '+message.author+' ! Raison : '+reason)

}

module.exports.help = {
    name:"report",
    desc:"Report un membre à l'administration de BrozardLand !",
    usage:"report [@membre] [raison + preuve(s)]",
    group:"utils",
    examples:"$report @『Brozard』#4192 Pub Mp"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}