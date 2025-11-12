// lib/wardrobeCollage.ts - Wardrobe grid collage generator

import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;
const BACKGROUND = { r: 245, g: 245, b: 245 }; // Light gray

/**
 * Generate wardrobe collage based on number of items
 * Adapts layout: 1 item (single), 2 items (side-by-side), 3 items (asymmetric), 4+ items (grid)
 */
export async function generateWardrobeCollage(imageUrls: string[]): Promise<Buffer> {
  if (!imageUrls || imageUrls.length === 0) {
    throw new Error('No images provided for collage');
  }

  // Download all images
  const imageBuffers = await Promise.all(
    imageUrls.map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch image: ${url}`);
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    })
  );

  // Generate layout based on count
  switch (imageBuffers.length) {
    case 1:
      return createSingleLayout(imageBuffers[0]);
    case 2:
      return createTwoItemLayout(imageBuffers);
    case 3:
      return createThreeItemLayout(imageBuffers);
    default:
      // 4 or more items
      return createFourItemLayout(imageBuffers.slice(0, 4));
  }
}

/**
 * Layout 1: Single item (centered, full size)
 * ┌────────────┐
 * │            │
 * │   Image    │
 * │            │
 * └────────────┘
 */
async function createSingleLayout(imageBuffer: Buffer): Promise<Buffer> {
  return sharp(imageBuffer)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 90 })
    .toBuffer();
}

/**
 * Layout 2: Two items (side by side)
 * ┌──────┬──────┐
 * │      │      │
 * │  1   │  2   │
 * │      │      │
 * └──────┴──────┘
 */
async function createTwoItemLayout(imageBuffers: Buffer[]): Promise<Buffer> {
  const cellWidth = WIDTH / 2; // 600px each

  const resizedImages = await Promise.all(
    imageBuffers.slice(0, 2).map((buffer) =>
      sharp(buffer)
        .resize(cellWidth, HEIGHT, { fit: 'cover', position: 'center' })
        .toBuffer()
    )
  );

  return sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 3,
      background: BACKGROUND,
    },
  })
    .composite([
      { input: resizedImages[0], top: 0, left: 0 },
      { input: resizedImages[1], top: 0, left: cellWidth },
    ])
    .jpeg({ quality: 90 })
    .toBuffer();
}

/**
 * Layout 3: Three items (1 large left, 2 small stacked right)
 * ┌────────┬────┐
 * │        │ 2  │
 * │   1    ├────┤
 * │        │ 3  │
 * └────────┴────┘
 */
async function createThreeItemLayout(imageBuffers: Buffer[]): Promise<Buffer> {
  const largeWidth = Math.floor(WIDTH * 0.67); // 800px
  const smallWidth = WIDTH - largeWidth; // 400px
  const smallHeight = HEIGHT / 2; // 315px

  // Resize images
  const large = await sharp(imageBuffers[0])
    .resize(largeWidth, HEIGHT, { fit: 'cover', position: 'center' })
    .toBuffer();

  const small1 = await sharp(imageBuffers[1])
    .resize(smallWidth, smallHeight, { fit: 'cover', position: 'center' })
    .toBuffer();

  const small2 = await sharp(imageBuffers[2])
    .resize(smallWidth, smallHeight, { fit: 'cover', position: 'center' })
    .toBuffer();

  return sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 3,
      background: BACKGROUND,
    },
  })
    .composite([
      { input: large, top: 0, left: 0 },
      { input: small1, top: 0, left: largeWidth },
      { input: small2, top: smallHeight, left: largeWidth },
    ])
    .jpeg({ quality: 90 })
    .toBuffer();
}

/**
 * Layout 4: Four items (2x2 grid)
 * ┌──────┬──────┐
 * │  1   │  2   │
 * ├──────┼──────┤
 * │  3   │  4   │
 * └──────┴──────┘
 */
async function createFourItemLayout(imageBuffers: Buffer[]): Promise<Buffer> {
  const cellWidth = WIDTH / 2; // 600px
  const cellHeight = HEIGHT / 2; // 315px

  const resizedImages = await Promise.all(
    imageBuffers.slice(0, 4).map((buffer) =>
      sharp(buffer)
        .resize(cellWidth, cellHeight, { fit: 'cover', position: 'center' })
        .toBuffer()
    )
  );

  return sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 3,
      background: BACKGROUND,
    },
  })
    .composite([
      { input: resizedImages[0], top: 0, left: 0 },
      { input: resizedImages[1], top: 0, left: cellWidth },
      { input: resizedImages[2], top: cellHeight, left: 0 },
      { input: resizedImages[3], top: cellHeight, left: cellWidth },
    ])
    .jpeg({ quality: 90 })
    .toBuffer();
}
