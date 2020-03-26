const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    const figlet = require('figlet')

    if(!args[0]) return message.reply('vous devez entrer un message !')
    
    if(args.join(' ').length > 20){
        return message.reply('trop de caractères....Nombre de caractères maximum est de 20')
    }
    figlet(args.join(' '), function(err, rdata) {
        if (err) {
            message.reply('une erreur est survenue pendant la conversion...')
            return
        }
        message.channel.send('```' + rdata + '```')
    })

}

module.exports.help = {
    name:"ascii",
    desc:"Transforme votre texte en ascii !",
    usage:"ascii [texte]",
    group:"fun",
    examples:"$ascii Bonjour !"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}