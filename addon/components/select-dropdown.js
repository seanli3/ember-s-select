import Ember from 'ember';
import layout from '../templates/components/select-dropdown';
import { buildTree } from '../utils/tree';
import { bringInView } from '../utils/view';

const {
  Component,
  computed,
  get,
  observer,
  isEmpty,
  isNone,
  isPresent,
  run
} = Ember;

export default Component.extend({
  layout,
  list: null,
  keyEvent: null,

  init() {
    this._super(...arguments);
    let options = this.getProperties('valueKey', 'labelKey');
    let model = this.get('model');
    let list = buildTree(model, options);

    this.setProperties({ list });
  },

  keyPressed: observer('keyEvent', function() {
    this.keys.call(this, this.get('keyEvent'));
  }),

  options: computed('token', 'model.[]', 'values.[]', function() {
    if (this.get('shouldFilter')) {
      this.filterModel();
    }

    return this.get('list');
  }),

  actions: {
    hover(node) {
      let selected = this.get('selected');
      if (selected) {
        selected.set('isSelected', false);
      }
      this.set('selected', node);
      node.set('isSelected', true);
    },

    select(node) {
      this.attrs.select(node.content, true);
    }
  },

  /* Filter out existing selections. Mark everything
   visible if no search, otherwise update visiblity. */
  filterModel() {
    let list = this.get('list');
    let token = this.get('token');
    let values = this.get('values');

    list.forEach(el => el.set('isVisible', false));

    if (isPresent(values)) {
      list = list.filter(el => values.indexOf(el.content) === -1);
    }

    if (isEmpty(token)) {
      list.forEach(el => el.set('isVisible', true));
    } else {
      token = token.toLowerCase();
      this.setVisibility(list, token);
    }

    // Mark first visible element as selected
    if (isPresent(token) && list.some(x => get(x, 'isVisible'))) {
      let [firstVisible] = list.filter(x => get(x, 'isVisible'));
      firstVisible.set('isSelected', true);
      this.set('selected', firstVisible);
    }
  },

  keys(keyEvent) {
    if (!keyEvent || !keyEvent.which) {
      return;
    }

    let selected = this.get('selected');

    switch (keyEvent.which) {
      case 9: // TAB
      case 13: // Enter
        this.tabEnterKeys(selected);
        break;

      case 38: // Up
      case 40: // Down
        this.upDownKeys(selected, keyEvent);
        break;
    }
  },

  // Prevent mousedown event from stealing focus from input
  mouseDown(event) {
    event.preventDefault();
  },

  // Down: 40, Up: 38
  move(list, selected, direction) {
    if (isPresent(selected)) {
      selected.set('isSelected', false);
    }

    if (isEmpty(list)) {
      return;
    }

    let index = selected ? list.findIndex(node => selected.id === node.id) : -1;
    let node;

    if (direction === 38) {
      if (index !== -1) {
        node = list[index - 1];
      }

      if (isNone(node)) {
        node = list[list.length - 1];
      }
    } else {
      if (index !== -1) {
        node = list[index + 1];
      }

      if (isNone(node)) {
        node = list[0];
      }
    }
    this.set('selected', node);
    node.set('isSelected', true);

    run.next(this, bringInView, '.es-options', '.es-highlight');
  },

  setVisibility(list, token) {
    list
      .filter(el => get(el, 'name').toLowerCase().indexOf(token) > -1)
      .forEach(el => el.set('isVisible', true));
  },

  tabEnterKeys(selected) {
    if (selected && this.get('list').includes(selected)) {
      this.send('select', selected);
    }
  },

  upDownKeys(selected, keyEvent) {
    let list = this.get('list').filterBy('isVisible');
    this.move(list, selected, keyEvent.which);
  }
});
