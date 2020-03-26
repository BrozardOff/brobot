const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var ms = require('ms')

    var responses = args.join(' ').split('/')

    if(responses.length < 2) return message.reply('vous devez donner deux choix au minimum !')

    message.channel.send('Choix en cours...').then(m =>{
        setTimeout(function(){
            m.edit('Mon choix :')
            let result = Math.floor((Math.random() * responses.length))
            message.channel.send('```'+responses[result] + '```')
        }, ms('1s'))
    })

}

module.exports.help = {
    name:"random",
    desc:"Je fais des choix à votre place !",
    usage:"random [choix1/choix2/etc...]",
    group:"fun",
    examples:"$random Feu/Eau"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}