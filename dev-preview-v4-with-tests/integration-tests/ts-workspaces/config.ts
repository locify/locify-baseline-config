import {ConnectConfig} from "near-api-js";

export type SandboxConfig = ConnectConfig & {
    contractAccount: string
}
export const configSandbox: SandboxConfig = {
    networkId: "sandbox",
    headers: {},
    nodeUrl: "http://localhost:3030",
    masterAccount: "test.near",
    contractAccount: "rtb-contract.test.near",
    keyPath: "/tmp/near-sandbox/validator_key.json",
};

export const config: ConnectConfig = {
    networkId: "sandbox",
    headers: {},
    nodeUrl: "http://localhost:3030",
};