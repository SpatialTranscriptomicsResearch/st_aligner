/* eslint-disable import/prefer-default-export */
export const MAX_CACHE_SIZE = 104857600;
export const MAX_THREADS = 4;

export const WORKER_PATH = 'worker.js';

// Options for the aligner
export const ROT_POINT_COLOR = 'rgba(100, 100, 255, 1.0)';
export const ROT_POINT_RADIUS = 128;

// Options for the calibrator
export const CALIBRATOR_LINE_COL_DEF = 'hsla(0, 0%, 100%, 0.6)';
export const CALIBRATOR_LINE_COL_HLT = 'hsla(0, 0%, 100%, 1.0)';
export const CALIBRATOR_LINE_DASH    = [0.002, 0.001];
export const CALIBRATOR_LINE_WGHT    = 0.0015;
export const CALIBRATOR_CORNER_COL   = CALIBRATOR_LINE_COL_HLT;
export const CALIBRATOR_CORNER_WGHT  = 1.2 * CALIBRATOR_LINE_WGHT;

// Options for spot rendering
export const SPOT_COL_DEF = 'hsl(  6, 78%, 57%)';
export const SPOT_COL_HLT = 'hsl(140, 63%, 42%)';
export const SPOT_OPACITY = '0.5';
