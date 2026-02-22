from google_ngram_downloader import readline_google_store
import os
from tqdm import tqdm


import unicodedata

def quitar_acentos(palabra):
    palabra_normalizada = unicodedata.normalize('NFD', palabra)
    palabra_sin_acentos = ''.join(caracter for caracter in palabra_normalizada if unicodedata.category(caracter) != 'Mn')
    return unicodedata.normalize('NFC', palabra_sin_acentos)

# Diccionarios del sistema numérico mayor invertido separados por longitudes de claves
major_system_3_chars = {
    'cha': '6', 'che': '6', 'chi': '6', 'cho': '6', 'chu': '6',
    'sha': '6', 'she': '6', 'shi': '6', 'sho': '6', 'shu': '6'
}

major_system_2_chars = {
    'sa': '0', 'se': '0', 'si': '0', 'so': '0', 'su': '0',
    'za': '0', 'ze': '0', 'zi': '0', 'zo': '0', 'zu': '0',
    'ta': '1', 'te': '1', 'ti': '1', 'to': '1', 'tu': '1',
    'da': '1', 'de': '1', 'di': '1', 'do': '1', 'du': '1',
    'na': '2', 'ne': '2', 'ni': '2', 'no': '2', 'nu': '2',
    'ma': '3', 'me': '3', 'mi': '3', 'mo': '3', 'mu': '3',
    'ra': '4', 're': '4', 'ri': '4', 'ro': '4', 'ru': '4',
    'la': '5', 'le': '5', 'li': '5', 'lo': '5', 'lu': '5',
    'ja': '6', 'je': '6', 'ji': '6', 'jo': '6', 'ju': '6',
    'ga': '6', 'ge': '6', 'gi': '6', 'go': '6', 'gu': '6',
    'ka': '7', 'ke': '7', 'ki': '7', 'ko': '7', 'ku': '7',
    'ca': '7', 'co': '7', 'cu': '7',
    'qa': '7', 'qe': '7', 'qi': '7', 'qo': '7', 'qu': '7',
    'fa': '8', 'fe': '8', 'fi': '8', 'fo': '8', 'fu': '8',
    'va': '8', 've': '8', 'vi': '8', 'vo': '8', 'vu': '8',
    'pa': '9', 'pe': '9', 'pi': '9', 'po': '9', 'pu': '9',
    'ba': '9', 'be': '9', 'bi': '9', 'bo': '9', 'bu': '9',
    'ña': '9', 'ñe': '9', 'ñi': '9', 'ño': '9', 'ñu': '9'
}

major_system_1_char = {
    's': '0', 'z': '0',
    't': '1', 'd': '1',
    'n': '2',
    'm': '3',
    'r': '4',
    'l': '5',
    'j': '6', 'g': '6',
    'k': '7', 'c': '7', 'q': '7',
    'f': '8', 'v': '8',
    'p': '9', 'b': '9', 'ñ': '9'
}


def convertir_a_numeros(palabra):
    # Quitar acentos de la palabra
    palabra = quitar_acentos(palabra.lower())
    # Reemplazar 'll' por 'y'
    palabra = palabra.replace('ll', 'y')
    palabra = palabra.replace('rr', 'r')
    

    # Sustituir grupos de 3 caracteres por dígitos
    for grupo in major_system_3_chars:
        palabra = palabra.replace(grupo, major_system_3_chars[grupo])
    
    # Sustituir grupos de 2 caracteres por dígitos
    for grupo in major_system_2_chars:
        palabra = palabra.replace(grupo, major_system_2_chars[grupo])

    # Sustituir caracteres individuales por dígitos
    for char in major_system_1_char:
        palabra = palabra.replace(char, major_system_1_char[char])

    # Eliminar todos los caracteres que no sean dígitos
    palabra = ''.join(caracter for caracter in palabra if caracter.isdigit())

    return palabra


def manage_file(file_path):
    # Check if the file exists
    if os.path.exists(file_path):
        # If it's a file, remove it
        if os.path.isfile(file_path):
            os.remove(file_path)
            print(f"Removed file: {file_path}")
    else:
        # Create the directory if it does not exist
        dir_name = os.path.dirname(file_path)
        if not os.path.exists(dir_name):
            os.makedirs(dir_name)
            print(f"Created directory: {dir_name}")
        
        # Create an empty file
        with open(file_path, 'w') as f:
            pass  # Creating an empty file
        print(f"Created empty file: {file_path}")

# Directory to save the n-gram files
output_dir = "ngram_data"
os.makedirs(output_dir, exist_ok=True)

# Function to download and save n-grams
def download_ngrams(lang, file_n):
    lang_mapping = {
        'spa': 'spa',
        'eng': 'eng'
    }
    
    if lang not in lang_mapping:
        raise ValueError(f"Language {lang} not supported.")
    ##def readline_google_store(ngram_len, lang='eng', indices=None, chunk_size=1024 ** 2, verbose=False):
    #fname, url, records = next(readline_google_store(ngram_len=1,indices='a'))
    parts = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    #for p in parts:
    records = readline_google_store(ngram_len=1,indices=parts,lang=lang_mapping[lang])
    manage_file(file_n)
    for fname, url, records in records:
        #for fname, url, records in readline_google_store(ngram_len=1,indices='a',lang=lang_mapping[lang]):
        output_file = os.path.join(output_dir, fname)
        try:
            with open(file_n, 'ab') as f:
                for record in tqdm(records):
                    w = record.ngram
                    if record.year!=2009 or record.match_count<100:
                        continue
                    if len(w)>4 and w[-4:]=='NOUN':
                        palabra = record.ngram[:-5]
                        cad = palabra + ", "+str(record.match_count)+ ", "+convertir_a_numeros(palabra)+"\n"
                        my_bytes = cad.encode('utf-8')
                        f.write(my_bytes)
        except Exception as e:
            print(f"An error occurred while processing {fname}: {e}")
                    
        print(f"Downloaded {fname} to {output_file}")
# Download 1-grams for Spanish and English
download_ngrams('spa', output_dir+'/spa1gram_nouns.txt')
download_ngrams('eng', output_dir+'/eng1gram_nouns.txt')

print("Download complete.")
