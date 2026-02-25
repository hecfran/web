document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('transcribe-btn').addEventListener('click', transcribeDigits);
    document.getElementById('digits').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            transcribeDigits();
        }
    });
});

function getRandomWord(wordList) {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

function transcribeDigits() {
    const digits = document.getElementById('digits').value;
    const language = document.getElementById('language').value;
    const dictionary = language === 'English' ? transcriptionDictEng : transcriptionDictSpa;

    let result = '';
    let i = 0;
    while (i < digits.length) {
        let found = false;
        for (let len = Math.min(8, digits.length - i); len > 0; len--) {
            const segment = digits.substr(i, len);
            if (dictionary[segment]) {
                result += getRandomWord(dictionary[segment]) + ' ';
                i += len;
                found = true;
                break;
            }
        }
        if (!found) {
            result += '[?] ';
            i++;
        }
    }

    document.getElementById('output').innerText = result.trim();
}
