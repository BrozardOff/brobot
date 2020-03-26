const Discord = require("discord.js")

module.exports.run = async (message, args, client, config) => {

    var user = message.mentions.members.first()
    if(!user) return message.reply('mentionne un membre !')

    user.send(`Tu viens d'être unmute sur ${message.guild.name} par ${message.author.username} !`)

    message.channel.send(`**${user.user.username}#${user.user.discriminator}** est unmute !`)

    message.guild.channels.forEach(ch => ch.overwritePermissions( user.user, { SEND_MESSAGES: null }))
    
}

module.exports.help = {
    name:"unmute",
    desc:"Unmute le membre !",
    usage:"unmute [@membre]",
    group:"modération",
    examples:"$unmute @『Brozard』#4192"
}

module.exports.settings = {
    permissions:"MANAGE_MESSAGES",
    disabled:"false",
    owner:"false"
}