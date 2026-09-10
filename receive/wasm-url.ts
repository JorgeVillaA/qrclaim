// Served builds fetch the decoder wasm (qrclaim-codec — QR-only plus the
// tracked fast path, see ../vendor/qrclaim-codec) as a
// separate asset, which the service worker precaches. Standalone builds swap
// this for wasm-url.inline.ts.
import wasmUrl from "../vendor/qrclaim-codec/qrclaim_codec.wasm?url";

export default wasmUrl;
