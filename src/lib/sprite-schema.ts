import { z } from "zod";

export const spriteKinds = ["character", "object"] as const;
export const spriteStatuses = ["outline", "in-progress", "final"] as const;
export const spriteDirections = ["down", "right", "up", "left"] as const;

export const paletteSwatchSchema = z.object({
  name: z.string().min(1),
  color: z
    .string()
    .regex(
      /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/,
      "Expected #RRGGBB or #RRGGBBAA",
    )
    .nullable(),
});

export const frameSchema = z.object({
  pixels: z.array(z.string().min(1)).min(1),
});

export const animationDirectionsSchema = z
  .object({
    down: z.array(z.string().min(1)).min(1).optional(),
    right: z.array(z.string().min(1)).min(1).optional(),
    up: z.array(z.string().min(1)).min(1).optional(),
    left: z.array(z.string().min(1)).min(1).optional(),
  })
  .refine(
    (value) =>
      Object.values(value).some((frames) => frames && frames.length > 0),
    {
      message: "Animation needs at least one direction",
    },
  );

export const animationSchema = z.object({
  id: z.string().min(1),
  frameMs: z.number().int().positive(),
  directions: animationDirectionsSchema,
});

export const spriteSchema = z
  .object({
    $schema: z.string().optional(),
    schemaVersion: z.literal(1),
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id must be kebab-case"),
    name: z.string().min(1),
    kind: z.enum(spriteKinds),
    status: z.enum(spriteStatuses),
    description: z.string().min(1),
    tags: z.array(z.string().min(1)).default([]),
    canvas: z.object({
      width: z.number().int().positive(),
      height: z.number().int().positive(),
    }),
    pivot: z.object({
      x: z.number().int().nonnegative(),
      y: z.number().int().nonnegative(),
    }),
    palette: z
      .record(z.string().length(1), paletteSwatchSchema)
      .refine((palette) => "." in palette, {
        message: 'palette must include "." for empty pixels',
      }),
    frames: z.record(z.string().min(1), frameSchema),
    animations: z.array(animationSchema).min(1),
  })
  .superRefine((sprite, ctx) => {
    const emptyChar = ".";
    const paletteKeys = new Set(Object.keys(sprite.palette));

    for (const [frameId, frame] of Object.entries(sprite.frames)) {
      if (frame.pixels.length !== sprite.canvas.height) {
        ctx.addIssue({
          code: "custom",
          path: ["frames", frameId, "pixels"],
          message: `expected ${sprite.canvas.height} rows, found ${frame.pixels.length}`,
        });
      }

      frame.pixels.forEach((row, rowIndex) => {
        if (row.length !== sprite.canvas.width) {
          ctx.addIssue({
            code: "custom",
            path: ["frames", frameId, "pixels", rowIndex],
            message: `expected ${sprite.canvas.width} columns, found ${row.length}`,
          });
        }

        for (const cell of row) {
          if (!paletteKeys.has(cell)) {
            ctx.addIssue({
              code: "custom",
              path: ["frames", frameId, "pixels", rowIndex],
              message: `unknown palette key "${cell}"`,
            });
            break;
          }
        }
      });
    }

    if (sprite.pivot.x > sprite.canvas.width) {
      ctx.addIssue({
        code: "custom",
        path: ["pivot", "x"],
        message: "pivot.x is outside the canvas",
      });
    }

    if (sprite.pivot.y > sprite.canvas.height) {
      ctx.addIssue({
        code: "custom",
        path: ["pivot", "y"],
        message: "pivot.y is outside the canvas",
      });
    }

    if (sprite.palette[emptyChar]?.color !== null) {
      ctx.addIssue({
        code: "custom",
        path: ["palette", emptyChar, "color"],
        message: 'the empty palette key "." must use color: null',
      });
    }

    for (const [animationIndex, animation] of sprite.animations.entries()) {
      for (const [direction, frameIds] of Object.entries(
        animation.directions,
      )) {
        if (!frameIds) {
          continue;
        }

        frameIds.forEach((frameId, frameIndex) => {
          if (!(frameId in sprite.frames)) {
            ctx.addIssue({
              code: "custom",
              path: [
                "animations",
                animationIndex,
                "directions",
                direction,
                frameIndex,
              ],
              message: `unknown frame "${frameId}"`,
            });
          }
        });
      }
    }
  });

export type SpriteKind = (typeof spriteKinds)[number];
export type SpriteStatus = (typeof spriteStatuses)[number];
export type SpriteDirection = (typeof spriteDirections)[number];
export type SpriteDocument = z.infer<typeof spriteSchema>;

export const kindFolder: Record<SpriteKind, string> = {
  character: "characters",
  object: "objects",
};

export function emptyGrid(width: number, height: number): string[] {
  return Array.from({ length: height }, () => ".".repeat(width));
}
