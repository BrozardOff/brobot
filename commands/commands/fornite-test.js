const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var apikey = require('../keys.json').fortnite
    var request = require('request')

    var the_request = 'https://fortnite-api.tresmos.xyz/status?key='+apikey

    message.channel.send("Connexion à l'api Fortnite...").then(m => {

        request(the_request, { json: true }, (err, res, body) => {

            var statut

            if(body.boolean){
                var online_embed = new Discord.RichEmbed()
                    .setAuthor('Statut Fortnite')
                    .setColor(config.embed.color)
                    .setDescription('Les serveurs sont en ligne !')
                    .setFooter('Fortnite - Statuts Serveurs')
                m.edit(online_embed)
            }
            if(!body.boolean){
                var disco_embed = new Discord.RichEmbed()
                    .setAuthor('Statut Fortnite')
                    .setColor(config.embed.color)
                    .setDescription('Les serveurs sont down !')
                    .setFooter('Fortnite - Statuts Serveurs')
                m.edit(disco_embed)
            }

        })
    })
    
}

module.exports.help = {
    name:"fortnite-test",
    desc:"Obtenez le statut des serveurs Fortnite !",
    usage:"fortnite-test",
    group:"utils",
    examples:"$fortnite-test"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}