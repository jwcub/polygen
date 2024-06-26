import { Gm } from "../gm/gm";
import type { Pos } from "../gm/matrix";
import type { Palette } from "../gm/palette";

import BaseRenderer from "./baseRenderer";

/**
 * Full-featured renderer with mode support and interaction.
 */
export default class Renderer extends BaseRenderer {
  constructor(gm: Gm, palette: Palette) {
    super(gm, palette);
  }

  shape([i, j]: Pos) {
    switch (this.gm.mode) {
      case Gm.Mode.Hexagon: {
        return [
          { x: 0.5, y: 0 },
          { x: 1.5, y: 0 },
          { x: 2, y: Math.sqrt(3) / 2 },
          { x: 1.5, y: Math.sqrt(3) },
          { x: 0.5, y: Math.sqrt(3) },
          { x: 0, y: Math.sqrt(3) / 2 }
        ];
      }
      case Gm.Mode.Square: {
        return [
          { x: 0, y: 0 },
          { x: Math.sqrt(2), y: 0 },
          { x: Math.sqrt(2), y: Math.sqrt(2) },
          { x: 0, y: Math.sqrt(2) }
        ];
      }
      case Gm.Mode.Triangle: {
        return (i + j) % 2 === 0
          ? [
              { x: Math.sqrt(3) / 2, y: 0 },
              { x: Math.sqrt(3), y: 1.5 },
              { x: 0, y: 1.5 }
            ]
          : [
              { x: 0, y: 0 },
              { x: Math.sqrt(3), y: 0 },
              { x: Math.sqrt(3) / 2, y: 1.5 }
            ];
      }
    }
  }

  topLeft([i, j]: Pos) {
    switch (this.gm.mode) {
      case Gm.Mode.Hexagon: {
        return {
          x: (j - 1) * 1.5,
          y:
            j % 2 === 0
              ? Math.sqrt(3) / 2 + (i - 1) * Math.sqrt(3)
              : (i - 1) * Math.sqrt(3)
        };
      }
      case Gm.Mode.Square: {
        return {
          x: (j - 1) * Math.sqrt(2),
          y: (i - 1) * Math.sqrt(2)
        };
      }
      case Gm.Mode.Triangle: {
        return {
          x: (Math.sqrt(3) / 2) * (j - 1),
          y: 1.5 * (i - 1)
        };
      }
    }
  }

  center([i, j]: Pos) {
    switch (this.gm.mode) {
      case Gm.Mode.Hexagon: {
        return {
          x: 1 + 1.5 * (j - 1),
          y: j % 2 === 0 ? Math.sqrt(3) * i : Math.sqrt(3) * (i - 0.5)
        };
      }
      case Gm.Mode.Square: {
        return {
          x: Math.sqrt(2) * (j - 0.5),
          y: Math.sqrt(2) * (i - 0.5)
        };
      }
      case Gm.Mode.Triangle: {
        return {
          x: (Math.sqrt(3) / 2) * j,
          y: 1.5 * (i - 1) + ((i + j) % 2 === 0 ? 1 : 0.5)
        };
      }
    }
  }

  maxTextWidth() {
    switch (this.gm.mode) {
      case Gm.Mode.Hexagon: {
        return 1.8;
      }
      case Gm.Mode.Square: {
        return Math.sqrt(2);
      }
      case Gm.Mode.Triangle: {
        return Math.sqrt(3) / 2;
      }
    }
  }

  maxImageSize() {
    switch (this.gm.mode) {
      case Gm.Mode.Hexagon: {
        return 1.26;
      }
      case Gm.Mode.Square: {
        return 1.1;
      }
      case Gm.Mode.Triangle: {
        return 0.8;
      }
    }
  }
}
