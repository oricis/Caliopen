import { v1 as uuidV1 } from 'uuid';

const DEFAULT_PROPS = {
  expanded: true,
  theme: 'dark',
};

class TextareaFieldGroupController {
  $onInit() {
    this.id = uuidV1();

    this.props = { ...DEFAULT_PROPS, ...this.props };
    this.inputStylesheets = {
      'm-textarea-field-group--expanded__textarea': this.props.expanded,
    };
  }
}

const TextareaFieldGroupComponent = {
  bindings: {
    props: '<',
    label: '<',
    model: '<',
    errors: '<?',
    required: '@?',
    onChange: '&',
  },
  controller: TextareaFieldGroupController,
  template: `
    <div class="m-textarea-field-group">
      <label for="{{ $ctrl.id }}" class="m-textarea-field-group__label">
        {{ $ctrl.label }}
      </label>
      <textarea ng-model="$ctrl.model"
        ng-change="$ctrl.onChange({ $event: { model: $ctrl.model } })"
        type="text"
        class="m-textarea-field-group__textarea"
        ng-class="$ctrl.inputStylesheets"
        ng-required="$ctrl.required"
        id="{{ $ctrl.id }}"
      ></textarea>
      <div class="m-textarea-field-group__errors" ng-if="$ctrl.errors.length">
        <field-errors errors="$ctrl.errors"></field-errors>
      </div>
    </div>
  `,
};

export default TextareaFieldGroupComponent;
