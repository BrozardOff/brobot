const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config) => {

    var the_id = args[0]
    if(!the_id) return message.reply('entrez une id !')

    var the_message = args.slice(1).join(' ')
    if(!the_message) return message.reply('entrez un message !')
    
    bot.fetchUser(the_id).then(user => {
        user.send(the_message).then( () => {
            return message.reply('message envoyé !')
        }).catch(err => {
            return message.reply(user.username+' n\'accepte pas mes mps...')
        })
    }).catch(err => {
        return message.channel.send('Aucun utilisateur ne possède l\'ID `'+the_id+'` !')
    })

}

module.exports.help = {
    name:"mp",
    desc:"Envoyez un mp via le bot !",
    usage:"mp [ID] [message]",
    group:"administration",
    examples:"$mp 354271328859324416 Bonjour !"
}

module.exports.settings = {
    permissions:"MANAGE_GUILD",
    disabled:"false",
    owner:"false"
}