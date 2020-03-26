const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    if(!args[0]) return message.reply('vous devez entrer une recherche !')
    message.delete()
    var the_request = args.join(' ')
    the_request = the_request.replace(/[' '_]/g,'+')
    the_request = 'http://lmgtfy.com/?q=' + the_request
    message.channel.send(the_request)
}

module.exports.help = {
    name:"lmgtfy",
    desc:"Pour vos amis, qui posent sans arrêt des questions débiles !",
    usage:"lmgtfy [recherche]",
    group:"fun",
    examples:"$lmgtfy ign signification"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}