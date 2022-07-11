export const getBidResponse = (playerId: string, price: string, h: string, w: string): any => ({
        id: "1",
        cur: "USD",
        seatbid: [getSeadBid(playerId, price, h, w)]
    }
)

const getSeadBid = (playerId: string, price: string, h, w): any => ({
    seat: playerId,
    bid: [getBid(price, h, w)]
})
const getBid = (price: string, h: string, w: string): any => ({
    id: "5ed134b186ca98265293b16c82a7d400",
    impid: "103",
    price,
    adid: "",
    cid: "111074",
    crid: "",
    w,
    h
})