/**
 * public/assets/leaf_.svg, cropped to the leaf itself.
 *
 * Two things about this file matter:
 *
 * 1. It declares `preserveAspectRatio="none"`, which means it has NO intrinsic
 *    aspect ratio. Give an <img> only a width and the browser falls back to a
 *    150px height and squashes the artwork into a sliver. Both dimensions have
 *    to be set explicitly, in the viewBox ratio (2048:1657), to see it properly.
 * 2. Drawn correctly it is a full leaf at 1.09:1, sitting inside a canvas with a
 *    small margin - measured off the rendered alpha:
 *
 *      left 9.0%   top 3.1%   width 85.0%   height 96.7%
 *
 * So this oversizes the image, sets both dimensions, and shifts the margins out
 * of view. The result is a box that is exactly the leaf. The browser fetches and
 * decodes the file once however many of these are on screen.
 */
const LEFT = 0.09;
const TOP = 0.031;
const VIS_W = 0.85;
const VIS_H = 0.967;
const CANVAS_RATIO = 2048 / 1657;      // 1.236 - the viewBox
/** height of the visible leaf as a fraction of its width */
export const LEAF_RATIO = (VIS_H / CANVAS_RATIO) / VIS_W;   // ~0.92

export default function RealLeaf({
  width,
  tint,
  className,
  style,
}: {
  width: number;
  /** static per-leaf colour shift, so a field of them is not all one green */
  tint?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const height = width * LEAF_RATIO;
  const imgW = width / VIS_W;
  const imgH = imgW / CANVAS_RATIO;

  return (
    <div
      className={className}
      style={{ width, height, position: "relative", overflow: "hidden", ...style }}
      aria-hidden="true"
    >
      <img
        src="/assets/leaf_.svg"
        alt=""
        draggable={false}
        width={imgW}
        height={imgH}
        style={{
          position: "absolute",
          width: imgW,
          height: imgH,          /* both set, or the art gets squashed */
          maxWidth: "none",
          left: -LEFT * imgW,
          top: -TOP * imgH,
          filter: tint,
        }}
      />
    </div>
  );
}
