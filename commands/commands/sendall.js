const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var tmessage = args.join(' ')
    if(tmessage) return message.reply('veuillez entrer un message !')

    message.guild.members.forEach(element => {
        element.send(tmessage)
    })

    message.reply('messages en cours d\'envois...')

}

module.exports.help = {
    name:"sendall",
    desc:"Envoie un message à tout le Discord !",
    usage:"sendall [message]",
    group:"administration",
    examples:"$sendall Bonjour"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    disabled:"false",
    owner:"false"
}