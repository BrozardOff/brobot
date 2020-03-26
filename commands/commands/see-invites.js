const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config) => {

    let membre = (message.mentions.members.first()) ? message.mentions.members.first() : message.member

    let invites = message.guild.fetchInvites().catch(error => { // This will store all of the invites into the variable

    }).then(invites =>{
        
      var my_invites = invites.filter(invite => invite.inviter === membre.user)

      if(my_invites.size <= 0) return message.channel.send('Actuellement aucune invitation !')

      var uses_count = 0

      var codes = ''

      my_invites.forEach(element => {
        var isExpire = (element.temporary) ? 'Oui' : 'Jamais'
        uses_count += element.uses
        codes += '**'+element.code+'** ('+element.uses+' utilisations) | '+element.channel+'\n'
      })
      
      const embed = new Discord.RichEmbed()
        .setColor(config.embed.color)
        .setAuthor('See Invites')
        .setDescription('Informations sur les invitations de '+membre+' sur '+message.guild.name)
        .addField('👥 Personnes Invitées', uses_count + ' membres')
        .addField('🔑 Codes', codes) // This 

      message.channel.send(embed)
    })

}

module.exports.help = {
    name:"see-invites",
    desc:"Obtenez des informations sur les invitations d'un membre !",
    usage:"see-invites [@membre]",
    group:"utils",
    examples:"$see-invites @『Brozard』#4192"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}