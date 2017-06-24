import Ember from 'ember';
import layout from '../templates/components/select-dropdown-option';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  layout,
  classNames: ['es-option'],
  classNameBindings: ['model.isSelected:es-highlight'],
  attributeBindings: ['hidden'],

  hidden: computed.not('model.isVisible'),

  click() {
    this.get('select')(this.get('model'));
  },

  mouseEnter() {
    this.get('hover')(this.get('model'));
  }
});
