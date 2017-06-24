import tree from 'dummy/utils/tree';
import { module, test } from 'qunit';

module('Unit | Utility | tree');

const listofObjects = [
  { id: 0, name: 'Alfa Romeo' },
  { id: 1, name: 'Audi' },
  { id: 2, name: 'Citroën' },
  { id: 3, name: 'Fiat' },
  { id: 4, name: 'Opel' },
  { id: 5, name: 'Peugeot' },
  { id: 6, name: 'Seat' },
  { id: 7, name: 'Skoda' }
];

test('it works', function(assert) {
  let result = tree.buildTree();
  assert.ok(result);
});

test('it builds a tree correctly when no valueKey and labelKey', function(assert) {
  let result = tree.buildTree(listofObjects, {});
  assert.equal(result.length, 8);
  result.forEach((node, index) => {
    assert.equal(node.content.value, listofObjects[index].value);
    assert.equal(node.content.label, listofObjects[index].label);
    assert.equal(node.isSelected, false);
    assert.equal(node.isVisible, true);
  });
});