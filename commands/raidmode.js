const Discord = require("discord.js")

module.exports.run = async (message, args, client, config) => {

    var quickdb = require('quick.db')
    quickdb.init('./brobot.sqlite')
    var raidmode_db = new quickdb.table('raidmode')

    var status = raidmode_db.get(message.guild.id)
    if(status === 'active'){
        raidmode_db.set(message.guild.id, 'null')
        return message.reply('raidmode désactivé !')
    } else {
        raidmode_db.set(message.guild.id, 'active')
        return message.reply('raidmode activé !')
    }
}

module.exports.help = {
    name:"raidmode",
    desc:"Active ou désactive le raidmode !",
    usage:"raidmode",
    group:"administration",
    examples:"$raidmode"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    disabled:"false",
    owner:"false"
}