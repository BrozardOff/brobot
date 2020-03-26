const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var apikey = require('../keys.json').fortnite
    var request = require('request')

    message.channel.send("Connexion à l'api Fortnite...").then(m => {

        var the_request = "https://fortnite-api.tresmos.xyz/news?key="+apikey

        request(the_request, { json: true }, (err, res, body) => {
            

            // 1 = pile | 2 = face
            min = Math.ceil(0)
            max = Math.floor(3)

            let result = Math.floor(Math.random() * (max - min)) + min

            var embed1 = new Discord.RichEmbed()
                .setAuthor('News #1 - ' + body.br[0].title)
                .setDescription(res.text)
                .setImage(body.br[0].image)
                .setFooter(data.footer)
                .setColor(data.embed_color)

            m.edit(embed1)
        
            var embed2 = new Discord.RichEmbed()
                .setAuthor('News #2 - ' + body.br[1].title)
                .setDescription(res.text)
                .setImage(body.br[1].image)
                .setFooter(data.footer)
                .setColor(data.embed_color)

            m.channel.send(embed2)
        
            var embed3 = new Discord.RichEmbed()
                .setAuthor('News #3 - ' + body.br[2].title)
                .setDescription(res.text)
                .setImage(body.br[2].image)
                .setFooter(data.footer)
                .setColor(data.embed_color)

            m.channel.send(embed3)
        })
    })
}

module.exports.help = {
    name:"fortnite-news",
    desc:"Obtenez les dernières news Fortnite !",
    usage:"fortnite-news",
    group:"utils",
    examples:"$fortnite-news"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}