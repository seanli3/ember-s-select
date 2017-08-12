import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('s-select', 'Integration | Component | s select', {
  integration: true
});

const { $, run } = Ember;

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

const mixedGroups = [
  { value: 0, label: 'Fruit' },
  { value: 101, label: 'Banana', parentId: 0 },
  { value: 102, label: 'Lemon', parentId: 0 },
  { value: 103, label: 'Orange', parentId: 0 },
  { value: 104, label: 'Raspberry', parentId: 0 },
  { value: 1, label: 'Vegetable' },
  { value: 111, label: 'Cucumber', parentId: 1 },
  { value: 2, label: 'Others' }
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

test('groups are selectable when "canSelectGroup" is true', function(assert) {
  assert.expect(10);
  this.set('groups', mixedGroups);
  this.on('select', (value, option, selected)=>{
    assert.equal(value, 2, 'selection value matches');
    assert.deepEqual(option, { label: 'Others', value: 2 }, 'selection option matches');
    assert.ok(selected, 'option is selected');
  });
  this.render(hbs`
    {{s-select
      model=groups
			canSelectGroup=true
			onSelect=(action "select")
      labelKey="label"}}`);

  let $groups = this.$('div.es-group');
  assert.equal($groups.length, 3);
  let firstGroup = this.$('div.es-group:eq(0)');
  assert.equal(firstGroup.text().trim(), mixedGroups[0].label, 'label matches');
  assert.ok(firstGroup.hasClass('es-selectable'), 'has "es-selectable" class');
  let secondGroup = this.$('div.es-group:eq(1)');
  assert.equal(secondGroup.text().trim(), mixedGroups[5].label, 'label matches');
  assert.ok(secondGroup.hasClass('es-selectable'), 'has "es-selectable" class');
  let thirdGroup = this.$('div.es-group:eq(2)');
  assert.equal(thirdGroup.text().trim(), mixedGroups[7].label, 'label matches');
  assert.ok(thirdGroup.hasClass('es-selectable'), 'has "es-selectable" class');

  this.$('span.es-arrow').trigger('mousedown');
  this.$('.es-group')[2].click();
});

test('groups are selectable when "canSelectGroup" is true', function(assert) {
  assert.expect(10);
  this.set('groups', mixedGroups);
  this.on('select', (value, option, selected)=>{
    assert.equal(value, 2, 'selection value matches');
    assert.deepEqual(option, { label: 'Others', value: 2 }, 'selection option matches');
    assert.ok(selected, 'option is selected');
  });
  this.render(hbs`
    {{s-select
      model=groups
			canSelectGroup=true
			onSelect=(action "select")
      labelKey="label"}}`);

  let $groups = this.$('div.es-group');
  assert.equal($groups.length, 3);
  let firstGroup = this.$('div.es-group:eq(0)');
  assert.equal(firstGroup.text().trim(), mixedGroups[0].label, 'label matches');
  assert.ok(firstGroup.hasClass('es-selectable'), 'has "es-selectable" class');
  let secondGroup = this.$('div.es-group:eq(1)');
  assert.equal(secondGroup.text().trim(), mixedGroups[5].label, 'label matches');
  assert.ok(secondGroup.hasClass('es-selectable'), 'has "es-selectable" class');
  let thirdGroup = this.$('div.es-group:eq(2)');
  assert.equal(thirdGroup.text().trim(), mixedGroups[7].label, 'label matches');
  assert.ok(thirdGroup.hasClass('es-selectable'), 'has "es-selectable" class');

  this.$('span.es-arrow').trigger('mousedown');
  this.$('.es-group')[2].click();
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
  assert.ok(this.$('div.es-options-container').attr('hidden'));

  this.$('span.es-arrow').trigger('mousedown');
  assert.notOk(this.$('div.es-options-container').attr('hidden'));

  this.$('span.es-arrow').trigger('mousedown');
  assert.ok(this.$('div.es-options-container').attr('hidden'));
});

test('change input opens the dropdown', function(assert) {
  this.set('groups', groups);
  this.render(hbs`
    {{s-select
      model=groups
      labelKey="label"}}`);
  assert.ok(this.$('div.es-options-container').attr('hidden'));
  this.$('input').val('a');
  this.$('input').trigger('input');
  assert.notOk(this.$('div.es-options-container').attr('hidden'));
});

test('dropdown opens on focus when canSearch=false', function(assert) {
  this.set('groups', groups);
  this.render(hbs`
    {{s-select
      model=groups
      value="a"
      labelKey="label"
      canSearch=false}}`);

  assert.ok(this.$('div.es-options-container').attr('hidden'));
  this.$('input').trigger('focus');
  assert.notOk(this.$('div.es-options-container').attr('hidden'));
});

test('dropdown does not open on focus when canSearch=true', function(assert) {
  this.set('groups', groups);
  this.render(hbs`
    {{s-select
      model=groups
      value="a"
      labelKey="label"}}`);
  this.$('input').trigger('focus');
  assert.ok(this.$('div.es-options-container').attr('hidden'));
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
  assert.ok(this.$('div.es-options-container').attr('hidden'));
  assert.ok(this.$('input').attr('disabled'));

  this.set('disabled', false);
  this.$('input').trigger('focus');
  assert.notOk(this.$('div.es-options-container').attr('hidden'));
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
  assert.notOk(this.$('div.es-options-container').attr('hidden'));
  this.set('value', 'banana');
  assert.notOk(this.$('div.es-options-container').attr('hidden'));
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
  assert.ok(this.$('div.es-options-container').attr('hidden'));

  this.set('canSearch', false);
  this.$('input').val('ba');
  this.$('input').trigger('input');
  this.$('input').trigger($event('keydown', { which: 27 }));
  assert.equal(this.$('input').val(), 'ba');
  assert.ok(this.$('div.es-options-container').attr('hidden'));
});

test('UP arrow expands dropdown', function(assert) {
  this.set('list', listofObjects);
  this.set('canSearch', true);
  this.render(hbs`
    {{s-select
      model=list
      labelKey="label"}}`);

  this.$('input').trigger($event('keydown', { which: 38 }));
  assert.notOk(this.$('div.es-options-container').attr('hidden'));
});

test('DOWN arrow expands dropdown', function(assert) {
  this.set('list', listofObjects);
  this.set('canSearch', true);
  this.render(hbs`
    {{s-select
      model=list
      labelKey="label"}}`);

  this.$('input').trigger($event('keydown', { which: 40 }));
  assert.notOk(this.$('div.es-options-container').attr('hidden'));
  this.$('input').trigger($event('keydown', { which: 40 }));
  assert.notOk(this.$('div.es-options-container').attr('hidden'));
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

  let async = assert.async();
  this.set('list', listofObjects);

  this.render(hbs`{{s-select
    model=list
    labelKey="label"
    valueKey="value"}}`);

  this.$('span.es-arrow').trigger('mousedown');
  this.$('.es-option')[3].click();

  Ember.run.next(() => {
    assert.equal(this.$('input').val(), 'Fiat');
    async();
  });

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
    valueKey="value"
    value=value
    required=true
    valueKey="value"}}`);
  this.$('input').val('test');
  this.$('input').trigger('input');
  this.$('input').trigger('blur');

  assert.equal(this.$('input').val(), listofObjects[1].label);
  this.$('input').val('test');
  this.$('.es-clear-zone').click();
  assert.equal(this.$('input').val(), listofObjects[1].label);
});

test('When freeText is enabled, blur will keep the input value', function(assert) {
  assert.expect(1);

  this.set('list', listofObjects);
  this.set('value', listofObjects[1]);

  this.render(hbs`{{s-select
    model=list
    freeText=true
    labelKey="label"
    valueKey="value"
    value=value
    valueKey="value"}}`);
  this.$('input').val('test');
  this.$('input').trigger('input');
  this.$('input').trigger('blur');

  assert.equal(this.$('input').val(), 'test');
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
  assert.ok(this.$('.es-options-container').attr('hidden'));
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
  this.set('list', groups);
  this.set('value', null);
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

  let async = assert.async();
  run.next(() => {
    assert.equal(this.get('value'), null);
    async();
  });
});

test('Press ENTER when should select the option', function(assert) {
  this.set('list', listofItems);
  this.on('select', option => {
    assert.equal(option, 'Azul');
  });

  this.render(hbs`{{s-select
    model=list
    canSearch=false
    onSelect=(action 'select')}}`);

  this.$('input').trigger($event('keydown', { which: 40 }));
  this.$('input').trigger($event('keydown', { which: 40 }));
  this.$('input').trigger($event('keydown', { which: 40 }));
  this.$('input').trigger($event('keydown', { which: 13 }));
});

test('Press ENTER when should select the group when canSelectGroup=true', function(assert) {
  assert.expect(3);

  this.set('list', mixedGroups);
  this.on('select', (value, option, selected) => {
    assert.equal(value, 0, 'selection value matches');
    assert.deepEqual(option, { label: 'Fruit', value: 0 }, 'selection option matches');
    assert.ok(selected, 'option is selected');
  });

  this.render(hbs`{{s-select
    model=list
    canSearch=false
		canSelectGroup=true
    onSelect=(action 'select')}}`);

  this.$('input').trigger($event('keydown', { which: 40 }));
  this.$('input').trigger($event('keydown', { which: 40 }));
  this.$('input').trigger($event('keydown', { which: 13 }));
});

test('Press TAB when should select the option', function(assert) {
  this.set('list', listofItems);
  this.on('select', option => {
    assert.equal(option, 'Amarillo');
  });

  this.render(hbs`{{s-select
    model=list
    canSearch=false
    onSelect=(action 'select')}}`);

  this.$('input').trigger($event('keydown', { which: 40 }));
  this.$('input').trigger($event('keydown', { which: 40 }));
  this.$('input').trigger($event('keydown', { which: 9 }));
});

test('Click on group object option should update value', function(assert) {
  this.set('list', groups);
  this.set('value', null);
  let async = assert.async();

  this.render(hbs`{{s-select
    model=list
    labelKey="label"
    value=value
    required=true
    valueKey="value"
    onSelect=(action (mut value))}}`);

  this.$('input').trigger('input');
  this.$('.es-option:eq(1)').click();
  run.next(() => {
    assert.equal(this.get('value'), 102);
    async();
  });
});

test('onSelect event handler should not be called in freetext mode when input is empty', function(assert) {
  assert.expect(0);
  this.set('list', listofItems);
  this.on('select', () => {
    assert.ok(false);
  });

  this.render(hbs`{{s-select
    model=list
    canSearch=false
    freeText=true
    onSelect=(action 'select')}}`);

  this.$('input').val('');
  this.$('input').trigger('input');
  this.$('input').trigger($event('keydown', { which: 13 }));
});

test('onCreate event handler should be called in freetext mode when input is not empty', function(assert) {
  assert.expect(1);
  this.set('list', listofItems);
  this.on('create', option => {
    assert.equal(option, 'test');
  });

  this.render(hbs`{{s-select
    model=list
    canSearch=false
    freeText=true
    onCreate=(action 'create')}}`);

  this.$('input').val('test');
  this.$('input').trigger('input');
  this.$('input').trigger($event('keydown', { which: 13 }));
});

test('onSelect event handler should be called in freetext mode when input is not empty', function(assert) {
  assert.expect(1);
  let async = assert.async();

  this.set('list', listofItems);
  this.on('select', option => {
    assert.equal(option, 'test');
    async();
  });

  this.render(hbs`{{s-select
    model=list
    canSearch=false
    freeText=true
    onSelect=(action 'select')}}`);

  this.$('input').val('test');
  this.$('input').trigger('input');
  this.$('input').trigger($event('keydown', { which: 13 }));
});
