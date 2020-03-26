const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    if(!args[0]) return message.reply("donne un nombre de message à supprimer.")

    if(isNaN(args[0])) return message.reply("entre un nombre valide.")

    if(args[0] === "0") return message.reply('je ne peux pas clear 0 message.') 

    let tosuppr = parseInt(args[0]) + 1

    if(tosuppr > 99) tosuppr = 99

    message.channel.bulkDelete(tosuppr).then(() => {
        message.channel.send(`${args[0]} messages supprimés.`).then(ymessage => {
            setTimeout(function(){
                ymessage.delete()
            }, 5000)
        })
    })
}

module.exports.help = {
    name:"clear",
    desc:"Supprime rapidement un nombre de messages spécifique dans le channel ou a été tapée la commande.",
    usage:"clear [nombre]",
    group:"modération",
    examples:"$clear 100"
}

module.exports.settings = {
    permissions:"MANAGE_MESSAGES",
    disabled:"false",
    owner:"false"
}