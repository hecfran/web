import csv
import json
from collections import defaultdict

def process_csv(file_path):
    # Create a default dictionary where the default value is an empty set
    transcription_dict = defaultdict(set)
    
    row_count = 0  # Counter for rows with si_no == 's'
    
    # Open and read the CSV file
    with open(file_path, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        # Iterate through each row in the CSV
        for row in reader:
            # Check if the si_no column has the value "s"
            if row['si_no'] == 's' and len(row['transcription'])>0:
                row_count += 1  # Increment the counter
                # Get the transcription and word (converted to lowercase)
                transcription = row['transcription']
                word = row['word'].lower()
                
                # Add the word to the set corresponding to the transcription
                transcription_dict[transcription].add(word)
    
    return transcription_dict, row_count

def save_dict_to_js(transcription_dict, output_file_path):
    # Convert sets to lists for JSON serialization
    dict_with_lists = {k: list(v) for k, v in transcription_dict.items()}
    
    # Sort the dictionary by key length first, then alphabetically for keys of the same length
    sorted_dict = dict(sorted(dict_with_lists.items(), key=lambda item: (len(item[0]), item[0])))
    
    # Create a JSON string
    json_string = json.dumps(sorted_dict, indent=4)
    
    # Create a JS file content with the dictionary assigned to a variable
    js_content = f"const transcriptionDict = {json_string};"
    
    # Write the JS content to a file
    with open(output_file_path, mode='w', encoding='utf-8') as jsfile:
        jsfile.write(js_content)

# Example usage
if __name__ == "__main__":
    csv_file_path = 'ngram_data/spa1gram_nouns_s_fonemas.csv'
    js_file_path = 'ngram_data/spa.js'
    
    transcription_dict, row_count = process_csv(csv_file_path)
    save_dict_to_js(transcription_dict, js_file_path)
    
    print(f'Transcription dictionary saved to {js_file_path}')
    print(f'Number of rows used to create the file: {row_count}')
