# MarkDown to ANKI
A simple NodeJS utility to create [ANKI](https://apps.ankiweb.net/)  cards from a regular markdown file.

## Reason
[ANKI](https://apps.ankiweb.net/) is a great tool to learn something new or refresh your knowledge. But creating ANKI cards manually and editing it one by one can be a tedious task. So, I decided to make this simple NodeJS utility to automate it. You write your markdown file once. Mark by special marks where your questions/answers begin, run this tool and it will create new cards via REST API thanks to this ANKI extension [ANKI Connect](https://ankiweb.net/shared/info/2055492159)

- Example of markdown file `example.md`:
```
DECK=JavaScript Test
MODEL=Basic Code Highlight

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
- `#QUESTION#` and `#ANSWER#` selectors defining the starting of question and answer respectively.
- `DECK` and `MODEL` defining [deck name](https://docs.ankiweb.net/#/getting-started?id=decks) and [model name (note type)](https://docs.ankiweb.net/#/getting-started?id=note-types) respectively.
- Thanks to [highlight.js](https://github.com/highlightjs/highlight.js) source code will be highlighted in the right way.

## Prerequisites
- [ANKI](https://apps.ankiweb.net/)
- [ANKI Connect](https://ankiweb.net/shared/info/2055492159)
- NodeJS >= 10 (I always used the latest NodeJS library but guess that older will work as well)

## Usage
- `git clone`
- `npm install`
- `npm run index`
- **Important**:
    - When you update notes ANKI browser must be closed, see this issue: [updateNoteFields returns errorless but does nothing](https://github.com/FooSoft/anki-connect/issues/82#issuecomment-500179245)
    - If you use it on the Macbook, keep ANKI active when you're running this script, 
    otherwise it might be extremely slow due to [AppNap](https://www.howtogeek.com/277414/what-is-app-nap-is-it-slowing-down-my-mac-apps/) see this issue: [Response taking SECONDS in MacOS :O](https://github.com/FooSoft/anki-connect/issues/129#issuecomment-696768108)

## Configuration
The configuration is done in the `.env` file located in the root folder.
```
ANKI_URI=http://localhost:8765
ANKI_API_VERSION=6
MARKDOWN_QUESTION_SELECTORS=#QUESTION#
MARKDOWN_ANSWER_SELECTORS=#ANSWER#
MARKDOWN_PATH_TO=/Users/anatoly/Documents/git/anki-cards/
OVERRIDE_NOTE=false
```
- Most settings are self explaining. 
- `MARKDOWN_QUESTION_SELECTORS` and `MARKDOWN_ANSWER_SELECTORS`  are selectors which defining the start of the question and answer, see `example.md` above. They both can contain multiple selectors separated by a comma.
- `MARKDOWN_PATH_TO`, path to directory where markdown file placed. Right now only single markdown file supported. Images must be places in this directory in `images` sub-directory
- `OVERRIDE_NOTE`, if true it will override answer for the note with the same **Front** field 
- I advice you to clone the [**Basic** model (note type)](https://apps.ankiweb.net/docs/manual20.html#note-types) and add to its [styling section](https://apps.ankiweb.net/docs/manual20.html#card-styling) the one of the following [CSS styles](https://github.com/highlightjs/highlight.js/tree/master/src/styles) supported by [highlight.js](https://github.com/highlightjs/highlight.js) to support highlighting. 
- To support inline highlight you should use the following workaround, manually add the following CSS to styling section:
```
.inline-code {
    padding: .2em .4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27,31,35,.05);
    border-radius: 6px;
}

```
For more details, look at this issue [when using renderInline, highlight doesn't work.](https://github.com/markdown-it/markdown-it/issues/576)
- Note title are global, i.e. two notes with the same title can't be created even in different decks, see this issue [canAddNote returns false when note with same field's value exists in a different deck](https://github.com/FooSoft/anki-connect/issues/81).
- After all preparations are done just invoke from the root folder `npm run index`, ANKI obviously must be open when you run it.
