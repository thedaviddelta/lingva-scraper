import axios, { AxiosResponse } from "axios";
import UserAgent from "user-agents";
import { LangCodeGoogle } from "./language";

export const Endpoint = {
    INFO: "info",
    TEXT: "text",
    AUDIO: "audio"
} as const;

type EndpointType = typeof Endpoint[keyof typeof Endpoint];

type Params = {
    [Endpoint.INFO]: {
        body: string
    },
    [Endpoint.TEXT]: {
        source: LangCodeGoogle<"source">,
        target: LangCodeGoogle<"target">,
        query: string
    },
    [Endpoint.AUDIO]: {
        lang: LangCodeGoogle<"target">,
        text: string,
        textLength: number,
        speed: number
    }
};

const request = <T extends EndpointType>(
    endpoint: T,
    retry: number = 0
) => ({
    with: (
        params: Params[T]
    ) => {
        const promise = retrieve(endpoint, params);
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

const retrieve = <T extends EndpointType>(endpoint: T, params: Params[T]) => {
    if (endpoint === Endpoint.INFO) {
        const { body } = params as Params[typeof Endpoint.INFO];
        return axios.post(
            "https://translate.google.com/_/TranslateWebserverUi/data/batchexecute?rpcids=MkEWBc&rt=c",
            body,
            {
                headers: {
                    "User-Agent": new UserAgent().toString(),
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );
    }

    if (endpoint === Endpoint.TEXT) {
        const { source, target, query } = params as Params[typeof Endpoint.TEXT];
        return axios.get(
            `https://translate.google.com/m?sl=${source}&tl=${target}&q=${query}`,
            {
                headers: {
                    "User-Agent": new UserAgent().toString()
                }
            }
        );
    }

    if (endpoint === Endpoint.AUDIO) {
        const { lang, text, textLength, speed } = params as Params[typeof Endpoint.AUDIO];
        return axios.get(
            `https://translate.google.com/translate_tts?tl=${lang}&q=${text}&textlen=${textLength}&speed=${speed}&client=tw-ob`,
            {
                responseType: "arraybuffer",
                headers: {
                    "User-Agent": new UserAgent().toString()
                }
            }
        );
    }

    throw new Error("Invalid endpoint");
};

export default request;
