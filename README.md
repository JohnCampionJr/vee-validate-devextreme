vee-validate-devextreme is an integration of [Vee-Validate] (https://vee-validate.logaretm.com/v4) and [DevExtreme's Vue Components]()

## Getting Started

### Vue version support

This version supports only v4 of vee-validate and thus, only supports Vue 3.x

### Usage

#### Declarative Components (Recommended)

Higher-order components are better suited for most of your cases. Register the `Field` and `Form` components and create a simple `required` validator:

```js
import { Form } from 'vee-validate';
import { DxField } from 'vee-validate-devextreme';

export default {
  components: {
    DxField,
    Form,
  },
  methods: {
    isRequired(value) {
    return value ? true : 'This field is required';
  },
};
```

Then use the `Form` and `DxField` components to render your form:

```vue
<Form v-slot="{ errors }">
  <DxField name="field" :rules="isRequired" />

  <span>{{ errors.field }}</span>
</Form>
```

The `DxField` component renders a component of type `DxTextBox` by default but you can [control that](https://vee-validate.logaretm.com/v4/api/field#rendering-fields)

## Contributing

You are welcome to contribute to this project, but before you do, please make sure you read the [contribution guide](CONTRIBUTING.md)

## Credits

- Borrowed and imitate project structure of [Vee-validate](https://github.com/logaretm/vee-validate/)

## ⚖️ License

MIT
