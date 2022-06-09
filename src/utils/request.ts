import axios, { AxiosResponse } from "axios";
import UserAgent from "user-agents";
import { LangCodeGoogle } from "./language";

export const Endpoint = {
    TRANSLATION: "translation",
    AUDIO: "audio"
} as const;

type EndpointType = typeof Endpoint[keyof typeof Endpoint];

type Params = {
    translation: {
        body: string,
    },
    audio: {
        lang: LangCodeGoogle<"target">,
        text: string
    }
};

const request = <T extends EndpointType>(
    endpoint: T,
    retry: number = 0
) => ({
    with: (
        params: Params[T]
    ) => {
        const promise = endpoint === "translation"
            ? fetchTranslation(params as Params["translation"])
            : fetchAudio(params as Params["audio"]);
        return {
            promise,
            doing: <V>(
                callback: (res: AxiosResponse) => V | undefined
            ): Promise<V | null> => (
                promise.then(callback)
                    .catch(() => undefined)
                    .then(result =>
                        isEmpty(result) && retry < 3
                            ? request(endpoint, retry + 1).with(params).doing(callback)
                            : result ?? null
                    )
            )
        }
    }
});

const isEmpty = (item: any) => (
    !item || (typeof item === "object" && "length" in item && item.length <= 0)
);

const fetchTranslation = ({ body }: Params["translation"]) => (
    axios.post(
        "https://translate.google.com/_/TranslateWebserverUi/data/batchexecute?rpcids=MkEWBc&rt=c",
        body,
        {
            headers: {
                "User-Agent": new UserAgent().toString(),
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    )
);

const fetchAudio = ({ lang, text }: Params["audio"]) => (
    axios.get(
        `https://translate.google.com/translate_tts?tl=${lang}&q=${encodeURIComponent(text)}&textlen=${text.length}&client=tw-ob`,
        {
            responseType: "arraybuffer",
            headers: {
                "User-Agent": new UserAgent().toString()
            }
        }
    )
);

export default request;
