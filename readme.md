## Make Pali Mdict 

### Include
- `pts` : Pali Text Society Pali - English Dictionary
- `ncped` : New Concise Pali - English Dictionary
- `dppn` : Dictionary of Pali Proper Names
- `abbr` : Dictionary of book and grammatical term's abbreviation

### Preview
![image](https://github.com/dhammena/pali-mdict/blob/master/assets/preview.png)

### Download
- [For GoldenDict](https://github.com/dhammena/pali-mdict/releases/download/2022-3-8/ForGoldenDict.zip)
- [For Eudic](https://github.com/dhammena/pali-mdict/releases/download/2022-3-8/ForEudict.zip)

### Make
- [install python](https://www.python.org)
- `pip install mdict-utils`
- [install nodejs](https://nodejs.org)
- switch to project directory.
- `npm install` (init)
- `ts-node .\index.ts --help`
- `ts-node .\index.ts -t dppn` (rebuild dppn)
- `ts-node .\index.ts -d -t pts` (download json file and rebuild pts)
- `ts-node .\index.ts -d -e -t ncped` (download json file and rebuild ncped for eudic)
- download generated dict from ./assets .
