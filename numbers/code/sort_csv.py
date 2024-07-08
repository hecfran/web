import pandas as pd

def sort_csv_by_second_column(input_file, output_file):
    # Read the file into a DataFrame, specifying the delimiter as a colon
    df = pd.read_csv(input_file, delimiter=',', header=None, names=['word', 'frequency', 'code','nothing'])

    # Convert the second column to numeric type
    df['frequency'] = pd.to_numeric(df['frequency'])

    # Sort the DataFrame by the second column
    sorted_df = df.sort_values(by='frequency', ascending=False)

    # Write the sorted DataFrame to a new file with the header
    sorted_df.to_csv(output_file, sep=',', index=False)

if __name__ == '__main__':
    input_csv_file = 'ngram_data/eng1gram_nouns.txt'
    sort_csv_by_second_column(input_csv_file, input_csv_file.replace('.txt', '_s.csv'))
    
    input_csv_file = 'ngram_data/spa1gram_nouns.txt'
    sort_csv_by_second_column(input_csv_file, input_csv_file.replace('.txt', '_s.csv'))
    
    print('Sorted CSV files with headers have been created.')
