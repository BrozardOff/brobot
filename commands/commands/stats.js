const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var quickdb = require('quick.db')
    quickdb.init('./brobot.sqlite')
    var stats_db = new quickdb.table('stats')

    var embed = new Discord.RichEmbed()
        .setAuthor('Stats de BrozardLand')
        .setDescription('Stats enregistrés à partir du  mars ')
        .addField('Messages', stats_db.get('msg'), true)
        .addField('Commandes', stats_db.get('cmd'), true)
        .addField('Mentions', stats_db.get('ping'), true)
        .addField('Total Majuscules', stats_db.get('maj'), true)
        .addField('Total Minuscules', stats_db.get('min'), true)
        .addField('Total Caractères', stats_db.get('caract'), true)
        .setColor(config.embed.color)
        .setFooter(config.embed.footer)
    
    message.channel.send(embed)

}

module.exports.help = {
    name:"stats",
    desc:"Obtenez les stats du serveur !",
    usage:"stats",
    group:"général",
    examples:"$stats"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}

