const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var request = require('request')
    
    let username = (message.member.nickname) ? message.member.nickname : message.author.username

    let replies = []

    request("https://bridge.buddyweb.fr/api/blagues/blagues", { json: true }, function (error, response, body) {
        replies = body


        let result = Math.floor((Math.random() * replies.length))

        var number = result + 1
    
        var embed = new Discord.RichEmbed()
            .setAuthor('Blague n°' + number)
            .setColor(config.embed.color)
            .setDescription(replies[result].blagues)
            .setFooter(config.embed.footer)
            .setTimestamp()
    
        message.channel.send(embed).then(m =>{
            m.react('😂')
        })

    })

}

module.exports.help = {
    name:"blague",
    desc:"Tire une blague aléatoire !",
    usage:"blague",
    group:"fun",
    examples:"$blague"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}