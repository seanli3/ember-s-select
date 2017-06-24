import { moduleForComponent, test } from 'ember-qunit';
import sinon from 'sinon';

moduleForComponent('select-dropdown', 'Unit | Component | select dropdown', {
  unit: true
});

test('mouseDown event handler calls preventDefault', function(assert) {
  let component = this.subject();
  let event = { preventDefault: sinon.stub() };
  component.mouseDown(event);
  assert.ok(event.preventDefault.calledOnce);
});
