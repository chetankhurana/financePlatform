import os
from dotenv import load_dotenv
from google import genai

# Load .env variables (safe for local dev)
load_dotenv()

api_key = os.getenv('GEMINI_API_KEY', None)

if not api_key:
    print('No GEMINI_API_KEY set in environment! (Check .env)')
    exit(1)

try:
    # Latest SDK usage
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model='gemini-3.5-flash',
        contents="Hello, Gemini!"
    )
    print("API key is valid. Gemini response:")
    print(response.text)
    client.close()
except Exception as e:
    print("API key does NOT work.")
    print("Error:", e)
