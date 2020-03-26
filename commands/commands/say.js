const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var say_message = args.join(' ')

    if(!args[0]) return message.reply('entrez un message !')

    message.delete()
    
    message.channel.send('**'+message.author.username+'#'+message.author.discriminator+'** vient de dire :\n'+say_message)
    
}

module.exports.help = {
    name:"say",
    desc:"Faites parler le bot !",
    usage:"say",
    group:"utils",
    examples:"$say bonjour !"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}