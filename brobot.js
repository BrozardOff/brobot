const Discord = require('discord.js'), // Récup Discord
bot = new Discord.Client() // Création du client
bot.commands = new Discord.Collection()

var generator = require('generate-password')
var ms = require('ms')
var request = require('request')
var CronJob = require('cron').CronJob

const config = require('./config.json') // Récupère le contenu du fichier config.json
const fs = require('fs')

console.log('\x1b[33m%s\x1b[0m','[!]','\x1b[0m','Connexion en cours...') // Affichage d'un message d'attente dans la console

bot.login(config.token) // Connexion à l'api Discord

var owner = { user: null }

// Anti Raid
var users = {}
var warned_users = []

var quickdb = require('quick.db')
quickdb.init('./brobot.sqlite')
var raidmode = new quickdb.table('raidmode')
var giveaways_db = new quickdb.table('giveaways')
const unmutes_db = new quickdb.table('unmutes')
const warns_db = new quickdb.table('warns')

const config_db = new quickdb.table('config')

const users_data = new quickdb.table('usersdata')
const stats = new quickdb.table('stats')

const blacklist = new quickdb.table('blacklist')
if(!blacklist.get('words')) blacklist.set('words', [])

bot.on('ready', () => {
    console.log('\x1b[32m','[OK]','\x1b[0m', 'Connexion à l\'API Discord effectuée !')
    bot.user.setActivity(config_db.get('game')) // Met à jour le jeu du bot
    bot.fetchUser(config.owner).then(user => {
        owner.user = user
    })
    if(!giveaways_db.get('giveaways')) giveaways_db.set('giveaways', [])
    setInterval(maj, 5000)
})

var captcha = {}

new CronJob('* * * * * *', function() {
    var time = Math.floor(Date.now()/1000)
    time = String(time)
    var cm = unmutes_db.get(time)
    if(cm){
        cm.forEach(unmute => {
            var guild = bot.guilds.get(unmute.guild_id)
            if(guild){
                var member = guild.members.get(unmute.member_id)
                if(member){
                    guild.channels.forEach(ch => ch.overwritePermissions( member.user, { SEND_MESSAGES: null }))
                }
            }
        })
    }
}, null, true, "Europe/Paris")

bot.on('guildMemberAdd', (member) => {

    /* Message de bienvenue */

    var picture = member.user.displayAvatarURL

    axios.get(`https://arcadia-api.xyz/api/v1/welcome?url=`+picture+`&text=${member.user.username}&back=https://image.noelshack.com/fichiers/2019/08/4/1550730216-background-loop-4.jpg`, {
        headers: {
            Authorization: config['arcadia-key'],
        },
        responseType: 'arraybuffer'
    }).then((res) => {
        var channel =  bot.channels.get(config.channels.aeroport)
        channel.send('Bienvenue à toi '+member+' dans le serveur **'+member.guild.name+'**, nous espérons que tu as fait un bon vol jusqu\'ici a présent nous sommes **'+member.guild.memberCount+'**.')
        channel.send({
            files: [{
                attachment: res.data,
                name: member.displayName+'.png'
            }]
        })
    })

    /* Message de bienvenue */
    
})

fs.readdir("./commands/", (err, files) => {
    if(err){
        console.log(err)
    }
    let jsfiles = files.filter(f => f.split(".").pop() === "js")
    if(jsfiles.length <= 0){
      console.log("Je n'ai trouvé aucune commande...")
      return
    }
    jsfiles.forEach((f, i) =>{
      let props = require(`./commands/${f}`)
      bot.commands.set(props.help.name, props)
    })
})

bot.on('message', (message) => {

    if(message.mentions.users.size > 0) stats.add('ping', message.mentions.users.size)

    if(message.channel.type === "dm"){
        if(message.author.id === bot.user.id) return
        var embed = new Discord.RichEmbed()
            .setAuthor(message.author.username+'#'+message.author.discriminator, message.author.displayAvatarURL)
            .addField('Contenu', '**'+message.content+'**')
            .addField('ID Message', message.id, true)
            .addField('ID Auteur', message.author.id, true)
            .addField('ID Salon', message.channel.id, true)
            .setColor(config.embed.color)
            .setFooter(config.embed.footer)
        bot.channels.get(config.mps).send(embed)
    }

    if(!message.guild) return

    if(!message.author.bot && !message.member.hasPermission('MANAGE_MESSAGES')){
        var isInBlacklist = false
        blacklist.get('words').forEach(bm => {
            if(message.content.includes(bm)){
                if(isInBlacklist) return
                message.delete()
                isInBlacklist = true
                message.channel.send(message.author+', vous avez entré un mot blacklist ! Veuillez éditer votre message (il vous a été envoyé en privé pour que vous puissiez le copier et le modifier) !')
                return message.author.send('```'+message.content+'```')
            }
        })
    }

    if(message.channel.id === "518779793144021002", "507618775764434944", "507973139444269056", "507962999806492673", "507926661975506954"){
        var user = message.mentions.members.first()
        var level = message.content.slice(10).trim().split(/ +/g)[0]
        bot.channels.get('559316163138682881').send('GG '+user+', Tu avances au niveau suivant : '+level+' Continue ton beau travail !')
    }

    if(message.channel.id === "507620704045236234" && message.guild.id === config.support){
        if(message.member.hasPermission('ADMINISTRATOR')) return
        message.delete()
        var capt = message.guild.roles.find(r => r.name === 'Captcha')
        var pl = message.guild.roles.find(r => r.name === 'Joueur')
        if(message.member.roles.has(capt.id)){
            var code = captcha[message.author.id]
            if(message.content === code){
                message.member.removeRole(capt)
                message.member.addRole(pl)
                message.author.send('**Bienvenue !** :tada:')
            } else {
                message.author.send('Erreur code invalide !')
            }
        }
    }

    if(message.author.bot) return

    if(message.guild.id === config.support){
        addMessage(message.author.id)
        var user_data = users[message.author.id]
        if((user_data > 5)) warn(message)
        log(message)
    }

    if(raidmode.get(message.guild.id) === 'active' && !message.member.hasPermission('MANAGE_MESSAGES')) message.delete() // Si l'anti raid est activé => suppresion du msg
    
    var membre_data
    membre_data = users_data.get(message.author.id)
    if(!membre_data){
        createUser(message.author)
        membre_data = users_data.get(message.author.id)
    } 
    
    var members_data = [] // Initialisation de l'objet data

    if(message.mentions.members.size > 0){
        var array_membre_data = []
        message.mentions.members.forEach(membre =>{
            var the_membre_data
            the_membre_data = users_data.get(membre.id)
            if(!the_membre_data){
                createUser(membre.user)
                the_membre_data = users_data.get(membre.id)
            }
            array_membre_data.push(the_membre_data)
        })
        members_data = array_membre_data
    }

    if(!message.content.startsWith(config.prefix)) return

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g) // Si /say Hello ==> args[0] == 'say' et args[1] == 'hello'
    const command = args.shift().toLowerCase()  // Return args[0] et l'enlève du tableau args

    var isOwner = (config.admin_users.indexOf(message.author.id) < 0) ? false : true
    
    let commandfile = bot.commands.get(command) // Cherche si la cmd existe dans la collection de cmd

    if(commandfile){
        if(commandfile.settings.permissions !== "false"){
            if(!message.member.hasPermission(commandfile.settings.permissions)) return message.channel.send('Vous ne disposez pas du rôle nécessaire pour cette commande !')
        }
        if(commandfile.settings.owner === 'true'){
            if(!isOwner) return message.channel.send('Seul `'+owner.user.username+'#'+owner.user.discriminator+'` peut effectuer ces commandes.')
        }
        if(commandfile.settings.disabled === 'true'){
            return message.channel.send('La commande `' + commandfile.help.name + '` est actuellement désactivée.')
        }
        if(commandfile.settings.support){
            if(commandfile.settings.support === 'true' && message.guild.id !== config.support) return message.channel.send('Cette commande est seulement disponible sur le serveur principal.')
        }
        if(commandfile.settings.nsfw){
            if(commandfile.settings.nsfw === 'true' && !message.channel.nsfw) return message.channel.send('Cette commande est seulement disponible dans les salons NSFW :underage:')
        }
        stats.add('cmd', 1)
        return commandfile.run(message, args, bot, config, owner, membre_data, members_data)
    }

})

function addMessage(user_id){
    var current_messages = (users[user_id]) ? users[user_id] : 0
    var total = 1
    total += current_messages
    users[user_id] = total
    setTimeout(function(){
        users[user_id] = 0
    }, 10000)
}

function warn(msg){
    msg.channel.fetchMessages({limit:15}).then(msgs => {
        msgs = msgs.array().filter(m=>m.author.id === msg.author.id)
        msgs.map(async m => await m.delete().catch(console.error))
    })

    if(warned_users.indexOf(msg.author.id) >= 0){
        var kick_embed = new Discord.RichEmbed()
            .setAuthor('Bonjour, '+msg.author.username, msg.author.displayAvatarURL)
            .setDescription('Nous venons de détecter une tentative de spam !\nComme ce n\'est pas la première fois ces 5 dernières minutes, vous avez été expulsé.')
            .setColor(config.embed.color)
            .setFooter(config.embed.footer)
            .setTimestamp()
        
        users[msg.author.id] = 0
        var new_warn = []
        warned_users.forEach(m => { if(m !== msg.author.id) new_warn.push(m) }) // Nouveau tableau sans le membre
        warned_users = new_warn // Mise à jour de la variable
        msg.author.send(kick_embed).then( () => msg.member.kick('Spam')) // Envoie du message puis expulsion.
        
    }

    var warn_embed = new Discord.RichEmbed()
        .setAuthor('Attention, '+msg.author.username, msg.author.displayAvatarURL)
        .setDescription('Nous venons de détecter une tentative de spam !\nVous serez expulsé si vous continuez !')
        .setColor(config.embed.color)
        .setFooter(config.embed.footer)
        .setTimestamp()
    msg.channel.send(warn_embed).catch(err => msg.author.send(warn_embed)) // Si le bot n'a pas les permissions de parler => on envoie en mp
    users[msg.author.id] = 0
    warned_users.push(msg.author.id)
}


function maj(){
             
    giveaways_db.get('giveaways').forEach(giveaway => {

        if(giveaway.endAt > Date.now()){
            //Calcul de la différence entre la date actuelle et la date de fin
            var _diff = giveaway.endAt - Date.now()
            //Arrondi
            var _remaining = Math.floor(_diff / 1000)
            var time_remaining = tempsrestant(_diff)
            if(_remaining < 11){
                clearInterval(the_interval)
                return end(giveaway)
            }
            
            let embedmaj = new Discord.RichEmbed()
                .setAuthor(giveaway.lot)
                .setColor(config.embed.color)
                .setDescription("Réagissez avec 🎉 pour participer !\nTirage dans : " + time_remaining)
                .setFooter('BrozardLand Giveaways')
            
            var _message = bot.guilds.get(config.support).channels.get(giveaway.channel).fetchMessage(giveaway.messageid).then(m =>{
                m.edit(':tada: **GIVEAWAY** :tada:', embedmaj)
            })
        }

    })
}


function dhm(t){
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.round( (t - d * cd - h * ch) / 60000),
        pad = function(n){ return n < 10 ? '0' + n : n }
  if( m === 60 ){
    h++
    m = 0
  }
  if( h === 24 ){
    d++
    h = 0
  }
  return [d, pad(h), pad(m)].join(':')
}


function end(giveaway_data){

    var _message = bot.guilds.get(config.support).channels.get(giveaway_data.channel).fetchMessage(giveaway_data.messageid).then(m =>{

        var the_gagnant = m.reactions.filter(react => react._emoji.name === '🎉').first().users.filter(u => m.guild.members.get(u.id) !== undefined).random(1)[0]


        let embed3 = new Discord.RichEmbed()
            .setAuthor(giveaway_data.lot)
            .setDescription('Gagnant : '+the_gagnant)
            .setFooter(`Giveaway Terminé | BrozardLand Giveaways`)
            .setColor(0x000000)
        m.edit(':tada: **GIVEAWAY** :tada:', embed3)

    })
}

function tempsrestant(_diff){

    // Set the unit values in milliseconds.
    var msecPerMinute = 1000 * 60
    var msecPerHour = msecPerMinute * 60
    var msecPerDay = msecPerHour * 24

    var interval = _diff

    // Calculate how many days the interval contains. Subtract that
    // many days from the interval to determine the remainder.
    var days = Math.floor(interval / msecPerDay )
    interval = interval - (days * msecPerDay )

    // Calculate the hours, minutes, and seconds.
    var hours = Math.floor(interval / msecPerHour )
    interval = interval - (hours * msecPerHour )

    var minutes = Math.floor(interval / msecPerMinute )
    interval = interval - (minutes * msecPerMinute )

    var seconds = Math.floor(interval / 1000 )


    //Si plusieurs jours, heures, minutes ou secondes, passage au pluriel
    _plurield = (days > 1) ? "s" : ""
    _plurielh = (hours > 1) ? "s" : ""
    _plurielm = (minutes > 1) ? "s" : ""
    _pluriels = (seconds > 1) ? "s" : ""

    var _displayd = days + " jour" + _plurield + ", "
    var _displayh = hours + " heure" + _plurielh + ", "
    var _displaym = minutes + " minute" + _plurielm + ", "
    var _displays = seconds + " seconde" + _pluriels + "."

    if(days === 0){
    _displayd = ""
    }
    if(hours === 0){
    _displayh = ""
    }
    if(minutes === 0){
    _displaym = ""
    }
    if(seconds === 0){
    _displays = ""
    }

    var temps_restant = _displayd + _displayh + _displaym + _displays

    return temps_restant
}

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000)
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    var year = a.getFullYear()
    var month = months[a.getMonth()]
    var date = a.getDate()
    var hour = a.getHours()
    var min = a.getMinutes()
    var sec = a.getSeconds()
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec 
    return time
}


function printDate(pdate, displayh){
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

function checkForRewards(){

    var guild = bot.guilds.get('507620704045236234')

    let invites = guild.fetchInvites().then(invites =>{
        
        invites = invites.array()
        let tInvit = []
        invites.forEach(function(invite) {
            var member = message.guild.members.get(invite.inviter.id)
            if(member){
                if(invite.uses > 0){
                    if (tInvit[member.id] > 0){
                        tInvit[member.id] += invite.uses
                    } else {
                        tInvit[member.id] = invite.uses
                    }
                }
            }
        })
        
        var pos = 0
        for (var key in tInvit) {
            var member = guild.members.get(key)
            if(!member.roles.has(guild.roles.find(e => e.name === 'BrozardLand Premium').id)){
                if(tInvit[key] >= 50) member.addRole(guild.roles.find(e => e.name === 'BrozardLand Premium'))
            }
        }
  })
}







function log(msg){

    var majuscules = msg.content.split('').filter(e => e.toUpperCase() === e && e.toLowerCase() !== e).length
    var minuscules = msg.content.split('').filter(e => e.toLowerCase() === e && e.toUpperCase() !== e).length
    
    stats.add('maj', majuscules)
    stats.add('min', minuscules)
    stats.add('msg', 1)
    stats.add('caract', msg.content.length)

}



function createUser(user){

    users_data.set(user.id, {
        credits:0,
        rep:0,
        desc:'false',
        premium:'false',
        registeredAt:printDate(new Date(Date.now())),
        niv:{ xp:0, level:0 }
    })

    console.log('\x1b[32m','[DB]','\x1b[0m', `Utilisateur "${user.username}" enregistré ! ID : "${user.id}"`)
}