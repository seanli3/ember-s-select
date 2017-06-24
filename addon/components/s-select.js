import Ember from 'ember';
import layout from '../templates/components/s-select';

const {
  Component,
  computed,
  get,
  isBlank,
  isPresent,
  run,
  isArray
} = Ember;

const containsGroup = list => {
  return isArray(list) && list.find(ele => ele.parentId);
};

export default Component.extend({
  layout,
  classNames: ['s-select'],
  classNameBindings: [
    'isOpen:es-open', 'isFocus:es-focus',
    'canSearch::es-select', 'multiple:es-multiple'
  ],

  autofocus: false,
  canSearch: true,
  disabled: false,
  dropdown: 'select-dropdown',
  isDirty: false,
  isFocus: false,
  isOpen: false,
  openOnFocus: false,
  placeholder: 'Type...',
  required: false,
  token: '',
  value: '',

  labelKey: 'label',
  valueKey: 'value',

  canClear: computed.and('enabled', 'canSearch', 'hasOptions'),
  canOpen: computed.or('hasInput', 'openOnFocus'),
  enabled: computed.not('disabled'),
  hasDropdown: computed.and('enabled', 'hasModel'),
  hasInput: computed.notEmpty('token'),
  hasModel: computed.notEmpty('model'),
  hasOptions: computed.or('hasInput', 'hasValues'),
  hasValues: computed.notEmpty('values'),
  multiple: computed.bool('values'),
  shouldFilter: computed.or('isDirty', 'multiple', 'hasChanged'),
  hideDropdown: computed.not('isOpen'),

  input: computed(function() {
    return document.querySelector(`#${this.elementId} input`);
  }),

  hasChanged: computed('token', 'value', function() {
    let token = this.get('token');
    let option = this.get('value');

    if (isPresent(token) && isPresent(option)) {
      let { label } = this.retrieveOption(option);
      return token !== label;
    }
  }),

  init() {
    this._super(...arguments);
    if (this.disabled) {
      this.set('canSearch', false);
    }

    if (!this.canSearch) {
      this.set('openOnFocus', true);
    }

    this.set('oldValue', this.get('value'));

    if (containsGroup(this.get('model'))) {
      this.set('dropdown', 'select-dropdown-group');
    }
  },

  didInsertElement() {
    this._super(...arguments);

    let value = this.get('value');
    if (isPresent(value)) {
      run.next(this, () => this.setOption(value));
    }
  },

  didUpdateAttrs() {
    this._super(...arguments);

    // Need to open on lazy models
    if (this.get('isDirty')) {
      this.open();
    }

    // Update input if value has changed
    let newValue = this.get('value');
    let oldValue = this.get('oldValue');
    if (oldValue && newValue && oldValue !== newValue) {
      let { label } = this.retrieveOption(newValue);
      label !== this.get('token') && this.setOption(newValue);
    }

    this.set('oldValue', newValue);
  },

  actions: {
    blur() {
      if (this.get('isDirty')) {
        // Clear unallowed input in strict single mode
        this.setOption('', false, !this.get('multiple'));
      }

      this.setProperties({
        isFocus: false,
        isOpen: false
      });
    },

    change(query) {
      this.set('token', query);
      this.set('isDirty', true);
      this.sendAction('onChange', query);

      if (isPresent(query)) {
        this.open();
      }
    },

    clear() {
      this.setOption('', false, !this.get('multiple'));
      this.sendAction('onClear');
      this.send('focus');
    },

    dropdown() {
      let isOpen = this.toggleProperty('isOpen');
      if (isOpen) {
        this.get('input').focus();
      }
    },

    focus() {
      let input = this.get('input');

      input.focus();
      if (!this.get('isFocus') && this.get('canSearch')) {
        // Select text (similar to TAB)
        input.select();
      }

      if (!this.get('isOpen')) {
        this.open();
      }
    },

    keypress(e) {
      let isOpen = this.get('isOpen');
      this.set('keyEvent', e);

      switch (e.which) {
        case 8: { // Backspace
          let values = this.get('values');
          if (isPresent(values) && this.get('token') === '') {
            let removedVal = this.get('values').pop();
            this.attrs.onRemove && this.attrs.onRemove(removedVal);
            e.preventDefault();
          }
          break;
        }
        case 27: // ESC
          if (this.get('canSearch') && this.get('hasInput')) {
            this.send('clear');
          } else {
            this.set('isOpen', false);
          }
          break;
        case 38: // Up Arrow
        case 40: // Down Arrow
          if (!isOpen) {
            this.set('isOpen', true);
          }
          e.preventDefault();
          break;
      }
    },

    remove(selection) {
      let values = this.get('values');
      let index = values.indexOf(selection);
      values.splice(index, 1);
      this.attrs.onRemove && this.attrs.onRemove(selection);
      this.send('focus');
    },

    select(option, selected) {
      let valid = isPresent(option);
      valid && this.setOption(option, selected, true);
    }
  },

  // Handle plain arrays and Ember Data relationships
  getElement(model, position) {
    return model[position] || model.objectAt(position);
  },

  open() {
    this.setProperties({
      isOpen: this.get('hasDropdown') && this.get('canOpen'),
      isFocus: true
    });
  },

  /* Retrieve `option`, `value` and `label` given a selection
   * which can be either an option (object) or a value */
  retrieveOption(option) {
    let model = this.get('model');
    let label = option;
    let value = option;

    if (isBlank(option)) {
      label = '';
    } else if (typeof option === 'object') {
      label = get(option, this.get('labelKey'));
      value = get(option, this.get('valueKey'));
    } else if (isPresent(model) && typeof this.getElement(model, 0) === 'object') {
      let id = this.get('valueKey');
      option = model.filter(x => get(x, id) === option).shift();

      if (option) {
        label = get(option, this.get('labelKey'));
      }
    }

    return { option, value, label };
  },

  setOption(selection, selected, notify) {
    let { option, value, label } = this.retrieveOption(selection);

    if (this.get('multiple')) {
      label = '';
    }

    if (!selected && notify && this.get('required')) {
      return this.setOption(this.get('value'));
    }

    if (this.get('canSearch')) {
      this.set('token', label);
    }

    // Ensure the component is DOM ready before updating
    let input = this.get('input');
    if (input) {
      input.value = label;
    }

    this.set('isDirty', false);

    if (notify) {
      this.sendAction('onSelect', value, option, selected);
      this.set('isOpen', false);
    }
  }
});
