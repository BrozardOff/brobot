const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var embed = new Discord.RichEmbed()
        .setAuthor('Nos réseaux')
        .setColor(config.embed.color)
        .setFooter(config.embed.footer)
        .addField('Youtube', 'Pas de Youtube')
        .addField('Twitter', 'Pas de Twitter')
        .addField('Instagram', 'Pas de Instagram')


    message.channel.send(embed)
    
}

module.exports.help = {
    name:"social",
    desc:"Affiche les réseaux de BrozardLand !",
    usage:"social",
    group:"utils",
    examples:"$social"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}