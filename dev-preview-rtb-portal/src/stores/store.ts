import {writable} from 'svelte/store';

export const adname = writable<string>('adname');
export const bidprice = writable<number>(0);
export const cryptotype = writable<string>('NEAR');
export const filename = writable<string>('filename');
export const tagname = writable<string>('tagname');
export const title = writable<string>('title');
export const pname = writable<string>('pname');
export const gaming = writable<string>('gaming');
export const tmpl = writable<string>('Video Ads');
