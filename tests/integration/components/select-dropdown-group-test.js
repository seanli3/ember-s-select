import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('select-dropdown-group', 'Integration | Component | select dropdown group', {
  integration: true
});

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

test('it renders', function(assert) {
  this.render(hbs`{{select-dropdown-group}}`);

  assert.equal(this.$().text().trim(), '');
});

test('UP and DWON keypress moves selection', function(assert) {
  this.set('keyEvent', null);
  this.set('groups', groups);
  this.render(hbs`
    {{select-dropdown-group
      keyEvent=keyEvent
      model=groups
      labelKey="label"
      valueKey="value"}}`);

  this.set('keyEvent', { which: 40 });
  assert.ok(this.$('.es-option:first').hasClass('es-highlight'));
  this.set('keyEvent', { which: 40 });
  assert.ok(this.$('.es-option:eq(1)').hasClass('es-highlight'));

  this.set('keyEvent', { which: 38 });
  assert.ok(this.$('.es-option:first').hasClass('es-highlight'));
  this.set('keyEvent', { which: 38 });
  assert.ok(this.$('.es-option:last').hasClass('es-highlight'));
});

test('UP and DWON keypress moves selection correctly when canSelectGroup is set to true', function(assert) {
  this.set('keyEvent', null);
  this.set('groups', mixedGroups);
  this.render(hbs`
    {{select-dropdown-group
      keyEvent=keyEvent
      model=groups
			canSelectGroup=true
      labelKey="label"
      valueKey="value"}}`);

  this.set('keyEvent', { which: 40 });
  assert.ok(this.$('.es-group:first').hasClass('es-highlight'));
  this.set('keyEvent', { which: 40 });
  assert.ok(this.$('.es-option:first').hasClass('es-highlight'));

  this.set('keyEvent', { which: 38 });
  assert.ok(this.$('.es-group:first').hasClass('es-highlight'));
  this.set('keyEvent', { which: 38 });
  assert.ok(this.$('.es-group:last').hasClass('es-highlight'));
});

test('Hover over group highlights it when canSelectGroup is set to true', function(assert) {
  this.set('groups', mixedGroups);
  this.render(hbs`
    {{select-dropdown-group
      keyEvent=keyEvent
      model=groups
			canSelectGroup=true
      labelKey="label"
      valueKey="value"}}`);

  this.$('.es-group:eq(1)').trigger('mouseenter');
  assert.ok(this.$('.es-group:eq(1)').hasClass('es-highlight'));

  this.$('.es-group:eq(2)').trigger('mouseenter');
  assert.notOk(this.$('.es-group:eq(1)').hasClass('es-highlight'));
  assert.ok(this.$('.es-group:eq(2)').hasClass('es-highlight'));
});

test('Hover over group does not highlight it when canSelectGroup is not set', function(assert) {
  assert.expect(2);

  this.set('groups', mixedGroups);
  this.render(hbs`
    {{select-dropdown-group
      keyEvent=keyEvent
      model=groups
      labelKey="label"
      valueKey="value"}}`);

  this.$('.es-group:eq(1)').trigger('mouseenter');
  assert.notOk(this.$('.es-group:eq(1)').hasClass('es-highlight'));

  this.$('.es-option:eq(1)').trigger('mouseenter');
  assert.ok(this.$('.es-option:eq(1)').hasClass('es-highlight'));
});

test('Click on option should trigger select event', function(assert) {
  this.set('groups', groups);
  this.set('keyEvent', null);
  this.on('select', option => {
    assert.equal(option.value, 102);
  });
  this.render(hbs`
    {{select-dropdown-group
      select=(action "select")
      model=groups
      labelKey="label"
      valueKey="value"}}`);

  this.$('.es-option:eq(1)').click();
});

test('should filter options when shouldFilter=true', function(assert) {
  this.set('groups', groups);
  this.set('token', null);
  this.render(hbs`
    {{select-dropdown-group
      model=groups
      token=token
      shouldFilter=true
      labelKey="label"
      valueKey="value"}}`);
  assert.equal(this.$('.es-group:not([hidden])').length, 2);
  assert.equal(this.$('.es-option:not([hidden])').length, 8);
  this.set('token', 'bana');
  assert.equal(this.$('.es-group:not([hidden])').length, 1);
  assert.equal(this.$('.es-option:not([hidden])').length, 1);
});

test('should filter options and groups when shouldFilter=true and canSelectGroup=true', function(assert) {
  this.set('groups', mixedGroups);
  this.set('token', null);
  this.render(hbs`
    {{select-dropdown-group
      model=groups
      token=token
      shouldFilter=true
      canSelectGroup=true
      labelKey="label"
      valueKey="value"}}`);
  assert.equal(this.$('.es-group:not([hidden])').length, 3);
  assert.equal(this.$('.es-option:not([hidden])').length, 5);
  this.set('token', 'others');
  assert.equal(this.$('.es-group:not([hidden])').length, 1);
  assert.equal(this.$('.es-option:not([hidden])').length, 0);
});