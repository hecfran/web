


import pathlib
import textwrap
import google
import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown


google.generativeai.ChatSession(
    model: GenerativeModel,
    history: (Iterable[content_types.StrictContentType] | None) = None,
    enable_automatic_function_calling: bool = False
)