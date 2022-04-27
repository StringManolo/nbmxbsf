# nbmxbsf  
General purpouse Telegram bot.  
  
Modules are loaded automatically from ./src/serverModules using the filenames. If you create a hello.ts, you can call the module using /hello command from Telegram simple as that.

### Depend On
- git (only for download)
- telegram api token
- curl (interact with telegram api)
- node
- npm 
- fdir npm module (used by ransomware.ts and backdoor.ts to find files)

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

