const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config) => {

    var superagent = require('superagent')

    message.channel.send('Image en cours de chargement...').then(m => {

        superagent.get('https://nekobot.xyz/api/image').query({ type: 'pussy'}).end((err, response) => {

            var embed_nsfw = new Discord.RichEmbed()
                .setAuthor('NSFW - Pussy')
                .setDescription('Requête de '+message.member.displayName)
                .setFooter(config.embed.footer)
                .setImage(response.body.message)
                .setColor(config.embed.color)
            
            m.edit(embed_nsfw)
    
        })
    })
    


}

module.exports.help = {
    name:"pussy",
    desc:"Génère une image NSFW de type `pussy`. Attention, ce type d'image peut choquer et est réservé aux membres de plus de 18 ans.",
    usage:"pussy",
    group:"NSFW",
    examples:"$pussy"
}

module.exports.settings = {
    permissions:"false",
    nsfw:"true",
    disabled:"false",
    owner:"false"
}