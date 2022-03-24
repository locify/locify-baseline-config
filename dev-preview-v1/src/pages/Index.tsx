import React, { Fragment, useEffect, useState } from 'react'
import {
    CircularProgress,
    Divider,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { DID } from 'dids'
import { ThreeIdConnect } from '@3id/connect'
import { NearAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'
import { randomBytes } from '@stablelib/random'

import * as nearApiJs from 'near-api-js'
import { KeyPair } from 'near-api-js'

// @ts-ignore
import near from '@src/lib/near'
import { useRecoilValue } from 'recoil'
import { walletState, WalletT } from '@src/store/walletState'
import { CeramicClient } from '@ceramicnetwork/http-client'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import { ModelManager } from '@glazed/devtools'
import { DataModel } from '@glazed/datamodel'
import { model as basicProfileModel } from '@datamodels/identity-profile-basic'
import { DIDDataStore } from '@glazed/did-datastore'
import { LoadingButton } from '@mui/lab'

const seed = randomBytes(32)

//const core = new Core({ ceramic: 'http://localhost:7007', model })
//const core = new Core({ ceramic: 'mainnet-gateway' })
const API_URL = 'https://ceramic-clay.3boxlabs.com'

const ceramic = new CeramicClient(API_URL)

export const Index = () => {
    const walletInfo = useRecoilValue<WalletT>(walletState)
    const [userProfile, setUserProfile] = useState({
        account: 'loading',
        did: 'loading',
        name: 'loading',
        description: 'loading',
        url: 'loading',
    })

    const [cName, setCName] = useState('')
    const [cDescription, setCDescription] = useState('')
    const [cUrl, setCUrl] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleGetProfile = async () => {
        setIsLoading(true)
        if (walletInfo.t === 'authenticated') {
            const threeIdConnect = new ThreeIdConnect()
            const keyStore = new nearApiJs.keyStores.InMemoryKeyStore()
            const PRIVATE_KEY =
                'ed25519:9hB3onqC56qBSHpHJaE6EyxKPyFxCxzRBkmjuVx6UqXwygvAmFbwnsLuZ2YHsYJqkPTCygVBwXpNzssvWvUySbd'
            const keyPair = KeyPair.fromString(PRIVATE_KEY)
            const CONTRACT_NAME = 'locify-identity.testnet'
            const config = {
                keyStore, // instance of InMemoryKeyStore
                networkId: 'default',
                nodeUrl: 'https://rpc.testnet.near.org',
                contractName: CONTRACT_NAME,
                walletUrl: 'https://wallet.testnet.near.org',
                helperUrl: 'https://helper.testnet.near.org',
            }

            if (near) {
                console.info('near ready 2')
                const chainRef = 'testnet'
                await keyStore.setKey(chainRef, walletInfo.user.name, keyPair)
                // @ts-ignore
                const nearDid = await nearApiJs.connect(config)
                const authProvider = new NearAuthProvider(
                    nearDid,
                    walletInfo.user.name,
                    chainRef
                )
                await threeIdConnect.connect(authProvider)
                const provider = threeIdConnect.getDidProvider()

                const clientDid = new DID({
                    resolver: ThreeIdResolver.getResolver(ceramic),
                })
                clientDid.setProvider(provider)
                ceramic.did = new DID({
                    resolver: ThreeIdResolver.getResolver(ceramic),
                })
                ceramic.did.setProvider(provider)
                await ceramic.did.authenticate()

                const accountLink = provider.accountId

                const manager = new ModelManager(ceramic)
                manager.addJSONModel(basicProfileModel)

                const myProfile = {
                    name: cName,
                    description: cDescription,
                    url: cUrl,
                }

                const publishedModel = {
                    schemas: {
                        BasicProfile:
                            'ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio',
                    },
                    definitions: {
                        basicProfile:
                            'kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic',
                    },
                    tiles: {},
                }
                const model = new DataModel({
                    ceramic,
                    model: publishedModel,
                })
                const dataStore = new DIDDataStore({
                    ceramic,
                    model: publishedModel,
                })
                const resProfile = await dataStore.get('basicProfile')
                /* await manager.createTile('basicProfile', myTile, {
                    schema: manager.getSchemaURL(
                        'ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio'
                    ),
                })*/

                /*createTile(, {
                    description: 'This is my funny description.',
                    emoji: '🚀',
                })*/
                console.group('get res profile')
                console.table(resProfile)
                console.groupEnd()
                if (resProfile) {
                    setUserProfile((prevState) => ({
                        ...prevState,
                        name: resProfile.name,
                        description: resProfile.description,
                        url: resProfile.url,
                    }))
                }
            }
        }
        setIsLoading(false)
    }
    const handleSubmitProfile = async () => {
        setIsLoading(true)
        if (walletInfo.t === 'authenticated') {
            const threeIdConnect = new ThreeIdConnect()
            const keyStore = new nearApiJs.keyStores.InMemoryKeyStore()
            const PRIVATE_KEY =
                'ed25519:9hB3onqC56qBSHpHJaE6EyxKPyFxCxzRBkmjuVx6UqXwygvAmFbwnsLuZ2YHsYJqkPTCygVBwXpNzssvWvUySbd'
            const keyPair = KeyPair.fromString(PRIVATE_KEY)
            const CONTRACT_NAME = 'locify-identity.testnet'
            const config = {
                keyStore, // instance of InMemoryKeyStore
                networkId: 'default',
                nodeUrl: 'https://rpc.testnet.near.org',
                contractName: CONTRACT_NAME,
                walletUrl: 'https://wallet.testnet.near.org',
                helperUrl: 'https://helper.testnet.near.org',
            }

            if (near) {
                console.info('near ready 2')
                const chainRef = 'testnet'
                await keyStore.setKey(chainRef, walletInfo.user.name, keyPair)
                // @ts-ignore
                const nearDid = await nearApiJs.connect(config)
                const authProvider = new NearAuthProvider(
                    nearDid,
                    walletInfo.user.name,
                    chainRef
                )
                await threeIdConnect.connect(authProvider)
                const provider = threeIdConnect.getDidProvider()

                const clientDid = new DID({
                    resolver: ThreeIdResolver.getResolver(ceramic),
                })
                clientDid.setProvider(provider)
                ceramic.did = new DID({
                    resolver: ThreeIdResolver.getResolver(ceramic),
                })
                ceramic.did.setProvider(provider)
                await ceramic.did.authenticate()

                const accountLink = provider.accountId

                const manager = new ModelManager(ceramic)
                manager.addJSONModel(basicProfileModel)

                const myProfile = {
                    name: cName,
                    description: cDescription,
                    url: cUrl,
                }

                const publishedModel = {
                    schemas: {
                        BasicProfile:
                            'ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio',
                    },
                    definitions: {
                        basicProfile:
                            'kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic',
                    },
                    tiles: {},
                }
                const model = new DataModel({
                    ceramic,
                    model: publishedModel,
                })
                const dataStore = new DIDDataStore({
                    ceramic,
                    model: publishedModel,
                })
                //await dataStore.set('basicProfile', { ...myProfile })
                console.info('my new profile: ')
                console.info(myProfile)
                await dataStore.set('basicProfile', { ...myProfile })
                const resProfile = await dataStore.get('basicProfile')
                console.table(resProfile)
                if (resProfile) {
                    setUserProfile((prevState) => ({
                        ...prevState,
                        name: resProfile.name,
                        description: resProfile.description,
                        url: resProfile.url,
                    }))
                }

                setCName('')
                setCDescription('')
                setCUrl('')
            }
        }
        setIsLoading(false)
    }
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCName(event.target.value)
    }
    const handleDescriptionChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCDescription(event.target.value)
    }
    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCUrl(event.target.value)
    }
    useEffect(() => {
        const getProfile = async () => {
            setIsLoading(true)
            if (walletInfo.t === 'authenticated') {
                const streamId =
                    'kjzl6cwe1jw148e9qkyxbyr84elvpjq8hzimrqg51759sf6yp6m7qvs0e38msdt'
                const stream = await ceramic.loadStream(streamId)
                console.info('stream info: ', stream.content)
                console.info('index wallet authenticated, start did')

                const accountName = walletInfo.user.name

                const threeIdConnect = new ThreeIdConnect()
                const keyStore = new nearApiJs.keyStores.InMemoryKeyStore()
                const PRIVATE_KEY =
                    'ed25519:9hB3onqC56qBSHpHJaE6EyxKPyFxCxzRBkmjuVx6UqXwygvAmFbwnsLuZ2YHsYJqkPTCygVBwXpNzssvWvUySbd'
                const keyPair = KeyPair.fromString(PRIVATE_KEY)
                const CONTRACT_NAME = 'locify-identity.testnet'
                const config = {
                    keyStore, // instance of InMemoryKeyStore
                    networkId: 'default',
                    nodeUrl: 'https://rpc.testnet.near.org',
                    contractName: CONTRACT_NAME,
                    walletUrl: 'https://wallet.testnet.near.org',
                    helperUrl: 'https://helper.testnet.near.org',
                }

                if (near) {
                    console.info('near ready 2')
                    const chainRef = 'testnet'
                    await keyStore.setKey(chainRef, accountName, keyPair)
                    // @ts-ignore
                    const nearDid = await nearApiJs.connect(config)
                    const authProvider = new NearAuthProvider(
                        nearDid,
                        accountName,
                        chainRef
                    )
                    await threeIdConnect.connect(authProvider)
                    const provider = threeIdConnect.getDidProvider()

                    const clientDid = new DID({
                        resolver: ThreeIdResolver.getResolver(ceramic),
                    })
                    clientDid.setProvider(provider)
                    ceramic.did = new DID({
                        resolver: ThreeIdResolver.getResolver(ceramic),
                    })
                    ceramic.did.setProvider(provider)
                    await ceramic.did.authenticate()

                    const accountLink = provider.accountId

                    const manager = new ModelManager(ceramic)
                    manager.addJSONModel(basicProfileModel)

                    const myProfile = {
                        name: 'not set',
                        description: 'not set',
                        url: 'not set',
                    }
                    let didId = 'error - not found'
                    if (ceramic.did) {
                        didId = ceramic.did.id
                    }
                    setUserProfile((prevState) => ({
                        ...prevState,
                        account: accountLink,
                        did: didId,
                    }))
                    console.info('did for provider:', provider.accountId)
                    console.info('did for ceramic:', ceramic.did.id)
                    console.log('did provider:')
                    console.info(provider)
                    const published = await manager.toPublished()
                    console.info('tile id: ', published.tiles)
                    console.info('schema id: ', published.schemas)
                    console.info('definition id: ', published.definitions)

                    const publishedModel = {
                        schemas: {
                            BasicProfile:
                                'ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio',
                        },
                        definitions: {
                            basicProfile:
                                'kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic',
                        },
                        tiles: {},
                    }
                    const model = new DataModel({
                        ceramic,
                        model: publishedModel,
                    })
                    const dataStore = new DIDDataStore({
                        ceramic,
                        model: publishedModel,
                    })
                    //await dataStore.set('basicProfile', { ...myProfile })
                    const resProfile = await dataStore.get('basicProfile')
                    /* await manager.createTile('basicProfile', myTile, {
                        schema: manager.getSchemaURL(
                            'ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio'
                        ),
                    })*/

                    /*createTile(, {
                        description: 'This is my funny description.',
                        emoji: '🚀',
                    })*/
                    console.group('get res profile')
                    console.table(resProfile)
                    console.groupEnd()
                    if (resProfile) {
                        setUserProfile((prevState) => ({
                            ...prevState,
                            name: resProfile.name,
                            description: resProfile.description,
                            url: resProfile.url,
                        }))
                    }
                }

                console.info('pubkey: ', walletInfo.user.pubKey)

                //const proof = await nearAuthProvider.createLink(did)
                //console.group('proof')
                //console.table(proof)
                //console.groupEnd()
                //const result = await nearAuthProvider.authenticate('msg')
                //console.group('proof result')
                //console.table(result)
                //console.groupEnd()
            } else {
                console.error('index walletState nonAuthenticated')
            }

            //const id =
            //    'did:3:kjzl6cwe1jw146ncjii03eo2l55j7y5yezje9yidufj8bpx7z91jglpdlwj25yk'
            //const id = 'did:key:z6MkvG7ji4ooa5QJqtHZhh5xvUSZiWaDKZP6DLMUw2HnLuhJ'
            //const profile = await core.get('basicProfile', id)
            //console.group('profile')
            //console.table(profile)
            //console.groupEnd()
            //const note = await core.get('myNote')
            //console.group('note')
            //console.table(note)
            //console.groupEnd()
            setIsLoading(false)
        }
        getProfile()
    }, [walletInfo.t])

    const handleChange = () => {}
    return (
        <Fragment>
            <Typography gutterBottom>Index page</Typography>
            <Typography gutterBottom variant={'h5'}>
                Wallet
            </Typography>
            <Typography gutterBottom variant={'h6'}>
                user:{' '}
                {walletInfo.t === 'authenticated'
                    ? walletInfo.user.name
                    : 'not-authenticated'}
            </Typography>
            {walletInfo.t === 'authenticated' && (
                <Fragment>
                    {isLoading ? (
                        <Stack direction={'row'} spacing={2}>
                            <CircularProgress size={24} />
                            <Typography gutterBottom variant={'h5'}>
                                Ceramic
                            </Typography>
                        </Stack>
                    ) : (
                        <Typography gutterBottom variant={'h5'}>
                            Ceramic
                        </Typography>
                    )}
                    <Typography>
                        Near AccountId (CAIP2): {userProfile.account}
                    </Typography>
                    <Typography>
                        3ID DID Identifier: {userProfile.did}
                    </Typography>
                    <Divider sx={{ my: 3 }} />
                    <Typography gutterBottom variant={'h6'}>
                        Ceramic Basic profile scheme
                    </Typography>
                    <Stack direction={'row'} spacing={2}>
                        <LoadingButton
                            variant={'outlined'}
                            loading={isLoading}
                            loadingPosition={'start'}
                            startIcon={<SaveIcon />}
                            onClick={handleSubmitProfile}
                        >
                            Set new profile
                        </LoadingButton>
                        <LoadingButton
                            variant={'outlined'}
                            loading={isLoading}
                            loadingPosition={'start'}
                            startIcon={<SaveIcon />}
                            onClick={handleSubmitProfile}
                        >
                            Get profile
                        </LoadingButton>
                    </Stack>
                    <Typography gutterBottom variant={'h6'}>
                        Name: {userProfile.name}
                    </Typography>
                    <TextField
                        id="standard-basic"
                        label="New name"
                        variant="standard"
                        value={cName}
                        onChange={handleNameChange}
                    />
                    <Divider sx={{ my: 3 }} />
                    <Typography gutterBottom variant={'h6'}>
                        Description: {userProfile.description}
                    </Typography>
                    <TextField
                        id="standard-basic"
                        label="New description"
                        variant="standard"
                        value={cDescription}
                        onChange={handleDescriptionChange}
                    />
                    <Divider sx={{ my: 3 }} />
                    <Typography gutterBottom variant={'h6'}>
                        Url: {userProfile.url}
                    </Typography>
                    <TextField
                        id="standard-basic"
                        label="New url"
                        variant="standard"
                        value={cUrl}
                        onChange={handleUrlChange}
                    />
                </Fragment>
            )}
        </Fragment>
    )
}
