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

    this._addGraphicsToViewer([graphic]);
  }

  addMany(graphics) {
    this.graphics = [...this.graphics, ...graphics];
    this._setEntities(graphics);

    this._addGraphicsToViewer([graphics]);
  }

  remove(graphic) {
    if(!graphic){
      return;
    }
    const graphics = this.graphics;
    const index = graphics.indexOf(graphic);
    if (index !== -1) {
      const entities = this._entities;
      const graphicEntities = graphic._entities;
      for (let j = 0, len = entities.length; j < len; j++) {
        const index2 = entities.indexOf(graphicEntities[j]);
        if (index2 !== -1) {
          entities.splice(index2, 1);
          this._viewer.entities.remove(graphicEntities[j]);
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
      this._viewer.entities.remove(entities[i]);
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

  _addGraphicsToViewer(graphics) {
    for (let i = 0, len = graphics.length; i < len; i++) {
      const entities = graphics[i]._entities;
      for (let j = 0, len2 = entities.length; j < len2; j++) {
        this._viewer.entities.add(entities[j]);
      }
    }
  }
}

export default GraphicsLayer;
