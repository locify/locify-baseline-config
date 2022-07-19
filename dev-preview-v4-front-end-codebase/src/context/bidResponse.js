export const getBidResponse = (playerId, price, h, w) => ({
        id: "1",
        cur: "USD",
        seatbid: [getSeadBid(playerId, price, h, w)]
    }
)

const getSeadBid = (playerId, price, h, w) => ({
    seat: playerId,
    bid: [getBid(price, h, w)]
})
const getBid = (price, h, w) => ({
    id: "5ed134b186ca98265293b16c82a7d400",
    impid: "103",
    price,
    adid: "",
    cid: "111074",
    crid: "",
    w,
    h
})