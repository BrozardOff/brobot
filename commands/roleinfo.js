const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config) => {

    var role = message.mentions.roles.first()
    if(!role) return message.reply('vous devez mentionner un rôle !')

    var isMentionnable = (role.mentionnable) ? 'Oui' : 'Non'

    var embed = new Discord.RichEmbed()
        .setAuthor('Information sur le role '+role.name)
        .addField('Nom', role, true)
        .addField('ID', role.id, true)
        .addField('Mentionnable', isMentionnable, true)
        .addField('Position', role.position, true)
        .addField('Couleur', role.hexColor, true)
        .addField('Créé le', printDateonts(role.createdAt, true), true)
        .setColor(config.color)
        .setFooter(config.footer)
    
    message.channel.send(embed)

    function printDateonts(ts, displayh){
        var pdate = new Date(ts)
        var monthNames = [
            "janvier", "février", "mars",
            "avril", "mai", "juin", "juillet",
            "août", "septembre", "octobre",
            "novembre", "décembre"
        ]
        var day = pdate.getDate()
        var monthIndex = pdate.getMonth()
        var year = pdate.getFullYear()
        var hour = pdate.getHours()
        var minute = pdate.getMinutes()
        var thedate
        if(displayh){
            thedate = day + ' ' + monthNames[monthIndex] + ' ' + year + " à " + hour + "h" + minute
        }
        if(!displayh){
            thedate = day + ' ' + monthNames[monthIndex] + ' ' + year
        }
        return thedate
    }

}

module.exports.help = {
    name:"roleinfo",
    desc:"Affiche des infos sur le role",
    usage:"roleinfo [@role]",
    group:"utils",
    examples:"$roleinfo @『🎗』Administrateur"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}