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
    
    var quickdb = require('quick.db')
    quickdb.init('./brobot.sqlite')
    var warns_db = new quickdb.table('warns')

    var mention = message.mentions.members.first()
    if(!mention) return message.reply('vous devez mentionner un membre !')
    var raison = args.slice(1).join(' ')
    if(!raison) return message.reply('vous devez préciser une raison !')
    var warns = warns_db.get(message.guild.id+'.'+mention.id)
    if(!warns){
        warns_db.set(message.guild.id+'.'+mention.id, 0)
        warns = 1
    }
    if(warns > 5){
        warns_db.set(message.guild.id+'.'+mention.id, 0)
        mention.ban('Plus de 5 warns')
        return message.reply(mention+' avait plus de 5 warns, il vient d\'être banni.')
    } else {
        warns_db.add(message.guild.id+'.'+mention.id, 1)
        mention.send('Vous venez d\'être averti par **'+message.author.username+'** sur le serveur **'+message.guild.name+'** pour **'+raison+'**.\nC\'est votre `'+String(parseInt(warns)+1)+'`eme avertissement. Au bout du 5eme, vous serez banni.')
        message.reply('membre averti !')
    }

    if(infractions[mention.id] === undefined){
        infractions[mention.id] = {"warns":[],"mute":[],"kick":[],"tempban":[]}
        save()
    }
    infractions[mention.id]["warns"].push("**" + raison + "** • " + message.author.tag)
    save()
    
}

module.exports.help = {
    name:"warn",
    desc:"Averti un membre en messages privés (plus de 5 warns résulte d\'un ban.)",
    usage:"warn [@membre] [raison]",
    group:"modération",
    examples:"$warn @『Brozard』#4192 Spam"
}

module.exports.settings = {
    permissions:"KICK_MEMBERS",
    disabled:"false",
    owner:"false"
}