# nbmxbsf  
General purpose Telegram bot.  
  
![Image of the Telegram Bot running on a Huawei Smartphone](https://github.com/StringManolo/nbmxbsf/blob/master/docs/botExample.jpg)  

Modules are loaded automatically from ./src/serverModules using the filenames. If you create a hello.ts, you can call the module using /hello command from Telegram, simple as that. You can find modules documentation [here](https://github.com/StringManolo/nbmxbsf/blob/master/docs/MODULES.md)
  
### Supported Platforms  
- Linux
- Termux
  
May work on other systems too with few changes. Not tested in Windows yet.  

### Depends On
- [git](https://git-scm.com/download/linux) (only for download)
- telegram's [bot api token](https://t.me/BotFather)
- [curl](https://curl.se/download.html) (interact with telegram api)
- [node](https://nodejs.org/en/download/)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [fdir](https://github.com/thecodrr/fdir#installation) npm module (used by [ransomware.ts](https://github.com/StringManolo/nbmxbsf/blob/master/src/serverModules/ransomware.ts#L5) and [backup.ts](https://github.com/StringManolo/nbmxbsf/blob/master/src/serverModules/backup.ts#L4) to find files)

### INSTALL AS USER
- Clone: 
```
git clone https://github.com/stringmanolo/nbmxbsf && cd nbmxbsf
```

- Install required modules  
```
npm install
```

- Create password.txt file
```
echo 'thisIsMyLoginPassword' > password.txt
```

- Create token.txt file
```
echo '1637382718:HWJSIW6BVhwUaL4JwhsiU6JevPQPipP3' > token.txt
```

- Run the Bot
```
npm start;
```

- Login in telegram bot chat
```
/login thisIsMyLoginPassword
```

- Run available commands
```
/help
```

### INSTALL AS DEVELOPER
- Clone:
```
git clone https://github.com/stringmanolo/nbmxbsf && cd nbmxbsf
```

- Install required modules
```
npm install
```

- Make changes
```
echo '// Example of easily creating a time command
const time = (telegramText: string) => {
  return new Date();
}

export default time;
' > ./src/serverModules/time.ts
```

- Create password.txt and token.txt files

- Compile and run
```
tsc && npm start
```

### TIPS
- If you're a developer, you don't need to touch the server.ts/server.js code. Just develop the modules in the serverModules folder.

