document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('transcribe-btn').addEventListener('click', transcribeDigits);
    document.getElementById('digits').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            transcribeDigits();
        }
    });
});

function transcribeDigits() {
    const digits = document.getElementById('digits').value;
    const language = document.getElementById('language').value;
    const dictionary = dictionaries[language].words;
    
    let result = '';
    let i = 0;
    while (i < digits.length) {
        if (i + 2 < digits.length && dictionary[digits.substr(i, 3)]) {
            result += dictionary[digits.substr(i, 3)] + ' ';
            i += 3;
        } else if (i + 1 < digits.length && dictionary[digits.substr(i, 2)]) {
            result += dictionary[digits.substr(i, 2)] + ' ';
            i += 2;
        } else if (dictionary[digits[i]]) {
            result += dictionary[digits[i]] + ' ';
            i++;
        } else {
            result += '[?] ';
            i++;
        }
    }

    document.getElementById('output').innerText = result.trim();
}
