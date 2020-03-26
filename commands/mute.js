const Discord = require("discord.js")
let infractions = JSON.parse(fs.readFileSync("./infraction.json", "utf8"))
const {promisify} = require("util")
const write = promisify(fs.writeFile)
var saveEnCours = false


async function save(){
    if(!saveEnCours){
        saveEnCours  = true
        await write("infraction.json", JSON.stringify(infractions,null,'\t'))
        saveEnCours  = false
    }
}
module.exports.run = async (message, args, client, config) => {

    var ms = require('ms')

    var quickdb = require('quick.db')
    quickdb.init('./brobot.sqlite')
    var unmutes = new quickdb.table('unmutes')

    var mention = message.mentions.members.first()
    if(!mention) return message.reply('mentionne un membre !')

    var time = args[1]
    if(!time || isNaN(ms(time))) return message.reply('tu dois préciser un temps valide !')

    var reason = args.slice(2).join(' ')
    if(!reason) reason = 'Pas de raison donnée'

    mention.send(`Tu viens d'être mute sur ${message.guild.name} par ${message.author.username} pendant ${time} pour ${reason} !`)

    message.channel.send(`**${mention.user.username}#${mention.user.discriminator}** est mute pendant **${time}** pour **${reason}**`)
    
    var mute_object = {
        "member_id":mention.id,
        "guild_id":message.guild.id
    }

    var ftime = Date.now()+ms(time)
    ftime = Math.floor(ftime / 1000)
    ftime = String(ftime)
    
    var cdata = unmutes.get(ftime)
    if(!cdata) unmutes.set(ftime, [])
    unmutes.push(ftime, mute_object)

    message.guild.channels.forEach(ch => ch.overwritePermissions( mention.user, { SEND_MESSAGES: false }))
    if(infractions[mention.id] === undefined){
        infractions[mention.id] = {"warns":[],"mute":[],"kick":[],"tempban":[]}
        save()
    }
    infractions[mention.id]["mute"].push("**" + reason + "** • " + message.author.tag)
    save()
}

module.exports.help = {
    name:"mute",
    desc:"Mute le membre pendant un temps donné !",
    usage:"mute [@membre] [temps] [raison]",
    group:"modération",
    examples:"$mute @『Brozard』#4192 10m Spam"
}

module.exports.settings = {
    permissions:"MANAGE_MESSAGES",
    disabled:"false",
    owner:"false"
}