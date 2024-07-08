const dictionaries = {
    English: {
        words: {
            '0': 'saw',   // 's'
            '1': 'tie',   // 't'
            '2': 'knee',  // 'n'
            '3': 'mow',   // 'm'
            '4': 'ray',   // 'r'
            '5': 'law',   // 'l'
            '6': 'shoe',  // 'sh'
            '7': 'cow',   // 'k'
            '8': 'foe',   // 'f'
            '9': 'pea',   // 'p'
            '00': 'sauce', // 's' 's'
            '01': 'seat',  // 's' 't'
            '02': 'sun',   // 's' 'n'
            '03': 'sum',   // 's' 'm'
            '04': 'sore',  // 's' 'r'
            '05': 'seal',  // 's' 'l'
            '06': 'sage',  // 's' 'j'
            '07': 'sock',  // 's' 'k'
            '08': 'safe',  // 's' 'f'
            '09': 'sap',   // 's' 'p'			
            '10': 'toes', // 't' 's'
            '11': 'tot',  // 't' 't'
            '12': 'tin',  // 't' 'n'
            '13': 'tomb', // 't' 'm'
            '14': 'tire', // 't' 'r'
            '15': 'tail', // 't' 'l'
            '17': 'tack', // 't' 'k'
            '18': 'toffee', // 't' 'f'
            '19': 'tape', // 't' 'p'
            '20': 'nose', // 'n' 's'
            '21': 'net',  // 'n' 't'
            '22': 'nun',  // 'n' 'n'
            '23': 'name', // 'n' 'm'
            '24': 'noir', // 'n' 'r'
            '25': 'nail', // 'n' 'l'
            '27': 'neck', // 'n' 'k'
            '28': 'knife', // 'n' 'f'
            '29': 'nap',  // 'n' 'p'
            '30': 'mice', // 'm' 's'
            '31': 'mat',  // 'm' 't'
            '32': 'moon', // 'm' 'n'
            '33': 'meme', // 'm' 'm'
            '34': 'mare', // 'm' 'r'
            '35': 'mail', // 'm' 'l'
            '37': 'mug',  // 'm' 'g'
            '38': 'movie', // 'm' 'v'
            '39': 'map',  // 'm' 'p'
            '40': 'rose', // 'r' 's'
            '41': 'rat',  // 'r' 't'
            '42': 'rain', // 'r' 'n'
            '43': 'ram',  // 'r' 'm'
            '44': 'rear', // 'r' 'r'
            '45': 'rail', // 'r' 'l'
            '47': 'rock', // 'r' 'k'
            '48': 'roof', // 'r' 'f'
            '49': 'rope', // 'r' 'p'
            '50': 'lace', // 'l' 's'
            '51': 'latte', // 'l' 't'
            '52': 'lion', // 'l' 'n'
            '53': 'lime', // 'l' 'm'
            '54': 'lore', // 'l' 'r'
            '55': 'lily', // 'l' 'l'
            '57': 'luck', // 'l' 'k'
            '58': 'leaf', // 'l' 'f'
            '59': 'lip',  // 'l' 'p'
            '61': 'jet',  // 'j' 't'
            '63': 'jam',  // 'j' 'm'
            '64': 'jar',  // 'j' 'r'
            '65': 'jewel', // 'j' 'l'
            '67': 'joke', // 'j' 'k'
            '68': 'chief', // 'ch' 'f'
            '69': 'job',  // 'j' 'b'
            '70': 'case', // 'k' 's'
            '71': 'cat',  // 'k' 't'
            '72': 'coin', // 'k' 'n'
            '73': 'comb', // 'k' 'm'
            '74': 'car',  // 'k' 'r'
            '75': 'coal', // 'k' 'l'
            '77': 'kick', // 'k' 'k'
            '78': 'cave', // 'k' 'f'
            '79': 'cup',  // 'k' 'p'
            '80': 'face', // 'f' 's'
            '81': 'foot', // 'f' 't'
            '82': 'fan',  // 'f' 'n'
            '83': 'foam', // 'f' 'm'
            '84': 'fire', // 'f' 'r'
            '85': 'file', // 'f' 'l'
            '87': 'fog',  // 'f' 'g'
            '88': 'five', // 'f' 'v'
            '89': 'fib',  // 'f' 'b'
            '90': 'paws', // 'p' 's'
            '91': 'bat',  // 'b' 't'
            '92': 'pen',  // 'p' 'n'
            '93': 'bum',  // 'b' 'm'
            '94': 'bear', // 'b' 'r'
            '95': 'pill', // 'p' 'l'
            '97': 'pig',  // 'p' 'g'
            '98': 'poof', // 'p' 'f'
            '99': 'pipe', // 'p' 'p'
            '100': 'toaster', // 't' 's' 't'
            '101': 'tattoo', // 't' 't' 't'
            '102': 'tennis', // 't' 'n' 's'
            '103': 'tomato', // 't' 'm' 't'
            '104': 'terrace', // 't' 'r' 's'
            '105': 'tailor', // 't' 'l' 'r'
            '107': 'tackle', // 't' 'k' 'l'
            '109': 'topaz' // 't' 'p' 'z'
        }
    },
    Español: {
        words: {
            '0': 'hoz',   // 's'
            '1': 'té',    // 't'
            '2': 'Noe', // 'n'
            '3': 'mi',   // 'm'
            '4': 'reo  ',   // 'r'
            '5': 'luz',   // 'l'
            '6': 'g', // 'j'
            '7': 'eco ',  // 'c'
            '8': 'fe',  // 'f'
            '9': 'pie ',  // 'p'
            '00': 'soso', // 's' 's'
            '01': 'seda', // 's' 'd'
            '02': 'sano', // 's' 'n'
            '03': 'suma', // 's' 'm'
            '04': 'asar', // 's' 'b'
            '05': 'sello', // 's' 'll'
            '06': 'sopa', // 's' 'p'
            '07': 'saco', // 's' 'c'
            '08': 'silla', // 's' 'll'
            '09': 'sapo', // 's' 'p'			
            '10': 'taza', // 't' 's'
            '11': 'teta', // 't' 't'
            '12': 'tuna', // 't' 'n'
            '13': 'toma', // 't' 'm'
            '14': 'toro', // 't' 'r'
            '15': 'tela', // 't' 'l'
            '17': 'taco', // 't' 'c'
            '18': 'tifo', // 't' 'f'
            '19': 'tapa', // 't' 'p'
            '20': 'nasa', // 'n' 's'
            '21': 'nota', // 'n' 't'
            '22': 'nene', // 'n' 'n'
            '23': 'nima', // 'n' 'm'
            '24': 'nora', // 'n' 'r'
            '25': 'nela', // 'n' 'l'
            '27': 'nuca', // 'n' 'c'
            '28': 'nifa', // 'n' 'f'
            '29': 'napa', // 'n' 'p'
            '30': 'masa', // 'm' 's'
            '31': 'mata', // 'm' 't'
            '32': 'nina', // 'm' 'n'
            '33': 'mama', // 'm' 'm'
            '34': 'mara', // 'm' 'r'
            '35': 'mela', // 'm' 'l'
            '37': 'maca', // 'm' 'c'
            '38': 'mafa', // 'm' 'f'
            '39': 'mapa', // 'm' 'p'
            '40': 'rasa', // 'r' 's'
            '41': 'rata', // 'r' 't'
            '42': 'rana', // 'r' 'n'
            '43': 'rama', // 'r' 'm'
            '44': 'rara', // 'r' 'r'
            '45': 'rela', // 'r' 'l'
            '47': 'raca', // 'r' 'c'
            '48': 'rafa', // 'r' 'f'
            '49': 'rapa', // 'r' 'p'
            '50': 'lasa', // 'l' 's'
            '51': 'lata', // 'l' 't'
            '52': 'lana', // 'l' 'n'
            '53': 'lama', // 'l' 'm'
            '54': 'lara', // 'l' 'r'
            '55': 'lala', // 'l' 'l'
            '57': 'laca', // 'l' 'c'
            '58': 'lafa', // 'l' 'f'
            '59': 'lapa', // 'l' 'p'
            '61': 'jata', // 'j' 't'
            '63': 'jama', // 'j' 'm'
            '64': 'jara', // 'j' 'r'
            '65': 'jaula', // 'j' 'l'
            '67': 'jaca', // 'j' 'c'
            '68': 'jafa', // 'j' 'f'
            '69': 'japa', // 'j' 'p'
            '70': 'casa', // 'c' 's'
            '71': 'cata', // 'c' 't'
            '72': 'cana', // 'c' 'n'
            '73': 'cama', // 'c' 'm'
            '74': 'cara', // 'c' 'r'
            '75': 'cala', // 'c' 'l'
            '77': 'caca', // 'c' 'c'
            '78': 'cafa', // 'c' 'f'
            '79': 'capa', // 'c' 'p'
            '80': 'fasa', // 'f' 's'
            '81': 'fata', // 'f' 't'
            '82': 'fana', // 'f' 'n'
            '83': 'fama', // 'f' 'm'
            '84': 'fara', // 'f' 'r'
            '85': 'fala', // 'f' 'l'
            '87': 'faca', // 'f' 'c'
            '88': 'fafa', // 'f' 'f'
            '89': 'fapa', // 'f' 'p'
            '90': 'pasa', // 'p' 's'
            '91': 'pata', // 'p' 't'
            '92': 'pana', // 'p' 'n'
            '93': 'pama', // 'p' 'm'
            '94': 'para', // 'p' 'r'
            '95': 'pala', // 'p' 'l'
            '97': 'paca', // 'p' 'c'
            '98': 'pafa', // 'p' 'f'
            '99': 'papa', // 'p' 'p'
        }
    }
};
