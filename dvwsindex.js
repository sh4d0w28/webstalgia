var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
const { default: LogPong } = require('./logpong');

module.exports = Event.extend(function Base(container, config) {
  this.config = {
    theme: {}
  }
  this.container = $(container);           
  this.apis = config.apis;                 
  this._data = null;                       
  this.canvas = null;                       
  this.longpong = null;
  this.init(config);
}, {
  init: function (config) {
    this.mergeConfig(config);
    this.updateLayout();
    this.container.html("<canvas id='cnvs' style='width:100%;height:100%'></canvas>");
    this.canvas = document.getElementById('cnvs');

    this.longpong = new LogPong();
    this.updateStyle();
  },
  render: function (data, config) {
    console.log('render');
    data = this.data(data);
    var cfg = this.mergeConfig(config);
    
    if(this.canvas.width != this.canvas.clientWidth) {
      this.canvas.width = this.canvas.clientWidth;
    } 
    if(this.canvas.height != this.canvas.clientHeight) {
      this.canvas.height = this.canvas.clientHeight
    }

    this.ctx = this.canvas.getContext('2d');
    
    this.longpong.sourceData = data;

    this.longpong.render(this.ctx, this.longpong);

    this.updateStyle();
  },

  resize: function (width, height) {
    console.log('resize');
    this.updateLayout(width, height);
   
    if(this.canvas.width != width) {
      this.canvas.width = width;
    } 
    if(this.canvas.height != height) {
      this.canvas.height = height
    }

    this.longpong.WIDTH = width; 
  },
  setColors: function () {
    
  },
  data: function (data) {
    if (data) {
      this._data = data;
    }
    return this._data;
  },
  mergeConfig: function (config) {
    if (!config) {return this.config}
    this.config.theme = _.defaultsDeep(config.theme || {}, this.config.theme);
    this.setColors();
    this.config = _.defaultsDeep(config || {}, this.config);
    return this.config;
  },
  updateLayout: function (width, height) {
    console.log('update layout');
  },
  updateStyle: function () {
    var cfg = this.config;
    this.container.css({
      'font-size': cfg.size + 'px',
      'color': cfg.color || '#fff'
    });
  },
   destroy: function(){console.log('请实现 destroy 方法')}
});
