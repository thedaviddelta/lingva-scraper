import { LangCodeGoogle } from "./language";

export type Boilerplate = [
    [
        "wrb.fr",
        "MkEWBc",
        string, // info
        null,
        null,
        null,
        "generic"
    ],
    [
        "di",
        number
    ],
    [
        "af.httprm",
        number,
        string,
        number
    ]
];

export type Info = [
    InfoSource,
    InfoTarget,
    LangCodeGoogle<"source">, // source/detected
    InfoExtra | undefined
];

type InfoSource = [
    string | null, // pronunciation
    [
        null,
        [
            LangCodeGoogle<"source"> // lang
        ]
    ] | null,
    LangCodeGoogle<"source"> | null, // detected
    [
        [
            [
                0,
                [
                    [
                        [
                            null,
                            number // textlen
                        ]
                    ],
                    [
                        true
                    ]
                ]
            ]
        ],
        number // textlen
    ],
    [
        [
            string, // text
            null,
            null,
            string // textlen
        ]
    ]
];

type InfoTarget = [ // target
    [
        [
            null,
            string | null, // pronunciation
            null,
            null,
            null,
            [
                [
                    string, // text
                    null,
                    null,
                    null,
                    [ // more
                        string,
                        number[]
                    ][]
                ]
            ]
        ]
    ],
    LangCodeGoogle<"target">, // lang
    1,
    LangCodeGoogle<"source">, // source/detected,
    [
        string, // query
        LangCodeGoogle<"source">, // source
        LangCodeGoogle<"target">, // target
        true
    ]
];

type InfoExtra = [
    string, // query
    [ // definitions
        [
            [
                string, // type
                [
                    string, // definition
                    string, // example
                    true | null,
                    null,
                    [
                        [
                            string // field
                        ]
                    ] | null,
                    [ // synonyms
                        [
                            string // synonym
                        ][],
                        [
                            [
                                string // type
                            ]
                        ] | null
                    ][]
                ][]
            ][]
        ],
        number,
        true | undefined
    ] | null,
    [ // examples
        [
            null,
            string // example
        ][],
        number,
        number
    ] | null,
    [ // similar
        string[], // words
        null,
        number
    ] | null,
    null,
    [ // translations
        [
            string, // type
            [
                string, // word,
                string, // article
                string[], // synonyms
                number, // frequency
                true
            ][],
            string, // target
            LangCodeGoogle<"source"> // source/detected
        ][]
    ] | null,
    null,
    null,
    LangCodeGoogle<"source">, // source/detected
    number
];
