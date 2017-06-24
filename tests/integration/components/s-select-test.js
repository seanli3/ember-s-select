import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('s-select', 'Integration | Component | s select', {
  integration: true
});

const { $ } = Ember;

const $event = $.Event;

const groups = [
  { value: 0, label: 'Fruit' },
  { value: 101, label: 'Banana', parentId: 0 },
  { value: 102, label: 'Lemon', parentId: 0 },
  { value: 103, label: 'Orange', parentId: 0 },
  { value: 104, label: 'Raspberry', parentId: 0 },
  { value: 1, label: 'Vegetable' },
  { value: 111, label: 'Cucumber', parentId: 1 },
  { value: 112, label: 'Eggplant', parentId: 1 },
  { value: 113, label: 'Garlic', parentId: 1 },
  { value: 114, label: 'Onion', parentId: 1 }
];

const listofObjects = [
  { value: 0, label: 'Alfa Romeo' },
  { value: 1, label: 'Audi' },
  { value: 2, label: 'Citroën' },
  { value: 3, label: 'Fiat' },
  { value: 4, label: 'Opel' },
  { value: 5, label: 'Peugeot' },
  { value: 6, label: 'Seat' },
  { value: 7, label: 'Skoda' }
];

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

test('it renders control classes correctly', function(assert) {
  this.render(hbs`{{s-select controlClass="form-control"}}`);
  assert.notOk(this.$('.ember-view').hasClass('form-control'));
  assert.ok(this.$('.es-control').hasClass('form-control'));
});

test('group dropdowns are rendered correctly', function(assert) {
  this.set('groups', groups);
  this.render(hbs`
    {{s-select
      model=groups
      labelKey="label"}}`);

  let $groups = this.$('div.es-group');
  assert.equal($groups.length, 2);
  $groups.each((grpIndex, group) => {
    assert.equal(group.textContent.trim(), groups[5 * grpIndex].label);
    let $group1Options = $(group).nextUntil('div.es-group');
    assert.equal($group1Options.length, 4);
    $group1Options.each((index, option) => {
      assert.equal(option.textContent.trim(), groups[1 + 5 * grpIndex + index].label);
    });
  });
});

test('list of items are rendered correctly', function(assert) {
  this.set('items', listofItems);
  this.render(hbs`
    {{s-select
      model=items}}`);

  assert.equal(this.$('div.es-group').length, 0);
  let $options = this.$('div.es-option');
  assert.equal($options.length, 8);
  $options.each((index, option) => {
    assert.equal(option.textContent.trim(), listofItems[index]);
  });
});

test('list of objects are rendered correctly', function(assert) {
  this.set('items', listofObjects);
  this.render(hbs`
    {{s-select
      labelKey="label"
      model=items}}`);

  assert.equal(this.$('div.es-group').length, 0);
  let $options = this.$('div.es-option');
  assert.equal($options.length, 8);
  $options.each((index, option) => {
    assert.equal(option.textContent.trim(), listofObjects[index].label);
  });
});

test('Ember ArrayProxy list is rendered correctly', function(assert) {
  this.set('items', Ember.ArrayProxy.create({ content: Ember.A(listofObjects) }));
  this.render(hbs`
    {{s-select
      labelKey="label"
      model=items}}`);

  assert.equal(this.$('div.es-group').length, 0);
  let $options = this.$('div.es-option');
  assert.equal($options.length, 8);
  $options.each((index, option) => {
    assert.equal(option.textContent.trim(), listofObjects[index].label);
  });
});

test('Default value should be selected for ArrayProxy', function(assert) {
  let async = assert.async();
  this.set('items', Ember.ArrayProxy.create({ content: Ember.A(listofObjects) }));
  this.set('value', 1);
  this.render(hbs`
    {{s-select
      labelKey="label"
      valueKey="value"
      value=value
      model=items}}`);
  Ember.run.next(() => {
    assert.equal(this.$('input').val().trim(), 'Audi');
    async();
  });
});

test('Default value will not be selected if input is not dom ready', function(assert) {
  let async = assert.async();
  this.set('items', listofObjects);
  this.set('value', 1);
  this.render(hbs`
    {{s-select
      labelKey="label"
      valueKey="value"
      value=value
      model=items}}`);
  this.$('input').remove();
  Ember.run.next(() => {
    assert.equal(this.$('input').length, 0);
    async();
  });
});

test('click on down arrow toggles the dropdown', function(assert) {
  this.set('groups', groups);
  this.render(hbs`
    {{s-select
      model=groups
      labelKey="label"}}`);

  assert.equal(this.$('div.es-group').length, 2);
  assert.ok(this.$('div.es-options').attr('hidden'));

  this.$('span.es-arrow').trigger('mousedown');
  assert.notOk(this.$('div.es-options').attr('hidden'));

  this.$('span.es-arrow').trigger('mousedown');
  assert.ok(this.$('div.es-options').attr('hidden'));
});

test('change input opens the dropdown', function(assert) {
  this.set('groups', groups);
  this.render(hbs`
    {{s-select
      model=groups
      labelKey="label"}}`);
  assert.ok(this.$('div.es-options').attr('hidden'));
  this.$('input').val('a');
  this.$('input').trigger('input');
  assert.notOk(this.$('div.es-options').attr('hidden'));
});

test('dropdown opens on focus when canSearch=false', function(assert) {
  this.set('groups', groups);
  this.render(hbs`
    {{s-select
      model=groups
      value="a"
      labelKey="label"
      canSearch=false}}`);

  assert.ok(this.$('div.es-options').attr('hidden'));
  this.$('input').trigger('focus');
  assert.notOk(this.$('div.es-options').attr('hidden'));
});

test('dropdown does not open on focus when canSearch=true', function(assert) {
  this.set('groups', groups);
  this.render(hbs`
    {{s-select
      model=groups
      value="a"
      labelKey="label"}}`);
  this.$('input').trigger('focus');
  assert.ok(this.$('div.es-options').attr('hidden'));
});

test('autofocus is bind with input', function(assert) {
  this.set('groups', groups);
  this.set('autofocus', false);
  this.render(hbs`
    {{s-select
      model=groups
      labelKey="label"
      autofocus=autofocus}}`);

  assert.notOk(this.$('input').attr('autofocus'));
  this.set('autofocus', true);
  assert.ok(this.$('input').attr('autofocus'));
});

test('no dropdown when disabled is true', function(assert) {
  this.set('groups', groups);
  this.set('disabled', true);
  this.render(hbs`
    {{s-select
      model=groups
      labelKey="label"
      disabled=disabled}}`);

  this.$('input').trigger('focus');
  assert.ok(this.$('div.es-options').attr('hidden'));
  assert.ok(this.$('input').attr('disabled'));

  this.set('disabled', false);
  this.$('input').trigger('focus');
  assert.notOk(this.$('div.es-options').attr('hidden'));
  assert.notOk(this.$('input').attr('disabled'));
});

test('dropdown should keep open when attribute is updated', function(assert) {
  this.set('groups', groups);
  this.set('value', 'b');
  this.render(hbs`
    {{s-select
      model=groups
      value=value
      labelKey="label"}}`);

  this.$('input').val('banana');
  this.$('input').trigger('input');
  assert.notOk(this.$('div.es-options').attr('hidden'));
  this.set('value', 'banana');
  assert.notOk(this.$('div.es-options').attr('hidden'));
});

test('input values should be updated when value attribute is updated to be different', function(assert) {
  this.set('groups', groups);
  this.set('value', 'b');
  this.render(hbs`
    {{s-select
      model=groups
      value=value
      labelKey="label"}}`);

  this.$('input').val('ba');
  this.$('input').trigger('input');
  this.set('value', 'banana');
  assert.equal(this.$('input').val(), 'banana');
});

test('unselected value should be cleared on blur', function(assert) {
  this.set('groups', groups);
  this.render(hbs`
    {{s-select
      model=groups
      labelKey="label"}}`);

  this.$('input').val('ba');
  this.$('input').trigger('input');
  this.$('input').trigger('blur');
  assert.equal(this.$('input').val(), '');
});

test('input value should be cleared when clear button is clicked', function(assert) {
  this.set('groups', groups);
  this.render(hbs`
    {{s-select
      model=groups
      labelKey="label"}}`);

  this.$('input').val('ba');
  this.$('input').trigger('input');
  this.$('.es-clear-zone').click();
  assert.equal(this.$('input').val(), '');
});

test('BACKSPACE deletes character in multi-select mode', function(assert) {
  assert.expect(2);

  this.set('groups', groups);
  this.set('values', [101, 102]);
  this.on('remove', (selection) => {
    assert.equal(selection, 102);
  });

  this.render(hbs`
    {{s-select
      model=groups
      values=values
      onRemove=(action "remove")
      labelKey="label"}}`);

  this.$('input').trigger($event('keydown', { which: 8 }));

  assert.deepEqual(this.get('values'), [101]);
});

test('BACKSPACE will not alter value in single-select mode', function(assert) {
  this.set('groups', groups);
  this.set('value', 101);

  this.render(hbs`
    {{s-select
      model=groups
      value=value
      labelKey="label"}}`);

  this.$('input').trigger($event('keydown', { which: 8 }));

  assert.deepEqual(this.get('value'), 101);
});

test('ESC clears input in search mode', function(assert) {
  this.set('list', listofObjects);
  this.set('canSearch', true);

  this.render(hbs`
    {{s-select
      model=list
      canSearch=canSearch
      labelKey="label"}}`);

  this.$('input').val('ba');
  this.$('input').trigger('input');
  this.$('input').trigger($event('keydown', { which: 27 }));

  assert.equal(this.$('input').val(), '');
  assert.ok(this.$('div.es-options').attr('hidden'));

  this.set('canSearch', false);
  this.$('input').val('ba');
  this.$('input').trigger('input');
  this.$('input').trigger($event('keydown', { which: 27 }));
  assert.equal(this.$('input').val(), 'ba');
  assert.ok(this.$('div.es-options').attr('hidden'));
});

test('UP arrow expands dropdown', function(assert) {
  this.set('list', listofObjects);
  this.set('canSearch', true);
  this.render(hbs`
    {{s-select
      model=list
      labelKey="label"}}`);

  this.$('input').trigger($event('keydown', { which: 38 }));
  assert.notOk(this.$('div.es-options').attr('hidden'));
});

test('DOWN arrow expands dropdown', function(assert) {
  this.set('list', listofObjects);
  this.set('canSearch', true);
  this.render(hbs`
    {{s-select
      model=list
      labelKey="label"}}`);

  this.$('input').trigger($event('keydown', { which: 40 }));
  assert.notOk(this.$('div.es-options').attr('hidden'));
  this.$('input').trigger($event('keydown', { which: 40 }));
  assert.notOk(this.$('div.es-options').attr('hidden'));
});

test('Click on value should remove it from values', function(assert) {
  this.set('list', listofItems);
  this.set('values', ['Blanco', 'Azul', 'Lemon']);
  this.render(hbs`{{s-select
    model=list
    values=values}}`);

  this.$('.es-selections span')[1].click();
  assert.deepEqual(this.get('values'), ['Blanco', 'Lemon']);
  this.$('.es-selections span')[0].click();
  assert.deepEqual(this.get('values'), ['Lemon']);
});

test('Click on value should trigger onRemove action', function(assert) {
  assert.expect(1);

  this.set('list', listofItems);
  this.set('values', ['Blanco', 'Azul', 'Lemon']);
  this.on('remove', (selection)=>{
    assert.equal(selection, 'Blanco');
  });
  this.render(hbs`{{s-select
    model=list
    values=values
    onRemove=(action "remove")}}`);

  this.$('.es-selections span')[0].click();
});

test('Click on option sets value on a list of objects', function(assert) {
  assert.expect(3);

  this.set('list', listofObjects);
  this.set('value', '');
  this.on('select', (value, option, selected)=>{
    assert.equal(value, 0);
    assert.deepEqual(option, { label: 'Alfa Romeo', value: 0 });
    assert.ok(selected);
  });
  this.render(hbs`{{s-select
    model=list
    value=value
    labelKey="label"
    valueKey="value"
    onSelect=(action "select")}}`);

  this.$('.es-option')[0].click();
});

test('Click on option sets value on a list of items', function(assert) {
  assert.expect(3);

  this.set('list', listofItems);
  this.set('value', '');
  this.on('select', (value, option, selected)=>{
    assert.equal(value, 'Blanco');
    assert.deepEqual(option, 'Blanco');
    assert.ok(selected);
  });
  this.render(hbs`{{s-select
    model=list
    value=value
    onSelect=(action "select")}}`);

  this.$('.es-option')[2].click();
});

test('Search token/input value is set when selected in single select mode', function(assert) {
  assert.expect(1);

  this.set('list', listofObjects);

  this.render(hbs`{{s-select
    model=list
    labelKey="label"
    valueKey="value"}}`);

  this.$('span.es-arrow').trigger('mousedown');
  this.$('.es-option')[3].click();

  assert.equal(this.$('input').val(), 'Fiat');
});

test('Search token/input value is cleared when selected in multiple select mode', function(assert) {
  assert.expect(1);

  this.set('list', listofObjects);

  this.render(hbs`{{s-select
    model=list
    labelKey="label"
    multiple=true
    valueKey="value"}}`);

  this.$('span.es-arrow').trigger('mousedown');
  this.$('.es-option')[3].click();

  assert.equal(this.$('input').val(), '');
});

test('Blur/Clear reset input to value when required=true in single select mode', function(assert) {
  assert.expect(2);

  this.set('list', listofObjects);
  this.set('value', listofObjects[1]);

  this.render(hbs`{{s-select
    model=list
    labelKey="label"
    value=value
    required=true
    valueKey="value"}}`);
  this.$('input').val('test');
  this.$('input').trigger('input');
  this.$('input').trigger('blur');

  assert.equal(this.$('input').val(), this.get('value').label);

  this.$('input').val('test');
  this.$('.es-clear-zone').click();
  assert.equal(this.$('input').val(), this.get('value').label);
});

test('Dropdown is not opened when input is cleared', function(assert) {
  this.set('list', listofObjects);
  this.set('value', listofObjects[1]);

  this.render(hbs`{{s-select
    model=list
    labelKey="label"
    value=value
    required=true
    valueKey="value"}}`);

  this.$('input').trigger('input');
  assert.ok(this.$('.es-options').attr('hidden'));
});

test('Click on object option should select it', function(assert) {
  let value = null;
  this.set('list', listofObjects);
  this.set('value', value);
  this.on('select', option => {
    assert.equal(option, 1);
  });

  this.render(hbs`{{s-select
    model=list
    labelKey="label"
    value=value
    required=true
    valueKey="value"
    onSelect=(action 'select')}}`);

  this.$('input').trigger('input');
  this.$('.es-option:eq(1)').click();
});

test('Click on group object option should select it', function(assert) {
  let value = null;
  this.set('list', groups);
  this.set('value', value);
  this.on('select', option => {
    assert.equal(option, 102);
  });

  this.render(hbs`{{s-select
    model=list
    labelKey="label"
    value=value
    required=true
    valueKey="value"
    onSelect=(action 'select')}}`);

  this.$('input').trigger('input');
  this.$('.es-option:eq(1)').click();
});