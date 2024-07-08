import pathlib
import textwrap

import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown


def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

GOOGLE_API_KEY="AIzaSyBOLLVGSFUENRtQJnBnDrClN2CY5NnCueE"

genai.configure(api_key=GOOGLE_API_KEY)


for m in genai.list_models():
  if 'generateContent' in m.supported_generation_methods:
    print(m.name)
    
    
model = genai.GenerativeModel('gemini-1.5-flash')
#%%time
response = model.generate_content("What is the meaning of life?")    
print(response.text)
#my_markdown_string = to_markdown(response.text)
#display({'text/plain': my_markdown_string,
#         'text/markdown': my_markdown_string},
#        raw=True)