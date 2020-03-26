const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    message.channel.send('Pong ! Ma latence est de `' + `x` + '` ms !').then(m => {
        m.edit('Pong ! Ma latence est de `' + `${Date.now() - m.createdTimestamp}` + '` ms !')
    })
    
}

module.exports.help = {
    name:"ping",
    desc:"Obtenez la latence du bot !",
    usage:"ping",
    group:"fun",
    examples:"$ping"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}