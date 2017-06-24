import { moduleForComponent, test } from 'ember-qunit';
import sinon from 'sinon';

moduleForComponent('s-select', 'Unit | Component | s select', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar'],
  unit: true
});

test('event.preventDefault is called on keyPress for Up/Ddown/Backspace', function(assert) {

  let component = this.subject({ values: ['something', 'something'], token: '', attrs: {} });

  // Backspace
  let event = { which: 8, preventDefault: sinon.stub() };

  component.actions.keypress.call(component, event);
  assert.ok(event.preventDefault.calledOnce);

  component.values = null;
  event = { which: 8, preventDefault: sinon.stub() };
  component.actions.keypress.call(component, event);
  assert.ok(event.preventDefault.notCalled);

  // UP
  event = { which: 38, preventDefault: sinon.stub() };

  component.actions.keypress.call(component, event);
  assert.ok(event.preventDefault.calledOnce);

  // DOWN
  event = { which: 40, preventDefault: sinon.stub() };
  component.actions.keypress.call(component, event);
  assert.ok(event.preventDefault.calledOnce);

  // ESC
  event = { which: 27, preventDefault: sinon.stub() };
  component.actions.keypress.call(component, event);
  assert.ok(event.preventDefault.notCalled);

  // Other keys
  event = { which: 82, preventDefault: sinon.stub() };
  component.actions.keypress.call(component, event);
  assert.ok(event.preventDefault.notCalled);
});
