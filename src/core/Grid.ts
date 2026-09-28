import type { Point, Rect } from './types';

export class Grid {
  public static readonly STEP = 20;

  public panX: number = 60;
  public panY: number = 60;
  public zoom: number = 1.0;

  public static snap(value: number): number {
    return Math.round(value / Grid.STEP) * Grid.STEP;
  }

  public static snapPoint(p: Point): Point {
    return {
      x: Grid.snap(p.x),
      y: Grid.snap(p.y),
    };
  }

  public screenToWorld(sx: number, sy: number): Point {
    return {
      x: (sx - this.panX) / this.zoom,
      y: (sy - this.panY) / this.zoom,
    };
  }

  public worldToScreen(wx: number, wy: number): Point {
    return {
      x: wx * this.zoom + this.panX,
      y: wy * this.zoom + this.panY,
    };
  }

  public static pointsEqual(p1: Point, p2: Point, tolerance: number = 2): boolean {
    return Math.abs(p1.x - p2.x) <= tolerance && Math.abs(p1.y - p2.y) <= tolerance;
  }

  public static pointToSegmentDistance(p: Point, a: Point, b: Point): number {
    const l2 = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
    if (l2 === 0) return Math.hypot(p.x - a.x, p.y - a.y);
    let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = a.x + t * (b.x - a.x);
    const projY = a.y + t * (b.y - a.y);
    return Math.hypot(p.x - projX, p.y - projY);
  }

  public static distance(p1: Point, p2: Point): number {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
  }

  public static rectContainsPoint(rect: Rect, p: Point): boolean {
    return (
      p.x >= rect.x &&
      p.x <= rect.x + rect.width &&
      p.y >= rect.y &&
      p.y <= rect.y + rect.height
    );
  }

  public static rectContainsRect(outer: Rect, inner: Rect): boolean {
    return (
      inner.x >= outer.x &&
      inner.x + inner.width <= outer.x + outer.width &&
      inner.y >= outer.y &&
      inner.y + inner.height <= outer.y + outer.height
    );
  }

  public static rectIntersectsRect(r1: Rect, r2: Rect): boolean {
    return (
      r1.x <= r2.x + r2.width &&
      r1.x + r1.width >= r2.x &&
      r1.y <= r2.y + r2.height &&
      r1.y + r1.height >= r2.y
    );
  }

  public static segmentsIntersect(a: Point, b: Point, c: Point, d: Point): boolean {
    const ccw = (p1: Point, p2: Point, p3: Point) =>
      (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
    return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
  }

  public static segmentIntersectsRect(p1: Point, p2: Point, rect: Rect): boolean {
    if (Grid.rectContainsPoint(rect, p1) || Grid.rectContainsPoint(rect, p2)) {
      return true;
    }
    const tl = { x: rect.x, y: rect.y };
    const tr = { x: rect.x + rect.width, y: rect.y };
    const br = { x: rect.x + rect.width, y: rect.y + rect.height };
    const bl = { x: rect.x, y: rect.y + rect.height };

    return (
      Grid.segmentsIntersect(p1, p2, tl, tr) ||
      Grid.segmentsIntersect(p1, p2, tr, br) ||
      Grid.segmentsIntersect(p1, p2, br, bl) ||
      Grid.segmentsIntersect(p1, p2, bl, tl)
    );
  }
}
