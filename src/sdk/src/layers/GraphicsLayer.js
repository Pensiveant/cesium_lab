import Layer from "./Layer.js";

class GraphicsLayer extends Layer {
  constructor(options) {
    super(options);
    this.type = "graphics";
    this.graphics = [];
    this._viewer = undefined;
    this._entities = [];
  }

  add(graphic) {
    this.graphics.push(graphic);
    this._setEntities([graphic]);
  }

  addMany(graphics) {
    this.graphics = [...this.graphics, ...graphics];
    this._setEntities(graphics);
  }

  remove(graphic) {
    const graphics = this.graphics;
    const index = graphics.indexOf(graphic);
    if (index !== -1) {
      const entities = this._entities;
      const graphicEntities = graphics._entities;
      for (let j = 0, len = entities.length; j < len; j++) {
        const index2 = entities.indexOf(graphicEntities[i]);
        if (index2 !== -1) {
          entities.splice(index2, 1);
        }
      }
      graphics.splice(index, 1);
    }
  }

  removeMany(graphics) {
    for (let i = 0, len = graphics.length; i < len; i++) {
      const item = graphics[i];
      this.remove(item);
    }
  }

  removeAll() {
    const entities = this._entities;
    for (let i = 0, len = entities.length; i < len; i++) {
      viewer.entities.remove(entities[i]);
    }

    this.graphics = [];
    this._entities = [];
  }

  zoomTo() {
    this._viewer.flyTo(this._entities);
  }

  destroy() {
    this.removeAll();
  }

  _addDataToViewer(viewer) {
    const entities = this._entities;
    for (let i = 0, len = entities.length; i < len; i++) {
      viewer.entities.add(entities[i]);
    }
  }

  _setEntities(graphics) {
    for (let i = 0, len = graphics.length; i < len; i++) {
      const entities = graphics[i]._entities;
      this._entities = [...this._entities, ...entities];
    }
  }
}

export default GraphicsLayer;
