import csv
import openai
import time
from tqdm import tqdm
import ast
import os
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Lock

# Constants
TOP_N = 15000
NUM_THREADS = 4  # Number of threads to use for concurrent API calls
API_KEY = os.getenv('OPENAI_API_KEY')
modelo = "gpt-4o" #"gpt-3.5-turbo"
REQUEST_LIMIT = 400  # Maximum number of requests per minute
REQUEST_INTERVAL = 70  # Interval time in seconds

if API_KEY is None:
    raise ValueError("No API key found in environment variables. Please set the 'OPENAI_API_KEY' with your private OpenAI key.")

client = openai.OpenAI(api_key=API_KEY)

# Rate limiting
request_counter = 0
start_time = time.time()
lock = Lock()

def has_special_characters(word):
    special_char_pattern = re.compile(r'[^\w\s]', re.UNICODE)
    return bool(special_char_pattern.search(word))

def call_chatgpt(word, lan='es'):
    global request_counter, start_time

    with lock:
        # Check if the request limit has been reached
        if request_counter >= REQUEST_LIMIT:
            elapsed_time = time.time() - start_time
            if elapsed_time < REQUEST_INTERVAL:
                time_to_wait = REQUEST_INTERVAL - elapsed_time
                print(f"Rate limit reached. Waiting for {time_to_wait:.2f} seconds.")
                time.sleep(time_to_wait)
            # Reset the counter and timer
            request_counter = 0
            start_time = time.time()

        request_counter += 1

    if lan == "en":
        prompt = f'is the word "{word}" represents a phisical object or something that can be touch with hands and it is written in singular form? respond only with "s" for yes, or "n" for no'
    else:
        prompt = f'"{word}" es una palabra correctamente escrita del idioma español que es un nombre común (que no puede ser concreto de persona o lugar), concreto (no abstracto), singular y es un object fisico que se puede tocar con la mano?.  Responde solamente "s" si cumple todas las condiciones o "n" para no'

    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=modelo,
            temperature=0 
        )
        r = response.choices[0]
        d = r.message
        m = d.content
        return m.strip()
    except Exception as e:
        print(f"Error calling ChatGPT for word '{word}': {e}")
        return "Error"

def transform_table(table):
    new_table = []
    for i in range(0, len(table), 10):
        if i + 10 > len(table):
            break
        first_column = [table[j][0] for j in range(i, i + 10)]
        second_column = [table[j][1] for j in range(i, i + 10)]
        third_column = [table[j][2] for j in range(i, i + 10)]
        new_row = [first_column, second_column, third_column]
        new_table.append(new_row)
    return new_table

def process_csv(file_path, lan):
    data = []
    counter = 0
    try:
        with open(file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in tqdm(reader, desc="Loading CSV and writing"):
                counter += 1
                if len(row) > 2:
                    try:
                        data.append((row['word'].strip(), int(float(row['frequency'])), row['code'].strip()))
                    except Exception as e:
                        print(f"fail row: {row}, error: {e}")
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return

    results = []

    def process_word(word, freq, trans):
        if has_special_characters(word):
            return (word, freq, trans.strip(), "Error")
        chatgpt_response = call_chatgpt(word, lan)
        return (word, freq, trans.strip(), chatgpt_response)

    with ThreadPoolExecutor(max_workers=NUM_THREADS) as executor:
        future_to_word = {executor.submit(process_word, word, freq, trans): (word, freq, trans) for word, freq, trans in data[:TOP_N]}
        for future in tqdm(as_completed(future_to_word), total=len(future_to_word), desc="Processing Words"):
            try:
                result = future.result()
                results.append(result)
            except Exception as e:
                word, freq, trans = future_to_word[future]
                print(f"Error processing word '{word}': {e}")
                results.append((word, freq, trans, "Error"))

    new_file_path = file_path.replace('.csv', '_fonemas.csv').replace('.txt', '_fonemas.txt')

    try:
        with open(new_file_path, mode='w', encoding='utf-8', newline='') as new_file:
            fieldnames = ['word', 'frequency', 'transcription', 'si_no']
            writer = csv.DictWriter(new_file, fieldnames=fieldnames)
            writer.writeheader()
            for result in tqdm(results, desc="Writing CSV"):
                writer.writerow({
                    'word': result[0],
                    'frequency': result[1],
                    'transcription': result[2],
                    'si_no': result[3],
                })
    except Exception as e:
        print(f"Error writing CSV file: {e}")

file_path = ('ngram_data/spa1gram_nouns_s.csv', 'es')
process_csv(*file_path)
