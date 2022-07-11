export type Player = {
    id: string,
    linked_account: string,
    status: string,
    balance: string,
}

export type Auction = {
    auction_id: string,
    winner: any,
    sell_price: number,
    highest_bid: number,
    start_at: any,
    end_at: any,
    bid_request: any,
    bid_responses: any,
}