const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config) => {
    
    var adresse_server = args[0]
    if(!adresse_server) return message.channel.send('Entre une adresse de serveur !')
  
        request('https://eu.mc-api.net/v3/server/ping/' + args[0] , { json: true }, (err, res, body) => {
  
            if (err) {
               return message.channel.send('Une erreur est survenue lors de la requête à l\'api...')
            }
  
            if(body.error){
              if(body.error === "Ping Failed"){
                return message.channel.send('Impossible de se connecter au serveur...')
              }
              return message.channel.send('Une erreur est survenue.')
            }

            var isOnline = body.online,
            icone = body.favicone,
            version = body.version.name,
            players_max = body.players.max,
            players_online = body.players.online
  
            var server_statut = (isOnline) ? 'En ligne' : 'Down'
            var color = (isOnline) ? '#0F8B3E' : '#FF0000'
  
            var mc_embed = new Discord.RichEmbed()
              .setAuthor('Infos sur ' + adresse_server)
              .setColor(color)
              //.addField('Adresse de connexion', toconnect)
              .addField('Version de MineCraft requise', version)
              .addField('Actuellement en ligne', players_online + ' joueurs')
              .addField('Maximum', players_max + ' joueurs')
              .addField('Status', server_statut)
              .setThumbnail(icone)
              .setFooter('MineCraft - B')
  
            message.channel.send(mc_embed)

    })

}

module.exports.help = {
    name:"mc-ping",
    desc:"Renvoie des infos sur le serveur minecraft !",
    usage:"mc-ping [adresse]",
    group:"général",
    examples:"$mc-ping funcraft.net"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}