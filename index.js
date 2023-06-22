import { readFileSync, writeFileSync } from 'fs';

class BookIndexer {
    constructor() {
        this.pages = [];
        this.excludeWords = [];
        this.wordIndex = new Map();
    }

    //read all the pages
    readPages(pageFiles) {
        for (const file of pageFiles) {
            const content = readFileSync(file, 'utf8');
            const words = content.split(/\s+/);
            this.pages.push(words);
        }
    }

    //read the words that should be ignored 
    readExcludeWords(excludeWordsFile) {
        const content = readFileSync(excludeWordsFile, 'utf8');
        this.excludeWords = content.split(/\s+/);
    }

    indexWords() {
        for (let i = 0; i < this.pages.length; i++) {
            const pageWords = this.pages[i];
            for (const word of pageWords) {
                if (!this.excludeWords.includes(word)) {
                    if (!this.wordIndex.has(word)) {
                        this.wordIndex.set(word, []);
                    }

                    // Insert the page number at the correct position
                    this.wordIndex.get(word).push(i + 1);
                }
            }
        }
    }

    generateIndexFile(outputFile) {
        const sortedWords = Array.from(this.wordIndex.keys()).sort();
  
        let output = '';
        for (const word of sortedWords) {
            const pageList = this.wordIndex[word].join(',');
            output += `${word} : ${pageList}\n`;
        }
        writeFileSync(outputFile, output);
    }
}
// Usage example
const bookIndexer = new BookIndexer();
const pageFiles = ["./files/Page1.txt","./files/Page2.txt","./files/Page3.txt,"];
const excludeWordsFile = './files/exclude-words.txt';
const outputFile = './files/index.txt';

bookIndexer.readPages(pageFiles);
bookIndexer.readExcludeWords(excludeWordsFile);
bookIndexer.indexWords();
bookIndexer.generateIndexFile(outputFile);