# MarkDown to ANKI
A simple NodeJS utility to create [ANKI](https://apps.ankiweb.net/)  cards from a regular markdown file.

## Reason
[ANKI](https://apps.ankiweb.net/) is a great tool to learn something new or refresh your knowledge. But creating ANKI cards manually and editing it one by one can be a tedious task. So, I decided to make this simple NodeJS utility to automate it. You write your markdown file once. Mark by special marks where your questions/answers begin, run this tool and it will create new cards via REST API thanks to this ANKI extension [ANKI Connect](https://ankiweb.net/shared/info/2055492159)

- Example of markdown file `example.md`:
```
#QUESTION#
What is the JavaScript?
#ANSWER#
JavaScript is the programming language.

#QUESTION#
Write a simple programm which prints "Hello World" in JavaScript
#ANSWER#
    ```
    console.log("Hello World")
    ```
```

- This file above will generate 2 ANKI cards with corresponded questions and answers.
- Thanks to [highlight.js](https://github.com/highlightjs/highlight.js) source code will be highlighted in the right way.

## Prerequisites
- [ANKI](https://apps.ankiweb.net/)
- [ANKI Connect](https://ankiweb.net/shared/info/2055492159)
- NodeJS >= 10 (I always used the latest NodeJS library but guess that older will work as well)

## Usage
- `git clone`
- `npm install`
- `npm run index`

## Configuration
The configuration is done in the `.env` file located in the root folder.
```
ANKI_URI=http://localhost:8765
ANKI_API_VERSION=6
ANKI_DECK_NAME=JavaScript Test
ANKI_MODEL_NAME=Basic
MARKDOWN_QUESTION_SELECTORS=#QUESTION#
MARKDOWN_ANSWER_SELECTORS=#ANSWER#
MARKDOWN_PATH_TO_FILE=/Users/anatoly/Documents/git/anki-cards/fullstack.md
MAX_NOTES_PER_REQUEST=10
```

- Most settings are self explaining. 
- `MARKDOWN_QUESTION_SELECTORS` and `MARKDOWN_ANSWER_SELECTORS` can contain multiple selectors separated by a comma. 
- Sometimes when a big markdown file with a lot of questions is pushed to ANKI it might fail, so I added `MAX_NOTES_PER_REQUEST` which split questions to chunks of N questions/answers per chunk/request.
- I advice you to clone the [**Basic** model (note type)](https://apps.ankiweb.net/docs/manual20.html#note-types) and add to its [styling section](https://apps.ankiweb.net/docs/manual20.html#card-styling) the one of the following [CSS styles](https://github.com/highlightjs/highlight.js/tree/master/src/styles) supported by [highlight.js](https://github.com/highlightjs/highlight.js) to support highlighting. 
- After all preparations are done just invoke from the root folder `npm run index`, ANKI obviously must be open when you run it.