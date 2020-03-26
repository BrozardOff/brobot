const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config, owner) => {

    var apikey = require('../keys.json').fortnite
    var request = require('request')

    var platform = args[0]
    if(!args[0]) return message.reply('vous devez entrer une plateforme !')
    if(args[0] !== "ps4" && args[0] !== "xb1" && args[0] !== "pc")     if(!args[0]) return message.reply('vous devez entrer une plateforme valide !')

    var the_username = args.slice(1).join(' ')
    if(!the_username) return message.reply('vous devez entrer un pseudo !')
    username = the_username.replace(/[' '_]/g,'%20')

    var the_request = 'https://fortnite-api.tresmos.xyz/profile/'+platform+'/'+username+'?key='+apikey

    if(platform === "pc") platform = "PC"
    if(platform === "ps4") platform = "PS4"
    if(platform === "xb1") platform = "Xbox One"

    message.channel.send("Connexion à l'api Fortnite...").then(m => {

        var ms = require('ms')

        request(the_request, { json: true }, (err, res, body) => {

            if (err) {
                return message.channel.send('Erreur lors de la connexion à l\'api Fortnite.')
            }
    
            if(body.err){
                if(body.err === "Player Not Found"){
                    var stats_embed = new Discord.RichEmbed()
                        .setAuthor('Erreur')
                        .setColor(0x000000)
                        .setDescription('Le joueur n\'est pas présent dans la base de données...')
                        .setFooter('Fortnite API - Stats de ' + username)
                    return m.edit(stats_embed)
                }
                if(body.err === "Impossible to fetch User. User not found on this platform"){
                    var stats_embed = new Discord.RichEmbed()
                        .setAuthor('Erreur')
                        .setColor(0x000000)
                        .setDescription('Le joueur existe mais n\'a pas été trouvé sur la plateforme ' + platform + '...\nEssayez-en une autre !')
                        .setFooter('Fortnite API - Stats de ' + the_username)
                    return m.edit(stats_embed)
                }
                var stats_embed = new Discord.RichEmbed()
                    .setAuthor('Erreur')
                    .setColor(0x000000)
                    .setDescription('Une erreur est survenue durant la récupération des données de l\'api Fortnite...')
                    .setFooter('Fortnite API - Stats de ' + the_username)
                return m.edit(stats_embed)
            }
            if(!body.err){

                var array_time_played = body.lifetimeStats.timePlayed.split(' ')
                var time_played_ms = 0

                array_time_played.forEach(element => {
                    var current_ms = ms(element)
                    time_played_ms = time_played_ms + current_ms
                })
                
                var stats_embed = new Discord.RichEmbed()
                    .setAuthor('Stats de ' + the_username)
                    .setColor(config.embed.color)
                    .setDescription('Plateforme : ' + platform)
                    .setThumbnail(body.info.rank)
                    .addField('Solo', body.group.solo.wins + ' victoire(s) | ' + body.group.solo.matches + ' partie(s) | ' + body.group.solo.kills + ' kill(s)')
                    .addField('Duo', body.group.duo.wins + ' victoire(s) | ' + body.group.duo.matches + ' partie(s) | ' + body.group.duo.kills + ' kill(s)')
                    .addField('Squad', body.group.squad.wins + ' victoire(s) | ' + body.group.squad.matches + ' partie(s) | ' + body.group.squad.kills + ' kill(s)')
                    .addField('Total', body.lifetimeStats.wins + ' victoire(s) | ' + body.lifetimeStats.matches + ' partie(s) | '+ body.lifetimeStats.kills + ' kill(s)')
                    .addField('Autres', body.lifetimeStats['k/d'] + ' Kill/Death | ' + convertMS(time_played_ms) + ' passées sur le jeu')
                    .setFooter('Fortnite - Stats de ' + the_username)
        
                m.edit(stats_embed)
            }
        })
    })

    function convertMS(ms) {
        var d, h, m, s
        s = Math.floor(ms / 1000)
        m = Math.floor(s / 60)
        s = s % 60
        h = Math.floor(m / 60)
        m = m % 60
        d = Math.floor(h / 24)
        h = h % 24
      
        var pad = function (n) { return n < 10 ? '0' + n : n }
      
        var result = d + 'j ' + pad(h) + 'h ' + pad(m) + 'm'
        return result
      }
}

module.exports.help = {
    name:"fortnite-stats",
    desc:"Obtenez des stats sur un compte Fortnite !",
    usage:"fortnite-stats [ps4/xb1/pc] [pseudo]",
    group:"utils",
    examples:"$fortnite-stats ps4 user"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}