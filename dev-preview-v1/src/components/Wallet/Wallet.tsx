import React, { useEffect } from 'react'
// @ts-ignore
import near from '@src/lib/near'

import { Logger } from 'aws-amplify'
import { useSetRecoilState } from 'recoil'
import { walletState, WalletT } from '@src/store/walletState'

const logger = new Logger('useWallet')

type props = {
    children: React.ReactNode
}

export const Wallet = ({ children }: props) => {
    const setWalletState = useSetRecoilState<WalletT>(walletState)

    useEffect(() => {
        const init = async () => {
            await near.init()
            if (near) {
                if (near.isLoggedIn()) {
                    const account = near.getAccount()
                    //console.info('loggedIn')
                    setWalletState({
                        t: 'authenticated',
                        user: {
                            name: near.getAccount().accountId,
                            balance: near.getAccount().balance,
                            pubKey: near.pubKey,
                        },
                    })
                    logger.info(account)
                    //console.info('nKey: ', nKey)
                } else {
                    console.info('wallet out')
                    setWalletState({ t: 'nonAuthenticated' })
                }
            }
        }
        init()
    }, [])

    return <>{children}</>
}
