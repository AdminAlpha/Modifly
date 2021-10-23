const { trace } = require('console')
const { Client } = require('discord.js')
const Discord = require('discord.js')
const { GorilinkManager, Queue } = require('gorilink')

//testttttttttttttttttttttttsddddddddd

const nodes = [
  {
    host: 'localhost',
    port: 2333,
    password: 'youshallnotpass'
  }
]


const client = new Client()
const prefix = '!'
const token = ""
client.login(token)


client.music = new GorilinkManager(client, nodes, {
  sendWS: (data) => {
    const guild = client.guilds.cache.get(data.d.guild_id)
    if (!guild) return

    return guild.shard.send(data)
  }
})

  .on('nodeConnect', node => {
    console.log(`${node.tag || node.host} - Lavalink connected with success.`)
  })
  .on('trackStart', (player, track) => {})

  .on('trackEnd', (player, track) => {})

  .on('queueEnd', player => {
    player.destroy()
  })

client.on('ready', async () => {
  client.music.start(client.user.id)
  console.log('Online on the client', client.user.username)
})



client.on('raw', packet => client.music.packetUpdate(packet))

client.on('message', async (message, option) => {



  let noppp = new Discord.MessageEmbed()
  .setColor('RANDOM')
  .setTitle('❌ No Music. Pls !p <song>')
  .setFooter(`Request By ${message.author.tag}`)
  
  let nojo = new Discord.MessageEmbed()
  .setColor('RANDOM')
  .setTitle('❌ You not join the Voice Channel  ')
  .setFooter(`Request By ${message.author.tag}`)
  



  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift().toLocaleLowerCase()

  if (command === 'play' || command === 'p') {
  if (!message.member.voice.channel) return message.channel.send(nojo).then(message => {setTimeout(() => message.delete(), 3000)}).catch;
  if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(nojo).then(message => { setTimeout(() => message.delete(), 3000)}).catch;    

  const player = await client.music.join({
    guild: message.guild.id,
    voiceChannel: message.member.voice.channel.id,
    textChannel: message.channel
  }, { 
    selfDeaf: true 
  })
  
  const { tracks, loadType, playlistInfo } = await client.music.fetchTracks(args.join(' '));
  const playe = client.music.players.get(message.guild.id)
  if (loadType === 'TRACK_LOADED' || loadType === 'SEARCH_RESULT') {

  player.queue.add(tracks[0])
    message.channel.send(
      new Discord.MessageEmbed()
      .setTitle(`**${tracks[0].title}**`)
      .setColor('RANDOM'))
 
    if(!player.playing) return player.play();

  } else if(loadType === 'PLAYLIST_LOADED') {

      message.channel.send(
        new Discord.MessageEmbed()
        .setTitle(`**Add Playlist \`${playlistInfo.name}\` In Queue**`)
        .setColor('RANDOM'))
        for (const musics of tracks) {
          player.queue.add(musics);
        }
        if(!player.playing) return player.play();
    }
    
  }
  





  if (command === 'stop'){
  const player = client.music.players.get(message.guild.id)
  if (!message.member.voice.channel) return message.channel.send(nojo).then(message => {setTimeout(() => message.delete(), 3000)}).catch;
  if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(nojo).then(message => { setTimeout(() => message.delete(), 3000)}).catch;    
  if (!player || player.queue.length <= 0) return message.channel.send(noppp).then(message => { setTimeout(() => message.delete(), 3000)}).catch;

  player.destroy()
  message.channel.send(
    new Discord.MessageEmbed()
    .setTitle('**Queue Stop**')
    .setColor('RANDOM')
  )
}



  if (command === 'skip' || command === 's'){
  const player = client.music.players.get(message.guild.id)
  if (!message.member.voice.channel) return message.channel.send(nojo).then(message => {setTimeout(() => message.delete(), 3000)}).catch;
  if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(nojo).then(message => { setTimeout(() => message.delete(), 3000)}).catch;    
  if (!player || player.queue.length <= 0) return message.channel.send(noppp).then(message => { setTimeout(() => message.delete(), 3000)}).catch;

  player.stop()
  message.channel.send(
    new Discord.MessageEmbed()
    .setTitle('**Skip**')
    .setColor('RANDOM')
  )
  }






  if (command === 'q' || command === 'queue'){
  const player = client.music.players.get(message.guild.id)
  if (!message.member.voice.channel) return message.channel.send(nojo).then(message => {setTimeout(() => message.delete(), 3000)}).catch;
  if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(nojo).then(message => { setTimeout(() => message.delete(), 3000)}).catch;    
  if (!player || player.queue.length <= 0) return message.channel.send(noppp).then(message => { setTimeout(() => message.delete(), 3000)}).catch;
  let index = 0
  const serverQueue = client.music.players.get(message.guild.id).queue

  message.channel.send(
    new Discord.MessageEmbed()
    .setTitle(`Now : \`${player.track.title}\``)
    .setColor('RANDOM')
    .setDescription(`${serverQueue.map(a => `\`${++index}.\` **${a.title}** `).slice(0, 30).join('\n')}`))
  }





  if (command === 'volume' || command === 'v'){
  const player = client.music.players.get(message.guild.id)
  if (!message.member.voice.channel) return message.channel.send(nojo).then(message => {setTimeout(() => message.delete(), 3000)}).catch;
  if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(nojo).then(message => { setTimeout(() => message.delete(), 3000)}).catch;    
  if (!player || player.queue.length <= 0) return message.channel.send(noppp).then(message => { setTimeout(() => message.delete(), 3000)}).catch;

  const volume = parseInt(args[0])
  player.volume(volume)
  message.channel.send(
    new Discord.MessageEmbed()
    .setTitle(`Set Volume To \`${args[0]}\``)
    .setColor('RANDOM')
  )
  }





 if (command === 'loop'){
  const player = client.music.players.get(message.guild.id)
  if (!message.member.voice.channel) return message.channel.send(nojo).then(message => {setTimeout(() => message.delete(), 3000)}).catch;
  if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(nojo).then(message => { setTimeout(() => message.delete(), 3000)}).catch;    
  if (!player || player.queue.length <= 0) return message.channel.send(noppp).then(message => { setTimeout(() => message.delete(), 3000)}).catch;
  if (!args[0]) return message.channel.send(
    new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle('Loop Function')
    .setDescription('```!loop 1 = Loop Song``` \n ```!loop 2 = Loop Queue``` \n ```!loop 0 = UnLoop```')
  )
  let mode =  player.loop(parseInt(args[0]));
  mode = mode ? mode == 2 ? "2" : "1" : "0";
  let lop = new Discord.MessageEmbed()
  .setColor('RANDOM')
  .setTitle("🔁 Set repeat mode to | `" + mode + "`")
  message.channel.send(lop)

 }





if (command === 'np'){
const player = client.music.players.get(message.guild.id)
if (!message.member.voice.channel) return message.channel.send(nojo).then(message => {setTimeout(() => message.delete(), 3000)}).catch;
if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(nojo).then(message => { setTimeout(() => message.delete(), 3000)}).catch;    
if (!player || player.queue.length <= 0) return message.channel.send(noppp).then(message => { setTimeout(() => message.delete(), 3000)}).catch;

let ytdl = require('ytdl-core');  
let qui = player.track.uri
let idv = ytdl.getURLVideoID(qui)


const NPP = new Discord.MessageEmbed()
.setAuthor('Now Song Playing')
.addField('Title:', player.track.title, false)
.addField('Channel:', player.track.author, false)
.addField('Song Link:', `[Song Link](${player.track.uri})`, false)
.setColor('RANDOM')
//.setThumbnail(`https://i.ytimg.com/vi/${idv}/default.jpg`)
.setImage(`https://img.youtube.com/vi/${idv}/hqdefault.jpg`)
message.channel.send(NPP)

 }

if (command === 'pause'){
const player = client.music.players.get(message.guild.id)
if (!message.member.voice.channel) return message.channel.send(nojo).then(message => {setTimeout(() => message.delete(), 3000)}).catch;
if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(nojo).then(message => { setTimeout(() => message.delete(), 3000)}).catch;    
if (!player || player.queue.length <= 0) return message.channel.send(noppp).then(message => { setTimeout(() => message.delete(), 3000)}).catch;
  
let ytdl = require('ytdl-core');  
let qui = player.track.uri
let idv = ytdl.getURLVideoID(qui)

if (!player.paused) {
  message.channel.send(
    new Discord.MessageEmbed()
    .setTitle('⏸️ Now Pause')
    .setColor('RANDOM')
    .setThumbnail(`https://i.ytimg.com/vi/${idv}/default.jpg`)
  )
  player.pause(true)
} else {
  message.channel.send(
    new Discord.MessageEmbed()
    .setTitle('⚠️ Music Paused')
    .setColor('RANDOM')
    .setThumbnail(`https://i.ytimg.com/vi/${idv}/default.jpg`)
    )
}
 }

if (command === 'resume'){
const player = client.music.players.get(message.guild.id)
if (!message.member.voice.channel) return message.channel.send(nojo).then(message => {setTimeout(() => message.delete(), 3000)}).catch;
if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(nojo).then(message => { setTimeout(() => message.delete(), 3000)}).catch;    
if (!player || player.queue.length <= 0) return message.channel.send(noppp).then(message => { setTimeout(() => message.delete(), 3000)}).catch;
   
let ytdl = require('ytdl-core');  
let qui = player.track.uri
let idv = ytdl.getURLVideoID(qui)

player.pause(false)
message.channel.send(
new Discord.MessageEmbed()
  .setTitle('▶️ Now Resume')
  .setColor('RANDOM')
  .setThumbnail(`https://i.ytimg.com/vi/${idv}/default.jpg`)
)
  
 }

 if (command === 'help'){
   message.channel.send(
     new Discord.MessageEmbed()
     .setColor('RANDOM')
     .setTitle('Help And Invite Me')
     .setURL('https://discord.com/api/oauth2/authorize?client_id=880235570289315931&permissions=8&scope=bot')
     .setDescription('```!p <song> = Play Track```\n```!skip = Skip Track```\n```!stop = Stop All Tracks```\n```!v = Set Volume```\n```!loop = Loop Track```\n```!q = Show All Queue```\n```!np = Show Now Playing```\n```!pause = Pause Track```\n```!resume = Resume Track```')
     .setThumbnail('https://cdn.discordapp.com/attachments/864508240717283348/898655880638242906/unknown.png')
     )
 }
})

