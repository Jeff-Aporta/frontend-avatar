import{z as o}from"../../base/zod.js?v=zn6b7f";const t=()=>o.custom(e=>typeof e=="function"),p=o.object({registerApp:t(),load:t()}).passthrough();export{p as LoaderAppSchema};
