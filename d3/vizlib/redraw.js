
var redraw = (function() {

  /****************************************************************************
   *  private variables
   ****************************************************************************/
  // queue of functions to update the canvas
  var _q = [];
  var _intervalID = null;
  var _idPrefix = 'elem_';
  var _callbacks = new Array();
  var _playpause = false; // true = play, false = pause


  /****************************************************************************
   *  private methods
   ****************************************************************************/

  /**
   * Toggle play/pause
   */
  function _play() {
    _intervalID = null;
    var f = _step();
    if (f) {
      _intervalID = setTimeout(_play, f.duration);
    } else {
      _playpause = false;
    }
  }

  /**
   * Execute the next visualization step.
   */
  function _step() {
    while (_q.length > 0 && !(_q[0].isRedraw)) {
      _q.shift()();
    }
    if (_q.length > 0) {
      var f = _q.shift();
      f();
      _callbacks.forEach(function(callback) {
        setTimeout(callback, f.duration);
      });
      _callbacks = new Array();
      return f;
    }
    return null;
  }

  /**
   * Update the svg canvas.
   * @param {Object} viz - The visualization object for a specific algorithm.
   * @param {number} dur - Num. of milliseconds to spend updating the canvas.
   */
  function _draw(viz, dur) {

    // draw all rectangles
    var rects = d3.select("#g_rects")
      .selectAll('rect')
      .data(viz.getRects());

    rects.transition().duration(dur)
      .attr('id', function(d) { return _idPrefix + d.getID(); })
      .attr('visibility', function(d) { return d.getVisibility(); })
      .attr('x', function(d) { return d.getPosX(); })
      .attr('y', function(d) { return d.getPosY(); })
      .attr('width', function(d) { return d.getWidth(); })
      .attr('height', function(d) { return d.getHeight(); })
      .attr('stroke', function(d) { return d.getStroke(); })
      .attr('stroke-width', function(d) { return d.getStrokeWidth(); })
      .attr('stroke-opacity', function(d) { return d.getStrokeOpacity(); })
      .attr('fill', function(d) { return d.getFill(); })
      .attr('fill-opacity', function(d) { return d.getFillOpacity(); });

    rects.enter()
      .append('rect')
      .attr('id', function(d) { return _idPrefix + d.getID(); })
      .attr('visibility', function(d) { return d.getVisibility(); })
      .attr('x', function(d) { return d.getSpX(); })
      .attr('y', function(d) { return d.getSpY(); })
      .attr('width', function(d) { return d.getWidth(); })
      .attr('height', function(d) { return d.getHeight(); })
      .attr('fill', function(d) { return d.getFill(); })
      .attr('stroke', function(d) { return d.getStroke(); })
      .attr('stroke-width', function(d) { return d.getStrokeWidth(); })
      .attr('stroke-opacity', function(d) { return d.getStrokeOpacity(); })
      .attr('fill-opacity', function(d) { return d.getFillOpacity(); })
      .transition().duration(dur)
      .attr('id', function(d) { return _idPrefix + d.getID(); })
      .attr('visibility', function(d) { return d.getVisibility(); })
      .attr('fill', function(d) { return d.getFill(); })
      .attr('width', function(d) { return d.getWidth(); })
      .attr('height', function(d) { return d.getHeight(); })
      .attr('stroke', function(d) { return d.getStroke(); })
      .attr('stroke-width', function(d) { return d.getStrokeWidth(); })
      .attr('stroke-opacity', function(d) { return d.getStrokeOpacity(); })
      .attr('x', function(d) { return d.getPosX(); })
      .attr('y', function(d) { return d.getPosY(); })
      .attr('fill-opacity', function(d) { return d.getFillOpacity(); });

    // draw all circles
    var circles = d3.select("#g_circles")
      .selectAll('circle')
      .data(viz.getCircles());

    circles.transition().duration(dur)
      .attr('id', function(d) { return _idPrefix + d.getID(); })
      .attr('visibility', function(d) { return d.getVisibility(); })
      .attr('cx', function(d) { return d.getPosCX(); })
      .attr('cy', function(d) { return d.getPosCY(); })
      .attr('fill', function(d) { return d.getFill(); })
      .attr('fill-opacity', function(d) { return d.getFillOpacity(); })
      .attr('r', function(d) { return d.getR(); })
      .attr('stroke', function(d) { return d.getStroke(); })
      .attr('stroke-width', function(d) { return d.getStrokeWidth(); })
      .attr('stroke-opacity', function(d) { return d.getStrokeOpacity(); });

    circles.enter()
      .append('circle')
      .attr('id', function(d) { return _idPrefix + d.getID(); })
      .attr('visibility', function(d) { return d.getVisibility(); })
      .attr('cx', function(d) { return d.getSpCX(); })
      .attr('cy', function(d) { return d.getSpCY(); })
      .attr('fill', function(d) { return d.getFill(); })
      .attr('fill-opacity', function(d) { return d.getFillOpacity(); })
      .attr('r', function(d) { return d.getR(); })
      .attr('stroke', function(d) { return d.getStroke(); })
      .attr('stroke-width', function(d) { return d.getStrokeWidth(); })
      .attr('stroke-opacity', function(d) { return d.getStrokeOpacity(); })
      .transition().duration(dur)
      .attr('id', function(d) { return _idPrefix + d.getID(); })
      .attr('visibility', function(d) { return d.getVisibility(); })
      .attr('cx', function(d) { return d.getPosCX(); })
      .attr('cy', function(d) { return d.getPosCY(); })
      .attr('fill', function(d) { return d.getFill(); })
      .attr('fill-opacity', function(d) { return d.getFillOpacity(); })
      .attr('r', function(d) { return d.getR(); })
      .attr('stroke', function(d) { return d.getStroke(); })
      .attr('stroke-width', function(d) { return d.getStrokeWidth(); })
      .attr('stroke-opacity', function(d) { return d.getStrokeOpacity(); });

    // draw all lines
    var lines = d3.select("#g_lines")
      .selectAll('line')
      .data(viz.getLines());

    lines.transition().duration(dur)
      .attr('id', function(d) { return _idPrefix + d.getID(); })
      .attr('visibility', function(d) { return d.getVisibility(); })
      .attr('x1', function(d) { return d.getPosX1(); })
      .attr('y1', function(d) { return d.getPosY1(); })
      .attr('x2', function(d) { return d.getPosX2(); })
      .attr('y2', function(d) { return d.getPosY2(); })
      .attr('stroke', function(d) { return d.getStroke(); })
      .attr('stroke-width', function(d) { return d.getStrokeWidth(); })
      .attr('stroke-opacity', function(d) { return d.getStrokeOpacity(); })
      .attr('opacity', function(d) { return d.getOpacity(); })
      .attr('marker-start', function(d) { return d.getMarkerStart(); })
      .attr('marker-end', function(d) { return d.getMarkerEnd(); });

    lines.enter()
      .append('line')
      .attr('id', function(d) { return _idPrefix + d.getID(); })
      .attr('visibility', function(d) { return d.getVisibility(); })
      .attr('x1', function(d) { return d.getSpX1(); })
      .attr('y1', function(d) { return d.getSpY1(); })
      .attr('x2', function(d) { return d.getSpX2(); })
      .attr('y2', function(d) { return d.getSpY2(); })
      .attr('stroke', function(d) { return d.getStroke(); })
      .attr('stroke-width', function(d) { return d.getStrokeWidth(); })
      .attr('stroke-opacity', function(d) { return d.getStrokeOpacity(); })
      .attr('opacity', function(d) { return d.getOpacity(); })
      .attr('marker-start', function(d) { return d.getMarkerStart(); })
      .attr('marker-end', function(d) { return d.getMarkerEnd(); })
      .transition().duration(dur)
      .attr('id', function(d) { return _idPrefix + d.getID(); })
      .attr('visibility', function(d) { return d.getVisibility(); })
      .attr('x1', function(d) { return d.getPosX1(); })
      .attr('y1', function(d) { return d.getPosY1(); })
      .attr('x2', function(d) { return d.getPosX2(); })
      .attr('y2', function(d) { return d.getPosY2(); })
      .attr('stroke', function(d) { return d.getStroke(); })
      .attr('stroke-width', function(d) { return d.getStrokeWidth(); })
      .attr('stroke-opacity', function(d) { return d.getStrokeOpacity(); })
      .attr('opacity', function(d) { return d.getOpacity(); })
      .attr('marker-start', function(d) { return d.getMarkerStart(); })
      .attr('marker-end', function(d) { return d.getMarkerEnd(); });

    // draw all text elements
    var text = d3.select("#g_text")
      .selectAll('text')
      .data(viz.getText());

    text.text(function(d) { return d.getVal(); })
      .transition().duration(dur)
      .attr('id', function(d) { return _idPrefix + d.getID(); })
      .attr('visibility', function(d) { return d.getVisibility(); })
      .attr('x', function(d) { return d.getPosX(); })
      .attr('y', function(d) { return d.getPosY(); })
      .attr('fill', function(d) { return d.getFill(); })
      .attr('fill-opacity', function(d) { return d.getFillOpacity(); })
      .attr('font', function(d) { return d.getFont(); })
      .attr('font-size', function(d) { return d.getFontSize(); })
      .attr('text-anchor', function(d) { return d.getTextAnchor(); });

    text.enter()
      .append('text')
      .text(function(d) { return d.getVal(); })
      .attr('id', function(d) { return _idPrefix + d.getID(); })
      .attr('visibility', function(d) { return d.getVisibility(); })
      .attr('x', function(d) { return d.getSpX(); })
      .attr('y', function(d) { return d.getSpY(); })
      .attr('fill', function(d) { return d.getFill(); })
      .attr('fill-opacity', function(d) { return d.getFillOpacity(); })
      .attr('font', function(d) { return d.getFont(); })
      .attr('font-size', function(d) { return d.getFontSize(); })
      .attr('text-anchor', function(d) { return d.getTextAnchor(); })
      .transition().duration(dur)
      .text(function(d) { return d.getVal(); })
      .attr('id', function(d) { return _idPrefix + d.getID(); })
      .attr('x', function(d) { return d.getPosX(); })
      .attr('y', function(d) { return d.getPosY(); })
      .attr('fill', function(d) { return d.getFill(); })
      .attr('fill-opacity', function(d) { return d.getFillOpacity(); })
      .attr('font', function(d) { return d.getFont(); })
      .attr('font-size', function(d) { return d.getFontSize(); })
      .attr('text-anchor', function(d) { return d.getTextAnchor(); });

  }


  /****************************************************************************
   *  public methods
   ****************************************************************************/

  /**
   * Immediately update the svg canvas (used by resize operations).
   * @param {Object} viz - The visualization object for a specific algorithm.
   * @param {number} dur - Duration of the entire redraw in milliseconds.
   */
  function draw(viz, dur) {
    _draw(viz, dur);
  }

  /**
   * Public method to execute all functions currently in the queue and then
   * update the svg canvas.
   * @param {Object} viz - The visualization object for a specific algorithm.
   * @param {number} dur - Duration of the entire redraw in milliseconds.
   */
  function addDraw(viz, dur) {
    var f = function() { _draw(viz, dur); };
    f.duration = dur;
    f.isRedraw = 1;
    _q.push(f);
  }

  /**
   * Add a function to the queue. Any changes this function makes to the
   * visualization's elements will be reflected the next time redraw() is
   * called.
   * @param {Object} op - A function object to be added to the queue.
   */
  function addOps(...ops) {
    _q.push(function() {
      ops.forEach(function(f) { f(); });
    });
  }

  /**
   * Add a function to the queue and immediately redraw the canvas.
   * This is a convenience function.
   * @param {Object} viz - The visualization object for a specific algorithm.
   * @param {number} dur - Duration of the entire redraw in milliseconds.
   * @param {Object} op - A function object to be added to the queue.
   */
  function addOpsAndDraw(viz, dur, ...ops) {
    _q.push(function() {
      ops.forEach(function(f) { f(); });
    });
    addDraw(viz, dur);
  }

  /**
   * Add a callback function to invoke once the next redraw function added
   * to the queue ends.
   * @param {function} callback - Function to invoke when animation ends.
   * @param {Object} args - Arguments to pass to callback function.
   */
  function onNextDrawEnd(callback, ...args) {
    _callbacks.push(function() { callback.apply(null, args); });
  }

  /**
   * Play visualization
   */
  function playAnimation() {
    if (!_playpause) {
      _playpause = true;
      _play();
    }
  }

  /**
   * Toggle play/pause
   */
  function toggleAnimation() {
    if (_playpause) {
      if (_intervalID) {
        clearInterval(_intervalID);
        _intervalID = null;
      }
      _playpause = false;
    } else {
      _playpause = true;
      _play();
    }
  }

  /**
   * Draw the next step in the visualization.
   */
  function stepAnimation() {
    if (_playpause) { return; }
    _step();
  }

  /**
   * Get an svg element by its id.
   * @param {number} id - The id of the element to get.
   */
  function getElem(id) {
    return d3.select('#' + _idPrefix + id);
  }

  /**
   * Remove an svg element from the canvas.
   * @param {number} id - The id of the element to remove.
   */
  function removeElem(id) {
    getElem(id).remove();
  }

  /**
   * Add an svg element to the canvas.
   * This is just a helper method (used by getBBox())for now.
   * @param {Object} e - The element to add.
   */
  function addElem(e) {
    var svgType = e.className();
    var selection = d3.select('svg').append(svgType);
    if (svgType === 'text') {
      selection
        .text(e.getVal())
        .attr('id', _idPrefix + e.getID())
        .attr('visibility', function(d) { return 'hidden'; })
        .attr('x', e.getPosX())
        .attr('y', e.getPosY())
        .attr('fill', e.getFill())
        .attr('fill-opacity', e.getFillOpacity())
        .attr('font', e.getFont())
        .attr('font-size', e.getFontSize())
        .attr('text-anchor', e.getTextAnchor());
    } else if (svgType === 'rect') {
      selection
        .attr('id', _idPrefix + e.getID())
        .attr('visibility', function(d) { return 'hidden'; })
        .attr('x', e.getPosX())
        .attr('y', e.getPosY())
        .attr('width', e.getWidth())
        .attr('height', e.getHeight())
        .attr('stroke', e.getStroke())
        .attr('stroke-width', e.getStrokeWidth())
        .attr('stroke-opacity', e.getStrokeOpacity())
        .attr('fill', e.getFill())
        .attr('fill-opacity', e.getFillOpacity());
    } else if (svgType === 'circle') {
      selection
        .attr('id', _idPrefix + e.getID())
        .attr('visibility', function(d) { return 'hidden'; })
        .attr('cx', e.getPosCX())
        .attr('cy', e.getPosCY())
        .attr('fill', e.getFill())
        .attr('fill-opacity', e.getFillOpacity())
        .attr('r', e.getR())
        .attr('stroke', e.getStroke())
        .attr('stroke-width', e.getStrokeWidth())
        .attr('stroke-opacity', e.getStrokeOpacity());
    } else if (svgType === 'line') {
      selection
        .attr('id', _idPrefix + e.getID())
        .attr('visibility', function(d) { return 'hidden'; })
        .attr('x1', e.getPosX1())
        .attr('y1', e.getPosY1())
        .attr('x2', e.getPosX2())
        .attr('y2', e.getPosY2())
        .attr('stroke', e.getStroke())
        .attr('stroke-width', e.getStrokeWidth())
        .attr('stroke-opacity', e.getStrokeOpacity());
    }
  }

  /**
   * Get the bounding box of an svg element.
   * @param {number|Object} id_elem - The id or element.
   */
  function getBBox(id_elem) {
    if (id_elem.className && typeof id_elem.className === 'function' &&
                             (id_elem.className() === 'text' ||
                              id_elem.className() === 'line' ||
                              id_elem.className() === 'circle' ||
                              id_elem.className() === 'rect')) {
      var addedToCanvas = false;
      if (!getElem(id_elem.getID()).node()) {
        addedToCanvas = true;
        addElem(id_elem);
      }
      var bbox = getElem(id_elem.getID()).node().getBBox();
      if (addedToCanvas) {
        removeElem(id_elem.getID());
      }
      return bbox;
    } else {
      return getElem(id_elem).node().getBBox();
    }
  }

  /**
   * Initialize the visualization layout by appending group elements to the
   * svg canvas for each type of element (rect, circle, line, text).
   */
  function initCanvas(canvasID) {
    // append group element for rectangles
    d3.select("#" + canvasID)
        .append('g')
        .attr('id','g_rects');

    // append defs item to store markers
    d3.select("#svg_canvas")
      .append('defs')
      .attr('id', 'svg_defs');

    // append group element for circles
    d3.select("#" + canvasID)
        .append('g')
        .attr('id','g_circles');

    // append group element for lines
    d3.select("#" + canvasID)
        .append('g')
        .attr('id','g_lines');

    // append group element for text elements
    d3.select("#" + canvasID)
      .append('g')
      .attr('id','g_text');

    // append defs element and marker definitions

    var marker_defs = [
      { name: 'circle',
        path: 'M 0,0 m -5,0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0',
        viewbox: '-6 -6 12 12'},
      { name: 'square',
        path: 'M 0,0 m -5,-5 L 5,-5 L 5,5 L -5,5 Z',
        viewbox: '-5 -5 10 10'},
      { name: 'arrow',
        path: 'M 0,0 m -5,-5 L 5,0 L -5,5 Z',
        viewbox: '-5 -5 10 10'},
      { name: 'stub',
        path: 'M 0,0 m -1,-5 L 1,-5 L 1,5 L -1,5 Z',
        viewbox: '-1 -5 2 10'},
      { name: 'none',
        path: '',
        viewbox: '0 0 0 0'}
    ];

    d3.select('#svg_defs')
      .selectAll('marker')
      .data(marker_defs)
      .enter()
      .append('marker')
      .attr('id', function(d){ return 'marker_' + d.name;})
      .attr('markerHeight', 5)
      .attr('markerWidth', 5)
      .attr('markerUnits', 'strokeWidth')
      .attr('orient', 'auto')
      .attr('refX', 0)
      .attr('refY', 0)
      .attr('viewBox', function(d){ return d.viewbox;})
      .append('path')
        .attr('d', function(d){ return d.path; })
        .attr('fill', function(d) { return colors.BLACK;});
  }


  /****************************************************************************
   *  return public methods
   ****************************************************************************/
  return {
    addDraw:addDraw,
    addOps:addOps,
    addOpsAndDraw:addOpsAndDraw,
    onNextDrawEnd:onNextDrawEnd,
    playAnimation:playAnimation,
    toggleAnimation:toggleAnimation,
    stepAnimation:stepAnimation,
    getElem:getElem,
    removeElem:removeElem,
    getBBox:getBBox,
    initCanvas:initCanvas,
    draw:draw
  };

})();
