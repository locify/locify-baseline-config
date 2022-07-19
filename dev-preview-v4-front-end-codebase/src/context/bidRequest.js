export const getBidRequest = (id, publisherId, bidfloor, h, w) => ({
        id,
        source: getSource(),
        imp: [getImp(bidfloor, h, w)],
        site: getSite(publisherId)
    }
)

const getSource = () => ({
    fd: "0",
    sourcetype: "2",
    tid: ""
})

const getImp = (bidfloor, h, w) => ({
    id: "55",
    tagid: "215876-55",
    instl: "0",
    secure: "1",
    bidfloor,
    bidfloorcur: "USD",
    banner: {
        format: [
            {
                h,
                w
            }
        ]
    },
    ext: {
        unmoderated: "0"
    },
})

const getSite = (publisherId) => ({
    id: "215876",
    page: "https://banners.adfox.ru/201208/adfox/1300062/2b9df8c5d7bd3400f1c1702953801bc8_index.html",
    domain: "example.com",
    publisher: {
        "id": publisherId
    },
    content: {
        "language": "us"
    }
})