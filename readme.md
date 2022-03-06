## Make Pali Mdict 
---
### Abbreviations
- `pts` : Pali Text Society Pali - English Dictionary
- `ncped` : New Concise Pali - English Dictionary
- `dppn` : Dictionary of Pali Proper Names

### Preview
![image](https://github.com/dhammena/dict/releases/download/pali-mdict/Pali-GoldenDict.png)
![image](https://github.com/dhammena/dict/releases/download/pali-mdict/Pali-Eudic.png)

### Make
- [install python](https://www.python.org)
- `pip install mdict-utils`
- [install nodejs](https://nodejs.org)
- switch to project directory.
- `npm install` (init)
- `ts-node .\index.ts --help`
- `ts-node .\index.ts -d dppn` (rebuild dppn mdict)
- `ts-node .\index.ts -p -d pts` (pull raw data and rebuild pts mdict)
- `ts-node .\index.ts -p -e -d ncped` (pull raw data and rebuild ncped mdict for eudic)
- download generated dict from ./assets .
