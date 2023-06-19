import { readFileSync, writeFileSync } from 'fs';

class BookIndexer {
    constructor() {
        this.pages = [];
        this.excludeWords = [];
        this.wordIndex = {};
    }

    readPages(pageFiles) {
        for (const file of pageFiles) {
            const content = readFileSync(file, 'utf8');
            const words = content.split(/\s+/);
            this.pages.push(words);
        }
    }

    readExcludeWords(excludeWordsFile) {
        const content = readFileSync(excludeWordsFile, 'utf8');
        this.excludeWords = content.split(/\s+/);
    }

    indexWords() {
        for (let i = 0; i < this.pages.length; i++) {
            const pageWords = this.pages[i];
            for (const word of pageWords) {
                if (!this.excludeWords.includes(word)) {
                    if (!this.wordIndex[word]) {
                        this.wordIndex[word] = [];
                    }
        
                    // Binary search implementation
                    const pageIndex = this.binarySearch(this.wordIndex[word], i + 1);
        
                    if (pageIndex === -1) {
                        // Insert the page number at the correct position
                        this.wordIndex[word].splice(-(pageIndex + 1), 0, i + 1);
                    }
                }
            }
        }
    }

    binarySearch(array, target) {
        let left = 0;
        let right = array.length - 1;
  
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
    
            if (array[mid] === target) {
                return mid; // Target found
            } else if (array[mid] < target) {
                left = mid + 1; // Target is in the right half
            } else {
                right = mid - 1; // Target is in the left half
            }
        }
  
        return -1; // Target not found
    }

    generateIndexFile(outputFile) {
        const sortedWords = Object.keys(this.wordIndex);
  
        // Bubble sort implementation
        for (let i = 0; i < sortedWords.length - 1; i++) {
            for (let j = 0; j < sortedWords.length - i - 1; j++) {
                if (sortedWords[j] > sortedWords[j + 1]) {
                    [sortedWords[j], sortedWords[j + 1]] = [sortedWords[j + 1], sortedWords[j]]; // Swap
                }
            }
        }
  
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
const pageFiles = ["E:/work-folder/Portfolio/wordSearch/files/Page1.txt","E:/work-folder/Portfolio/wordSearch/files/Page2.txt","E:/work-folder/Portfolio/wordSearch/files/Page3.txt"];
const excludeWordsFile = 'E:/work-folder/Portfolio/wordSearch/files/exclude-words.txt';
const outputFile = 'E:/work-folder/Portfolio/wordSearch/files/index.txt';

bookIndexer.readPages(pageFiles);
bookIndexer.readExcludeWords(excludeWordsFile);
bookIndexer.indexWords();
bookIndexer.generateIndexFile(outputFile);
