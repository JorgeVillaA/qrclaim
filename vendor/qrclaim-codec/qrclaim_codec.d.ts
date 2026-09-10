// Hand-written types for the qrclaim-codec build (embind API). Source of
// truth: ../../../qrclaim-codec/wrapper/qrclaim_codec.cpp — keep in step.

export interface QRClaimPoint {
  x: number;
  y: number;
}

export interface QRClaimQuad {
  topLeft: QRClaimPoint;
  topRight: QRClaimPoint;
  bottomRight: QRClaimPoint;
  bottomLeft: QRClaimPoint;
}

export interface QRClaimResult {
  valid: boolean;
  error: string;
  bytes: Uint8Array;
  position: QRClaimQuad;
  /** Symbol dimension in modules (17 + 4·version); 0 when unknown. */
  modules: number;
}

export interface QRClaimResultVector {
  size(): number;
  get(index: number): QRClaimResult;
  delete(): void;
}

export interface QRClaimModule {
  _malloc(bytes: number): number;
  _free(ptr: number): void;
  HEAPU8: Uint8Array;
  /** Codec version (qrclaim-codec package.json at build time), e.g. "0.1.0". */
  version(): string;
  /** Build id: git short hash, "-dirty" when built from an uncommitted tree. */
  build(): string;
  readFull(
    ptr: number,
    width: number,
    height: number,
    tryHarder: boolean,
    maxSymbols: number,
    returnErrors: boolean,
  ): QRClaimResultVector;
  readTracked(
    ptr: number,
    width: number,
    height: number,
    dim: number,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
  ): QRClaimResult;
  /** Debug: the raw sampled module grid for a quad — dim×dim row-major 0/1,
   *  or null when binarization or sampling fails. */
  trackedMatrix(
    ptr: number,
    width: number,
    height: number,
    dim: number,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
  ): Uint8Array | null;
  /** Debug: project one module-space point through the tracked transform. */
  projectPoint(
    dim: number,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    mx: number,
    my: number,
  ): { x: number; y: number; valid: boolean };
  /** Debug: one row of the binarized matrix, 0/1 per pixel, or null. */
  binarizedRow(ptr: number, width: number, height: number, y: number): Uint8Array | null;
}

export default function QRClaimCodec(options?: {
  locateFile?: (path: string, prefix: string) => string;
  instantiateWasm?: (
    imports: WebAssembly.Imports,
    done: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void,
  ) => object;
}): Promise<QRClaimModule>;
