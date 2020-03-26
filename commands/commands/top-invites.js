const Discord = require("discord.js")

module.exports.run = async (message, args, bot, config) => {

    var arraySort = require('array-sort') // This will be used for sorting arrays

    // First, we need to fetch the invites
    let invites = message.guild.fetchInvites().catch(error => { // This will store all of the invites into the variable
    
        // If an error is catched, it will run this...
        return message.channel.send('Désolé, je n\'ais pas la perm d\'accéder aux invitations !')

    }).then(invites =>{
    
        // Next, we can turn invites into an array
        invites = invites.array()

        // Now, using arraySort, we can sort the array by 'uses'
        arraySort(invites, 'uses', { reverse: true }) // Be sure to enable 'reverse'

        var AsciiTable = require('ascii-table')

        var table = new AsciiTable('TOP INVITES')
        table
          .setHeading('#', 'Utilisateur', 'Invites')

        // First pass to get total uses for each user
        let tInvit = []
        invites.forEach(function(invite) {
            var member = message.guild.members.get(invite.inviter.id)
            if(member){
                if(invite.uses > 0){
                    if (tInvit[member.displayName] > 0){
                        tInvit[member.displayName] += invite.uses
                    } else {
                        tInvit[member.displayName] = invite.uses
                    }
                }
            }
            
        })

        var pos = 0
        for (var key in tInvit) {
            //possibleInvites.push([key, tInvit[key]])
            pos++
            table.addRow(pos, key, tInvit[key])
        }

        message.channel.send(`\`\`\`${table.toString()}\`\`\``)
  }) // This will store all of the invites into the variable



}

module.exports.help = {
    name:"top-invites",
    desc:"Obtenez les membres qui ont le plus d'invitations !",
    usage:"see-invites [@membre]",
    group:"utils",
    examples:"$see-invites @『Brozard』#4192"
}

module.exports.settings = {
    permissions:"false",
    disabled:"false",
    owner:"false"
}