const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    const fetch = require('node-superfetch')

    var content = args.join(' ')
    if(!args[0]) return message.reply('veuillez entrer un message !')

    fetch.post(`https://hastebin.com/documents`).send(content).then(body => {
        message.channel.send(`Contenu posté sur HasteBin !\n\nVotre lien : https://hastebin.com/${body.body.key}`)
    })
    
}

module.exports.help = {
    name:"hastebin",
    desc:"Uploadez votre message sur hastebin !",
    usage:"hastebin [message]",
    group:"utils",
    examples:"$hastebin Bonjour"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}