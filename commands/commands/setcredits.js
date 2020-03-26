const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner, membre_data, members_data) => {

    var quickdb = require('quick.db')
    quickdb.init('./brobot.sqlite')
    var users_data = new quickdb.table('usersdata')

    var member = message.mentions.members.first()
    if(!member) return message.channel.send(author+', vous devez mentionner un membre !')

    var nb_credits = args[1]
    if(isNaN(nb_credits) || !nb_credits)    return message.channel.send(message.author+', vous devez entrer un montant pour **'+member.user.username+'** !')

    users_data.set(member.id+'.credits', nb_credits)

    message.channel.send(message.auhtor+', Brocoins définis à **'+nb_credits+'** pour **'+member.user.username+'** !')
    
}

module.exports.help = {
    name:"set-brocoins",
    desc:"Change le nombre de Brocoins d\'un membre",
    usage:"set-brocoins [@membre] [nombre]",
    group:"économie",
    examples:"$set-brocoins @『Brozard』#4192 20"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"true"
}