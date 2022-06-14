import { LangCode } from "./language";

interface DefinitionsGroup {
    type: string,
    list: {
        definition: string,
        example: string,
        field?: string,
        synonyms: string[]
    }[]
}

interface ExtraTranslationsGroup {
    type: string,
    list: {
        word: string,
        article?: string,
        frequency: number,
        meanings: string[]
    }[]
}

export interface TranslationInfo {
    detectedSource?: LangCode<"source">,
    typo?: string,
    pronunciation: {
        query?: string,
        translation?: string
    },
    definitions: DefinitionsGroup[],
    examples: string[],
    similar: string[],
    extraTranslations: ExtraTranslationsGroup[]
}
