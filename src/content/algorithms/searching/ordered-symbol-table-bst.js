vm.loadFunc("3.2-bst-ceiling.js");
vm.loadFunc("3.2-bst-delete.js");
vm.loadFunc("3.2-bst-deletemax.js");
vm.loadFunc("3.2-bst-deletemin.js");
vm.loadFunc("3.2-bst-floor.js");
vm.loadFunc("3.2-bst-get.js");
vm.loadFunc("3.2-bst-keys.js");
vm.loadFunc("3.2-bst-max.js");
vm.loadFunc("3.2-bst-min.js");
vm.loadFunc("3.2-bst-put.js");
vm.loadFunc("3.2-bst-rank.js");
vm.loadFunc("3.2-bst-select.js");

// tree node representation
// id(), val(), lChild(), and rChild() are expected by tree visualizations
function node(uid, nodeVal, lc, rc) {
  var _id = uid;
  var _val = nodeVal;
  var _lc = lc;
  var _rc = rc;
  var _n = 1;

  var id = function() { return _id; }
  var val = function() { return _val; }
  var lChild = function() { return _lc; }
  var rChild = function() { return _rc; }
  var n = function() { return _n; }
  var setLChild = function(child) { _lc = child; }
  var setRChild = function(child) { _rc = child; }
  var setN = function(n) { _n = n; }

  return {
    id:id,
    val:val,
    lChild:lChild,
    rChild:rChild,
    n:n,
    setLChild:setLChild,
    setRChild:setRChild,
    setN:setN
  };
}

function resize() {
  svgW = window.innerWidth;
  svgH = window.innerHeight;
  vm.viz.resize(vm.viz, svgW, svgH);
}

// find node with given key
function findNodeWithKey(rootNode, key) {
  while (rootNode && rootNode.val() !== key) {
    if (key < rootNode.val()) {
      rootNode = rootNode.lChild();
    } else {
      rootNode = rootNode.rChild();
    }
  }
  return rootNode;
}

// add a node to the tree rooted at rootNode
function addNode(rootNode, newNode) {
  if (!rootNode) {
    return newNode;
  } else if (newNode.val() > rootNode.val()) {
    vm.viz.emphasizeAndUpdate([rootNode], vm.dur);
    vm.viz.setFillAndUpdate([rootNode, newNode], colors.COMPARE, vm.dur);
    vm.viz.setFillAndUpdate([rootNode, newNode], colors.BACKGROUND, vm.dur);
    vm.viz.moveEmphasisAndUpdate(rootNode, rootNode.rChild(), 1, vm.dur);
    rootNode.setRChild(addNode(rootNode.rChild(), newNode));
  } else if (newNode.val() < rootNode.val()) {
    vm.viz.emphasizeAndUpdate([rootNode], vm.dur);
    vm.viz.setFillAndUpdate([rootNode, newNode], colors.COMPARE, vm.dur);
    vm.viz.setFillAndUpdate([rootNode, newNode], colors.BACKGROUND, vm.dur);
    vm.viz.moveEmphasisAndUpdate(rootNode, rootNode.lChild(), -1, vm.dur);
    rootNode.setLChild(addNode(rootNode.lChild(), newNode));
  } else {
    // deal with equal keys here
  }
  return rootNode;
}

// add a node to the tree rooted at rootNode without visualizing the steps
function addNodeNoViz(rootNode, newNode) {
  if (!rootNode) {
    return newNode;
  } else if (newNode.val() > rootNode.val()) {
    rootNode.setRChild(addNodeNoViz(rootNode.rChild(), newNode));
  } else if (newNode.val() < rootNode.val()) {
    rootNode.setLChild(addNodeNoViz(rootNode.lChild(), newNode));
  } else {
    // deal with equal keys here
  }
  return rootNode;
}

// remove theNode from the tree rooted at rootNode
function removeNode(rootNode, theNode) {
  if (!rootNode) {
    return null;
  } else if (theNode.val() > rootNode.val()) {
    vm.viz.setFillAndUpdate([rootNode], colors.COMPARE, vm.dur);
    vm.viz.setFillAndUpdate([rootNode], colors.BACKGROUND, vm.dur);
    if (rootNode.rChild()) {
      vm.viz.moveEmphasisAndUpdate(rootNode, rootNode.rChild(), 1, vm.dur);
      rootNode.setRChild(removeNode(rootNode.rChild(), theNode));
    } else {
      vm.viz.deemphasizeAndUpdate([rootNode], vm.dur);
    }
  } else if (theNode.val() < rootNode.val()) {
    vm.viz.setFillAndUpdate([rootNode], colors.COMPARE, vm.dur);
    vm.viz.setFillAndUpdate([rootNode], colors.BACKGROUND, vm.dur);
    if (rootNode.lChild()) {
      vm.viz.moveEmphasisAndUpdate(rootNode, rootNode.lChild(), -1, vm.dur);
      rootNode.setLChild(removeNode(rootNode.lChild(), theNode));
    } else {
      vm.viz.deemphasizeAndUpdate([rootNode], vm.dur);
    }
  } else {
    vm.viz.setFillAndUpdate([rootNode], colors.GREEN, vm.dur);
    if (!rootNode.rChild()) {
      vm.viz.setFill([rootNode], colors.WHITE);
      vm.viz.setOutline([rootNode], colors.WHITE);
      vm.viz.setLabelFill([rootNode], colors.WHITE);
      vm.viz.deemphasizeAndUpdate([rootNode], vm.dur);
      return rootNode.lChild();
    } else if (!rootNode.lChild()) {
      vm.viz.setFill([rootNode], colors.WHITE);
      vm.viz.setOutline([rootNode], colors.WHITE);
      vm.viz.setLabelFill([rootNode], colors.WHITE);
      vm.viz.deemphasizeAndUpdate([rootNode], vm.dur);
      return rootNode.rChild();
    } else {
      var suc = successor(rootNode);
      var minNode = min(rootNode.rChild());
      vm.viz.emphasizeAndUpdate([rootNode.rChild()], vm.dur);
      suc.setRChild(delMin(rootNode.rChild()));
      suc.setLChild(rootNode.lChild());
      vm.viz.setFill([rootNode], colors.WHITE);
      vm.viz.setOutline([rootNode], colors.WHITE);
      vm.viz.setLabelFill([rootNode], colors.WHITE);
      return suc;
    }
  }
  return rootNode;
}

// delete min node in tree rooted at root
function delMin(rootNode) {
  if (!rootNode) {
    return null;
  } else if (!rootNode.lChild()) {
    vm.viz.setFillAndUpdate([rootNode], colors.GREEN, vm.dur);
    vm.viz.deemphasize([rootNode]);
    vm.viz.setFillAndUpdate([rootNode], colors.BACKGROUND, vm.dur);
    return rootNode.rChild();
  } else {
    vm.viz.setFillAndUpdate([rootNode], colors.COMPARE, vm.dur);
    vm.viz.setFillAndUpdate([rootNode], colors.BACKGROUND, vm.dur);
    vm.viz.moveEmphasisAndUpdate(rootNode, rootNode.lChild(), -1, vm.dur);
    rootNode.setLChild(delMin(rootNode.lChild()));
    return rootNode;
  }
}

// find the successor of aNode (not visualized)
function successor(aNode) {
  return min(aNode.rChild());
}

// find the min node in the tree rooted at rootNode (not visualized)
function min(rootNode) {
  while (rootNode && rootNode.lChild()) {
    rootNode = rootNode.lChild();
  }
  return rootNode;
}

var a = [86, 71, 10, 75, 73, 64, 87, 23];
var nodeId = 1;
vm.globals["root"] = null;
vm.globals["nodes"] = {};
vm.viz = vizlib.get_bst(vm.globals["root"], svgW, svgH);

// TODO: These are dummy values. Currently, BST will operate on
// hardcoded values in onInvoke when any data set is selected.
populateSelectInput({
  "Random": d3.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  "Ascending": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "Descending": [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
});

let onInvoke = function() {
  if (vm.getFrame() === undefined) {
    // Emphasize the root (if it exists)
    let method = document.getElementById("selectMethod").value;
    if (method === 'put') {
      let locA = a.slice();
      d3.shuffle(locA);
      let key = locA.pop();
      let newNode = new node(nodeId++, key, null, null);
      if (vm.globals["root"]) {
        vm.viz.emphasizeAndUpdate([vm.globals["root"]], vm.dur);
        vm.viz.step();
      }
      vm.viz.dispNextNodeAndUpdate(newNode, vm.dur);
      vm.viz.step();
      vm.invokeFunc(method, function(result) {
        vm.globals["root"] = result;
        vm.viz.buildTreeAndUpdate(result, vm.dur);
        vm.viz.step();
        vm.viz.clearEmphasesAndUpdate(vm.dur);
        vm.viz.step();
      }, vm.globals["root"], key, newNode);
    } else if (method === 'deleteMin') {
      if (!vm.globals["root"]) { // build a tree
        let i = 0;
        while (i < a.length) {
          let newNode = new node(nodeId++, a[i++], null, null);
          vm.globals["root"] = addNodeNoViz(vm.globals["root"], newNode);
        }
        vm.viz.buildTreeAndUpdate(vm.globals["root"], vm.dur);
        vm.viz.step();
      }
      if (vm.globals["root"]) {
        vm.viz.emphasizeAndUpdate([vm.globals["root"]], vm.dur);
        vm.viz.step();
        vm.invokeFunc(method, function(result) {
          var oldRoot = vm.globals["root"];
          vm.globals["root"] = result;
          vm.viz.delMinNode(oldRoot);
          vm.viz.buildTreeAndUpdate(result, vm.dur);
          vm.viz.step();
        }, vm.globals["root"]);
      }
    } else if (method === 'delete') {
      if (!vm.globals["root"]) { // build a tree
        let i = 0;
        while (i < a.length) {
          let newNode = new node(nodeId++, a[i++], null, null);
          vm.globals["root"] = addNodeNoViz(vm.globals["root"], newNode);
        }
        vm.viz.buildTreeAndUpdate(vm.globals["root"], vm.dur);
        vm.viz.step();
      }
      if (vm.globals["root"]) {
        let locA = a.slice();
        d3.shuffle(locA);
        let key = locA.pop();
        console.log("looking for val: " + key);
        vm.viz.emphasizeAndUpdate([vm.globals["root"]], vm.dur);
        vm.viz.step();
        vm.invokeFunc(method + "_", function(result) {
          console.log("result: " + result.val());
          let theNode = findNodeWithKey(vm.globals["root"], key);
          console.log("deleting: " + theNode.val());
          vm.globals["root"] = result;
          vm.viz.removeNodeAndUpdate(theNode, vm.dur);
          vm.viz.buildTreeAndUpdate(result, vm.dur);
          vm.viz.play();
        }, vm.globals["root"], key);
      }
    }
  }
};
