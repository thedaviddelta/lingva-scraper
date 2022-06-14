import { LangCodeGoogle } from "./language";

export type Boilerplate = [
    [
        "wrb.fr",
        "MkEWBc",
        string, // data
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

export type Data = [
    DataSource,
    DataTarget,
    LangCodeGoogle<"source">, // source/detected
    DataExtra | undefined
];

type DataSource = [
    string | null, // pronunciation
    [
        [
            [
                null,
                string
            ],
            string, // text
            1,
            [
                1
            ],
            string // typo
        ] | null,
        [
            LangCodeGoogle<"source"> // lang
        ] | null
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

type DataTarget = [ // target
    [
        [
            null,
            string | null, // pronunciation
            null,
            null,
            null,
            [
                string, // text
                null,
                null,
                null,
                [ // more
                    string,
                    number[]
                ][]
            ][]
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

type DataExtra = [
    string, // query
    [ // definitions
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
                    ] | undefined
                ][] | undefined
            ][]
        ][],
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
                string | null, // article
                string[], // meanings
                number, // frequency
                true
            ][],
            LangCodeGoogle<"target">, // target
            LangCodeGoogle<"source"> // source/detected
        ][]
    ] | null,
    null,
    null,
    LangCodeGoogle<"source">, // source/detected
    number
];
