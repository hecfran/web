import requests
import pandas as pd
from tqdm import tqdm
import gzip
import os
import io

def download_ngram_data(corpus, part, save_path):
    base_url = f"http://storage.googleapis.com/books/ngrams/books/googlebooks-{corpus}-1gram-20120701-{part}.gz"
    response = requests.get(base_url, stream=True)
    response.raise_for_status()
    
    with open(save_path, 'wb') as file:
        total_size = int(response.headers.get('content-length', 0))
        block_size = 1024
        t = tqdm(total=total_size, unit='B', unit_scale=True, desc=f"Downloading {part}")
        for data in response.iter_content(block_size):
            t.update(len(data))
            file.write(data)
        t.close()
    print(f"Data downloaded and saved to {save_path}")

def count_lines(file):
    total_size = os.path.getsize(file)
    t = tqdm(total=total_size, unit='B', unit_scale=True, desc="Counting lines")
    line_count = 0
    with gzip.open(file, 'rb') as f:
        while True:
            chunk = f.read(1024 * 1024)  # Read in 1MB chunks
            if not chunk:
                break
            line_count += chunk.count(b'\n')
            t.update(len(chunk))
    t.close()
    return line_count

def extract_and_save_filtered_csv(gzip_path, csv_path, mode='a'):
    line_count = count_lines(gzip_path)
    
    with gzip.open(gzip_path, 'rb') as f_in:
        t = tqdm(total=line_count, unit='lines', desc="Reading and filtering")
        
        chunk_list = []
        chunk_size = 10**6  # 1 MB
        for chunk in pd.read_csv(io.StringIO(f_in.read().decode('utf-8')), sep='\t', header=None, names=["Word", "Year", "Frequency", "Volumes"], chunksize=chunk_size, encoding='utf-8'):
            filtered_chunk = chunk[(chunk['Word'].str.endswith('_NOUN')) & (chunk['Year'] == 2009) & (chunk['Frequency'] > 3)]
            chunk_list.append(filtered_chunk[["Word", "Frequency"]])
            t.update(len(chunk))
        t.close()

        # Concatenate all chunks into a single DataFrame
        filtered_df = pd.concat(chunk_list, ignore_index=True)
        
        # Save the filtered DataFrame to the CSV file
        filtered_df.to_csv(csv_path, mode=mode, index=False, header=not os.path.exists(csv_path), encoding='utf-8')
    print(f"Filtered data extracted and saved to {csv_path}")

    # Remove the .gz file
    os.remove(gzip_path)
    print(f"Removed file: {gzip_path}")

# Download the 1-gram datasets for English and Spanish
corpus_files = {
    "spanish": "spa-all",
    "english": "eng-us-all",
    
}
parts = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

save_dir = 'ngram_data'
os.makedirs(save_dir, exist_ok=True)

csv_paths = {
    "spanish": os.path.join(save_dir, "ngram_spanish.csv"),
    "english": os.path.join(save_dir, "ngram_english.csv"),
}

for language, corpus in corpus_files.items():
    csv_path = csv_paths[language]
    # Clear existing CSV file if exists
    if os.path.exists(csv_path):
        os.remove(csv_path)
    
    for part in tqdm(parts, desc=f"Processing letters for {language}"):
        save_path = os.path.join(save_dir, f"googlebooks-{corpus}-1gram-20120701-{part}.gz")
        print(f"Processing leter {part} for {language}")
        download_ngram_data(corpus, part, save_path)
        extract_and_save_filtered_csv(save_path, csv_path, mode='a')
