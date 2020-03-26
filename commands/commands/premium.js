const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner, membre_data, members_data) => {

    var quickdb = require('quick.db')
    quickdb.init('./brobot.sqlite')
    var users_data = new quickdb.table('usersdata')
    var work = new quickdb.table('work')

    var member = message.mentions.members.first()
    if(!member) return message.channel.send(message.author+', vous devez mentionner un membre !')

    if(members_data[0].premium === 'false'){
        users_data.set(member.id+'.premium', 'true')
        message.channel.send(':tada: Félicitations '+member+' ! Vous faites désormais parti des membres premium !')
    } else {
        users_data.set(member.id+'.premium', 'false')
        message.channel.send(':confused: Dommage '+member+'... Vous ne faites désormais plus parti des membres premium !')
    }
    
}

module.exports.help = {
    name:"premium",
    desc:"Passe un membre premium ou enlève le premium à un membre !",
    usage:"premium [@membre]",
    group:"économie",
    examples:"$premium @『Brozard』#4192"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"true"
}