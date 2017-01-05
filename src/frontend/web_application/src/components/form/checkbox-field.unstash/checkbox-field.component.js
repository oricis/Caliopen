const CheckboxFieldComponent = {
  bindings: {
    label: '<',
    model: '<',
    value: '<',
    onChange: '&',
  },
  template: `
    <label>
      <input type="checkbox"
        ng-value="$ctrl.value"
        ng-model="$ctrl.model"
        ng-change="$ctrl.onChange({ $event: { model: $ctrl.model }})"
      />
      {{ $ctrl.label }}
    </label>
  `,
};

export default CheckboxFieldComponent;
