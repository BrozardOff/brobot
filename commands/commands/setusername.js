const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var username = args.join(' ')
    if(!username) return message.reply('veuillez entrer un pseudo !')

    bot.user.setUsername(username).then( () => {
        return message.channel.send('Action correctement effectuée !')
    }).catch(err => {
        return message.channel.send('Une erreur s\'est produite. Soit :\n  - Le pseudo fait plus de 32 caractères.\n  - Vous avez changé trop de fois le pseudo et il vous faut patienter avant de pouvoir à nouveau le changer.')
    })

}

module.exports.help = {
    name:"setusername",
    desc:"Changez le nom d'utilisateur du bot !",
    usage:"setusername [pseudo]",
    group:"owner",
    examples:"$setusername BroBotV2"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"true"
}