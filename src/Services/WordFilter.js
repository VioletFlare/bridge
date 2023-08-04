const fs = require('fs');
const path = require('path');

class WordFilter {

    constructor() {
        this.badWordsPath = path.join(__dirname, '..', '..', 'static', 'bad_words.txt');
        this.badWordsExactPath = path.join(__dirname, '..', '..', 'static', 'bad_words_exact.txt');
        this.badWords = [];
        this.badWordsExact = [];
    }

    _getBadWords(path) {
        return new Promise(
            (resolve, reject) => {
                fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
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
        this._getBadWords(this.badWordsPath).then(data => {
            const dataSanitized = data.replaceAll("\r\n", "\n");
            this.badWords = dataSanitized.split("\n");
        })

        this._getBadWords(this.badWordsExactPath).then(data => {
            const dataSanitized = data.replaceAll("\r\n", "\n");
            this.badWordsExact = dataSanitized.split("\n");
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
        const splittedMessage = message.split(' ');

        this.badWordsExact.forEach(badWordExact => {
            splittedMessage.forEach((word, index) => {
                if (word === badWordExact) {
                    splittedMessage[index] = "*".repeat(word.length);
                }
            });
        });

        let filteredMessage = splittedMessage.join(' ');

        this.badWords.forEach(badWord => {
            const wordPermutations = this._findWordPermutations(filteredMessage, badWord);

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