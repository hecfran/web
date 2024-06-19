document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    document.getElementById('generate-btn').addEventListener('click', generateSequences);
    document.getElementById('api-key').addEventListener('input', saveApiKey);
    document.getElementById('language').addEventListener('change', saveLanguage);
    document.getElementById('number').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            generateSequences();
        }
    });
});

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function saveApiKey() {
    const apiKey = document.getElementById('api-key').value;
    setCookie('apiKey', apiKey, 180);
}

function saveLanguage() {
    const language = document.getElementById('language').value;
    setCookie('language', language, 180);
    updateExplanation(language);
}

function loadSettings() {
    const apiKey = getCookie('apiKey');
    const language = getCookie('language') || 'English';
    if (apiKey) {
        document.getElementById('api-key').value = apiKey;
    }
    document.getElementById('language').value = language;
    updateExplanation(language);
}

function updateExplanation(language) {
    const explanations = {
        'English': 'The **Major Mnemonic System** is a mnemonic technique used to aid in memorizing numbers. It works by converting numbers into consonant sounds, then into words by adding vowels. Each digit is mapped to a specific set of consonants:<br><br>**0**: s, z<br>**1**: t, d<br>**2**: n<br>**3**: m<br>**4**: r<br>**5**: l<br>**6**: j, sh, ch<br>**7**: k, g<br>**8**: f, v<br>**9**: p, b',
        'Español': 'El **Sistema Mnemotécnico Mayor** es una técnica mnemotécnica utilizada para ayudar a memorizar números. Funciona convirtiendo números en sonidos consonánticos y luego en palabras agregando vocales. Cada dígito se asigna a un conjunto específico de consonantes:<br><br>**0**: s, z<br>**1**: t, d<br>**2**: n<br>**3**: m<br>**4**: r<br>**5**: l<br>**6**: j, sh, ch<br>**7**: k, g<br>**8**: f, v<br>**9**: p, b',
        'Français': 'Le **Système Mnémotechnique Majeur** est une technique mnémotechnique utilisée pour aider à mémoriser des chiffres. Il fonctionne en convertissant les chiffres en sons consonantiques, puis en mots en ajoutant des voyelles. Chaque chiffre est associé à un ensemble spécifique de consonnes :<br><br>**0**: s, z<br>**1**: t, d<br>**2**: n<br>**3**: m<br>**4**: r<br>**5**: l<br>**6**: j, sh, ch<br>**7**: k, g<br>**8**: f, v<br>**9**: p, b',
        'Deutsch': 'Das **Major-System** ist eine mnemonische Technik, die verwendet wird, um sich Zahlen zu merken. Es funktioniert, indem Zahlen in Konsonantenlaute umgewandelt und dann durch Hinzufügen von Vokalen in Wörter umgewandelt werden. Jede Ziffer wird einer bestimmten Gruppe von Konsonanten zugeordnet:<br><br>**0**: s, z<br>**1**: t, d<br>**2**: n<br>**3**: m<br>**4**: r<br>**5**: l<br>**6**: j, sh, ch<br>**7**: k, g<br>**8**: f, v<br>**9**: p, b',
        '한국어': '**메이저 연상법 시스템**은 숫자를 기억하는 데 도움을 주는 연상 기법입니다. 숫자를 자음 소리로 변환한 다음 모음을 추가하여 단어로 변환합니다. 각 숫자는 특정 자음 집합에 매핑됩니다:<br><br>**0**: s, z<br>**1**: t, d<br>**2**: n<br>**3**: m<br>**4**: r<br>**5**: l<br>**6**: j, sh, ch<br>**7**: k, g<br>**8**: f, v<br>**9**: p, b',
        '日本語': '**メジャー記憶術システム**は、数字を覚えるのに役立つ記憶術です。数字を子音の音に変換し、母音を追加して単語にします。各数字は特定の子音のセットにマッピングされます:<br><br>**0**: s, z<br>**1**: t, d<br>**2**: n<br>**3**: m<br>**4**: r<br>**5**: l<br>**6**: j, sh, ch<br>**7**: k, g<br>**8**: f, v<br>**9**: p, b',
        'Русский': '**Система Майора** - это мнемоническая техника, используемая для запоминания чисел. Она работает путем преобразования чисел в согласные звуки, а затем в слова путем добавления гласных. Каждая цифра сопоставляется с определенным набором согласных:<br><br>**0**: s, z<br>**1**: t, d<br>**2**: n<br>**3**: m<br>**4**: r<br>**5**: l<br>**6**: j, sh, ch<br>**7**: k, g<br>**8**: f, v<br>**9**: p, b'
    };
    document.getElementById('explanation').innerHTML = explanations[language].replace(/\*\*/g, '<strong>').replace(/\*\*/g, '</strong>').replace(/\n/g, '<br>');
}

async function generateSequences() {
    const apiKey = document.getElementById('api-key').value;
    const number = document.getElementById('number').value;
    const language = document.getElementById('language').value;
	const prompt = `Use the Major Mnemonic System to create a sequence of words to codify the number ${number}. 
	Ensure the words are nouns in ${language}. 
	Remember to account for all consonants in the words and follow the Major Mnemonic System rules strictly: 
    0: s, z
    1: t, d
    2: n
    3: m
    4: r
    5: l
    6: j, sh, ch
    7: k, g
    8: f, v
    9: p, b. 
	After proposing a word write by its side the digits that are encoded on that word, make sure all consonants are represented as digits.
	Propose a sequence of words which nemonic represents the same sequence of numbers
    `;

    const responseDiv = document.getElementById('output');
    responseDiv.innerText = 'Loading...';

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{ role: 'system', content: prompt }],
                max_tokens: 150
            })
        });

        const data = await response.json();
        if (response.ok) {
            responseDiv.innerHTML = data.choices[0].message.content.replace(/\*\*/g, '<strong>').replace(/\*\*/g, '</strong>');
        } else {
            responseDiv.innerText = 'Error: ' + (data.error.message || 'Unknown error');
        }
    } catch (error) {
        responseDiv.innerText = 'Error: ' + error.message;
    }
}
