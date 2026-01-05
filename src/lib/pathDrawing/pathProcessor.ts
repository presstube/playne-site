// Path Processing Algorithms
// Pure functions for processing raw path data into smooth, flowing curves

/**
 * Default processing parameters
 */
export const PROCESSING_DEFAULTS = {
  simplifyTolerance: 2,
  resampleSpacing: 60,
  chaikinIterations: 3,
  laplacianIterations: 1
};

/**
 * Process raw points into smooth waypoints
 */
export const processRawPath = (rawPoints: [number, number][], params = PROCESSING_DEFAULTS) => {
  if (rawPoints.length < 2) return rawPoints;
  
  // Step 1: Simplification (RDP algorithm)
  let processed = simplifyPath(rawPoints, params.simplifyTolerance);
  
  // Step 2: Resample for even spacing
  processed = resamplePath(processed, params.resampleSpacing);
  
  // Step 3: Laplacian smoothing
  if (params.laplacianIterations > 0) {
    processed = laplacianSmooth(processed, params.laplacianIterations);
  }
  
  // Step 4: Chaikin's corner cutting
  if (params.chaikinIterations > 0) {
    processed = chaikinSmooth(processed, params.chaikinIterations);
  }
  
  return processed;
};

/**
 * Generate smooth Bézier curves through waypoints
 */
export const generateCurves = (waypoints: [number, number][]) => {
  if (waypoints.length < 2) return { points: waypoints, curves: [] };
  if (waypoints.length === 2) return { points: waypoints, curves: [] };
  
  const curves = [];
  
  // Generate cubic Bézier control points for each segment (Cardinal spline)
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p0 = waypoints[Math.max(0, i - 1)];
    const p1 = waypoints[i];
    const p2 = waypoints[i + 1];
    const p3 = waypoints[Math.min(waypoints.length - 1, i + 2)];
    
    // Cardinal spline formula (tension = 0 for maximum smoothness)
    const t1x = (p2[0] - p0[0]) / 2;
    const t1y = (p2[1] - p0[1]) / 2;
    const t2x = (p3[0] - p1[0]) / 2;
    const t2y = (p3[1] - p1[1]) / 2;
    
    // Control points at 1/3 of segment
    const cp1x = p1[0] + t1x / 3;
    const cp1y = p1[1] + t1y / 3;
    const cp2x = p2[0] - t2x / 3;
    const cp2y = p2[1] - t2y / 3;
    
    curves.push({
      cp1: [cp1x, cp1y],
      cp2: [cp2x, cp2y],
      end: p2
    });
  }
  
  return { points: waypoints, curves };
};

/**
 * Convert curves to SVG path string
 */
export const curvesToSVGPath = (waypoints: [number, number][], curves: any[]) => {
  if (waypoints.length < 2) return '';
  
  let pathData = `M ${waypoints[0][0]} ${waypoints[0][1]}`;
  
  curves.forEach(({ cp1, cp2, end }) => {
    pathData += ` C ${cp1[0]} ${cp1[1]}, ${cp2[0]} ${cp2[1]}, ${end[0]} ${end[1]}`;
  });
  
  return pathData;
};

/**
 * Simplify path using Ramer-Douglas-Peucker algorithm
 * Reduces number of points while maintaining shape
 */
export const simplifyPath = (points: [number, number][], tolerance: number): [number, number][] => {
  if (points.length <= 2) return points;
  
  const sqTolerance = tolerance * tolerance;
  const first = points[0];
  const last = points[points.length - 1];
  
  // Find point with max distance from line between first and last
  let maxDist = 0;
  let maxIndex = 0;
  
  for (let i = 1; i < points.length - 1; i++) {
    const dist = getSquareSegmentDistance(points[i], first, last);
    if (dist > maxDist) {
      maxIndex = i;
      maxDist = dist;
    }
  }
  
  // If max distance > tolerance, split and recurse
  if (maxDist > sqTolerance) {
    const left = simplifyPath(points.slice(0, maxIndex + 1), tolerance);
    const right = simplifyPath(points.slice(maxIndex), tolerance);
    return left.slice(0, -1).concat(right);
  }
  
  return [first, last];
};

/**
 * Resample path to create evenly-spaced waypoints
 */
export const resamplePath = (points: [number, number][], spacing = 50): [number, number][] => {
  if (points.length < 2) return points;
  
  // Calculate total path length
  let totalLength = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalLength += distance(points[i], points[i + 1]);
  }
  
  // If path is too short, return original
  if (totalLength < spacing) return points;
  
  // Calculate how many waypoints we need
  const numPoints = Math.floor(totalLength / spacing);
  const actualSpacing = totalLength / numPoints;
  
  const resampled: [number, number][] = [points[0]]; // Start with first point
  let accumulatedDistance = 0;
  let targetDistance = actualSpacing;
  
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const segmentLength = distance(p1, p2);
    
    while (accumulatedDistance + segmentLength >= targetDistance) {
      // Interpolate point at target distance
      const t = (targetDistance - accumulatedDistance) / segmentLength;
      const x = p1[0] + (p2[0] - p1[0]) * t;
      const y = p1[1] + (p2[1] - p1[1]) * t;
      
      resampled.push([x, y]);
      targetDistance += actualSpacing;
    }
    
    accumulatedDistance += segmentLength;
  }
  
  // Always include the last point
  resampled.push(points[points.length - 1]);
  
  return resampled;
};

/**
 * Chaikin's corner cutting algorithm
 * Makes paths flow more naturally by subdividing and smoothing
 */
export const chaikinSmooth = (points: [number, number][], iterations = 1): [number, number][] => {
  if (points.length < 3) return points;
  
  let smoothed = points;
  
  for (let iter = 0; iter < iterations; iter++) {
    const newPoints: [number, number][] = [];
    
    // Keep first point
    newPoints.push(smoothed[0]);
    
    // For each segment, create two new points at 1/4 and 3/4
    for (let i = 0; i < smoothed.length - 1; i++) {
      const p1 = smoothed[i];
      const p2 = smoothed[i + 1];
      
      // Q point: 1/4 of the way from p1 to p2
      const qx = 0.75 * p1[0] + 0.25 * p2[0];
      const qy = 0.75 * p1[1] + 0.25 * p2[1];
      
      // R point: 3/4 of the way from p1 to p2
      const rx = 0.25 * p1[0] + 0.75 * p2[0];
      const ry = 0.25 * p1[1] + 0.75 * p2[1];
      
      newPoints.push([qx, qy]);
      newPoints.push([rx, ry]);
    }
    
    // Keep last point
    newPoints.push(smoothed[smoothed.length - 1]);
    
    smoothed = newPoints;
  }
  
  return smoothed;
};

/**
 * Laplacian smoothing algorithm
 * Averages each point with its neighbors to relax distribution
 */
export const laplacianSmooth = (points: [number, number][], iterations = 1): [number, number][] => {
  if (points.length < 3) return points;
  
  let smoothed = [...points];
  
  for (let iter = 0; iter < iterations; iter++) {
    const newPoints: [number, number][] = [];
    
    // Keep first point fixed
    newPoints.push(smoothed[0]);
    
    // Average each interior point with neighbors
    for (let i = 1; i < smoothed.length - 1; i++) {
      const prev = smoothed[i - 1];
      const curr = smoothed[i];
      const next = smoothed[i + 1];
      
      const avgX = (prev[0] + curr[0] + next[0]) / 3;
      const avgY = (prev[1] + curr[1] + next[1]) / 3;
      
      newPoints.push([avgX, avgY]);
    }
    
    // Keep last point fixed
    newPoints.push(smoothed[smoothed.length - 1]);
    
    smoothed = newPoints;
  }
  
  return smoothed;
};

// Helper functions

/**
 * Calculate Euclidean distance between two points
 */
const distance = (p1: [number, number], p2: [number, number]) => {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate squared distance from point to line segment
 */
const getSquareSegmentDistance = (p: [number, number], p1: [number, number], p2: [number, number]) => {
  const [x, y] = p;
  let [x1, y1] = p1;
  const [x2, y2] = p2;
  
  let dx = x2 - x1;
  let dy = y2 - y1;
  
  if (dx !== 0 || dy !== 0) {
    const t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
    
    if (t > 1) {
      x1 = x2;
      y1 = y2;
    } else if (t > 0) {
      x1 += dx * t;
      y1 += dy * t;
    }
  }
  
  dx = x - x1;
  dy = y - y1;
  
  return dx * dx + dy * dy;
};

