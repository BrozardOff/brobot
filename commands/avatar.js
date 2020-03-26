const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var member = message.mentions.members.first() || message.member

    var embed = new Discord.RichEmbed()
        .setAuthor('Avatar de '+member.user.username)
        .setImage(member.user.displayAvatarURL)
        .setColor(config.embed.color)
        .setFooter(config.embed.footer)
    message.channel.send(embed)
    
}

module.exports.help = {
    name:"avatar",
    desc:"Obtenez l'avatar du membre !",
    usage:"avatar [@membre]",
    group:"fun",
    examples:"$avatar @『Brozard』#4192"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}