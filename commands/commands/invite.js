const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var ms = require('ms')
    
    var embed = new Discord.RichEmbed()
        .setAuthor('Invitations')
        .addField('Invitez le bot sur votre propre serveur !', 'Génération...')
        .addField('Serveur Support', 'Génération...')
        .setColor(config.embed.color)
        .setFooter(config.embed.footer)
        .setTimestamp()

    var new_embed = new Discord.RichEmbed()
        .setAuthor('Invitations')
        .setColor(config.embed.color)
        .setFooter(config.embed.footer)
        .setTimestamp()

    bot.generateInvite('ADMINISTRATOR').then(invite =>{
        new_embed.addField('Invitez le bot sur votre propre serveur !', invite)
    })

    bot.channels.get(config.channel).createInvite({
        maxAge : '0'
    }).then(invite =>{
        new_embed.addField('Serveur Support', invite.url)
    })

    message.channel.send(embed).then(m =>{
        setTimeout(function(){
            m.edit(new_embed)
        }, ms('1.5s'))
    })

}

module.exports.help = {
    name:"invite",
    desc:"Invitez le bot sur votre propre serveur !",
    usage:"invite",
    group:"général",
    examples:"$invite"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}