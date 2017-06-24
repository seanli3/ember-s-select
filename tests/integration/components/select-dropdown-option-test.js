import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('select-dropdown-option', 'Integration | Component | select dropdown option', {
  integration: true
});

test('it renders', function(assert) {
  this.set('model', { name: 'model' });
  this.render(hbs`{{select-dropdown-option model=model}}`);

  assert.equal(this.$().text().trim(), 'model');
  assert.ok(this.$('div').hasClass('es-option'));
  assert.notOk(this.$('div').hasClass('es-highlight'));
});

test('es-highlight class is binded with model.isSelected', function(assert) {
  this.set('model', { name: 'model', isSelected: true });
  this.render(hbs`{{select-dropdown-option model=model}}`);

  assert.equal(this.$().text().trim(), 'model');
  assert.ok(this.$('div').hasClass('es-highlight'));
});

test('click on component triggers select event', function(assert) {
  assert.expect(1);
  this.set('model', { name: 'model' });
  this.on('onSelect', (model) => {
    assert.equal(model, this.get('model'));
  });
  this.render(hbs`{{select-dropdown-option model=model select=(action "onSelect")}}`);
  this.$('div').click();
});

test('mouseEnter on component triggers hover event', function(assert) {
  assert.expect(1);
  this.set('model', { name: 'model' });
  this.on('onHover', (model) => {
    assert.equal(model, this.get('model'));
  });
  this.render(hbs`{{select-dropdown-option model=model hover=(action "onHover")}}`);
  this.$('div').trigger('mouseenter');
});