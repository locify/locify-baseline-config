const RTBMessageTemplate = {
  id: "a9b0bab2-af4f-11ec-b909-0242ac120002",
  implementation: [
    {
      tagId: "30b5a0c7-2c00-4786-bea4-5ad0549c1e18",
      bidValueFloor: 0.000001,
      bidFloorCur: "NEAR",
      native: {
        request: {
          assets: [
            { id: 1, required: 1, displayTitle: { len: 110 } },
            { id: 2, data: { type: 12, len: 15 } },
            { id: 3, required: 1, data: { type: 1, len: 25 } },
            {
              id: 4,
              required: 1,
              img: { type: 3, minWidth: 450, minHeight: 300 },
            },
          ],
        },
        apiVersion: [1, 2],
      },
      metric: [
        {
          type: "click_through_rate",
          value: 0.0005,
          vendor: "EXCHANGE",
        },
        {
          type: "viewability",
          value: 0.0096,
          vendor: "EXCHANGE",
        },
      ],
      ext: {
        customerBillingId: [56982500334],
        publisherSettingsListId: [3976073795055368263, 2078553529105944732],
        allowedVendorType: [GAMING, EDUCATION],

        excluded_creatives: [
          {
            buyer_creative_id: "EXCLUDED_BUYER_CREATIVE_ID",
          },
          {
            buyer_creative_id: "EXCLUDED_BUYER_CREATIVE_ID",
          },
        ],
        allowed_restricted_category: [33],
        creative_enforcement_settings: {
          policy_enforcement: 2,
          publisher_blocks_enforcement: 1,
          is_default: true,
        },
      },
    },
  ],
  site: {
    page: "https://www.locify.com",
    publisher: {
      id: "9be28175-5536-481c-ac42-9476d7ba6869",
      ext: {
        country: "DK",
      },
    },
    content: {
      livestream: 0,
      language: "en",
    },
    mobile: 1,
    ext: {
      amp: 0,
      page_visibility: 1,
    },
  },
  device: {
    ua: "Mozilla/5.0 AppleWebKit/605.1.15 (KHTML, like Gecko)",
    ip: "192.168.1.0",
    geo: {
      lat: 0.0,
      lon: 0.0,
      country: "IN",
      region: "IN-GJ",
      city: "Dubai",
      zip: "1234",
      type: 2,
      accuracy: 2465,
    },
    make: "samsung",
    model: "android",
    os: "android",
    osv: "10.6",
    devicetype: 4,
    lmt: 0,
    w: 375,
    h: 812,
    pxratio: 3,
    ext: {
      user_agent_data: {
        platform: {
          brand: "android",
          version: ["10", "6"],
        },
        mobile: true,
      },
    },
  },
  user: {
    ext: {
      consented_providers_settings: {
        additional_consent: "",
      },
      consent: "OMITTED",
    },
  },
  at: 1,
  timeMs: 600,
  cur: ["NEAR"],
  blockedCategory: ["IAB7-41", "IAB7-15"],
  regs: {
    ext: {
      gdpr: true,
    },
  },
  source: {
    ext: {
      schain: {
        complete: 0,
        nodes: [
          {
            asi: "locify.com",
            sid: "pub-3605257360853185",
            hp: 1,
          },
        ],
        ver: "1.0",
      },
    },
  },
  ext: {
    locify_query_id: "61cd4681-4754-4d45-aa52-4b5b617f3b36",
  },
};
