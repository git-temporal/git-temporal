// https://github.com/wbkd/d3-extended

export function addMoveToFront(d3) {
  d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
      // @ts-ignore
      this.parentNode.appendChild(this);
    });
  };
}
