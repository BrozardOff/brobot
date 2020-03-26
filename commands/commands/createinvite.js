const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    message.guild.channels.filter(ch => ch.type === 'text').first().createInvite().then(i => {
        message.channel.send(i.url)
    })
    
    
}


module.exports.help = {
    name:"createinvite",
    desc:"Génère une invitation valide !",
    usage:"createinvite",
    group:"utils",
    examples:"$createinvite"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}