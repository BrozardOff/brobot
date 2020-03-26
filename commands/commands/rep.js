const Discord = require("discord.js");

module.exports.run = async (message, args, bot, config, owner, membre_data, members_data) => {

    var quickdb = require('quick.db');
    quickdb.init('./brobot.sqlite');
    var users_data = new quickdb.table('usersdata');
    var rep = new quickdb.table('rep');

    var ms =require('ms');

    var ts = rep.get(message.author.id);
    if(ts){
        if(ts > Date.now()){
            var delai = convertMs(ts - Date.now()); 
            return message.channel.send(message.author+', vous devez attendre '+delai+' avant de pouvoir de nouveau utiliser cette commande !');
        }
    }

    var member = message.mentions.members.first();
    if(!member) return message.channel.send(message.author+', vous devez mentionner un membre !');

    var towait = Date.now() + ms('6h');
    rep.set(message.author.id, towait);
    
    if(member.id === message.author.id) return message.channel.send(message.author+', vous ne pouvez pas vous donner vous-même un point de réputation !');
    
    users_data.add(member.id+'.rep', 1);

    message.channel.send(message.author+', vous avez bien donné un point de réputation à **'+member.user.username+'** !');

    function convertMs(ms){
        var d, h, m, s;
        s = Math.floor(ms / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        d = Math.floor(h / 24);
        h = h % 24;
        h += d * 24;
        return h + ' heure(s) ' + m + ' minute(s) ' + s + ' seconde(s)';
    }
    
}

module.exports.help = {
    name:"rep",
    desc:"Récompensez un membre en lui donnant un point de rep !",
    usage:"rep [@membre]",
    group:"économie",
    examples:"$rep @『Brozard』#4192"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}