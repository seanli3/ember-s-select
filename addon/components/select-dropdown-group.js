import Ember from 'ember';
import layout from '../templates/components/select-dropdown-group';
import SelectDropdown from './select-dropdown';
import { getDescendents } from '../utils/tree';

const {
  computed,
  get,
  isPresent,
  on,
  observer
} = Ember;

export default SelectDropdown.extend({
  layout,
  groups: null,
  list: null,

  modelChanged: on('init', observer('model', function() {
    this._super(...arguments);
    // Tree built in extended component
    let groups = this.get('list');
    let list = getDescendents(groups);

    this.setProperties({ list, groups });
  })),

  options: computed('token', 'model.[]', 'values.[]', 'shouldFilter', function() {
    if (this.get('shouldFilter')) {
      this.filterModel();
    }

    return this.get('groups');
  }),

  setVisibility(list, token) {
    list
      .filter(el => isPresent(get(el, 'parentId')))
      .filter(el => get(el, 'name').toLowerCase().indexOf(token) > -1)
      .forEach(el => {
        el.set('isVisible', true);

        // Mark parent visible
        list
          .filter(x => x.id === get(el, 'parentId'))
          .shift()
          .set('isVisible', true);
      });
  },

  upDownKeys(selected, keyEvent) {
    let list = this.get('list')
      .filterBy('isVisible');
    if (!this.get('canSelectGroup')) {
      list = list.filter(el => isPresent(get(el, 'parentId')));
    }
    this.move(list, selected, keyEvent.which);
  }
});
