const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner, membre_data, members_data) => {

    var quickdb = require('quick.db')
    quickdb.init('./brobot.sqlite')
    var users_data = new quickdb.table('usersdata')

    var description = args.join(' ')
    if(!description) return message.channel.send(message.author+', veuillez entrer une description !')
    if(description.length > 100) return message.channel.send(message.author+', votre description ne doit pas excéder les 100 caractères !')

    users_data.set(message.author.id+'.desc', description)
    message.channel.send(message.author+', votre description vient d\'être mise à jour !')

}

module.exports.help = {
    name:"set-description",
    desc:"Changez votre description !",
    usage:"set-description [description]",
    group:"économie",
    examples:"$set-description Curieux, créatif !"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}

