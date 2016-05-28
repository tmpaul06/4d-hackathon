import DataStore from "../../DataStore";

function createMountain(ctx, width, height, color, N) {
  // Draw three mountains of varying height
  ctx.beginPath();
  ctx.moveTo(0, height);
  let w = width / N;
  for (let i = 0; i < N; i++) {
    ctx.lineTo(i * w + w / 2, 40 + N * 20);
    ctx.lineTo(i * w + w, i * height / N);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

export default class MountainLayer {
  constructor(id) {
    this.id = id;
    this.visible = false;
    this.shapes = [];
  }

  render(ctx, t) {
    if (this.visible) {
      createMountain(ctx, DataStore.cache.global.WIDTH * 2, DataStore.cache.global.HEIGHT * 1.5, "#aa9f83", 11);
      createMountain(ctx, DataStore.cache.global.WIDTH, DataStore.cache.global.HEIGHT * 1.2, "#a69082", 10);
      createMountain(ctx, DataStore.cache.global.WIDTH * 0.7, DataStore.cache.global.HEIGHT, "#61524f", 10);
    }
  }
};