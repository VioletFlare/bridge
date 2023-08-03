const fs = require('fs');
const path = require('path');

class WordFilter {

    constructor() {
        this.badWordsPath = path.join(__dirname, '..', '..', 'static', 'bad_words.txt');
        this.badWords = [];
    }

    _getBadWords() {
        return new Promise(
            (resolve, reject) => {
                fs.readFile(this.badWordsPath, { encoding: 'utf-8' }, (err, data) => {
                    if (!err) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                })
            }
        );
    }

    _loadBadWords() {
        return this._getBadWords().then(data => {
            const dataSanitized = data.replaceAll("\r\n", "\n");
            this.badWords = dataSanitized.split("\n");
        })
    }

    _findWordPermutations(phrase, word) {
        const lowerCaseMessage = phrase.toLowerCase();
        let wordStart;
        let wordEnd = 0;
        const permutations = [];

        while (lowerCaseMessage.includes(word, wordEnd)) {
            wordStart = lowerCaseMessage.indexOf(word, wordEnd);
            wordEnd = wordStart + word.length;
            word = phrase.substring(wordStart, wordEnd);
            
            permutations.push(word)
        }

        return permutations;
    }

    filter(message) {
        let filteredMessage = message;

        this.badWords.forEach(badWord => {
            const wordPermutations = this._findWordPermutations(message, badWord);

            wordPermutations.forEach(
                (permutation) => {
                    filteredMessage = filteredMessage.replace(
                        permutation, "\\*".repeat(permutation.length)
                    )
                }
            )
        });

        return filteredMessage;
    }

    init() {
        this._loadBadWords();
    }

}

module.exports = WordFilter;