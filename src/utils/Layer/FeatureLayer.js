/**
 * @Description:
 * @Author: Pensiveant
 * @Date: 2023-05-25 14:36:32
 */

class FeatureLayer {
  constructor(viewer) {
    this.viewer = viewer;
    this._entities = [];
    this._primitives = [];
    this._dataSource = [];
  }

  /**
   * 添加实体
   * @param {*} entity
   * @returns
   */
  addEntity(entity) {
    let item = this.viewer.entities.add(entity);
    this._entities.push(item);
    return item;
  }

  addDatasource(item) {
    this.viewer.dataSources.add(item);
    this._dataSource.push(item);
    return item;
  }


  /**
   * 移除图层上所有元素
   */
  removeAll() {
    for (let i = this._entities.length - 1; i > -1; i--) {
      this.viewer.entities.remove(this._entities[i]);
    }
  }

  destroy() {
    this.removeAll();
  }
}

export default FeatureLayer;
