import * as markdownIt from "markdown-it";
import * as hljs from "highlight.js";
import * as fs from "fs";
import * as path from "path";
import { createHash } from "crypto";

interface IFile {
    filename: string;
    fileData: string;
}

export class AnkiNote {

    static md;
    static getMarkdownParser (frontHash: string, populateFilesCallback: Function) {
        if (!AnkiNote.md) {
            AnkiNote.md = markdownIt({
                html: true,
                highlight: function (str, lang) {
                    if (lang && hljs.getLanguage(lang)) {
                        try {
                            const highlighted = `<pre class="hljs"><code> ${hljs.highlight(lang, str, true).value} </code></pre>`;
                            return highlighted;
                        } catch (e) {
                            console.error(e);
                        }
                    }

                    return '<pre class="hljs"><code>' + AnkiNote.md.utils.escapeHtml(str) + '</code></pre>';
                }
            });

            AnkiNote.md.renderer.rules.code_inline =  function (tokens, idx, options, env, slf) {
                const token = tokens[idx];
                const inline = `<code class="inline-code">${AnkiNote.md.utils.escapeHtml(token.content)}</code>`;
                return inline;
            };

            AnkiNote.md.renderer.rules.image = function (tokens, idx, options, env, self) {
                const token = tokens[idx];
                const src = token.attrGet('src');
                const pathToImagesFolder = process.env.MARKDOWN_PATH_TO_FILE.slice(0, process.env.MARKDOWN_PATH_TO_FILE.lastIndexOf("/"));
                const base64file = fs.readFileSync(path.resolve(pathToImagesFolder, src), {encoding: 'base64'});
                const uniqueFileName = `${frontHash}-${src.split("/")[1]}`;
                populateFilesCallback({
                    filename: uniqueFileName,
                    fileData: base64file
                })
                token.attrSet("src", uniqueFileName);
                token.attrSet("alt", uniqueFileName);
                return self.renderToken(tokens, idx, options);
            };
        }

        return AnkiNote.md;
    }


    front: string;
    back: string;

    frontRaw: string;
    backRaw: string;

    private frontHash: string;
    private files: IFile[];

    constructor(frontRaw, backRaw) {
        this.frontRaw = frontRaw;
        this.backRaw = backRaw;
        this.frontHash = createHash('md5').update(this.frontRaw).digest('hex')

        this.front = AnkiNote.getMarkdownParser(this.frontHash, this.populateFilesCallback).render(frontRaw);
        this.back = AnkiNote.getMarkdownParser(this.frontHash, this.populateFilesCallback).render(backRaw);
    }

    populateFilesCallback(file){
        this.files.push(file);
    }
}
