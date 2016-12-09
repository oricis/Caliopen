import { v1 as uuidV1 } from 'uuid';

const DEFAULT_PROPS = {
  expanded: true,
  theme: 'dark',
  'bottom-space': true,
};


class SelectFieldGroupController {
  $onInit() {
    this.id = uuidV1();
    this.props = { ...DEFAULT_PROPS, ...this.props };
    this.inputStylesheets = {
      'm-text-field-group__input--expanded': this.props.expanded,
      'm-text-field-group__input--bottom-space': this.props['bottom-space'],
    };
  }
}

const SelectFieldGroupComponent = {
  bindings: {
    props: '<',
    label: '<',
    model: '<',
    options: '<',
    errors: '<?',
    required: '@?',
    onChange: '&',
  },
  controller: SelectFieldGroupController,
  template: `
    <div class="m-select-field-group">
      <label for="{{ $ctrl.id }}" class="m-text-field-group__label">
        {{ $ctrl.label }}
      </label>
      <select ng-model="$ctrl.model"
        ng-options="value.label || value for value in $ctrl.options"
        ng-change="$ctrl.onChange({ $event: { model: $ctrl.model } })"
        ng-required="$ctrl.required"
        class="m-select-field-group__select m-text-field m-text-field--dark"
        ng-class="$ctrl.inputStylesheets"
        id="{{ $ctrl.id }}"></select>
      <div ng-if="$ctrl.errors.length" class="m-select-field-group__errors">
        <field-errors errors="$ctrl.errors"></field-errors>
      </div>
    </div>
  `,
};

export default SelectFieldGroupComponent;
