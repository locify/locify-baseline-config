#### Add banner<br/>

add banner object input format:

```js
{
    account: string; // account owner
    banner_uuid: string; // banner UUID
    is_active:    string; // is_active - flag (not use now)
    banner_subscription_charge:    string; // subscription cost
    banner_page_url:    string; // url of the banner
    banner_width: string; // width of the banner
    banner_height:    string;// height of the banner
}
```

#### View all saved banners<br/>

input format:
{} - empty object

```js
all_banner()
```

response: empty string or banners array

```js
    [{
    account: string, // account owner
    banner_uuid: string, // banner UUID 
    is_active: string, // is_active - flag (not use now)
    banner_subscription_charge: string, // subscription cost 
    banner_page_url: string, // url of the banner 
    banner_width: string, // width of the banner 
    banner_height: string,// height of the banner
}]
```

#### View banner by UUID<br/>

input format:
{ banner_uuid: string }

```js
get_banner({banner_uuid: 'xxx'})
```

response: empty string or banner object

```js
{
    account: string; // account owner
    banner_uuid: string; // banner UUID 
    is_active: string; // is_active - flag (not use now)
    banner_subscription_charge: string; // subscription cost 
    banner_page_url: string; // url of the banner 
    banner_width: string; // width of the banner 
    banner_height: string; // height of the banner
}
```

#### Add advertisement<br/>

add advertisement object input format:

```js
{
    account: AccountId; // account owner
    adv_uuid: String; // adv UUID
    is_active: String; // flag (not use now)
    banner_uuid: String; // reference to banner UUID
    adv_image_url: String; // adv image link
    adv_forwarding_url: String; // adv forward link
    remaining_hit_count: String; // adv click count
}
```

#### View all saved advertisements<br/>

input format: {} - empty object

```js
all_advs()
```

```js
    [{
    account: AccountId, // account owner
    adv_uuid: String, // adv UUID
    is_active: String, // flag (not use now)
    banner_uuid: String, // reference to banner UUID
    adv_image_url: String, // adv image link
    adv_forwarding_url: String, // adv forward link
    remaining_hit_count: String, // adv click count
}]
```

#### View saved advertisement by UUID<br/>

input format:

```js
{
    adv_uuid: string; // advertisement uuid
}
```

```js
get_advs({adv_uuid: 'xxx'})
```

response: empty string or advertisement object

```js
{
    account: AccountId; // account owner
    adv_uuid: String; // adv UUID
    is_active: String; // flag (not use now)
    banner_uuid: String; // reference to banner UUID
    adv_image_url: String; // adv image link
    adv_forwarding_url: String; // adv forward link
    remaining_hit_count: String; // adv click count
}
```

#### View advertisement by banner UUID<br/>

input format: {banned_uuid: string}

```js
get_adv_by_banner({banner_uudi: 'xxx'})
```

response: empty string or advertisement object

```js
{
    account: AccountId; // account owner
    adv_uuid: String; // adv UUID
    is_active: String; // flag (not use now)
    banner_uuid: String; // reference to banner UUID
    adv_image_url: String; // adv image link
    adv_forwarding_url: String; // adv forward link
    remaining_hit_count: String; // adv click count
}
```

#### Click on banner

decrease hit count on advertisement<br/>
input format:
{adv_uuid: string}

```js
on_adv_click({adv_uuid: 'xxx'})
```

response: none
