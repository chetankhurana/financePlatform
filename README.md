# Finance Project

This project is a starter template using [Next.js](https://nextjs.org). It has been extended to include a Python script for verifying your Gemini API key, allowing easy integration with Google's latest Gemini LLM via the official SDK.

## Features
- Next.js frontend
- Python-based Gemini API key tester
- .env setup following security best practices

## How to Use the Gemini API Verifier

### 1. Requirements
- Python 3.10 or above
- Recommended: [python-dotenv](https://pypi.org/project/python-dotenv/)
- The [google-genai](https://pypi.org/project/google-genai/) package

### 2. Set up your API key
Copy `.env.example` to `.env` and fill in your Gemini API key:

```
GEMINI_API_KEY=your-key-here
```

**Do not commit your real key!**

### 3. Install Python dependencies

```
pip install -r requirements.txt
```

(Or individually:)
```
pip install python-dotenv google-genai
```

### 4. Run the API key test script

```
python test_gemini_key.py
```
If your key is valid you'll see a response, e.g.:
```
API key is valid. Gemini response:
Hello! How can I help you today?
```

## General Next.js Setup
Run your Next.js app as usual:

```
npm run dev
# or
yarn dev
```
Go to http://localhost:3000/

## Security & Environment
- This repo's `.gitignore` already excludes `.env` files.
- Only provide `GEMINI_API_KEY` in your local `.env` (never commit live credentials).
- The `.env.example` is provided to document needed environment variables.

## Contributing
1. Fork the repository and create your branch.
2. Add features or fixes; write tests if possible.
3. Run the Gemini API key tester before submitting API-related changes.
4. Open a pull request.

---

This README and project structure follows open source and GitHub best practices, making it easy for new contributors.

For more on using Gemini, see https://ai.google.dev/gemini-api/docs
