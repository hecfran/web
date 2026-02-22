import csv
import openai
import time
import time
from tqdm import tqdm
import ast

# Constants

TOP_N = 15000
import os
API_KEY = os.getenv('OPENAI_API_KEY')

import re

def has_special_characters(word):
    # Regular expression to match special characters (excluding diacritics)
    special_char_pattern = re.compile(r'[^\w\s]', re.UNICODE)
    
    # Search for special characters in the word
    if special_char_pattern.search(word):
        return True
    return False

# Example usage
word = "caféçà"
if has_special_characters(word):
    print("The word contains special characters.")
else:
    print("The word does not contain special characters.")
    
    
if API_KEY is None:
    raise ValueError("No API key found in environment variables. Please set the 'OPENAI_API_KEY' with your private open_AI key.")


#openai.api_key = API_KEY
from openai import OpenAI
import os

client = OpenAI(
    # This is the default and can be omitted
    api_key=API_KEY,
)


# Function to call ChatGPT for each word
def call_chatgpt(word,lan='es'):
    if lan == "en":
        prompt = f'is the word "{word}" represents a phisical object or something that can be touch with hands and it is written in singular form? respond only with "s" for yes, or "n" for no'
    else: #espanish
        prompt = f'¿La palabra "{word}" representa un objecto fisico o algo que se puede tocar con las manos y esta escrito en singular? '
        prompt = f'"{word}" es una palabra que se puede considerar nombre concreto singular tangible? responde solamente "s" para sí o "n" para no'



        
        # prompt = f'Dada la siguiente lista de palabras {word} \ndevuelve una lista con la respuesta a cada palabrea respondiendo si la palabra representa un objecto fisico o algo que se puede tocar con las manos y esta escrito en singular? responde solamente "s" para si o "n" para no. La respuesta tiene el formato de una lista de python'

        
    try:
        response = client.chat.completions.create(
            messages=[                
                    {"role": "user", "content": prompt}                
            ],
            #model="gpt-4o",
            model="gpt-3.5-turbo",
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
    
def process_csv(file_path,lan):
    data = []
    counter:int = 0
    # Read the CSV file
    try:
        with open(file_path, mode='r', encoding='utf-8') as file:
            #fieldnames = ['Word','Freq','Transcription']

            reader = csv.DictReader(file)#,fieldnames=fieldnames)
            #if 'Word' not in reader.fieldnames or 'Frequency' not in reader.fieldnames or 'Transcription' not in reader.fieldnames:
            #    raise KeyError("CSV file must contain 'Word', 'Frequency', and 'Transcription' columns")
            for row in tqdm(reader, desc="Loading CSV and writing"):
                counter+=1
                if len(row)>2:
                    try:
                        data.append((row['word'].strip(),int(float(row['frequency'])),row['code'].strip()))
                    except:
                        print(f"fail row:{row}")
                    
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return
       
    # Sort the data by frequency in descending order
    #data.sort(key=lambda x: x[1], reverse=True)
    #data2 = transform_table(data)

    # Prepare data for the top N words
    results = []
    for word, freq, trans in tqdm(data[:TOP_N], desc="Processing Words"):
        #word2 = word.split("_")[0]
        word2 = word
        if has_special_characters(word2):
            continue
        chatgpt_response = call_chatgpt(word2,lan)
        if chatgpt_response == "Error":
            si_no  = "Error", ""
        else:
            #gptresponses=chatgpt_response
            #try:
            #    gptresponses = ast.literal_eval(chatgpt_response)
            #except:
            #    print(chatgpt_response)
            #    gptresponses = ['?']*10
            #response_parts = chatgpt_response.split(',')
            #si_no = response_parts[0].strip()
            #for x in range (len(word2)):
            #    results.append((word2[x], freq[x], trans[x].strip(), gptresponses[x]))
            results.append((word2, freq, trans.strip(), chatgpt_response))

        time.sleep(0.1)  # Wait for half a second between calls

    # Create new CSV file with additional columns
    new_file_path = file_path.replace('.csv', '_fonemas.csv')
    new_file_path = new_file_path.replace('.txt', '_fonemas.txt')

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


file_path = ('ngram_data/spa1gram_nouns_s.csv','es')
process_csv(*file_path)        

#file_path = ('ngram_data/eng1gram_nouns_s.csv','en')
#process_csv(*file_path)    






print("code compleated")