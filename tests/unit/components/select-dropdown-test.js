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

test('Abnormal keyEvent should be able be ignored', function(assert) {
  let component = this.subject();
  sinon.spy(component, 'tabEnterKeys');
  sinon.spy(component, 'upDownKeys');
  component.keys(null);
  component.keys({});
  assert.ok(component.tabEnterKeys.notCalled);
  assert.ok(component.upDownKeys.notCalled);
});