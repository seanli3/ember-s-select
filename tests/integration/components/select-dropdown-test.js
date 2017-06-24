import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('select-dropdown', 'Integration | Component | select dropdown', {
  integration: true
});

const listofItems = [
  'Amarillo',
  'Azul',
  'Blanco',
  'Naranja',
  'Negro',
  'Rojo',
  'Rosa',
  'Verde'
];

test('it renders', function(assert) {
  this.render(hbs`{{select-dropdown}}`);

  assert.equal(this.$().text().trim(), '');
});

test('Hover over option highlights it', function(assert) {
  this.set('items', listofItems);
  this.render(hbs`
    {{select-dropdown
      model=items}}`);

  this.$('.es-option:eq(1)').trigger('mouseenter');
  assert.ok(this.$('.es-option:eq(1)').hasClass('es-highlight'));

  this.$('.es-option:eq(2)').trigger('mouseenter');
  assert.notOk(this.$('.es-option:eq(1)').hasClass('es-highlight'));
  assert.ok(this.$('.es-option:eq(2)').hasClass('es-highlight'));
});

test('TAB selects option', function(assert) {
  assert.expect(1);

  this.set('items', listofItems);
  this.set('keyEvent', null);
  this.on('onSelect', (selection) => {
    assert.equal(selection, 'Azul');
  });

  this.render(hbs`
    {{select-dropdown
      model=items
      keyEvent=keyEvent
      select=(action "onSelect")}}`);

  this.$('.es-option:eq(1)').trigger('mouseenter');
  // TAB
  this.set('keyEvent', { which: 9 });
});

test('ENTER selects option', function(assert) {
  assert.expect(1);

  this.set('items', listofItems);
  this.set('keyEvent', null);
  this.on('onSelect', (selection) => {
    assert.equal(selection, 'Amarillo');
  });

  this.render(hbs`
    {{select-dropdown
      model=items
      keyEvent=keyEvent
      select=(action "onSelect")}}`);

  this.set('keyEvent', { which: 40 });
  // TAB
  this.set('keyEvent', { which: 13 });
});

test('ENTER and TAB should not trigger selection event when no option is selected', function(assert) {
  assert.expect(0);

  this.set('items', listofItems);
  this.set('keyEvent', null);
  this.on('onSelect', () => {
    assert.ok(false);
  });

  this.render(hbs`
    {{select-dropdown
      model=items
      keyEvent=keyEvent
      select=(action "onSelect")}}`);

  // ENTER
  this.set('keyEvent', { which: 13 });
  // TAB
  this.set('keyEvent', { which: 9 });
});

test('Press ARROW key when lsit is empty does nothing', function(assert) {
  assert.expect(2);

  this.set('items', []);
  this.set('keyEvent', null);

  this.render(hbs`
    {{select-dropdown
      model=items
      keyEvent=keyEvent}}`);

  this.set('keyEvent', { which: 40 });
  assert.equal(this.$('.es-option').length, 0);
  this.set('keyEvent', { which: 38 });
  assert.equal(this.$('.es-option').length, 0);
});

test('Dropdown options should be filtered based on token', function(assert) {
  this.set('items', listofItems);
  this.set('keyEvent', null);

  this.render(hbs`
    {{select-dropdown
      model=items
      token="ro"
      shouldFilter=true
      keyEvent=keyEvent}}`);
  assert.equal(this.$('.es-option:not([hidden])').length, 3);
  assert.equal(this.$('.es-option:not([hidden]):first').text().trim(), 'Negro');
  assert.equal(this.$('.es-option:not([hidden]):eq(1)').text().trim(), 'Rojo');
  assert.equal(this.$('.es-option:not([hidden]):last').text().trim(), 'Rosa');
});

test('UP and DWON keypress moves selection', function(assert) {
  this.set('items', listofItems);
  this.set('keyEvent', null);
  this.render(hbs`
    {{select-dropdown
      keyEvent=keyEvent
      model=items}}`);

  this.set('keyEvent', { which: 40 });
  assert.ok(this.$('.es-option:first').hasClass('es-highlight'));
  this.set('keyEvent', { which: 40 });
  assert.ok(this.$('.es-option:eq(1)').hasClass('es-highlight'));
  this.set('keyEvent', { which: 38 });
  assert.ok(this.$('.es-option:first').hasClass('es-highlight'));
  this.set('keyEvent', { which: 38 });
  assert.ok(this.$('.es-option:last').hasClass('es-highlight'));
});

test('Click on option should trigger select event', function(assert) {
  this.set('items', listofItems);
  this.set('keyEvent', null);
  this.on('select', option => {
    assert.equal(option, 'Naranja');
  });
  this.render(hbs`
    {{select-dropdown
      select=(action "select")
      model=items}}`);

  this.$('.es-option:eq(3)').click();
});
