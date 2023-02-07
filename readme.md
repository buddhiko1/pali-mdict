## Make Pali dictionary

### Include

- `pts` : Pali Text Society Pali - English Dictionary
- `ncped` : New Concise Pali - English Dictionary
- `dppn` : Dictionary of Pali Proper Names
- `abbr` : Abbreviation dictionary of book and grammatical's term

### Preview

![image](https://github.com/dhammena/pali-mdict/blob/master/assets/preview.png)

### Download

- [For GoldenDict](https://github.com/dhammena/pali-mdict/releases/download/2022-3-13/pali-mdict.GoldenDict.zip)
- [For Eudic](https://github.com/dhammena/pali-mdict/releases/download/2022-3-13/pali-mdict.eudic.zip)

### Make

1. [install python](https://www.python.org)
2. `pip install mdict-utils`
3. [install nodejs](https://nodejs.org)
4. Install pnpm `sudo npm install -g pnpm`.
5. Run `pnpm setup`.
6. Reopen terminal .
7. Install ts-node `pnpm install -g ts-node`.
8. Switch to project directory.
9. `npm install` (init)
10. `ts-node .\index.ts --help`
11. `ts-node .\index.ts -t dppn` (rebuild dppn)
12. `ts-node .\index.ts -d -t pts` (download json file and rebuild pts)
13. `ts-node .\index.ts -d -e -t ncped` (download json file and rebuild ncped for eudic)
14. Download generated dict from ./output .
